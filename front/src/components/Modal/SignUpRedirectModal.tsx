import React, { useEffect, useRef } from "react";
import { RiProhibited2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";

interface SignUpRedirectProps {
  onClose: () => void;
  signInUrl: string; // 추가
  toggleChat: () => void; // 추가
}

const SignUpRedirect: React.FC<SignUpRedirectProps> = ({ onClose, signInUrl, toggleChat }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const handleClickOutside = (event: MouseEvent): void => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
      toggleChat(); // 추가
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLoginClick = () => {
    console.log("Login button clicked"); // 로그 추가
    onClose(); // 모달 닫기
    navigate(signInUrl); // 로그인 페이지로 이동
    toggleChat(); // 추가
  };

  const handleCancelClick = () => {
    onClose();
    toggleChat(); // 추가
  };

  return ReactDOM.createPortal(
    <div id="modalBg" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-45 z-50">
      <div ref={modalRef} className="w-96 h-64 bg-white rounded-xl p-3 shadow-modalShadow z-50">
        <div className="h-full flex flex-col items-center justify-center gap-9">
          <div className="flex flex-col items-center gap-1">
            <span className="flex flex-row text-center text-xl text-red-500 gap-2">
              <RiProhibited2Line className="h-full" />
              CAUTION
              <RiProhibited2Line className="h-full" />
            </span>
            <span className="flex flex-row">
              채팅 기능은
              <p className="text-lime-400 px-1"> 로그인한 회원 </p>
              만 이용 가능합니다.
            </span>
          </div>
          <div className="flex flex-row w-full justify-evenly">
            <button onClick={handleLoginClick} className="w-28 rounded-lg py-3 px-7 bg-signature text-white hover:bg-violet-300 hover:text-signature hover:scale-110 transition-all">
              로그인
            </button>
            <button onClick={handleCancelClick} className="w-28 rounded-lg py-3 px-7 bg-signature text-white hover:bg-violet-300 hover:text-signature hover:scale-110 transition-all">
              취소
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body // 포탈을 통해 모달을 body에 렌더링합니다.
  );
};

export default SignUpRedirect;
