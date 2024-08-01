import SockJS from 'sockjs-client';
import { Client, Message } from '@stomp/stompjs';

export interface ChatMessage {
  nickname: string | null;
  messageText: string | null;
  transmitTime: string | null;
  type: MessageType;
}

export enum MessageType {
  CHAT = 'CHAT',
  JOIN = 'JOIN',
}

export interface WebSocketConfig {
  serverAddr: ()=>{};
  onMessage: (message: ChatMessage) => void;
  onPersonalMessage: (message: ChatMessage) => void;
  onError?: (error: any) => void;
  onDebug?: (message: string) => void;
}

export function initializeWebSocket(config: WebSocketConfig, userNickname: string, setIsJoined: (isJoined: boolean) => void): Client {
  console.log('WebSocket 클라이언트 초기화');
  const socket = new SockJS(String(config.serverAddr()));
  const client = new Client({
    webSocketFactory: () => socket,
    
    onConnect: () => {
      console.log('WebSocket 연결됨');

      // 웹소켓 연결 시 websocket mapping 구독 
      client.subscribe('/topic/chatRoom', (message: Message) => {
        console.log('메시지 수신:', message.body);
        const receivedMessage: ChatMessage = JSON.parse(message.body);
        config.onMessage(receivedMessage);
      });
      // 필터링 트리거 시 받을 개인 메세지 mapping 구독
      client.subscribe('/user/queue/reply', (message: Message) => {
        const receivedMessage: ChatMessage = JSON.parse(message.body);
        console.log("reply로 받은 문자 : " + receivedMessage);
        config.onPersonalMessage(receivedMessage);
      });

      // WebSocket이 연결된 후 joinChat 함수 호출
      const joinMessage: ChatMessage = {
        nickname: userNickname,
        messageText: '',
        type: MessageType.JOIN,
        transmitTime: null,
      };

      client.publish({
        destination: '/app/chat.addUser',
        body: JSON.stringify(joinMessage),
      });

      setIsJoined(true);
    },
    
    onDisconnect: () => {
      console.log('WebSocket 연결 해제');
      setIsJoined(false);
    },
    
    onStompError: (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      if (config.onError) {
        config.onError(new Error(frame.body));
      }
    },

    onWebSocketError: (event) => {
      console.error('WebSocket error: ', event);
      if (config.onError) {
        config.onError(event);
      }
    },

    debug: (str) => {
      if (config.onDebug) {
        config.onDebug(str);
      } else {
        console.log(str);
      }
    },
  });

  client.activate();
  
  return client;
}