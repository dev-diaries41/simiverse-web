import React, { useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import { update } from "@tweenjs/tween.js";
import { useThreeScene } from "@/app/hooks/three/useThreeScene";
import { ThreeSceneProps } from "@/app/types";
import { useTweenAnimations } from "@/app/hooks/three/useTween";

interface GlobeProps extends ThreeSceneProps {
  population: number;
  width?: number;
  height?: number;
  rotationSpeed?: number;
  onReady?: (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => void;
}

const generateDots = (numDots: number) => {
  const dotsGeometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const colors: number[] = [];
  const scaleFactor = 1e3; // 1 dot per 1,000 people
  const maxDots = 1e4; // Cap maximum dots to optimize performance
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
};

const Globe: React.FC<GlobeProps> = React.memo(
  ({ population, width, height, rotationSpeed = 0.005, backgroundUrl, textureUrl, onReady }) => {
    const populationDotsRef = useRef<THREE.Points | null>(null);
    const prevPopulationRef = useRef<number>(population);
    const globeGroupRef = useRef<THREE.Group | null>(null);
    const backgroundMeshRef = useRef<THREE.Mesh | null>(null); // Reference to the background mesh
    const { animateZoom } = useTweenAnimations();

    const { mountRef } = useThreeScene({
      width,
      height,
      onInitScene: (scene, camera) => {
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

        // Initialize background
        if (backgroundUrl) {
          const backgroundTexture = textureLoader.load(backgroundUrl);
          const backgroundMaterial = new THREE.MeshBasicMaterial({
            map: backgroundTexture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.2,
            depthWrite: false,
            depthTest: false,
          });

          const backgroundGeometry = new THREE.SphereGeometry(500, 128, 128);
          const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
          backgroundMesh.rotation.x = Math.PI / 2;
          backgroundMeshRef.current = backgroundMesh; 
          scene.add(backgroundMesh);
        }

        animateZoom(camera, camera.position.z * 10, 3, 2000);
      },
      onAnimate: (delta) => {
        
        if (globeGroupRef.current) {
          globeGroupRef.current.rotation.y += rotationSpeed;
        }
        update(); // Update Tween animations
      },
      onReady,
    });

    // React to changes in `backgroundUrl`
    useLayoutEffect(() => {
      if (backgroundMeshRef.current && backgroundUrl) {
        const textureLoader = new THREE.TextureLoader();
        const newTexture = textureLoader.load(backgroundUrl);

        const backgroundMaterial = backgroundMeshRef.current.material as THREE.MeshBasicMaterial;
        backgroundMaterial.map = newTexture;
        backgroundMaterial.needsUpdate = true;
      }
    }, [backgroundUrl]);

    useLayoutEffect(() => {
      const updatePopulation = (newPopulation: number) => {
        if (newPopulation !== prevPopulationRef.current && globeGroupRef.current) {
          const existingDots = populationDotsRef.current;
          if (existingDots) {
            const existingMaterial = existingDots.material as THREE.PointsMaterial;

            const fadeOutDuration = 1000;
            const fadeOutTimeStart = Date.now();
            const fadeOut = () => {
              const timeElapsed = Date.now() - fadeOutTimeStart;
              const opacity = Math.max(0.3 - (timeElapsed / fadeOutDuration) * 0.3, 0);
              existingMaterial.opacity = opacity;

              if (opacity > 0) {
                requestAnimationFrame(fadeOut);
              } else {
                globeGroupRef.current?.remove(existingDots);
              }
            };
            fadeOut();
          }

          const newDots = generateDots(newPopulation);
          const newMaterial = newDots.material as THREE.PointsMaterial;
          newMaterial.opacity = 0;
          globeGroupRef.current.add(newDots);

          const fadeInDuration = 1000;
          const fadeInTimeStart = Date.now();
          const fadeIn = () => {
            const timeElapsed = Date.now() - fadeInTimeStart;
            const opacity = Math.min((timeElapsed / fadeInDuration) * 0.3, 0.3);
            newMaterial.opacity = opacity;

            if (opacity < 0.3) {
              requestAnimationFrame(fadeIn);
            }
          };
          fadeIn();

          populationDotsRef.current = newDots;
          prevPopulationRef.current = newPopulation;
        }
      };
      updatePopulation(population);
    }, [population]);

    return (
      <div
        style={{
          position: "relative",
          width: `${width}px`,
          height: `${height}px`,
          overflow: "hidden",
        }}
      >
        <div ref={mountRef} style={{ width: "100%", height: "100%" }}></div>
      </div>
    );
  }
);

export default Globe