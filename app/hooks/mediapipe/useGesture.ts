import { useEffect, useRef } from "react";
import { GestureRecognizer } from "@mediapipe/tasks-vision";
import { createGestureRecognizer, processGestureVideo } from "../../lib/mediapipe";

export const useGesture = (
    onHandDetected: (categoryName: any) => void) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gestureRecognizerRef = useRef<GestureRecognizer | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeMediapipe = async () => {
      try {

        gestureRecognizerRef.current = await createGestureRecognizer()
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

        processGestureVideo({
          gestureRecognizer: gestureRecognizerRef.current,
          videoElement: videoRef.current,
          canvasElement: canvasRef.current,
          isMounted,
          onHandDetected
        });
      } catch (error) {
        console.error("Error initializing MediaPipe Gesture recognizer:", error);
      }
    };

    initializeMediapipe();

    return () => {
      isMounted = false;
      gestureRecognizerRef.current?.close();
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return { videoRef, canvasRef };
};
