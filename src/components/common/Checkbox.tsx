import React from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false
}) => {
  return (
    <label className="inline-flex items-center">
      <input
        type="checkbox"
        className="
          rounded border-gray-300 text-blue-600 shadow-sm 
          focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50
          disabled:opacity-50 disabled:cursor-not-allowed
        "
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className={`ml-2 ${disabled ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
        {label}
      </span>
    </label>
  );
};

export default Checkbox;