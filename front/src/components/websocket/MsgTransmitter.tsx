import { IoIosSend } from "react-icons/io";
import { MuteCountDown } from "services/WebSocketService/muteCountDownRenderer";
interface MsgTransMitterProps {
    messageInput: string;
    isEmptyMsg: boolean;
    isMuted: boolean;
    isModalPopped: boolean;
    onChanges: (e: React.ChangeEvent<HTMLInputElement>) => void;
    sendMsgFn: () => void;
    muteDuration: number;
}

export const MsgTransMitter: React.FC<MsgTransMitterProps> = ({isModalPopped, messageInput, isEmptyMsg, isMuted, onChanges, sendMsgFn, muteDuration }) => {
 
  return (
    <div id="inputInnerContainer" className="flex items-center border-t border-signature rounded-b-lg">
      <input
        id="chatTransmitter"
        className="flex-1 h-12 pl-3 outline-none border-none rounded-b-lg"
        type="text"
        value={messageInput}
        disabled={!isModalPopped || isMuted}
        placeholder={isMuted ? `욕설 및 도배로 인해 ${MuteCountDown(muteDuration)}초 간 채팅이 금지 되었습니다.` : "이곳에 메시지를 입력하세요"}
        onChange={onChanges}
        autoComplete='off'
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            sendMsgFn();
          }
        }}
      />
        {!isEmptyMsg && <button className="m-1 p-1 bg-transparent text-signature rounded-lg hover:text-white hover:bg-signature 
        transition-all animate-fade" onClick={sendMsgFn}>
        <IoIosSend size={26} />
      </button>}  
    </div>        
    );
}