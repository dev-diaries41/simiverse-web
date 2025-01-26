import React from 'react';
import { ListCardProps } from '@/app/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ListCard({
  title,
  description,
  items,
  icon,
  iconColor,
  titleClassName,
  columns = 1,  
  listType = 'icon',
  listIcon,
  ...props
}: ListCardProps & { titleClassName?: string, listType?: 'icon' | 'bullet' | 'number' }) {

  // Divide the items into columns dynamically
  const columnItems = Array.from({ length: columns }, (_, colIndex) =>
    items.filter((_, index) => index % columns === colIndex)
  );

  return (
    <div
      className="justify-center items-center grid grid-cols-1 sm:grid-cols-2 gap-6 min-h-[300px] w-auto p-8 rounded-lg transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-xl bg-gray-300 dark:bg-[#111]"
      {...props}
    >
      <div className="text-left flex-grow col-span-2">
        <div className="flex flex-row items-center gap-2 mb-2">
          {icon && <FontAwesomeIcon icon={icon} color={iconColor} className="w-6 h-6" />}
          {title && <h2 className={`text-xl font-semibold ${titleClassName}`}>
            {title}
          </h2>}
        </div>

        {description && <p className="max-w-full text-left mb-4 text-lg">
          {description}
        </p>}
        
        <div className={`grid grid-cols-1 sm:grid-cols-${columns} gap-2 md:gap-16 text-xl w-full`}>
          {columnItems.map((column, colIndex) => (
            <ul
              key={colIndex}
              className={`${listType === 'bullet' ? 'list-disc' : listType === 'number' ? 'list-decimal' : 'list-none'} space-y-2 pl-6`}
            >
              {column.map((item, index) => (
                <li key={index} className={`${listType === 'icon' ? 'flex items-center space-x-2' : ''}`}>
                  {listType === 'icon' && listIcon && (
                    <FontAwesomeIcon icon={listIcon} className="text-emerald-500" />
                  )}
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
