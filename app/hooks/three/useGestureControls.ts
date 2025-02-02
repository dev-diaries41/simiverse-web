import { GestureType } from "@/app/types";
import { useEffect, useRef } from "react";
import { PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as TWEEN from "@tweenjs/tween.js";


export function useGestureOrbitControls(controls: OrbitControls | null, gestureType: GestureType, camera: PerspectiveCamera | null) {
  const activeKey = useRef<string | null>(null);
  const keyInterval = useRef<NodeJS.Timeout | null>(null);

  const panCamToPosition = (
    camera: PerspectiveCamera,
    controls: OrbitControls,
    xTarget: number,
    yTarget: number,
    zTarget: number,
    tweenDuration = 2000
  ) => {
    const camNewPosition = { x: xTarget, y: yTarget, z: zTarget };
    const targetNewPos = { x: 0, y: 0, z: 0 };

    new TWEEN.Tween(camera.position)
      .to(camNewPosition, tweenDuration)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onComplete(() => camera.position.copy(new Vector3(camNewPosition.x, camNewPosition.y, camNewPosition.z)))
      .start();

    new TWEEN.Tween(controls.target)
      .to(targetNewPos, tweenDuration)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onComplete(() => controls.target.set(0, 0, 0))
      .start();
  };

  const zoomIn = () => {
    if (!camera || !controls) return;
    const zoomFactor = 0.8;
    const newCamPos = camera.position.clone().multiplyScalar(zoomFactor);
    panCamToPosition(camera, controls, newCamPos.x, newCamPos.y, newCamPos.z, 800);
  };

  const zoomOut = () => {
    if (!camera || !controls) return;
    const zoomFactor = 1.25;
    const newCamPos = camera.position.clone().multiplyScalar(zoomFactor);
    panCamToPosition(camera, controls, newCamPos.x, newCamPos.y, newCamPos.z, 800);
  };

  const simulateKeyEvent = (type: "keydown" | "keyup", key: string) => {
    const event = new KeyboardEvent(type, {
      key,
      code: key,
      shiftKey: true, // Simulate holding Shift
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);
  };

  const startHoldingKey = (key: string) => {
    if (activeKey.current === key) return; 
    stopHoldingKey(); 

    activeKey.current = key;
    simulateKeyEvent("keydown", key);

    keyInterval.current = setInterval(() => {
      simulateKeyEvent("keydown", key);
    }, 50);
  };

  const stopHoldingKey = () => {
    if (keyInterval.current) {
      clearInterval(keyInterval.current);
      keyInterval.current = null;
    }
    if (activeKey.current) {
      simulateKeyEvent("keyup", activeKey.current); // Release key
      activeKey.current = null;
    }
  };

  if(controls){
    controls.keyRotateSpeed = 10;
  }

  useEffect(() => {
    if (!controls) return;

    switch (gestureType) {
      case "Thumb_Up":
        startHoldingKey("ArrowUp");
        break;
      case "Thumb_Down":
        startHoldingKey("ArrowDown");
        break;
      case "Pointing_Up":
        startHoldingKey("ArrowRight");
        break;
      case "ILoveYou":
        startHoldingKey("ArrowLeft");
        break;
      case "Open_Palm":
        zoomIn()
        break;
      case "Closed_Fist":
        zoomOut()
        break;
      default:
        stopHoldingKey();
        break;
    }

    return () => stopHoldingKey(); 
  }, [gestureType, controls]);
}