//src/acommons/Label
import React from 'react';
import '../astyles/Label.css';

interface LabelProps {
  text: string;
  className?: string;
}

const AuthLabel: React.FC<LabelProps> = ({ text, className }) => {
  return <label className={`label ${className}`}>{text}</label>;
};

export default AuthLabel;