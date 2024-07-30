//src/apages/auth/MyPage
import React, { useEffect, useState } from 'react';
import { useAuth } from 'hooks/useAuthHook';
import { HeaderProvider } from 'services/HeaderService/HeaderService';
import CommonHeader from 'acomponents/header/CommonHeader';
import useNavigateHelper from 'utils/NavigationUtil/navigationUtil';
import Modal from 'components/Modal/Modal';
// import Modal from 'components/Modal/Modal';



const MyPage: React.FC = () => {
  const { isAuthenticated, myNickname, nicknameModalOpen, setNicknameModalOpen, checkAuthStatus } = useAuth();
  const [changePwdModalOpen, setChangePwdModalOpen] = useState(false);

  const deleteAccountModalConfirm = async (inputNickname?: string) => {
    if (inputNickname) {
      console.log("회원탈퇴 진행: " + inputNickname);
      // await deleteAccount(inputNickname);
      window.location.reload();
    } else {
      console.log("닉네임이 입력되지 않았습니다.");
    }
  };







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
    checkAuthStatus(
      (nickname) => {
        // todo: 인증성공시 로직실행하시면됩니다.
        console.log("인증된 사용자:", nickname);
        setChangePwdModalOpen(true);
      },
      () => {
        // todo: 인증실패시에는 로그인하라는 알림을 띄울지, 로그인화면으로 보낼지 정하면됩니다.
        console.log("인증 필요함");
      }
    );
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
        <div className="bg-white w-full max-w-xl flex justify-center items-center rounded shadow-md" style={{ minHeight: '700px' }}>
          <div className=" p-6"style={{ width: '700px' }}>
            <div className="flex-1 p-8">
              <div className="text-center text-3xl font-semibold mb-4">회원정보</div>
              
              <div className="container mx-auto p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">회원종류</label>
                  <input
                    type="text"
                    value="네이버"
                    disabled
                    className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                  />
                </div>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">닉네임</label>
                  <input
                    type="test"
                    value="첫번째 호석이"
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
      </div>
      <Modal
        isOpen={changePwdModalOpen}
        onClose={() => setChangePwdModalOpen(false)}
        onConfirm={deleteAccountModalConfirm}
        message="비밀번호 변경"
        showInput={true}
        placeholder='8~13자 변경하실 비밀번호를 입력하세요'
      />
    </HeaderProvider>
  );
};

export default MyPage;