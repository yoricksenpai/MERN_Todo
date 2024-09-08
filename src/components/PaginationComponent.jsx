/**
 * Renders a pagination component with a "previous" button, a text
 * indicating the current page number and the total number of pages,
 * and a "next" button.
 *
 * @param {number} currentPage - The current page number.
 * @param {function} setCurrentPage - The function to call when the
 *   page number changes.
 * @param {number} totalPages - The total number of pages.
 * @returns {JSX.Element} The rendered pagination component.
 */
// eslint-disable-next-line react/prop-types
const PaginationComponent = ({ currentPage, setCurrentPage, totalPages }) => {
  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 mr-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Précédent
      </button>
      <span className="px-4 py-2 bg-gray-200 rounded-md dark:bg-gray-700 dark:text-white">
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 ml-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Suivant
      </button>
    </div>
  );
};

export default PaginationComponent;