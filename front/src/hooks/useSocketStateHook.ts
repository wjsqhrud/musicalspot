import create from 'zustand';
import { Client } from '@stomp/stompjs';
import { MessageType } from './connectWebSocketHook';

interface ChatMessage {
  nickname: string | null;
  messageText: string | null;
  transmitTime: string | null;
  type: MessageType;
}

interface ChatState {
  isChatVisible: boolean;
  stompClient: Client | null;
  userNickname: string;
  isJoined: boolean;
  messages: ChatMessage[];
  toggleChat: () => void;
  setStompClient: (client: Client | null) => void;
  setUserNickname: (nickname: string) => void;
  setIsJoined: (joined: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isChatVisible: false,
  stompClient: null,
  userNickname: '',
  isJoined: false,
  messages: [],
  toggleChat: () => set((state) => ({ isChatVisible: !state.isChatVisible })),
  setStompClient: (client: Client | null) => set({ stompClient: client }),
  setUserNickname: (nickname: string) => set({ userNickname: nickname }),
  setIsJoined: (joined: boolean) => set({ isJoined: joined }),
  addMessage: (message: ChatMessage) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
}));
