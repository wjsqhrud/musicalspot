import Modal from "./Modal";
import ModalWithCancle from "./ModalWithCancle";
import useNavigateHelper from 'utils/NavigationUtil/navigationUtil';

export type ChatRestrictionMessage =
  | '채팅 기능은 로그인한 회원만 이용 가능합니다.'
  | `도배 및 비속어 사용으로 인해 ${number} 초 동안 채팅이 금지되었습니다. 바르고 고운말을 사용해주세요`
  | '최대 전송가능한 문자는 50자 이내입니다.'
  | '동일한 메세지를 여러번 전송할 수 없습니다.';

interface ModalProps {

    showModal: boolean;
    showMutedModal: boolean;
    isOverMsgLength: boolean;
    isSameMsg: boolean;
    MUTE_DURATION: number;

    closeModalWithChat: () => void;
    toggleChat: () => void;
    setShowMutedModal: () => void; // 매개변수 타입 정의
    setIsOverMsgLength: () => void; // 예시 추가
    setIsSameMsg: () => void;
    closeOnlyModal: () => void;
    message?: ChatRestrictionMessage;
}

export const ModalRenderer:React.FC<ModalProps> = ({setIsSameMsg, setIsOverMsgLength,
     closeOnlyModal, setShowMutedModal, MUTE_DURATION, closeModalWithChat,
      toggleChat, showModal, showMutedModal, isOverMsgLength, isSameMsg }) => 
        {
    const { navigateToLogin }= useNavigateHelper();

    const confirmFunc = () => {
      navigateToLogin();
      closeModalWithChat();
    }
    
    return (
        <>
        {showModal && 
          <ModalWithCancle
          isOpen={showModal}
          onClose={closeModalWithChat} 
          onConfirm={()=>{confirmFunc()}}
          toggleChat={toggleChat}
          message='채팅 기능은 로그인한 회원만 이용 가능합니다.'
          />}
            {showMutedModal && (
          <Modal
            isOpen={showMutedModal}
            onClose={setShowMutedModal}
            onConfirm={setShowMutedModal}
            message={`도배 및 비속어 사용으로 인해 ${MUTE_DURATION / 1000} 초 동안 채팅이 금지되었습니다. 바르고 고운말을 사용해주세요`}
          />)}
          {isOverMsgLength && <Modal
          isOpen={isOverMsgLength}
          onClose={closeOnlyModal}
          onConfirm={setIsOverMsgLength}
          message='최대 전송가능한 문자는 50자 이내입니다.'
          />}
          {isSameMsg && <Modal
          isOpen={isSameMsg}
          onClose={closeOnlyModal}
          onConfirm={setIsSameMsg}
          message='동일한 메세지를 여러번 전송할 수 없습니다.'
          />}
        </>
    )
}