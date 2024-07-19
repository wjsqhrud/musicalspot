//src/apages/auth/TestPage
import React from 'react';
import { useAuth } from 'hooks/useAuthHook';
import { HeaderProvider } from 'services/HeaderService/HeaderService';
import CommonHeader from 'acomponents/header/CommonHeader';

const TestPage: React.FC = () => {
  const { isAuthenticated, myNickname, nicknameModalOpen, setNicknameModalOpen, checkAuthStatus } = useAuth();
  // todo: isAuthenticated :
  // todo: 로그인 상태 + 닉네임가진이용자 = true
  // todo: 로그인상태 X = false

  // todo: myNickname = 로그인상태 + 닉네임가진이용자일경우 값이 들어있음
  // todo: nickname = 호석이두마리치킨, 네이버호석이

  // todo: checkAuthStatus = 예측할수 없는 시점의 인증상태를 리필,확인 하기위한 함수
  // todo: 이 함수내에서는 모든 인증 리필, 확인, 닉네임유무를 판단하고 2개의 갈래로 나뉨
  // todo: 인증되면 위에 함수로 인증되지않았다면 아래함수로


  // todo : 버튼을 눌렀을때 인증로직발생
  const handleAuthCheck = () => {
    checkAuthStatus(
      (nickname) => {
        // todo: 인증성공시 로직실행하시면됩니다.
        console.log("인증된 사용자:", nickname);
      },
      () => {
        // todo: 인증실패시에는 로그인하라는 알림을 띄울지, 로그인화면으로 보낼지 정하면됩니다.
        console.log("인증 필요함");
      }
    );
  };

  return (
    <HeaderProvider>
      <div className="pt-20"> 
        <CommonHeader
          isAuthenticated={isAuthenticated}
          myNickname={myNickname}
          nicknameModalOpen={nicknameModalOpen}
          setNicknameModalOpen={setNicknameModalOpen}
          checkAuthStatus={checkAuthStatus}
        />
        <div className="container mx-auto p-4">
          <button 
            onClick={handleAuthCheck} 
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            인증 여부 확인
          </button>
        </div>
      </div>
    </HeaderProvider>
  );
};

export default TestPage;