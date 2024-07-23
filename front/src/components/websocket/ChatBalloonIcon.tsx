import React from 'react';
import { FaCommentDots } from 'react-icons/fa';

interface ChatIconComponentProps {
  toggleChat: () => void;
}

const ChatIconComponent: React.FC<ChatIconComponentProps> = ({ toggleChat }) => (
  <button onClick={toggleChat} className="transition-all text-4xl text-white bg-signature p-4 rounded-2xl fixed bottom-0 right-0 mr-11 mb-11 z-50 hover:scale-110 shadow-chatBalloonShadow">
    <FaCommentDots />
  </button>
);

export default ChatIconComponent;