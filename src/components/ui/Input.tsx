import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    helperText, 
    error, 
    fullWidth = false, 
    icon, 
    iconPosition = 'left', 
    className = '', 
    id,
    ...props 
  }, ref) => {
    
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    const baseInputStyles = `
      block rounded-md border-gray-300 shadow-sm
      focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50
      disabled:opacity-70 disabled:cursor-not-allowed
      transition duration-150 ease-in-out
    `;
    
    const errorInputStyles = error 
      ? 'border-error-500 focus:border-error-500 focus:ring-error-500' 
      : '';
    
    const hasIconStyles = icon 
      ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') 
      : '';
    
    const widthStyles = fullWidth ? 'w-full' : '';
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        
        <div className="relative rounded-md shadow-sm">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={`${baseInputStyles} ${errorInputStyles} ${hasIconStyles} ${widthStyles}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          
          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
              {icon}
            </div>
          )}
        </div>
        
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
        
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-error-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;