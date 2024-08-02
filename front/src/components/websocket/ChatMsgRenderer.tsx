import { ChatMessage, MessageType } from "hooks/connectWebSocketHook";
import styles from './WebSocketConnect.module.css';

interface ChatMsgRendererProps {
    messages: ChatMessage[];
    userNickname: string;
}

export const ChatMsgRenderer: React.FC<ChatMsgRendererProps> = ({ messages, userNickname }) => {
    return (
    <>{messages.map((v, index) => (
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
        }
    </>
        )
}