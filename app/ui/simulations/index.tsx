'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useSimulation } from '@/app/hooks/useSimulation';
import Globe from './globe';
import ControlMenu from '../common/control-menu';
import Settings from '../common/settings';
import SidePanel from './panel';
import { useSettings } from '@/app/providers/settings';
import useControlMenu from '@/app/hooks/useControlMenu';
import Stats from './stats';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { useLoading } from '@/app/hooks';
import { useGesture } from '@/app/hooks/mediapipe/useGesture';

const backgroundImages = [
  '/background.jpg',
  '/gates.jpg',
];

export default function Simulation() {
  const {
    outcomes,
    isRunning,
    prevStats,
    stats,
    downloadLink,
    aiBackgroundImgUrl,
    startSimulation,
    reset,
  } = useSimulation();

  const { showSettings } = useSettings();
  const { actions, isMinimized, isDataPanelVisible, isDataPanelExpanded, toggleDataPanel, toggleDataPanelExpansion } = useControlMenu();
  const { canvasRef, videoRef, gestureTypes } = useGesture();
  const { loading, setLoading } = useLoading(true);
  const globeContainerRef = useRef<HTMLDivElement | null>(null);

  const onGestureChange = () => {
    if(gestureTypes[0] === 'Open_Palm' && gestureTypes[1] === 'Open_Palm' && !isRunning){
      reset();
      startSimulation();
    }else if(gestureTypes[0] === 'Closed_Fist' && gestureTypes[1] === 'Closed_Fist'){
      toggleDataPanel()
    }else if(gestureTypes[0] === "Pointing_Up" && gestureTypes[1] === "Pointing_Up"){
      toggleDataPanelExpansion();
    }
  }

  useEffect(() => {
    onGestureChange()
  }, [gestureTypes]);

  return (
    <div className="w-full h-full flex flex-row relative">
      <form
        action={() => {
          reset();
          startSimulation();
        }}
        className="flex-grow flex flex-col items-center"
      >
        {!loading && (
          <div className="flex flex-row justify-between items-start w-full p-4 pt-20 animate-fadeIn">
            <h1 className="text-2xl font-medium mr-auto ">Global Survival Simulation</h1>
            <div className="flex flex-row">
              <Stats stats={stats} prevStats={prevStats} />
              {isRunning && (
                <span className="flex items-center ml-8 mb-auto ml-2 text-green-500 text-xl">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-1"></span>
                  [Live]
                </span>
              )}
            </div>
          </div>
        )}
        <div className="fixed w-full h-screen opacity-80" ref={globeContainerRef}>
          <Globe
            gestureTypes={gestureTypes}
            backgroundUrl={aiBackgroundImgUrl || backgroundImages[0]}
            textureUrl="/earth2.jpg"
            population={outcomes[outcomes.length - 1]?.globalPopulation ?? 0}
            onReady={(scene, camera) => {
              setTimeout(() => setLoading(false), 1000);
            }}
          />
        </div>
      </form>

      <SidePanel
        isVisible={isDataPanelVisible}
        isExpanded={isDataPanelExpanded}
        isLive={isRunning}
        outcomes={outcomes}
        onClose={toggleDataPanel}
        onExpandToggle={toggleDataPanelExpansion}
        downloadLink={downloadLink}
      />
      <ControlMenu actions={actions} isMinimized={isMinimized}>
        <form
          action={() => {
            reset();
            startSimulation();
          }}
        >
          <button
            type="submit"
            disabled={isRunning}
            className={` ${
              isRunning ? 'opacity-50' : ''
            } group relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-gray-900 to-black hover:bg-gray-700 rounded-full text-white focus:outline-none transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-xl`}
            aria-label={'Start sim'}
          >
            <FontAwesomeIcon icon={faPlayCircle} className="w-6 h-6 text-emerald-500" />
            <span className="absolute bottom right-12 mb-2 w-max bg-gradient-to-br from-gray-900 to-black hover:bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-lg opacity-0 transition-opacity group-hover:opacity-100">
              {isRunning ? 'Simulation running' : 'Start simulation'}
            </span>
          </button>
        </form>
      </ControlMenu>
      <video
        ref={videoRef}
        width={320}
        height={240}
        autoPlay
        muted
        className="fixed bottom-0 z-[100]"
        style={{ display: 'block', margin: 'auto' }}
      />
      <canvas
        ref={canvasRef}
        width={320}
        height={240}
        className="fixed bottom-0 z-[101]"
        style={{
          pointerEvents: 'none',
        }}
      />
      {showSettings && <Settings />}
    </div>
  );
}
