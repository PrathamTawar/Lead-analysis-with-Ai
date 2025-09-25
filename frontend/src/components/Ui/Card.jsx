import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  padding = true,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-xl shadow-sm border border-gray-200';
  const hoverClasses = hover ? 'hover:shadow-md transition-shadow duration-200' : '';
  const paddingClasses = padding ? 'p-6' : '';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${paddingClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;