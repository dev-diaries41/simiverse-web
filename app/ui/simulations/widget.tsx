import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faStop, faBackward, faForward } from "@fortawesome/free-solid-svg-icons";

interface SimulationWidgetProps {
  time?: number; // Current simulation time in seconds
  isPlaying: boolean; // Current playback state
  onPlay: () => void; // Callback for play action
  onPause?: () => void; // Callback for pause action
  onStop?: () => void; // Callback for stop action
  onBack?: () => void; // Callback for step backward
  onForward?: () => void; // Callback for step forward
}

const SimulationWidget: React.FC<SimulationWidgetProps> = ({
  time,
  isPlaying,
  onPlay,
  onPause,
  onStop,
  onBack,
  onForward,
}) => {
  // Format time as HH:MM:SS
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((time % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="fixed bottom-8 right-0 left-0 flex items-center justify-center p-4 text-white rounded-md space-x-4">
      {/* Timer */}
{    time&&  <div className="font-mono text-lg">{formatTime(time)}</div>
}
      {/* Backward Button */}
      <button
        className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
        onClick={onBack}
        title="Step Backward"
      >
        <FontAwesomeIcon icon={faBackward} className="w-8 h-8" />
      </button>

      {/* Play/Pause Button */}
      <button
        className={`p-2 rounded-full ${
          isPlaying ? "bg-green-600 hover:bg-green-500" : "bg-blue-600 hover:bg-blue-500"
        }`}
        onClick={isPlaying ? onPause : onPlay}
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <FontAwesomeIcon icon={faPause} className="w-8 h-8" />
        ) : (
          <FontAwesomeIcon icon={faPlay} className="w-8 h-8" />
        )}
      </button>

      {/* Stop Button */}
      <button
        className="p-2 rounded-full bg-red-600 hover:bg-red-500"
        onClick={onStop}
        title="Stop"
      >
        <FontAwesomeIcon icon={faStop} className="w-8 h-8" />
      </button>

      {/* Forward Button */}
      <button
        className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
        onClick={onForward}
        title="Step Forward"
      >
        <FontAwesomeIcon icon={faForward} className="w-8 h-8" />
      </button>
    </div>
  );
};

export default SimulationWidget;
