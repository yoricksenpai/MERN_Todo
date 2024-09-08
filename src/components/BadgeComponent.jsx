/* eslint-disable react/prop-types */
import { Check } from 'lucide-react';

/**
 * Badge component to display a list name with a checkmark if the list is active.
 * @param {string} listName - The name of the list.
 * @param {boolean} isActive - Whether the list is active or not.
 * @param {function} onClick - The function to call when the badge is clicked.
 * @returns {JSX.Element} The rendered badge component.
 */
const BadgeComponent = ({ listName, isActive, onClick }) => {
  return (
    <>
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-sm cursor-pointer mr-2 mb-2 ${
        isActive 
          ? 'bg-emerald-500 dark:bg-emerald-600 text-white' 
          : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
      onClick={() => onClick(listName)}
    >
      {isActive && <Check className="size-4 mr-1" />}
      {listName}
      </span>
      </>
  );
};

export default BadgeComponent;