//acomponents/auth/TestComponent
import React, { forwardRef, ChangeEvent, KeyboardEvent } from 'react';

// Import utility function
import { getErrorClass } from 'utils/IdErrorStyleUtil/IdErrorStyleUtil';

// Sub-components
import AuthLabel from 'acommons/auth/AuthLabel';
import Input from 'acommons/auth/AuthInput';
import AuthButton from 'acommons/auth/AuthButton';
import AuthDivider from 'acommons/auth/AuthDivider';


interface AuthInputComponentProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onButtonClick?: () => void;
    showLabel?: boolean;
    labelText?: string;
    buttonText?: string;
    placeholderText?: string;
    errorText?: string;
    errorType?: 'error' | 'success' | 'smallError'; // 추가된 부분
    inputType?: 'text' | 'password' | 'email';
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    inputRef?: React.Ref<HTMLInputElement>;  // ref 추가
    maxLength?: number; // maxLength 추가
  }
  
  const AuthInputComponent: React.FC<AuthInputComponentProps> = forwardRef(({
    value,
    onChange,
    onButtonClick,
    showLabel = true,
    labelText = '',
    buttonText = '',
    placeholderText = '',
    errorText = '',
    errorType = 'error', // 기본값을 'error'로 설정
    inputType = 'text',
    onKeyDown,
    maxLength,
    inputRef // ref prop 추가
  }, ref) => {
    
    const errorClass = getErrorClass(errorType);
  
    return (
      <div className="mb-4">
        {showLabel && <AuthLabel text={labelText} />}
        <div className="flex space-x-2 items-center">
          <Input
            placeholder={placeholderText}
            type={inputType}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            className="flex-grow"
            ref={inputRef} // ref 전달
            maxLength={maxLength}
          />
          {buttonText && onButtonClick && (
            <AuthButton text={buttonText} onClick={onButtonClick} variant="secondary" style={{ width: '50%' }} />
          )}
        </div>
        {errorText && (
          <div className={`mt-2 ${errorClass}`}>
            {errorText}
          </div>
        )}
      </div>
    );
  });
  
  export default AuthInputComponent;
  
  
  
  