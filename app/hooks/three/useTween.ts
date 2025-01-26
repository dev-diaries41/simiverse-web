import { Tween, Easing } from '@tweenjs/tween.js';
import { PerspectiveCamera } from 'three';

export const useTweenAnimations = () => {
  const animateZoom = (camera: PerspectiveCamera, initialZoom: number, targetZoom: number, duration = 1500) => {
    camera.position.z = initialZoom;

    new Tween(camera.position)
      .to({ z: targetZoom }, duration)
      .easing(Easing.Cubic.Out)
      .start();
  };

  return {
    animateZoom,
  };
};
