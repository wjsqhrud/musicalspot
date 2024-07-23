import { Client } from '@stomp/stompjs';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { initializeWebSocket, ChatMessage, MessageType } from '../../hooks/connectWebSocketHook';
import 'tailwindcss/tailwind.css';
import styles from './WebsocketTest.module.css';
import { SOCKET_MAINADDRESS } from 'utils/APIUrlUtil/apiUrlUtil';
import { FaMinus } from 'react-icons/fa';
import { IoEnterOutline } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";

interface ChatComponentProps {
  toggleChat: () => void;
}
const WebSocketConnect: React.FC<ChatComponentProps> = ({ toggleChat }) => {
  // 로컬 호스트 
  const serverAddr = SOCKET_MAINADDRESS;
  // 배포서버 url
  // const serverAddr = 'https://musicalspot-server2.azurewebsites.net/ws';
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const [userNickname, setUserNickname] = useState('엄준식');
  const [isJoined, setIsJoined] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleNewMessage = (message: ChatMessage) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const joinChat = () => {
    const config = {
      serverAddr,
      onMessage: handleNewMessage,
      onError: (error: any) => console.error(error),
      onDebug: (message: string) => console.log(message),
    };

    const client = initializeWebSocket(config, userNickname, setIsJoined);
    setStompClient(client);
    setIsConnected(true); // WebSocket 연결 후 버튼 숨김
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
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
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
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  return (
    <div
      id="chatContainer"
      className={`z-50 fixed flex flex-col justify-center bottom-0 right-0 mr-11 mb-11 w-96 h-3/5 rounded-lg select-none ${styles.customBoxShadow} bg-white`}
    >
      <div className="flex justify-end items-center p-2 bg-violet-400 rounded-t-lg opacity-70">
        <button onClick={toggleChat} className="text-white"><FaMinus/></button>
      </div>
      {!isConnected && // 조건부 버튼 렌더링 
      <button onClick={joinChat} className='flex items-center justify-center space-x-2 text-xl mx-auto my-auto'>
        <span>채팅 입장</span>
        <IoEnterOutline size={24}/>
      </button>}
        <div className={`h-maxHeight pt-top mb-3 w-full overflow-y-auto  ${styles.customScrollbar}`}>
          {isConnected && !isJoined ? (
            <div className="absolute bottom-0 mb-10">
              <button onClick={joinChat} className='flex items-center justify-center space-x-2 text-xl mx-auto my-auto'>
                <span>채팅 입장</span>
                <IoEnterOutline size={24}/>
              </button>
            </div>
          ) : (
            messages.map((v, index) => (
              <div key={index} className={`animate-fade flex place-items-end`}>
                {v.type === MessageType.JOIN ? (
                  <div className="flex justify-center bg-gray-300 py-1 px-4 m-1 rounded-xl w-fit ml-16 text-black text-xs font-mono font-semibold">
                    <span>{v.messageText}</span>
                  </div>
                ) : (
                  <div className="bg-signature p-2 m-1 rounded-xl rounded-bl-none w-fit text-white max-w-80">
                    {v.nickname} : {v.messageText}
                  </div>
                )}
                <span className="text-gray-400 text-xxs bg-white pb-s">{v.transmitTime}</span>
              </div>
            ))
          )}
          <div ref={messageEndRef}></div>
        </div>
        <div id="inputContainer" className="bottom-0 w-full rounded-b-lg">
          <div id="inputInnerContainer" className="flex items-center  border-t border-signature rounded-b-lg">
            <input
              id="chatTransmitter"
              className="flex-1 h-12 pl-1 outline-none border-none rounded-b-lg"
              type="text"
              value={messageInput}
              placeholder='이곳에 메시지를 입력하세요.'
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              className="m-1 p-1 bg-transparent text-signature rounded-lg hover:text-white hover:bg-signature transition-all"
              onClick={sendMessage}
            >
              <IoIosSend size={26}/>
            </button>
          </div>
      </div>
    </div>
  );
};

export default WebSocketConnect;