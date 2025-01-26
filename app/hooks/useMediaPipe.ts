import { useEffect, useRef } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

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
        // Load the Mediapipe vision model
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        handLandmarkerRef.current = await HandLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            },
            numHands: 1,
            minHandDetectionConfidence: 0.9,
            minHandPresenceConfidence:0.9,
            runningMode: "VIDEO",
          }
        );

        // Get user media (camera feed)
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

        // Start processing the video feed
        const processVideo = async () => {
          if (
            handLandmarkerRef.current &&
            videoRef.current?.readyState === 4 &&
            isMounted
          ) {
            const results = handLandmarkerRef.current.detectForVideo(
              videoRef.current,
              performance.now()
            );

            const ctx = canvasRef.current?.getContext("2d");
            if (ctx && canvasRef.current) {
              // Clear canvas first
              ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

              if (results.landmarks && results.landmarks.length > 0) {
                // Draw landmarks
                results.landmarks[0].forEach((landmark) => {
                  ctx.beginPath();
                  ctx.arc(
                    landmark.x * canvasRef.current!.width,
                    landmark.y * canvasRef.current!.height,
                    5, // Radius of the circle
                    0,
                    2 * Math.PI
                  );
                  ctx.fillStyle = "red";
                  ctx.fill();
                });

                // Notify parent component of hand detection
                onHandDetected(results.landmarks[0]);
              }
            }
          }

          if (isMounted) {
            requestAnimationFrame(processVideo); // Keep processing the video feed
          }
        };

        processVideo();
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
