import React, { useEffect } from "react";
import { useThreeScene } from "@/app/hooks/three/useThreeScene";
import { useGlobe } from "@/app/hooks/three/useGlobe";
import { ThreeSceneProps, GestureType } from "@/app/types";
import { MOUSE, PerspectiveCamera, Scene, TOUCH } from "three";
import { useGestureOrbitControls } from "@/app/hooks/three/useGestureControls";



interface GlobeProps extends ThreeSceneProps {
  population: number;
  width?: number;
  height?: number;
  rotationSpeed?: number;
  onReady?: (scene: Scene, camera: PerspectiveCamera) => void;
  /** Determines the current gesture action */
  gestureType?: GestureType;
}

const Globe: React.FC<GlobeProps> = React.memo(
  ({
    population,
    width,
    height,
    rotationSpeed = 0.005,
    backgroundUrl,
    textureUrl,
    onReady,
    gestureType = "None",
  }) => {
    const { initScene, animateScene } = useGlobe({
      population,
      rotationSpeed,
      backgroundUrl,
      textureUrl,
    });

    const { mountRef, controls, camera } = useThreeScene({
      width,
      height,
      onInitScene: initScene,
      onAnimate: animateScene,
      onReady,
    });

    useGestureOrbitControls(controls, gestureType, camera)
    
    return (
      <div
        style={{
          position: "relative",
          width: width ? `${width}px` : "100%",
          height: height ? `${height}px` : "100%",
          overflow: "hidden",
        }}
      >
        <div ref={mountRef} style={{ width: "100%", height: "100%" }}></div>
      </div>
    );
  }
);

export default Globe;
