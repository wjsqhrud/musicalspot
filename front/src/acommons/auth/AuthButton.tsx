import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;  // Add className prop
  style?: React.CSSProperties;  // Add style prop
}

const AuthButton: React.FC<ButtonProps> = ({ text, onClick, variant = 'primary', className,style  }) => {
  const baseStyle = "w-full p-2 rounded focus:outline-none focus:ring-2 ";
  const primaryStyle = "bg-signature text-white hover:bg-violet-300 hover:text-signature focus:ring-signature";
  const secondaryStyle = "border border-signature text-signature hover:bg-signature hover:text-white focus:ring-signature";
  // text-signature bg-violet-300
  const buttonStyle = variant === 'primary' ? primaryStyle : secondaryStyle;

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${buttonStyle} ${className}`} 
      style={style} 
    >
      {text}
    </button>
  );
};

export default AuthButton;
