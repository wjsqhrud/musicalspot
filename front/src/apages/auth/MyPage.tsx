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

  // Dummy data
  const dummyData = {
    email: "dummyemail@example.com",
    userId: "dummyUserId",
    password: "dummyPassword"
  };

  // Handle password change
  const handlePasswordChange = () => {
    console.log("Change password button clicked");
  };

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
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white w-full max-w-6xl flex rounded shadow-md" style={{ minHeight: '700px' }}>
          <nav className="w-1/4 p-4 border-r border-signature">
            <ul className="space-y-4">
              <li className="cursor-pointer text-signature hover:underline">정보수정</li>
              <li className="cursor-pointer text-signature hover:underline">뮤지컬 좋아요 목록</li>
              <li className="cursor-pointer text-signature hover:underline">게시글 좋아요 목록</li>
            </ul>
          </nav>
          <div className="flex-1 p-8">
            <div className="text-center text-lg font-semibold mb-4">여기는 상태창</div>
            <div className="container mx-auto p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">이메일</label>
                <input
                  type="email"
                  value={dummyData.email}
                  disabled
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">아이디</label>
                <input
                  type="text"
                  value={dummyData.userId}
                  disabled
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">비밀번호</label>
                  <input
                    type="password"
                    value={dummyData.password}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                  />
                </div>
                <button
                  onClick={handlePasswordChange}
                  className="mt-6 p-2 bg-blue-500 text-white rounded"
                >
                  변경
                </button>
              </div>
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