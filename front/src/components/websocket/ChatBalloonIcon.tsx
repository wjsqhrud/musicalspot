import React from 'react';
import { FaCommentDots } from 'react-icons/fa';

interface ChatIconComponentProps {
  toggleChat: () => void;
  showNotification: boolean;
  isJoined: boolean;
}

const ChatIconComponent: React.FC<ChatIconComponentProps> = ({ toggleChat, showNotification, isJoined }) => {

  // 신규 채팅 알림 조건 변수에 채팅 참여여부 추가
  const notifyStateCheck = isJoined && showNotification;

  return (
    <button
    onClick={toggleChat}
    className="transition-all text-4xl text-white bg-signature p-4 rounded-2xl fixed bottom-0 right-0 mr-11 mb-11 z-50 hover:scale-110 shadow-chatBalloonShadow"
    >
    {notifyStateCheck && (
      <>
        <div className="absolute -top-2 -right-1 bg-red-500 w-5 h-5 rounded-full animate-ping"></div>
        <div className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full animate-bounce"></div>
      </>
    )}
    <FaCommentDots />
  </button>
  );
};

export default ChatIconComponent;
