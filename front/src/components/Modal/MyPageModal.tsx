import React, { useEffect, useState } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (inputValue?: string) => void;
  message: string;
  showInput?: boolean;
  placeholder?: string; // 기본값 설정
}
const validPasswordFormat = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,13}$/;
  return passwordRegex.test(password);
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, message, showInput, placeholder = "닉네임을 입력하세요" }) => {
  const [inputValue, setInputValue] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (showInput && !validPasswordFormat(inputValue)) {
      setValidationMessage("8-13자의 영어 대소문자와 숫자를 포함해야 합니다.");
      return;
    }
    onConfirm(showInput ? inputValue : undefined);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (validPasswordFormat(value)) {
      setValidationMessage("올바른 형식입니다.");
    } else {
      setValidationMessage("8-13자의 영어 대소문자와 숫자를 포함해야 합니다.");
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded shadow-lg p-6 w-96 z-10 flex flex-col items-center justify-center">
        <p className="text-center mb-4">{message}</p>
        {showInput && (
          <>
            <input
              type="password"
              value={inputValue}
              onChange={handleInputChange}
              className="border border-gray-300  p-2 rounded mb-2 w-full focus:outline-none focus:ring-2 focus:ring-signature"
              placeholder={placeholder}
            />
            <div className={`text-sm ${validPasswordFormat(inputValue) ? 'text-blue-500' : 'text-red-500'}`}>
              {validationMessage}
            </div>
          </>
        )}
        <div className="flex justify-end mt-4 gap-7">
        <button
            onClick={handleConfirm}
            className="bg-signature text-white px-4 py-2 rounded hover:bg-violet-300 hover:text-signature focus:ring-signature"
          >
            확인
          </button>
        <button
            onClick={onClose}
            className="border border-signature text-signature px-4 py-2 rounded hover:bg-signature hover:text-white focus:ring-signature"
          >
            취소
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default Modal;
