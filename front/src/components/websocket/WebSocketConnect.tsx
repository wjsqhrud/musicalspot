import React, { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { FaMinus } from 'react-icons/fa';
import { IoEnterOutline } from 'react-icons/io5';
import { IoIosSend } from "react-icons/io";
import { useAuth } from 'hooks/useAuthHook';
import { ChatMessage, MessageType, initializeWebSocket } from '../../hooks/connectWebSocketHook';
import { ImExit } from "react-icons/im";
import 'tailwindcss/tailwind.css';
import styles from './WebSocketConnect.module.css';

import { SOCKET_MAINADDRESS } from 'utils/APIUrlUtil/apiUrlUtil';
import useNavigateHelper from 'utils/NavigationUtil/navigationUtil';
import ModalWithCancle from 'components/Modal/ModalWithCancle';
import Modal from 'components/Modal/Modal';


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


  const MUTE_DURATION = 10000;
  const { navigateToLogin }= useNavigateHelper();
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showMutedModal, setShowMutedModal] = useState<boolean>(false);
  const [isOverMsgLength, setIsOverMsgLength] = useState<boolean>(false);
  const [isSameMsg, setIsSameMsg] = useState<boolean>(false);
  const [isEmptyMsg, setIsEmptyMsg] = useState<boolean>(false);

  const isAllGreen = isConnected && isJoined;

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

  const closeModalWithChat = () => {
    setShowModal(false);
    toggleChat();
  };
  const closeOnlyModal = () => {
    setShowModal(false);
  }

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
    const maximumMessageRender = 100;
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    if (messages.length > maximumMessageRender) {
      handleNewMessage(messages.slice(1) as unknown as ChatMessage);
    }
  }, [messages, handleNewMessage]);

  useEffect(() => {
    if(messageInput.trim() === "") {
      setIsEmptyMsg(true);
    } else {
      setIsEmptyMsg(false);
    }
  },[messageInput])

  const sendMessage = () => {

    if (!messageInput.trim()) {
      setIsEmptyMsg(true);

      return;
    }

    if (stompClient && !isMuted) {
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
    if (message.messageText?.includes("비속어") || message.messageText?.includes("도배감지")) {
      setIsMuted(true);
      setTimeout(() => {
        setIsMuted(false);
      }, MUTE_DURATION);

      setShowMutedModal(true);

    } else if (message.messageText?.includes("동일문자열")) {
      setIsSameMsg(true);
    } else if (message.messageText?.includes("길이초과")) {
// <<<<<<< HEAD
//       //todo: 여기모달
//       setLogOutModalOpen(true);
//       // window.alert("한번에 최대 전송 가능한 문자는 50자 이내 입니다.");
// =======
      setIsOverMsgLength(true);

    }
  };

  return (
    <>
      {isVisible && (
        <div
          id="chatContainer"
          className={`${styles.chatContainer} ${styles.customBoxShadow}`}
        >
          <div className={styles.upperBtnContainer}>
            <button onClick={toggleChat} className={styles.minimizeBtn}>
              <FaMinus />
            </button>
            <button onClick={handleExitChat} className={styles.exitChatBtn}>
              <ImExit size={18}/>
            </button>
          </div>
  
          <div className={`flex-grow flex items-center justify-center bg-slate-300 ${isConnected ? 'hidden' : ''}`}>
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
  
          <div className={`flex-grow ${isAllGreen ? '' : 'hidden'} ${styles.customScrollbar} overflow-y-auto`}>
            {isConnected && !isJoined ? (
              <div className="flex items-center justify-center h-full max-w-[400px]">
                <button
                  onClick={handleConnectWebSocket}
                  className="relative z-10 flex items-center justify-center space-x-2 text-xl px-6 py-3 
                text-white rounded-full transition-all 
                  duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <span className={`group-hover:text-green-400 transition-colors duration-300`}>채팅 입장</span>
                  <IoEnterOutline size={24} />
                </button>
              </div>
            ) : (
              messages.map((v, index) => (
                <div key={index} className={`${styles.animateFadeIn} flex ${styles.customFont} break-words text-wrap
                ${v.nickname === userNickname && v.type === MessageType.CHAT ? 'justify-end' : 'justify-start'}`}>
                  {v.type === MessageType.JOIN ? (
                    <div className={`font-mono ${styles.noticeStyle}`}>
                      <span>{v.messageText} </span>
                    </div>
                  ) : (
                    <div className={`flex items-end ${v.nickname === userNickname ? 'flex-row': 'flex-row-reverse'}`}>
                      <span className="text-gray-400 text-xxs bg-white">{v.transmitTime}</span>
                      <div className={`${v.nickname === userNickname ? 'bg-green-500' : 'bg-signature'} p-2 m-1 rounded-xl 
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
                className="flex-1 h-12 pl-3 outline-none border-none rounded-b-lg"
                type="text"
                value={messageInput}
                disabled={isMuted}
                placeholder={isMuted ? "욕설 및 도배로 인해 채팅이 금지 되었습니다." : "이곳에 메시지를 입력하세요"}
                onChange={handleInputChange}
                autoComplete='off'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              {!isEmptyMsg && <button className="m-1 p-1 bg-transparent text-signature rounded-lg hover:text-white hover:bg-signature 
              transition-all animate-fade" onClick={sendMessage}>
                <IoIosSend size={26} />
              </button>}
              
            </div>
          </div>

          {showModal && 
          <ModalWithCancle
          isOpen={showModal}
          onClose={closeModalWithChat} 
          onConfirm={()=>{navigateToLogin()}}
          toggleChat={toggleChat}
          message='채팅 기능은 로그인한 회원만 이용 가능합니다.'
          />}
          {showMutedModal && (
          <Modal
            isOpen={showMutedModal}
            onClose={() => setShowMutedModal(false)}
            onConfirm={() => setShowMutedModal(false)}
            message={`도배 및 비속어 사용으로 인해 ${MUTE_DURATION / 1000} 초 동안 채팅이 금지되었습니다. 바르고 고운말 사용을 사용해주세요`}
          />)}
          {isOverMsgLength && <Modal
          isOpen={isOverMsgLength}
          onClose={closeOnlyModal}
          onConfirm={()=> setIsOverMsgLength(false)}
          message='최대 전송가능한 문자는 50자 이내입니다.'
          />}
          {isSameMsg && <Modal
          isOpen={isSameMsg}
          onClose={closeOnlyModal}
          onConfirm={()=> setIsSameMsg(false)}
          message='이전과 동일한 메세지는 전송할 수 없습니다.'
          />}

        </div>
      )}
    </>
  );
};

export default WebSocketConnect;