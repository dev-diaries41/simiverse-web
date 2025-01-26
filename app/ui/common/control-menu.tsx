import React, { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionItem } from '@/app/types';

interface ControlMenuProps {
  actions: ActionItem[];
  isMinimized: boolean;
  children?: ReactNode;
}

const ControlMenu: React.FC<ControlMenuProps> = ({ actions, isMinimized, children }) => {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-center space-y-2 p-2 rounded-md shadow-lg">
      {/* Render children if provided */}
      {children}

      {/* Always render the Show Controls button */}
      {actions.map((action, index) => {
        if (action.name === 'Show Controls') {
          return (
            <button
              type="button"
              key={index}
              onClick={action.onClick}
              className={` ${action?.classname} group relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-gray-900 to-black hover:bg-gray-700 rounded-full text-white focus:outline-none transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-xl`}
              aria-label={action.name}
            >
              <FontAwesomeIcon icon={action.icon} className="w-6 h-6 opacity-80 hover:text-blue-500 transition-opacity duration-200 ease-in-out" />
            </button>
          );
        }

        if (!isMinimized) {
          return (
            <button
              type="button"
              disabled={action?.disabled}
              key={index}
              onClick={action.onClick}
              className={` ${action?.classname} group relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-gray-800 to-black hover:bg-gray-700 rounded-full focus:outline-none transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-xl`}
              aria-label={action.name}
            >
              <FontAwesomeIcon icon={action.icon} className="w-6 h-6 opacity-80 hover:text-blue-500 transition-opacity duration-200 ease-in-out" />
              <span className="absolute bottom right-12 mb-2 w-max bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-lg opacity-0 transition-opacity group-hover:opacity-100">
                {action.name}
              </span>
            </button>
          );
        }

        return null;
      })}
    </div>
  );
};

export default ControlMenu;
