import React, { useRef, useState, useEffect } from "react";
import { WebGLRenderer } from "three";

interface CameraWidgetProps {
  renderer: WebGLRenderer;
  canvas: HTMLCanvasElement;
}

const CameraWidget: React.FC<CameraWidgetProps> = ({ renderer, canvas }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!canvas) {
      console.error("CameraWidget requires a valid canvas element.");
      return;
    }

    // Create a stream from the canvas
    const stream = canvas.captureStream(60); // 30 FPS

    // Set the video source for PiP preview
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    // Initialize MediaRecorder
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "video/webm; codecs=vp9",
    });

    // Collect recorded data chunks
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    // Handle recording stop event
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      recordedChunksRef.current = []; // Reset the chunks
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    };

    return () => {
      // Clean up resources
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current = null;
      }
    };
  }, [canvas]);

  const handleStartRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "inactive") {
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 z-[100] ">
      {/* PiP Preview */}
      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-[200px] h-[150px] bottom-2 right-2 border border-black rounded-lg bg-black"
      />

      {/* Recording Controls */}
      <div className=" bottom-[170px] right-2 flex flex-col gap-2">
        {!isRecording ? (
          <button
            onClick={handleStartRecording}
            className="px-3 py-2 bg-green-500 text-white rounded"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={handleStopRecording}
            className="px-3 py-2 bg-red-500 text-white rounded"
          >
            Stop Recording
          </button>
        )}

        {/* Download Link */}
        {downloadUrl && (
          <a
            href={downloadUrl}
            download="recording.webm"
            className="text-blue-500"
          >
            Download Recording
          </a>
        )}
      </div>
    </div>
  );
};

export default CameraWidget;
