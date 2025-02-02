import { GestureType } from "@/app/types";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export function useGestureOrbitControls(controls: OrbitControls | null, gestureType: GestureType) {
  const activeKey = useRef<string | null>(null);
  const keyInterval = useRef<NodeJS.Timeout | null>(null);

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
    if (activeKey.current === key) return; // Prevent re-triggering the same key
    stopHoldingKey(); // Stop any previously held key

    activeKey.current = key;
    simulateKeyEvent("keydown", key); // Press key once

    // Manually simulate repeated key presses every 30ms
    keyInterval.current = setInterval(() => {
      simulateKeyEvent("keydown", key);
    }, 100);
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
      case "Pointing_Up":
        startHoldingKey("ArrowUp");
        break;
      case "Thumb_Down":
        startHoldingKey("ArrowDown");
        break;
      case "Open_Palm":
        startHoldingKey("ArrowRight");
        break;
      case "Closed_Fist":
        startHoldingKey("ArrowLeft");
        break;
      default:
        stopHoldingKey();
        break;
    }

    return () => stopHoldingKey(); // Cleanup when component unmounts or gesture changes
  }, [gestureType, controls]);
}
