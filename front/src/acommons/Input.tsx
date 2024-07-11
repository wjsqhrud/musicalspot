//src/acommons/Input
import React, { ChangeEvent, forwardRef, KeyboardEvent } from 'react';
import '../astyles/Input.css';

interface InputProps {
  placeholder: string;
  type: 'text' | 'password' | 'email';
  value: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  maxLength?: number;
  
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ placeholder, type, value, onChange, onKeyDown, className, maxLength}, ref) => {
  return (
    <input
      ref={ref}
      className={`input ${className}`}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      maxLength={maxLength}
      
    />
  );
});

export default Input;