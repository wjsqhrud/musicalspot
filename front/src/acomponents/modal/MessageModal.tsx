import React, { useState } from 'react';

export interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (inputValue?: string) => void;
  message: string;
  showInput?: boolean;
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, onConfirm, message, showInput }) => {
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(showInput ? inputValue : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded shadow-lg p-6 w-96 z-10 flex flex-col items-center justify-center">
        <h2 className="text-lg font-semibold mb-4 text-center">메시지</h2>
        <p className="text-center mb-4">{message}</p>
        {showInput && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="border border-gray-300 p-2 rounded mb-4 w-full"
            placeholder="닉네임을 입력하세요"
          />
        )}
        <div className="flex justify-end mt-4">
          <button 
            onClick={handleConfirm} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
