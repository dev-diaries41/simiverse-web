import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Tween, Easing } from "@tweenjs/tween.js";

export const useThreeScene = ({
  width,
  height,
  onInitScene, // Callback for scene initialization
  onAnimate, // Callback for animation logic
  onReady, // Callback for when the scene and camera are ready
  onDispose, // Callback for cleanup
}: {
  width?: number;
  height?: number;
  onInitScene?: (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    controls: OrbitControls
  ) => void; // Function to initialize the scene
  onAnimate?: (delta: number, scene: THREE.Scene, camera: THREE.PerspectiveCamera) => void; // Animation callback
  onReady?: (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => void; // Callback for when the scene is ready
  onDispose?: (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => void; // Cleanup callback
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);

  useEffect(() => {
    const sceneWidth = width || window.innerWidth;
    const sceneHeight = height || window.innerHeight;

    // Initialize Three.js essentials
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, sceneWidth / sceneHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const controls = new OrbitControls(camera, renderer.domElement);

    // Save references
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    controlsRef.current = controls;

    renderer.setSize(sceneWidth, sceneHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    camera.position.z = 10; // Default camera position

    // Configure OrbitControls
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;

    // Initialize the scene using the provided callback
    if (onInitScene) {
      onInitScene(scene, camera, controls);
    }

    // Notify when the scene and camera are ready
    if (onReady) {
      onReady(scene, camera);
    }

    // Animation loop
    const clock = new THREE.Clock();
    clockRef.current = clock;

    const animate = () => {
      const delta = clock.getDelta(); // Time since last frame

      // Custom animation logic
      if (onAnimate && sceneRef.current && cameraRef.current) {
        onAnimate(delta, sceneRef.current, cameraRef.current);
      }

      controls.update(); // Update OrbitControls
      renderer.render(scene, camera); // Render the scene
      animationFrameIdRef.current = requestAnimationFrame(animate); // Loop
    };

    animate();

    // Cleanup
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }

      if (onDispose && sceneRef.current && cameraRef.current) {
        onDispose(sceneRef.current, cameraRef.current);
      }

      controls.dispose();
      renderer.dispose();

      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [width, height]);

  return {
    mountRef,
    scene: sceneRef.current,
    camera: cameraRef.current,
    controls: controlsRef.current,
    renderer: rendererRef.current,
  };
};
