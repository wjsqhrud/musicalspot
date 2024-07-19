import React from 'react';


type HeaderProps = {
    title: string;
    onClick?: () => void;
    className?: string;
  };
  
  const Header = ({ title, onClick, className }: HeaderProps) => {
    
    return (
      <div className={className} onClick={onClick}>
        <h1>
          {title}
        </h1>
      </div>
    );
  };
  export default Header;
  