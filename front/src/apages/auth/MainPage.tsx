//src/apages/Testpage
import React, { useState } from 'react';
import Modal from 'components/Modal/Modal';
import HeaderComponent from 'acomponents/header/HeaderComponent';
import HeaderDropDownComponent from 'acomponents/header/HeaderDropDownComponent';
import { combinedLogoutHandler } from 'services/LogOutService/logOutService';
import useNavigateHelper from 'utils/NavigationUtil/navigationUtil';
import { deleteAccount } from 'services/Auth/authService';
import { HeaderProvider, useHeader } from 'services/HeaderService/HeaderService';
import { useAuth } from 'hooks/useAuthHook';

const HomePage: React.FC = () => {
  const { navigateToCreateNickname, navigateToLogin, navigateToHome } = useNavigateHelper();
  const { dropdownOpen, toggleDropdown } = useHeader();
  const { hasNickname, myNickname, nicknameModalOpen, setNicknameModalOpen } = useAuth();
  const [logOutModalOpen, setLogOutModalOpen] = useState(false); // 로그아웃 모달 상태
  const [refresh, setRefresh] = useState(false); // 리프레시 상태  
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  

  const nicknameModalConfirm = () => {
    navigateToCreateNickname();
  };

  const handleLogOut = async () => {
    const result = await combinedLogoutHandler(navigateToHome);
    if (result) {
      setLogOutModalOpen(true);
    }
  };

  const logOutModalConfirm = () => {
    setRefresh(prev => !prev);
    window.location.reload();
  };

  const handleHeaderClick = () => {
    navigateToHome();
  };

  const handleDeleteAccountClick = () => {
    console.log("회원탈퇴 클릭");
    setDeleteAccountModalOpen(true);
  };
  const deleteAccountModalConfirm = async (inputNickname?: string) => {
    if (inputNickname) {
      console.log("회원탈퇴 진행: " + inputNickname);
      await deleteAccount(inputNickname);
      window.location.reload();
    } else {
      console.log("닉네임이 입력되지 않았습니다.");
    }
  };

  return (
    <HeaderProvider>
      <div >
      <HeaderComponent
      title="MusicalSpot"
      hasNickname={hasNickname}
      nickname={myNickname}
      onHeaderClick={handleHeaderClick}
      onLoginClick={navigateToLogin}
      onNicknameClick={toggleDropdown}
      />
      <HeaderDropDownComponent
      onLogoutClick={handleLogOut}
      onDeleteAccountClick={handleDeleteAccountClick}
      />
      <Modal
          isOpen={nicknameModalOpen}
          onClose={() => setNicknameModalOpen(false)}
          onConfirm={nicknameModalConfirm}
          message="닉네임 생성은 필수 입니다."
        />
        <Modal
          isOpen={logOutModalOpen}
          onClose={() => setLogOutModalOpen(false)}
          onConfirm={logOutModalConfirm}
          message="로그아웃 성공"
        />
        <Modal
          isOpen={deleteAccountModalOpen}
          onClose={() => setDeleteAccountModalOpen(false)}
          onConfirm={deleteAccountModalConfirm}
          message="회원탈퇴를 위해 닉네임을 입력해주세요."
          showInput={true}
        />
    </div>
    </HeaderProvider>
    
  );
};

export default HomePage;