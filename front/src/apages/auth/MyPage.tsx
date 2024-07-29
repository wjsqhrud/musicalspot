//src/apages/auth/MyPage
import React, { useEffect, useState } from 'react';
import { useAuth } from 'hooks/useAuthHook';
import { HeaderProvider } from 'services/HeaderService/HeaderService';
import CommonHeader from 'acomponents/header/CommonHeader';
import useNavigateHelper from 'utils/NavigationUtil/navigationUtil';



const MyPage: React.FC = () => {
  const { isAuthenticated, myNickname, nicknameModalOpen, setNicknameModalOpen, checkAuthStatus } = useAuth();
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
  useEffect(() => {
    console.log("마이페이지 ");
    console.log("마이페이지 로그인 상태 : " + isAuthenticated);
    console.log("마이페이지닉네임 : " + myNickname);
    
  }, [isAuthenticated, myNickname]);
  // bg-white w-full max-w-xl h-auto md:h-3/4 flex justify-center items-center rounded shadow-md
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
      </div>
      <div className="flex justify-center items-center min-h-screen bg-gray-100  ">

        <div className="bg-white w-full max-w-6xl  flex rounded shadow-md" style={{ minHeight: '700px' }}>
          <nav className="w-1/4 p-4 border-r border-signature">
            <ul className="space-y-4">
              <li className="cursor-pointer text-signature hover:underline">정보수정</li>
              <li className="cursor-pointer text-signature hover:underline">뮤지컬 좋아요 목록</li>
              <li className="cursor-pointer text-signature hover:underline">게시글 좋아요 목록</li>
            </ul>
          </nav>
          <div className="flex-1 p-8">
            <div className="text-center text-lg font-semibold mb-4">여기는 상태창</div>
            <div className="container mx-auto p-4">
              <button
                onClick={handleAuthCheck}
                className="mt-4 p-4 bg-blue-500 text-white rounded"
              >
                인증 여부 확인
              </button>
            </div>
          </div>
        </div>
      </div>
    </HeaderProvider>
  );
};

export default MyPage;