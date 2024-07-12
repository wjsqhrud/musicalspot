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
import Button from 'acommons/Button';
import { categoryList, categoryMusical, musicalCategoryIdSortedByEndDate, musicalCategoryIdSortedByStartDate, musicalCategoryIdSortedByTitle, musicalCategoryIdSortedByViewCount, musicalDetails, musicalDetailsIncrementView, musicalLike, musicalSortedByStartDate, musicalSortedByViewCount, toggleMusicalLike } from 'services/musical/musicalService';
import { createReview, deleteReview, privateReviewDetails, publicReviewDetails, reviewCommentsCreate, reviewCommentsDelete, reviewCommentsUpdate, reviewDetailsIncreaseView, reviewLike, reviewLikes40, reviewRecent40, reviewViews40, toggleReviewLike, updateReview } from 'services/review/reviewService';

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


  
  // todo: 뮤지컬 데이터 가져오는 방법
  const testOnClick= async() => {
    
    try {
      //todo: 뮤지컬 관련
      // const response = await categoryList(); 
      // const response = await categoryMusical("1");
      // const response = await musicalSortedByStartDate();
      // const response = await musicalSortedByViewCount();
      // const response = await musicalCategoryIdSortedByViewCount("1");
      // const response = await musicalCategoryIdSortedByEndDate("1");
      // const response = await musicalCategoryIdSortedByTitle("1");
      // const response = await musicalCategoryIdSortedByStartDate("1");
      // const response = await musicalDetails("1");
      // const response = await musicalDetailsIncrementView("1");
      // const response = await musicalLike("1");
      // const response = await toggleMusicalLike("1");  

      //todo: 리뷰 관련
      // const response = await privateReviewDetails("1"); 
      // const response = await publicReviewDetails("1"); 
      // const response = await createReview("제목","내용","1"); 
      // const response = await updateReview("23","수정제목","수정내용","1"); 
      // const response = await deleteReview("23"); 
      // const response = await reviewDetailsIncreaseView("20"); 
      // const response = await reviewCommentsCreate("20","댓글 내용"); 
      // const response = await reviewCommentsUpdate("45","댓글 수정 내용"); 
      // const response = await reviewCommentsDelete("45"); 
      // const response = await reviewRecent40(0); 
      // const response = await reviewLikes40(0); 
      // const response = await reviewViews40(0); 
      // const response = await reviewLike("1"); 
      const response = await toggleReviewLike("1"); 


      console.log(response.data);
    } catch (error) {
      console.error('Error', error);
    }
    
  }


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
      <Button text ={'버튼클릭'} onClick={testOnClick}/>
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