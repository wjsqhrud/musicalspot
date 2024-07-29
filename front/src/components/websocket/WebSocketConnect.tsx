import React, { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { FaMinus } from 'react-icons/fa';
import { IoEnterOutline } from 'react-icons/io5';
import { IoIosSend } from "react-icons/io";
import SignUpRedirect from 'components/Modal/SignUpRedirectModal';
import { useAuth } from 'hooks/useAuthHook';
import { ChatMessage, MessageType, initializeWebSocket } from '../../hooks/connectWebSocketHook';
import { ImExit } from "react-icons/im";
import 'tailwindcss/tailwind.css';
import styles from './WebSocketConnect.module.css';
import { REDIRECT_SIGN_IN, SOCKET_MAINADDRESS } from 'utils/APIUrlUtil/apiUrlUtil';

interface ChatComponentProps {
  isVisible: boolean;
  toggleChat: () => void;
  messages: ChatMessage[];
  handleNewMessage: (message: ChatMessage) => void;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const WebSocketConnect: React.FC<ChatComponentProps> = ({ isVisible, toggleChat, messages, handleNewMessage, setMessages }) => {
  const serverAddr = SOCKET_MAINADDRESS;
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messageInput, setMessageInput] = useState<string>('');
  const [userNickname, setUserNickname] = useState<string>('');
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { checkAuthStatus } = useAuth();
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const MUTE_DURATION = 10000;

  const handleConnectWebSocket = () => {
    checkAuthStatus(
      (nickname) => {
        setUserNickname(nickname);
        connectWebSocket(nickname);
      },
      () => {
        setShowModal(true);
      }
    );
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const connectWebSocket = (nickname: string) => {
    const config = {
      serverAddr,
      onMessage: handleNewMessage,
      onPersonalMessage: handlePersonalMessage,
      onError: (error: any) => console.error(error),
      onDebug: (message: string) => console.log(message),
    };

    const client = initializeWebSocket(config, nickname, setIsJoined);
    client.onWebSocketClose = () => {
      setIsConnected(false);
      setIsJoined(false);
    };

    setStompClient(client);
    setIsConnected(true);
  };

  useEffect(() => {
    return () => {
      if (stompClient && stompClient.active) {
        console.log('WebSocket 연결 해제');
        stompClient.deactivate();
      }
    };
  }, [stompClient]);

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const maximumChatLength = 150;

    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    if (messages.length > maximumChatLength) {
      // 메시지 배열 길이 제한 초과 시 가장 오래된 메시지 제거
      handleNewMessage(messages.slice(1) as unknown as ChatMessage);
    }
  }, [messages, handleNewMessage]);

  const sendMessage = () => {
    if (isMuted) {
      window.alert('도배 및 욕설로 인해 채팅이 금지되어 있습니다. 잠시 후 다시 시도하세요.');
      return;
    }

    if (!isJoined) {
      setMessageInput('');
      window.alert('아직 채팅에 참여하지 않았습니다.');
    } else if (!messageInput.trim()) {
      window.alert('빈 내용은 전송할 수 없습니다.');
    } else if (stompClient) {
      const chatMessage: ChatMessage = {
        nickname: userNickname,
        messageText: messageInput,
        transmitTime: '',
        type: MessageType.CHAT,
      };
      stompClient.publish({
        destination: '/app/transmitMessages',
        body: JSON.stringify(chatMessage),
      });
      setMessageInput('');
    }
  };

  const handleExitChat = () => {
    const chatMessage: ChatMessage = {
      nickname: userNickname,
      messageText: messageInput,
      transmitTime: '',
      type: MessageType.JOIN,
    };

    if (stompClient && stompClient.active) {
      stompClient.publish({
        destination: '/app/chat.removeUser',
        body: JSON.stringify({ nickname: userNickname })
      });
      stompClient.deactivate();
      setIsConnected(false);
      setIsJoined(false);
      setMessages([]);
      setMessageInput('');
      toggleChat();

    }

  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const handlePersonalMessage = (message: ChatMessage) => {
    // 개인 메시지 핸들링 로직
    if (message.messageText?.includes("비속어")) {
      window.alert("비속어가 감지되었습니다.");
      setIsMuted(true);
      setTimeout(() => setIsMuted(false), MUTE_DURATION);

    } else if (message.messageText?.includes("동일문자열")) {
      window.alert("동일한 내용을 연속해서 전송할 수 없습니다.");

    } else if (message.messageText?.includes("도배감지")) {
      window.alert("도배 감지됨. 일정 시간 동안 채팅이 금지됩니다.");
      setIsMuted(true);
      setTimeout(() => setIsMuted(false), MUTE_DURATION);
    }
  };

  return (
    <>
      {isVisible && (
        <div
          id="chatContainer"
          className={`z-50 fixed flex flex-col justify-between bottom-0 right-0
            mr-11 mb-11 w-[400px]  h-[700px]  rounded-lg select-none ${styles.customBoxShadow} bg-white`}
        >
          <div className="flex justify-end items-center p-2 bg-violet-400 rounded-t-lg opacity-70">
            <button onClick={toggleChat} className="rounded-full p-2 text-white hover:bg-white hover:text-red-600 transition-all">
              <FaMinus />
            </button>
            <button onClick={handleExitChat} className='flex ml-2 bg-transparent rounded-full p-2
             text-white hover:bg-white hover:text-red-600 transition-all'>
              <ImExit size={18}/>
              </button>
          </div>
  
          <div className={`flex-grow flex items-center justify-center ${isConnected ? 'hidden' : ''}`}>
            <button
              onClick={handleConnectWebSocket}
              className="relative flex items-center justify-center px-8 py-3 text-lg
              rounded-full
              transition-all duration-300 ease-in-out
              shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] 
              hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]
              overflow-hidden
              group"
            >
              <span className='mr-2 text-white font-semibold tracking-wide relative z-10 
              group-hover:translate-x-0.5 transition-transform duration-300'>
                채팅 입장
              </span>
              <IoEnterOutline size={24} className="relative z-10 text-white 
              group-hover:translate-x-0.5 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-400"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 
              bg-white transition-opacity duration-300"></div>
            </button>
          </div>
  
          <div className={`flex-grow ${isConnected ? '' : 'hidden'} ${styles.customScrollbar} overflow-y-auto`}>
            {isConnected && !isJoined ? (
              <div className="flex items-center justify-center h-full">
                <button
                  onClick={handleConnectWebSocket}
                  className="relative z-10 flex items-center justify-center space-x-2 text-xl px-6 py-3 
                  bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-full transition-all 
                  duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <span className='group-hover:text-green-400 transition-colors duration-300'>채팅 입장</span>
                  <IoEnterOutline size={24} />
                </button>
              </div>
            ) : (
              messages.map((v, index) => (
                <div key={index} className={`animate-fade flex 
                ${v.nickname === userNickname && v.type === MessageType.CHAT ? 'justify-end' : 'justify-start'}`}>
                  {v.type === MessageType.JOIN ? (
                    <div className="flex justify-center bg-gray-300 py-1 px-4 m-1 rounded-xl w-fit ml-16 
                    text-black text-xs font-mono font-semibold">
                      <span>{v.messageText}</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-gray-400 text-xxs bg-white justify-items-end">{v.transmitTime}</span>
                      <div className={`${v.nickname === userNickname ? 'bg-signature' : 'bg-violet-400'} p-2 m-1 rounded-xl 
                      ${v.nickname === userNickname ? 'rounded-br-none' : 'rounded-bl-none'} w-fit text-white max-w-80`}>
                        {v.nickname === userNickname ? `${v.messageText}` : `${v.nickname} : ${v.messageText}`}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messageEndRef}></div>
          </div>
  
          <div id="inputContainer" className={`'w-full rounded-b-lg' ${ !isJoined ? 'hidden' : 'block'} `}>
            <div id="inputInnerContainer" className="flex items-center border-t border-signature rounded-b-lg">
              <input
                id="chatTransmitter"
                className="flex-1 h-12 pl-1 outline-none border-none rounded-b-lg"
                type="text"
                value={messageInput}
                placeholder="이곳에 메시지를 입력하세요."
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button className="m-1 p-1 bg-transparent text-signature rounded-lg hover:text-white hover:bg-signature 
              transition-all" onClick={sendMessage}>
                <IoIosSend size={26} />
              </button>
            </div>
          </div>
          {showModal && <SignUpRedirect onClose={closeModal} signInUrl={REDIRECT_SIGN_IN()} toggleChat={toggleChat} />}
        </div>
      )}
    </>
  );
};

export default WebSocketConnect;
