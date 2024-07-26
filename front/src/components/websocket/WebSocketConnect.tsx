import { Client, Stomp } from '@stomp/stompjs';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { initializeWebSocket, ChatMessage, MessageType } from '../../hooks/connectWebSocketHook';
import 'tailwindcss/tailwind.css';
import styles from './WebSocketConnect.module.css';
import { REDIRECT_SIGN_IN, SIGN_IN_URL, SOCKET_MAINADDRESS } from 'utils/APIUrlUtil/apiUrlUtil';
import { FaMinus } from 'react-icons/fa';
import { IoEnterOutline } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import SignUpRedirect from 'components/Modal/SignUpRedirectModal';
import { useAuth } from 'hooks/useAuthHook';

// TODO: 채팅 로그 내의 욕설 필터링 및 도배방지 기능 구현하기 
// TODO: 채팅창이 말풍선으로 토글상태일 시 채팅 로그 올라오면 새로운 채팅 알림하는 기능 구현하기

interface ChatComponentProps {
  isVisible: boolean;
  toggleChat: () => void;
}

const WebSocketConnect: React.FC<ChatComponentProps> = ({ isVisible, toggleChat }) => {
  const serverAddr = SOCKET_MAINADDRESS;
  const [stompClient, setStompClient] = useState<Client | null>(null); // stompClient 가동여부 변수
  const [messages, setMessages] = useState<ChatMessage[]>([]); // 렌더링 메세지 저장변수
  const [messageInput, setMessageInput] = useState<string>(''); // 입력된 메세지 저장변수
  const [userNickname, setUserNickname] = useState(''); // 사용자닉네임 변수
  const [isJoined, setIsJoined] = useState(false); // 웹소켓 채팅 참여여부 변수
  const [isConnected, setIsConnected] = useState(false); // 웹소켓 연결여부 변수
  const [showModal, setShowModal] = useState(false); // 비로그인 회원 채팅접속 시도여부 변수
  const { checkAuthStatus } = useAuth(); // 로그인회원 인증
  const [showNotification, setShowNotification] = useState(false); // 새 메세지 알림 변수
  const [isMuted, setIsMuted] = useState(false); // 채팅 금지 상태 변수
  const MUTE_DURATION = 10000; // 채팅 금지 시간 (밀리초 단위, 여기서는 10초)

  // 정상 메세지 전송
  const handleNewMessage = (message: ChatMessage) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // 필터링 된 개인메세지 전송
  const handlePersonalMessage = (message: ChatMessage) => {

    const filteredSwear = "저는 공공장소에서 비속어를 사용하는 쓰레기입니다.";

    if (message.messageText?.includes("비속어")) {
      window.alert("비속어 사용은 금지되어 있습니다.");
      message.messageText = filteredSwear;
      setMessages((prevMessages) => [...prevMessages, message]);
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
    setStompClient(client);
    setIsConnected(true);
  };

  const disconnectWebSocket = () => {
    if (stompClient && stompClient.active) {
      stompClient.publish({
        destination: '/app/chat.removeUser',
        body: JSON.stringify({ nickname: userNickname }),
      });
      stompClient.deactivate();
      setIsJoined(false);
      setIsConnected(false);
      setMessages([]);
      setMessageInput('');
    }
  };

  useEffect(() => {
    return () => {
      if (stompClient && stompClient.active) {
        setIsJoined(false);
        console.log('WebSocket 연결 해제');
        stompClient.deactivate();
      }
    };
  }, [stompClient]);

  const messageEndRef = useRef<HTMLDivElement>(null);

  // 메세지가 채팅창 height overflow 시 채팅창 최하단부로 스크롤
  useEffect(() => {
    const currentMsgLength = messages.length; // 최신 메세지배열 길이 변수
    const maximumChatLength = 150; // 메세지 최대 길이 설정

    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // 메세지 배열길이 변화 있을 시, 알림설정 -> '!=' 사용시 메세지 배열의 길이가 줄어들어도 알림발생
    // TODO : 기능 구현 완료 후 isVisible 주석 해제하기
    if(messages.length > currentMsgLength /*&& isVisible*/) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000); // 2초 후 알림 숨기기
    }

     // 메시지 배열 길이 제한 초과 시 가장 오래된 메시지 제거
    if(messages.length > maximumChatLength) {
      setMessages((prevMessages) => prevMessages.slice(1));
    }
  }, [messages]);



  const sendMessage = () => {
    if (isMuted) {
      window.alert('현재 도배 및 욕설로 인해 채팅이 금지되어 있습니다. 잠시 후 다시 시도하세요.');
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      id="chatContainer"
      className={`z-50 fixed flex flex-col justify-between bottom-0 right-0 mr-11 mb-11 w-96 h-3/5 rounded-lg select-none bg-white ${styles.combinedShadow}`}
    >
      <div className="flex justify-end items-center p-2 bg-violet-400 rounded-t-lg opacity-70">
        <button onClick={toggleChat} className={`text-white rounded-full hover:text-red-500 hover:bg-slate-200 p-1 ${styles.transition}`}><FaMinus/></button>
        <button onClick={disconnectWebSocket} className="ml-2 text-white">나가기</button> {/* 나가기 버튼 추가 */}
      </div>
      
      {!isConnected && (
        <div className="flex-grow flex items-center justify-center">
          <button onClick={handleConnectWebSocket} className={`
            flex items-center justify-center px-6 py-3 text-lg
            bg-gradient-to-r from-green-600 to-emerald-500 rounded-full
            transition-all duration-300 ease-in-out
            hover:scale-105 hover:shadow-lg hover:from-green-700 hover:to-emerald-600
            ${styles.pulseAnimation}
          `}>
            <span className="mr-2 text-white font-sans tracking-wide">채팅 입장</span>
            <IoEnterOutline size={24}/>
          </button>
        </div>
      )}
      
      {isConnected && (
        <>
          <div className={`flex-grow pt-top mb-3 w-full overflow-y-auto ${styles.customScrollbar}`}>
            {!isJoined ? (
              <div className="h-full flex items-center justify-center">
                <button onClick={handleConnectWebSocket} className={`
                    flex items-center justify-center px-6 py-3 text-lg
                    bg-gradient-to-r from-green-600 to-emerald-500 rounded-full
                    transition-all duration-300 ease-in-out
                    hover:scale-105 hover:shadow-lg hover:from-green-700 hover:to-emerald-600
                    ${styles.pulseAnimation}
                  `}>
                  <span className="mr-2 text-white font-sans tracking-wide">채팅 입장</span>
                  <IoEnterOutline size={24}/>
                </button>
              </div>
            ) : (
              messages.map((v, index) => (
                <div key={index} className={`animate-fade flex ${v.nickname === userNickname && v.type === MessageType.CHAT ? 'justify-end' : 'justify-start'}`}>
                  {v.type === MessageType.JOIN ? (
                    <div className="flex bg-gray-300 py-1 px-4 m-1 rounded-xl w-fit ml-16 text-black text-xs font-mono font-semibold">
                      <span>{v.messageText}</span>
                    </div>
                  ) : (
                    <div className={`flex items-center ${v.nickname === userNickname ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`${v.nickname === userNickname ? 'bg-lime-500' : 'bg-signature'} p-2 m-1 rounded-xl ${v.nickname === userNickname ? 'rounded-br-none' : 'rounded-bl-none'} w-fit text-white max-w-80`}>
                        {v.nickname === userNickname ? `${v.messageText}` : `${v.nickname} : ${v.messageText}`}
                      </div>
                      <span className="text-gray-400 text-xxs bg-white self-end">{v.transmitTime}</span>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messageEndRef}></div>
          </div>
          <div id="inputContainer" className="w-full rounded-b-lg">
            <div id="inputInnerContainer" className="flex items-center border-t border-signature rounded-b-lg">
              <input
                id="chatTransmitter"
                className="flex-1 h-12 pl-4 outline-none border-none rounded-b-lg"
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
        </>
      )}
      {showModal && <SignUpRedirect onClose={closeModal} signInUrl={REDIRECT_SIGN_IN()} toggleChat={toggleChat} />}
    </div>
  );
};

export default WebSocketConnect;
