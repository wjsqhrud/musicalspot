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

      client.subscribe('/topic/chatRoom', (message: Message) => {
        console.log('메시지 수신:', message.body);
        const receivedMessage: ChatMessage = JSON.parse(message.body);
        config.onMessage(receivedMessage);
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