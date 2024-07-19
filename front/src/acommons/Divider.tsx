//src/acommons/Divider
import React from 'react';


interface DividerProps {
    text?: string;
  }
  
  const Divider: React.FC<DividerProps> = ({ text }) => {
    return (
      <div className="divider">
        <hr className="divider-line" />
        <span className="divider-text">{text}</span>
        <hr className="divider-line" />
      </div>
    );
  };
  
  export default Divider;