import React from 'react';
import { Check } from 'lucide-react';

interface BadgeComponentProps {
  listName: string;
  isActive?: boolean;
  onClick?: (listName: string) => void;
}

const BadgeComponent: React.FC<BadgeComponentProps> = ({ listName, isActive, onClick }) => {
  if (onClick) {
    return (
      <button
        type="button"
        className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs sm:text-sm mr-2 mb-2 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
          isActive 
            ? 'bg-emerald-500 dark:bg-emerald-600 text-white' 
            : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        onClick={() => onClick(listName)}
      >
        {isActive && <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />}
        {listName}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs sm:text-sm mr-2 mb-2 whitespace-nowrap bg-emerald-500 dark:bg-emerald-600 text-white">
      <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
      {listName}
    </span>
  );
};

export default BadgeComponent;