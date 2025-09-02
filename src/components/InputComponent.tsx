import React from 'react';

interface InputProps {
  type?: 'text' | 'password' | 'email' | 'tel' | 'date';
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  type = 'text', 
  id, 
  value, 
  onChange, 
  placeholder, 
  label,
  required = false
}) => {
  return (
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
        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 placeholder-gray-400"
      />
    </div>
  );
};

export default Input;