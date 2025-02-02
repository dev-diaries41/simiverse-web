import { useRef, useLayoutEffect, useCallback } from "react";
import * as THREE from "three";
import { Easing, Tween, update } from "@tweenjs/tween.js";

interface UseGlobeProps {
  population: number;
  rotationSpeed: number;
  width?: number;
  height?: number;
  backgroundUrl?: string;
  textureUrl?: string;
  onReady?: (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => void;
}

export const useGlobe = ({
  population,
  rotationSpeed = 0.005,
  backgroundUrl,
  textureUrl,
}: UseGlobeProps) => {
  const populationDotsRef = useRef<THREE.Points | null>(null);
  const prevPopulationRef = useRef<number>(population);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const backgroundMeshRef = useRef<THREE.Mesh | null>(null);

  const animateZoom = (camera: THREE.PerspectiveCamera, initialZoom: number, targetZoom: number, duration = 1500) => {
    camera.position.z = initialZoom;

    new Tween(camera.position)
      .to({ z: targetZoom }, duration)
      .easing(Easing.Cubic.Out)
      .start();
  };

  // Function to generate dots for the population
  const generateDots = useCallback((numDots: number) => {
    const dotsGeometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];
    const scaleFactor = 1e3;
    const maxDots = 1e4;
    const scaledPopulation = Math.min(numDots / scaleFactor, maxDots);
    const dotSize = Math.min(0.02, Math.max(0.01, 0.02 - (0.01 * (scaledPopulation / maxDots))));

    for (let i = 0; i < scaledPopulation; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.sin(theta);
      const z = Math.cos(phi);

      positions.push(x, y, z);
      colors.push(0.0, 1.0, 0.0);
    }

    dotsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    dotsGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const dotsMaterial = new THREE.PointsMaterial({
      size: dotSize,
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
    });

    return new THREE.Points(dotsGeometry, dotsMaterial);
  }, []);

  const updatePopulation = useCallback(
    (newPopulation: number) => {
      if (newPopulation !== prevPopulationRef.current && globeGroupRef.current) {
        const existingDots = populationDotsRef.current;
        if (existingDots) {
          const existingMaterial = existingDots.material as THREE.PointsMaterial;
          fadeDots(existingMaterial, existingDots, "out");
        }

        const newDots = generateDots(newPopulation);
        const newMaterial = newDots.material as THREE.PointsMaterial;
        newMaterial.opacity = 0;
        globeGroupRef.current.add(newDots);

        fadeDots(newMaterial, newDots, "in");

        populationDotsRef.current = newDots;
        prevPopulationRef.current = newPopulation;
      }
    },
    [generateDots]
  );

  const fadeDots = useCallback(
    (material: THREE.PointsMaterial, dots: THREE.Object3D, direction: "in" | "out") => {
      const duration = 1000;
      const startTime = Date.now();
      const fade = () => {
        const timeElapsed = Date.now() - startTime;
        const opacityChange = (timeElapsed / duration) * 0.3;
        let opacity = direction === "in" ? Math.min(opacityChange, 0.3) : Math.max(0.3 - opacityChange, 0);

        material.opacity = opacity;

        if (opacity > 0 && direction === "out" || opacity < 0.3 && direction === "in") {
          requestAnimationFrame(fade);
        } else if (direction === "out" && opacity === 0) {
          globeGroupRef.current?.remove(dots);
        }
      };
      fade();
    },
    []
  );

  const initScene = useCallback((scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
    const textureLoader = new THREE.TextureLoader();
    if (!textureUrl) throw new Error("Missing texture url");
    const texture = textureLoader.load(textureUrl);

    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      depthTest: false,
    });

    const sphereWithTexture = new THREE.Mesh(sphereGeometry, sphereMaterial);

    const globeGroup = new THREE.Group();
    globeGroup.add(sphereWithTexture);

    const initialDots = generateDots(population);
    populationDotsRef.current = initialDots;
    globeGroup.add(initialDots);

    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    if (backgroundUrl) {
      const backgroundTexture = textureLoader.load(backgroundUrl);
      const backgroundMaterial = new THREE.MeshBasicMaterial({
        map: backgroundTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
        depthTest: true,     // Enable depth test to ensure proper layering
      });

      const backgroundGeometry = new THREE.SphereGeometry(500, 128, 128);
      const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
      backgroundMesh.rotation.x = Math.PI / 2;
      backgroundMeshRef.current = backgroundMesh;
      scene.add(backgroundMesh);
    }

    animateZoom(camera, camera.position.z * 10, 3, 2000);
  }, [generateDots, population, backgroundUrl, textureUrl, animateZoom]);

  const animateScene = useCallback(
    (delta: number) => {
      if (globeGroupRef.current) {
        globeGroupRef.current.rotation.y += rotationSpeed;
      }
      update(); // Update Tween animations
    },
    [rotationSpeed]
  );

  useLayoutEffect(() => {
    updatePopulation(population);
  }, [population]);

  return {
    initScene,
    animateScene,
  };
};
