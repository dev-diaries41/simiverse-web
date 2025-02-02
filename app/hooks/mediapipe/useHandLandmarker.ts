import { useEffect, useRef } from "react";
import { HandLandmarker } from "@mediapipe/tasks-vision";
import { createHandLandMarker, processHandLandmarkVideo } from "../../lib/mediapipe";

export const useHandLandmarker = (
  onHandDetected: (landmarks: Array<{ x: number; y: number; z: number }>) => void
) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeMediapipe = async () => {
      try {

        handLandmarkerRef.current = await createHandLandMarker()
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        // Assign video stream to the video element (existing ref)
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.width = 320;
          videoRef.current.height = 240;
          videoRef.current.autoplay = true;
          videoRef.current.playsInline = true;

          // Start the video element once the metadata is loaded
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
          };
        }

        processHandLandmarkVideo({
          handLandmarker: handLandmarkerRef.current,
          videoElement: videoRef.current,
          canvasElement: canvasRef.current,
          isMounted,
          onHandDetected
        });
      } catch (error) {
        console.error("Error initializing MediaPipe Hand Landmarker:", error);
      }
    };

    initializeMediapipe();

    return () => {
      isMounted = false;
      handLandmarkerRef.current?.close();
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return { videoRef, canvasRef };
};
