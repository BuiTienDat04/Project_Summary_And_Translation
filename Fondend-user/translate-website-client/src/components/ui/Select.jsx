import React from "react";

const Select = ({ options, onChange, value, className }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 ${className}`}
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
