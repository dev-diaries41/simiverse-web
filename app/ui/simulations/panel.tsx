import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faExpand, faTimes } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useRef, ReactNode, memo } from "react";
import { useDraggable } from "@/app/hooks/useDraggable";
import ChartsWrapper from "./charts-wrapper";
import { SurvivalStats } from "simiverse";

interface DataPanelProps {
    isVisible: boolean;
    isExpanded: boolean;
    onClose: () => void;
    onExpandToggle: () => void;
    isLive?: boolean;
    downloadLink?: string | null;
    outcomes: SurvivalStats[]
}

// Main Component
export const SidePanel= memo(({
    isVisible,
    isExpanded,
    onClose,
    onExpandToggle,
    isLive,
    downloadLink,
    outcomes
}: DataPanelProps) =>{
    // if (!isVisible) return null;

    const { width: panelWidth, handleMouseDown } = useDraggable(500);

    return (
        <div
            className={`fixed ${isVisible? '':'hidden'} z-[100] is top-0 right-0 bg-gradient-to-br from-gray-800 to-black opacity-95 shadow-lg transition-transform ${
                isExpanded ? 'w-full h-full' : `h-screen w-[${panelWidth}]px`
            }`}
        >
            <div className="flex justify-between items-center p-4 gap-2 text-white">
                {isLive && (
                    <span className="flex items-center ml-2 text-green-500 text-xl">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-1"></span>
                        [Live]
                    </span>
                )}
                {downloadLink && (
                    <a
                        href={downloadLink}
                        download={`metrics_${Date.now()}.json`}
                        className="mr-auto px-3 py-1 bg-blue-500 text-sm text-white rounded-full hover:bg-blue-600"
                    >
                        Export
                    </a>
                )}
                <div className="ml-auto flex gap-2">
                    <button
                        onClick={onExpandToggle}
                        className="p-2 rounded-full text-white"
                    >
                        <FontAwesomeIcon icon={isExpanded ? faMinus : faExpand} className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-white"
                    >
                        <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div
                className="p-4 overflow-y-auto h-[calc(100%-64px)]"
                style={{
                    width: isExpanded ? '100%' : `${panelWidth}px`,
                }}
            >
            <ChartsWrapper outcomes={outcomes} isExpanded={isExpanded}/>
           
            </div>

            {!isExpanded && (
                <div
                    className="absolute top-1/2 left-0 transform -translate-y-1/2 w-2 h-8 cursor-ew-resize"
                    onMouseDown={handleMouseDown}
                >
                    <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-500 rounded-md w-4 h-8" />
                </div>
            )}
        </div>
    );
})
