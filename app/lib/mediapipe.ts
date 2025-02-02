import { DrawingUtils, FilesetResolver, GestureRecognizer, GestureRecognizerOptions, HandLandmarker, HandLandmarkerOptions } from "@mediapipe/tasks-vision";

export async function createHandLandMarker(handLandmarkerOptions: HandLandmarkerOptions = {}){
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    const handLandmarker = await HandLandmarker.createFromOptions(
        vision,
        {
        baseOptions: {
            delegate:'GPU',
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        },
        numHands: 1,
        minHandDetectionConfidence: 0.9,
        minHandPresenceConfidence:0.9,
        runningMode: "VIDEO",
        ...handLandmarkerOptions    // allow override
        }
    );

    return handLandmarker;
}

export async function processHandLandmarkVideo ({ 
    handLandmarker, 
    videoElement, 
    canvasElement, 
    isMounted, 
    onHandDetected 
  }: {
    handLandmarker: HandLandmarker | null;
    videoElement: HTMLVideoElement | null;
    canvasElement: HTMLCanvasElement | null;
    isMounted: boolean;
    onHandDetected: (landmarks: any) => void;
  }) {
    if (handLandmarker && videoElement?.readyState === 4 && isMounted) {
      const results = handLandmarker.detectForVideo(videoElement, performance.now());
      const ctx = canvasElement?.getContext("2d");
  
      if (ctx && canvasElement) {
        // Clear canvas first
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        const drawingUtils = new DrawingUtils(ctx);
  
        if (results.landmarks && results.landmarks.length > 0) {
          for (const landmarks of results.landmarks) {
            drawingUtils.drawConnectors(
              landmarks,
              HandLandmarker.HAND_CONNECTIONS,
              {
                color: "#00FF00",
                lineWidth: 3,
              }
            );
            drawingUtils.drawLandmarks(landmarks, {
              color: "#00FF00",
              lineWidth: 3,
            });
          }
          // Notify parent component of hand detection
          onHandDetected(results.landmarks[0]);
        }
      }
    }
    if (isMounted) {
        requestAnimationFrame(() => processHandLandmarkVideo({ handLandmarker, videoElement, canvasElement, isMounted, onHandDetected }));
      }
  };
  

export async function createGestureRecognizer(gestureRecognizerOptions: GestureRecognizerOptions = {}){
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    const gestureRecognizer = await GestureRecognizer.createFromOptions(
        vision,
        {
        baseOptions: {
            delegate:'GPU',
            
            modelAssetPath: "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task"
        },
        numHands: 2,
        runningMode: "VIDEO",
        minHandDetectionConfidence: 0.9,
        minHandPresenceConfidence:0.9,
        ...gestureRecognizerOptions //allow override
        }
    );

    return gestureRecognizer;
}
export async function processGestureVideo ({ 
  gestureRecognizer, 
  videoElement, 
  canvasElement, 
  isMounted, 
  onHandDetected 
}: {
  gestureRecognizer: GestureRecognizer | null;
  videoElement: HTMLVideoElement | null;
  canvasElement: HTMLCanvasElement | null;
  isMounted: boolean;
  onHandDetected: (categoryName: any) => void;
}) {
  if (gestureRecognizer && videoElement && videoElement.readyState === 4 && isMounted) {
    const ctx = canvasElement?.getContext("2d");

    if (ctx && canvasElement) {
      // Clear canvas first
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      const results = gestureRecognizer.recognizeForVideo(videoElement, performance.now());

      if (results.gestures.length > 0) {
        const { categoryName, displayName } = results.gestures[0][0];
        const drawingUtils = new DrawingUtils(ctx);

        if (results.landmarks && results.landmarks.length > 0) {
          for (const landmarks of results.landmarks) {
            drawingUtils.drawConnectors(
              landmarks,
              HandLandmarker.HAND_CONNECTIONS,
              {
                color: "#00FF00",
                radius: 3,
                lineWidth: 3,
              }
            );
            drawingUtils.drawLandmarks(landmarks, {
              color: "#00FF00",
              radius: 3,
              lineWidth: 3,
            });
          }

          ctx.font = "16px Arial";
          ctx.fillStyle = "#FF0000";
          ctx.fillText(categoryName, 10, 30);
          onHandDetected(categoryName);
        }
      } else {
        console.warn('No gesture results');
      }
    }
  }
  
  if (isMounted) {
    requestAnimationFrame(() => processGestureVideo({ gestureRecognizer, videoElement, canvasElement, isMounted, onHandDetected }));
  }
}
