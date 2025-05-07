import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  variant?: 'default' | 'outline' | 'filled';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  hoverable = false, 
  variant = 'default' 
}) => {
  
  const baseStyles = 'rounded-lg overflow-hidden';
  
  const variantStyles = {
    default: 'bg-white shadow-md',
    outline: 'bg-white border border-gray-200',
    filled: 'bg-gray-50',
  };
  
  const hoverStyles = hoverable 
    ? 'transition-transform transform hover:scale-[1.02] hover:shadow-lg cursor-pointer' 
    : '';
  
  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;