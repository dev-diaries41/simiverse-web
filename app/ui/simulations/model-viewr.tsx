"use client"; 

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useThreeScene } from "@/app/hooks/three/useThreeScene";

const ModelViewer = ({modelPath}: {modelPath: string}) => {
  const { mountRef } = useThreeScene({
    width: 800,
    height: 600,
    onInitScene: (scene, camera, controls) => {
      const light = new THREE.DirectionalLight(0xffffff, 10);
      light.position.set(2, 5, 3);
      scene.add(light);

      const loader = new GLTFLoader();
      loader.load(modelPath, (gltf) => {
        scene.add(gltf.scene);
      });

      camera.position.set(0, 2, 5);
      controls.target.set(0, 1, 0);
      controls.update();
    },
    onAnimate: (_, scene, camera) => {
    },
  });

  return <div ref={mountRef} style={{ width: "100%", height: "500px" }} />;
};

export default ModelViewer;
