import React, { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { FaMinus } from 'react-icons/fa';
import { useAuth } from 'hooks/useAuthHook';
import { ChatMessage, MessageType, initializeWebSocket } from '../../hooks/connectWebSocketHook';
import { ImExit } from "react-icons/im";
import 'tailwindcss/tailwind.css';
import styles from './WebSocketConnect.module.css';
import { SOCKET_MAINADDRESS } from 'utils/APIUrlUtil/apiUrlUtil';
import { useThrottle } from 'hooks/useThrottleHook';
import { JoinChatBtn } from './JoinChatBtn';
import { MsgTransMitter } from './MsgTransmitter';
import { ChatMsgRenderer } from './ChatMsgRenderer';
import { ModalRenderer } from 'components/Modal/WsModal';

interface ChatComponentProps {
  isVisible: boolean;
  toggleChat: () => void;
  messages: ChatMessage[];
  handleNewMessage: (message: ChatMessage) => void;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setIsJoined: React.Dispatch<React.SetStateAction<boolean>>;
  isJoined: boolean;
}

const WebSocketConnect: React.FC<ChatComponentProps> = ({ isVisible, toggleChat, messages, handleNewMessage, setMessages, isJoined, setIsJoined }) => {
  const serverAddr = SOCKET_MAINADDRESS;
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messageInput, setMessageInput] = useState<string>('');
  const [userNickname, setUserNickname] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { checkAuthStatus } = useAuth();

  const MUTE_DURATION = 10000;
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showMutedModal, setShowMutedModal] = useState<boolean>(false);
  const [isOverMsgLength, setIsOverMsgLength] = useState<boolean>(false);
  const [isSameMsg, setIsSameMsg] = useState<boolean>(false);
  const [isEmptyMsg, setIsEmptyMsg] = useState<boolean>(false);

  const isAllGreen = isConnected && isJoined;
  const isModalPopped = !(showMutedModal || isOverMsgLength || isSameMsg);

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

  // 채팅 입장버튼 다중 클릭 방지
  const handleThrottleConnectWS = useThrottle(()=> {
    handleConnectWebSocket();
  },2000)
  
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
        // 웹소켓 연결 해제 시 채팅로그 전부 삭제
        setMessages([]);
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
            <JoinChatBtn clickFn={handleThrottleConnectWS}/>
          </div>
  
          <div className={`flex-grow ${isAllGreen ? '' : 'hidden'} ${styles.customScrollbar} overflow-y-auto`}>
            {isConnected && !isJoined ? (
              null
            ) : (
              <ChatMsgRenderer
                messages={messages}
                userNickname={userNickname}
              />
            )}
            <div ref={messageEndRef}></div>
          </div>
  
          <div id="inputContainer" className={`'w-full rounded-b-lg' ${ !isJoined ? 'hidden' : 'block'} `}>
          <MsgTransMitter
              messageInput={messageInput}
              isMuted={isMuted}
              isModalPopped={isModalPopped}
              onChanges={(e) => handleInputChange(e)}
              sendMsgFn={sendMessage}
              isEmptyMsg={isEmptyMsg}
              />
          </div>

          <ModalRenderer
            showModal={showModal}
            showMutedModal={showMutedModal}
            isOverMsgLength={isOverMsgLength}
            isSameMsg={isSameMsg}
            setIsOverMsgLength={() => setIsOverMsgLength(false)}
            setIsSameMsg={() => setIsSameMsg(false)}
            MUTE_DURATION={MUTE_DURATION}
            closeOnlyModal={() => closeOnlyModal}
            closeModalWithChat={() => closeModalWithChat}
            setShowMutedModal={() => setShowMutedModal(false)}
            toggleChat={() => toggleChat}
          />

        </div>
      )}
    </>
  );
};

export default WebSocketConnect;