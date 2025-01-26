import React, { ReactNode } from "react";

const Card = ({ title, children }: {title: string; children: ReactNode}) => {
  return (
    <div className="relative max-w-md mx-auto p-6 bg-gradient-to-b from-gray-900 to-blue-900 border border-blue-500 rounded-lg shadow-lg animate-fadeIn">
      {/* Header */}
      <h2 className="text-xl font-bold text-blue-300 border-b border-blue-500 pb-2 mb-4">
        {title}
      </h2>
      {/* Content */}
      <div className="text-blue-200 space-y-3">{children}</div>
    </div>
  );
};

export default Card;
