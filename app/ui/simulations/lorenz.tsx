'use client';
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface LorenzAttractorProps {
  sigma?: number;
  rho?: number;
  beta?: number;
  numPoints?: number;
  dt?: number;
  pointSize?: number;
  pointColor?: number;
}

const generateLorenzPoints = (
  sigma: number,
  rho: number,
  beta: number,
  numPoints: number,
  dt: number
): THREE.BufferGeometry => {
  const points: number[] = [];
  let x = 0.1,
    y = 1.0,
    z = 1.05;

  for (let i = 0; i < numPoints; i++) {
    const dx = sigma * (y - x) * dt;
    const dy = (x * (rho - z) - y) * dt;
    const dz = (x * y - beta * z) * dt;
    x += dx;
    y += dy;
    z += dz;
    points.push(x, y, z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(points, 3)
  );
  return geometry;
};

const Toolbar: React.FC<{
  settings: {
    sigma: number;
    rho: number;
    beta: number;
    pointSize: number;
    pointColor: number;
  };
  setSettings: React.Dispatch<React.SetStateAction<{
    sigma: number;
    rho: number;
    beta: number;
    pointSize: number;
    pointColor: number;
  }>>;
}> = ({ settings, setSettings }) => {
  return (
    <div className="absolute top-16 left-4 bg-black bg-opacity-80 p-4 rounded-lg shadow-md space-y-4">
      <div>
        <label className="block text-gray-200">Sigma</label>
        <input
          type="range"
          min="1"
          max="30"
          step="0.1"
          value={settings.sigma}
          onChange={(e) =>
            setSettings((prev) => ({ ...prev, sigma: parseFloat(e.target.value) }))
          }
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-gray-200">Rho</label>
        <input
          type="range"
          min="10"
          max="50"
          step="1"
          value={settings.rho}
          onChange={(e) =>
            setSettings((prev) => ({ ...prev, rho: parseFloat(e.target.value) }))
          }
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-gray-200">Beta</label>
        <input
          type="range"
          min="1"
          max="10"
          step="0.1"
          value={settings.beta}
          onChange={(e) =>
            setSettings((prev) => ({ ...prev, beta: parseFloat(e.target.value) }))
          }
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-gray-200">Point Size</label>
        <input
          type="range"
          min="0.01"
          max="0.1"
          step="0.01"
          value={settings.pointSize}
          onChange={(e) =>
            setSettings((prev) => ({ ...prev, pointSize: parseFloat(e.target.value) }))
          }
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-gray-200">Point Color</label>
        <input
          type="color"
          value={`#${settings.pointColor.toString(16).padStart(6, "0")}`}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              pointColor: parseInt(e.target.value.slice(1), 16),
            }))
          }
          className="w-full"
        />
      </div>
    </div>
  );
};

export const LorenzAttractor: React.FC<LorenzAttractorProps> = ({
  sigma = 10,
  rho = 28,
  beta = 8 / 3,
  numPoints = 10000,
  dt = 0.01,
  pointSize = 0.05,
  pointColor = 0xff4500,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState({
    sigma,
    rho,
    beta,
    pointSize,
    pointColor,
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Lorenz Attractor
    let geometry = generateLorenzPoints(
      settings.sigma,
      settings.rho,
      settings.beta,
      numPoints,
      dt
    );
    let material = new THREE.PointsMaterial({
      color: settings.pointColor,
      size: settings.pointSize,
    });
    let points = new THREE.Points(geometry, material);
    scene.add(points);

    // Camera position
    camera.position.z = 50;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      points.rotation.x += 0.001;
      points.rotation.y += 0.001;
      renderer.render(scene, camera);
    };

    animate();

    // Resize handling
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      mount.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, [settings, numPoints, dt]);

  return (
    <div
      ref={mountRef}
      className="w-screen h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative"
    >
      <Toolbar settings={settings} setSettings={setSettings} />
    </div>
  );
};
