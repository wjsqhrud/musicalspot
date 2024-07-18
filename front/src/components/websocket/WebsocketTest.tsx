import { Client, Message } from "@stomp/stompjs";
import { ChangeEvent, useEffect, useState } from "react";
import SockJS from "sockjs-client";

const WebSocketCommu = () => {
  // 서버 IP 주소와 포트를 사용
  const serverAddr = "http://localhost:4040/ws";
  interface ChatMessage {
    nickname: string;
    messageText: string;
    transmitTime: string;
  }
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const [currentUser] = useState("User1"); // 현재 사용자 설정 (로그인 과정에서 설정)
  
  useEffect(() => {
    console.log("WebSocket 클라이언트 초기화");
    const socket = new SockJS(serverAddr);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("WebSocket 연결됨");
        setStompClient(client);

        client.subscribe("/topic/public", (message: Message) => {
          console.log("메시지 수신:", message.body);
          const receivedMessage: ChatMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
      onWebSocketError: (event) => {
        console.error("WebSocket error: ", event);
      },
      debug: (str) => {
        console.log(str);
      },
    });

    client.activate();

    return () => {
      if (client.active) client.deactivate();
    };
  }, []);

  const sendMessage = () => {
    if (stompClient && messageInput.trim()) {
      const chatMessage: ChatMessage = {
        nickname: currentUser, // 로그인한 유저 닉네임 삽입
        messageText: messageInput,
        transmitTime: "",
      };
      console.log("보내는 메시지: ", chatMessage); // 디버깅을 위해 추가
      stompClient.publish({
        destination: "/app/transmitMessages",
        body: JSON.stringify(chatMessage),
      });

      setMessageInput("");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };
  
  return (
  <div>
    <div className="w-1/4 h-1/4">
{messages.map((v, index) => (
  <div key={index} className="chatBalloon">
    {v.nickname} : {v.messageText}
    <span className="timeView">{v.transmitTime}</span>
  </div>
))}
</div>

<div className="border-2 border-cyan-600">
<input
className="border-2 border-solid border-indigo-500"
type="text"
value={messageInput}
onChange={handleInputChange}
onKeyDown={(e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage(); // 메시지 전송 함수 호출
    }
  }}
  />
  <button className="border-indigo-700" onClick={sendMessage}>
    전송
    </button>
</div>
</div>
);
}


export default WebSocketCommu;
