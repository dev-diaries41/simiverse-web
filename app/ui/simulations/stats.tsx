import React from "react";

const Stats = React.memo(
  ({
    stats,
    prevStats,
  }: {
    stats: { label: string; value: number }[];
    prevStats: { label: string; value: number }[];
  }) => {
    return (
      <div className="flex flex-wrap gap-6 max-w-[100%] mr-auto  z-50">
        {stats.map((stat, index) => {
          const prevValue = prevStats[index]?.value || 0;
          const diff = prevValue !== 0 ? ((stat.value - prevValue) / prevValue) * 100 : 0;
          const iconColor = diff > 0 ? "text-emerald-500" : diff < 0 ? "text-red-500" : "";

          return (
            <div
              key={index}
              className="relative opacity-50 flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-gray-900 to-black border-[1.0px] border-blue-900 shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-[1.10] group"
            >
              {/* Stat Label */}
              <span
                style={{ "--glow-color": "rgba(20, 50, 50, 0.8)" } as React.CSSProperties}
                className="text-xs font-medium tracking-wide glow"
              >
                {stat.label}
              </span>

              <div className="flex flex-row items-center justify-center gap-1">
                <span className="text-md font-semibold mt-2">{stat.value}</span>
              </div>
                {iconColor && (
                  <div className={` ${iconColor} mt-auto ml-auto flex flex-row items-center gap-1`}>
                    <span className="text-xs font-semibold mt-2">
                      {diff > 0 ? `+${diff.toFixed(2)}%` : `${diff.toFixed(2)}%`}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 pointer-events-none border-[1.5px] border-transparent rounded-lg transition-transform group-hover:scale-105 group-hover:border-blue-500 group-hover:shadow-blue-500/50"/>
            </div>
          );
        })}
      </div>
    );
  }
);

export default Stats;
