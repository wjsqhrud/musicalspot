//src/acommons/Button
import React, { ReactNode } from 'react';
import '../astyles/Button.css';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode; 
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className, style, children }) => {
  return (
    <button
      className={`button ${className}`}
      style={style}
      onClick ={onClick}
    >
      {text}
      {children} {/* children을 렌더링 */}
    </button>
  );
};

export default Button;