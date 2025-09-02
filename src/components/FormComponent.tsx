/* eslint-disable react/prop-types */

/**
 * Form component that renders a form with a submit button
 * @param {function} onSubmit - the function to call when the form is submitted
 * @param {ReactNode} children - the content of the form
 * @param {string} submitButtonText - the text of the submit button (default is 'Submit')
 * @returns {ReactElement}
 */
const Form = ({ onSubmit, children, submitButtonText = 'Submit' }) => {
  return (
    <>
    <form onSubmit={onSubmit} className="space-y-4">
      {children}
      <div>
        <button 
          type="submit" 
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {submitButtonText}
        </button>
      </div>
      </form>
      </>
  );
};

export default Form;