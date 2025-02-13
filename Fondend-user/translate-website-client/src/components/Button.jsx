// src/components/Button.js
import React from 'react';

const Button = ({ onClick, children, className }) => {
  return (
    <button
      className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;