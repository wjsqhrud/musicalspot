import React from 'react';
import '../astyles/Header.css';

type HeaderProps = {
    title: string;
    onClick?: () => void;
  };
  
  const Header = ({ title, onClick }: HeaderProps) => {
    
    return (
      <header className=" font-custom">
        <h1 className="text-2xl cursor-pointer" onClick={onClick}>
          {title}
        </h1>
      </header>
    );
  };
  export default Header;
  