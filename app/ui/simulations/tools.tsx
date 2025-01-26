import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Timeline from "./timeline";
import { YearlyOutcome } from "@/app/types"; 

// type SimulationSidebarProps = {
//   population: number;
//   updatePopulation: (population: number) => void;
//   simulationData: YearlyOutcome[]; // Add the simulation data as a prop
// };

type SimulationSidebarProps = {
     children: React.ReactNode
  };

const SimulationSidebar = React.memo(({children }: SimulationSidebarProps) => {

  return (
    <div className="w-1/4 h-full bg-white dark:bg-gray-800 p-4">
      <div className="flex flex-col gap-4 py-4">
      <h3 className="text-lg font-bold mb-4">Timeline</h3>

        {children}
        {/* <div className="">
          <h3 className="text-lg font-bold mb-4">Timeline</h3>
          <Timeline items={simulationData} layout="vertical" />
        </div> */}
      </div>
    </div>
  );
});

export default SimulationSidebar;
