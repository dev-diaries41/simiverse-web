import { useEffect, useRef, useState } from "react";
import { GestureRecognizer } from "@mediapipe/tasks-vision";
import { createGestureRecognizer, processGestureVideo } from "../../lib/mediapipe";
import { GestureType } from "@/app/types";


export const useGesture = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gestureRecognizerRef = useRef<GestureRecognizer | null>(null);
  const [gestureTypes, setGestureTypes] = useState<GestureType[]>([])

  useEffect(() => {
    let isMounted = true;

    const onHandDetected = (result: GestureType[]) => {
      setGestureTypes(result);
    }

    const initializeMediapipe = async () => {
      try {

        gestureRecognizerRef.current = await createGestureRecognizer()
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        // Assign video stream to the video element (existing ref)
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.width = 640;
          videoRef.current.height = 480;
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
  if (videoRef.current && videoRef.current.srcObject) {
    const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
    tracks.forEach(track => track.stop()); // Stop the video stream properly
    videoRef.current.srcObject = null;
  }
};

  }, []);

  return { videoRef, canvasRef, gestureTypes };
};
