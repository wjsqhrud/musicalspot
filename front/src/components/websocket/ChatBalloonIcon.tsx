import React, { CSSProperties } from 'react';
import { FaCommentDots } from 'react-icons/fa';

interface ChatIconComponentProps {
  toggleChat: () => void;
}


const ChatIconComponent: React.FC<ChatIconComponentProps> = ({ toggleChat }) => (
  <button onClick={toggleChat} className="transition-all text-4xl text-white bg-signature p-4 rounded-2xl fixed bottom-0 right-0 mr-11 mb-11 z-50 hover:scale-110 shadow-chatBalloonShadow">
    <div className='absolute flex justify-center items-center -top-1 -right-1 rounded-full bg-white w-6 h-6'>
      <div className='absolute bg-red-500 w-5 h-5 rounded-full animate-pulse'></div>
      </div>
    <FaCommentDots />
  </button>
);

export default ChatIconComponent;