import React, { ReactNode } from "react";

const StyledCard = ({ title, children }: {title: string; children: ReactNode}) => {
  return (
    <div className="relative w-full bg-gradient-to-br from-dark-gradient to-gray-900 card-border card-hover p-6 rounded-lg animate-glow max-w-md mx-auto">
      <h2 className="text-blue-border text-xl font-bold mb-4 uppercase tracking-widest border-b border-blue-border pb-2">
        {title}
      </h2>
      <div className="text-gray-300">{children}</div>
    </div>
  );
};

export default StyledCard;
