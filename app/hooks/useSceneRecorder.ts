import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

const useSceneRecorder = (scene: THREE.Scene, camera: THREE.Camera, fps: number = 30) => {
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // The canvas element

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create WebGLRenderer and link it to the canvasRef
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight); // Or any size you want for your canvas
    renderer.setClearColor(0x000000); // Background color of the canvas

    // Render loop
    const animate = () => {
      renderer.render(scene, camera);
      if (isRecording) {
        requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      // Cleanup and stop the animation frame if the component unmounts or recording stops
      cancelAnimationFrame(animate);
    };
  }, [scene, camera, isRecording]);

  // Start recording
  const handleStartRecording = () => {
    if (!canvasRef.current) return;

    setIsRecording(true);
    setDownloadLink(null);
    setChunks([]); // Clear previous chunks

    const stream = canvasRef.current.captureStream(fps); // Capture the stream from the canvas
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setChunks((prevChunks) => [...prevChunks, event.data]); // Collect chunks
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setDownloadLink(url); // Create the download link
      setIsRecording(false);
    };

    mediaRecorder.start();
  };

  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  };

  return {
    canvasRef, // Reference to the canvas for the component to access
    isRecording,
    downloadLink,
    handleStartRecording,
    handleStopRecording,
  };
};

export default useSceneRecorder;
