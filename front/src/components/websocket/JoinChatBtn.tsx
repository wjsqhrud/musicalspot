import { IoEnterOutline } from "react-icons/io5";

interface JoinChatBtnProps {
    clickFn: () => void;
}

export const JoinChatBtn: React.FC<JoinChatBtnProps> = ({clickFn}) => {
    return (
    <button
      onClick={clickFn}
      className="relative flex items-center justify-center px-8 py-3 text-lg
      rounded-full
      transition-all duration-300 ease-in-out
      shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] 
      hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]
      overflow-hidden
      group"
    >
      <span className='mr-2 text-white font-semibold tracking-wide relative z-10 
      group-hover:translate-x-0.5 transition-transform duration-300'>
        채팅 입장
      </span>
      <IoEnterOutline size={24} className="relative z-10 text-white 
      group-hover:translate-x-0.5 transition-transform duration-300" />
      <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-400"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 
      opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 
      bg-white transition-opacity duration-300"></div>
    </button>
    )
}

export const GradientJoinChatBtn: React.FC<JoinChatBtnProps> = ({clickFn}) => {
    
    return (
        <div className="flex items-center justify-center h-full max-w-[400px]">
        <button
          onClick={clickFn}
          className="relative z-10 flex items-center justify-center space-x-2 text-xl px-6 py-3 
        text-white rounded-full transition-all 
          duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <span className={`group-hover:text-green-400 transition-colors duration-300`}>채팅 입장</span>
          <IoEnterOutline size={24} />
        </button>
      </div>    
    );
}