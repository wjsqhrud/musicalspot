import { Client } from '@stomp/stompjs';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { initializeWebSocket, ChatMessage, MessageType } from '../../hooks/connectWebSocketHook';
import 'tailwindcss/tailwind.css';
import styles from './WebsocketTest.module.css';

const WebSocketConnect = () => {
  const serverAddr = 'http://localhost:4040/ws';
  const isChatToggled = false;

  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const [userNickname, setUserNickname] = useState('엄준식');
  const [isJoined, setIsJoined] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const toggleChat = () => {
    if (!isChatToggled) {
      console.log('toggleChat() called');
      const toggleBtn = document.getElementById('toggleTarget');
      toggleBtn?.classList.toggle('hidden');
    }
  };

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
    } else if (stompClient && messageInput.trim()) {
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
    } else if (!!messageInput.trim()) {
      window.alert('빈 내용은 전송할 수 없습니다.');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  return (
    <div
      id="chatContainer"
      className={`fixed flex flex-col justify-center bottom-0 right-0 mr-11 mb-11 w-96 h-3/5 rounded-lg select-none ${styles.customBoxShadow} w-6`}
    >
      <button onClick={toggleChat}>toggle Chat</button>
      {!isConnected && <button onClick={joinChat}>Join Chat</button>}
      <div id="toggleTarget" className="hidden">
        <div className={`h-maxHeight pt-top mb-10 w-full overflow-y-auto ${styles.customScrollbar}`}>
          {isConnected && !isJoined ? (
            <div className="absolute bottom-0 mb-10">
              <button onClick={joinChat}>Join Chat</button>
            </div>
          ) : (
            messages.map((v, index) => (
              <div key={index} className={`animate-fade flex place-items-end`}>
                {v.type === MessageType.JOIN ? (
                  <div className="bg-green-500 p-2 m-1 rounded-xl rounded-bl-none w-fit text-white max-w-80 text-center">
                    {v.messageText}
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
        <div id="inputContainer" className="bottom-0 w-full">
          <div id="inputInnerContainer" className="relative bottom-0 w-full h-fit rounded-lg pt-s">
            <input
              id="chatTransmitter"
              className="absolute bottom-0 border-signature border rounded-b-lg outline-none p-2 h-12 w-full"
              type="text"
              value={messageInput}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              className="absolute bottom-1.5 right-2 w-fit bg-signature text-white p-s rounded-lg hover:text-signature hover:bg-sky-100"
              onClick={sendMessage}
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSocketConnect;