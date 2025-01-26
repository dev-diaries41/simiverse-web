import React from "react";

export interface Resources {
  food: number;
  energy: number;
  water: number;
}

export interface YearlyOutcome {
  year: number;
  globalCooperation: number;
  globalDefection: number;
  globalResources: Resources;
  globalPopulation: number;
  activeNations: number;
  description: string;
  icon?: React.ReactNode;
}

type TimelineProps = {
  items: YearlyOutcome[];
  layout?: "vertical" | "horizontal";
};

const Timeline: React.FC<TimelineProps> = ({ items, layout = "vertical" }) => {
  return (
    <div className={`timeline relative ${layout === "horizontal" ? "flex overflow-x-auto" : ""}`}>
      {/* Timeline items */}
      <ul
        className={`relative ${
          layout === "horizontal"
            ? "flex space-x-8"
            : "flex flex-col space-y-8"
        } p-4`}
      >
        {items.map((item, index) => (
          <li key={index} className="flex items-start relative">
            {layout === "vertical" && index !== items.length - 1 && (
              <div className="absolute left-6 top-12 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 opacity-50" />
            )}
            {layout === "horizontal" && index !== items.length - 1 && (
              <div className="absolute top-6 left-12 h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-50" />
            )}

            {/* Timeline icon - futuristic design */}
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tl from-blue-500 to-purple-700 text-white z-10 shadow-lg transform transition-all hover:scale-110">
              {item.icon || (
                <span className="text-lg font-bold">{item.year}</span>
              )}
            </div>

            {/* Timeline content */}
            <div
              className={`ml-4 ${layout === "horizontal" ? "mt-16 text-center" : "flex-1"}`}
            >
              {/* <p className="opacity-70 font-semibold">{item.description}</p> */}
              <div className="text-sm font-medium space-y-2">
                <p><strong>Global Cooperation:</strong> {item.globalCooperation}%</p>
                <p><strong>Global Defection:</strong> {item.globalDefection}%</p>
                <p><strong>Population:</strong> {item.globalPopulation}</p>
                <p><strong>Active Nations:</strong> {item.activeNations}</p>
                <p><strong>Food:</strong> {item.globalResources.food}</p>
                <p><strong>Energy:</strong> {item.globalResources.energy}</p>
                <p><strong>Water:</strong> {item.globalResources.water}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timeline;
