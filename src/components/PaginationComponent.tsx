import React from 'react';

interface PaginationComponentProps {
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  totalPages: number;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ currentPage, setCurrentPage, totalPages }) => {
  return (
    <nav aria-label="Pagination" className="w-full mt-4">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Précédent
        </button>
        <span className="px-3 py-2 text-sm sm:text-base bg-gray-200 rounded-md dark:bg-gray-700 dark:text-white">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Suivant
        </button>
      </div>
    </nav>
  );
};

export default PaginationComponent;