/* eslint-disable react/prop-types */

/**
 * Input is a component that renders a form input with a label.
 * The `type` prop can be one of the following:
 * - 'text' (default)
 * - 'password'
 * - 'email'
 * - 'tel'
 * The `id` prop is the id of the input element.
 * The `value` prop is the value of the input element.
 * The `onChange` prop is the function that will be called when the input element is changed.
 * The `placeholder` prop is the text to be displayed in the input element when it is empty.
 * The `label` prop is the text to be displayed above the input element.
 * The `required` prop is whether or not the input element is required.
 * The component also uses tailwindcss classes to style the input element and its label.
 * @param {Object} props The props of the component.
 * @returns {JSX.Element} The rendered Input component.
 */
const Input = ({ 
  type = 'text', 
  id, 
  value, 
  onChange, 
  placeholder, 
  label,
  required = false
}) => {
  return (
    <>
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
      />
      </div>
      </>
  );
};

export default Input;