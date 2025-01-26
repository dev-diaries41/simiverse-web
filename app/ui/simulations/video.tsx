'use client';
import useSceneRecorder from "@/app/hooks/useSceneRecorder";
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faStop, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

// Define types for the props
interface VideoGeneratorProps {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
}

const VideoGenerator: React.FC<VideoGeneratorProps> = React.memo(({ scene, camera }) => {
  if (!scene || !camera) {
    console.error("Missing camera scene or camera")
    return null
  }

  console.log(scene, camera);

  
  ;
  const {
    canvasRef,
    isRecording,
    downloadLink,
    handleStartRecording,
    handleStopRecording,
  } = useSceneRecorder(scene, camera);

  // State to control the widget's play/pause
  const [isPaused, setIsPaused] = useState(false);

  const handleStopClick = () => {
    handleStopRecording();
    setIsPaused(false); // Reset the paused state
  };

  // Animation loop to rotate the cube (if it's part of the scene)
  useEffect(() => {
    const animate = () => {
      if (scene.children.length > 0) {
        // Rotate the first mesh (for example, if it's a cube)
        const cube = scene.children[0] as THREE.Mesh;
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, [scene]);

  return (
    <div className="absolute w-full h-full z-50">
      {/* Main content for video generation */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 z-50 p-6">
        <div className="flex space-x-4 z-50"> {/* Ensure buttons are on top */}
          {!isRecording && (
            <button
              onClick={handleStartRecording}
              className="p-4 rounded-full transition-transform duration-300 bg-green-500 hover:scale-110"
            >
              <FontAwesomeIcon icon={faCircle} className="text-white text-3xl" />
            </button>
          )}

          {isRecording && (
            <>
            
              <button
                onClick={handleStopClick}
                className="p-4 rounded-full bg-gray-600 hover:bg-gray-500 transition-all duration-300 transform hover:scale-110"
              >
                <FontAwesomeIcon icon={faStop} className="text-white text-3xl" />
              </button>
            </>
          )}
        </div>

        {downloadLink && (
          <div className="mt-6 animate-fadeIn">
            <a
              href={downloadLink}
              download="output.webm"
              className="text-blue-400 hover:underline transition-all duration-300"
            >
              Download Video
            </a>
          </div>
        )}
      </div>

      {/* Picture-in-Picture style video widget */}
      {isRecording && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            width: "200px",
            height: "150px",
            borderRadius: "10px",
            border: "2px solid #fff",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 10, // Ensure the widget is on top of everything
          }}
        >
          <canvas ref={canvasRef} width={200} height={150} className="rounded-md" />
        </div>
      )}
    </div>
  );
});

export default VideoGenerator;
