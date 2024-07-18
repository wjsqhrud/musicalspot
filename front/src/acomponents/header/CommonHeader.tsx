// // src/acomponents/header/TestHeader
import Modal from "components/Modal/Modal";
import React, { useEffect, useState } from "react";
import { FaRegUser, FaSearch } from "react-icons/fa";
import { categoryList } from "services/musical/musicalService";
import useNavigateHelper from "utils/NavigationUtil/navigationUtil";
import CommonDropDown from "./CommonDropDown";
import { combinedLogoutHandler } from "services/LogOutService/logOutService";
import { deleteAccount } from "services/Auth/authService";

type CommonHeaderProps = {
  isAuthenticated: boolean;
  myNickname: string | null;
  nicknameModalOpen: boolean;
  setNicknameModalOpen: (open: boolean) => void;
  checkAuthStatus: (onSuccess: (nickname: string) => void, onFailure: () => void) => void;
};

interface Category {
  id: number;
  category: string;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({
  isAuthenticated,
  myNickname,
  nicknameModalOpen,
  setNicknameModalOpen,
  checkAuthStatus,
}) => {
  const { navigateToCreateNickname, navigateToLogin, navigateToHome } = useNavigateHelper();
  const [categories, setCategories] = useState<Category[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [logOutModalOpen, setLogOutModalOpen] = useState(false); // 로그아웃 모달 상태
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);

  useEffect(() => {
    console.log("첫 번째 로직");
    console.log("로그인 상태 : " + isAuthenticated);
    console.log("닉네임 : " + myNickname);
    handleCategoryList();
  }, [isAuthenticated, myNickname]);

  const handleCategoryList = async () => {
    try {
      const response = await categoryList();
      setCategories(response.data);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleAll = () => {
    // todo all 카테고리 페이지 이동
    console.log("All");
  };

  const handleCategory = (id: number) => {
    // todo 해당 카테고리 페이지 이동
    console.log("카테고리 id : " + id);
  };

  const handleAuthButton = () => {
    console.log("AuthButtonClick");
    checkAuthStatus(
      (nickname: string) => {
        console.log("로그인상태 + 닉네임보유")
        setDropdownOpen(!dropdownOpen);
      },
      () => {
        console.log("로그인이 필요한 상태")
        navigateToLogin();
      }
    );
  };

  const nicknameModalConfirm = () => {
    console.log("헤더클릭");
    navigateToCreateNickname();
  };

  const handleLogOut = async () => {
    const result = await combinedLogoutHandler(navigateToHome);
    if (result) {
      setLogOutModalOpen(true);
    }
  };
  const logOutModalConfirm = () => {
    window.location.reload();
  };

  const handleDeleteAccount = () => {
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
    <>
      <header className="fixed top-0 left-0 right-0 flex justify-between items-center bg-white text-[#33313B] w-full min-w-[1300px] p-4 border-b border-gray-300 z-50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold cursor-pointer" onClick={navigateToHome}>
              MusicalSpot
            </h1>
          </div>
        </div>
        <div className="flex gap-1 flex-wrap">
          <div className="bg-white text-[#33313B] p-2 min-w-[60px] text-center cursor-pointer box-border" onClick={handleAll}>
            All
          </div>
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white text-[#33313B] p-2 min-w-[60px] text-center cursor-pointer box-border"
              onClick={() => handleCategory(category.id)}
            >
              {category.category}
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center border-b-2 border-black">
            <input type="text" placeholder="Search" className="p-1 focus:outline-none" />
            <button className="p-1">
              <FaSearch />
            </button>
          </div>
          <div className="relative">
            <FaRegUser size={24} onClick={handleAuthButton} />
            {dropdownOpen && (
              <CommonDropDown onLogoutClick={handleLogOut} onDeleteAccountClick={handleDeleteAccount} />
            )}
          </div>
        </div>
      </header>
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
    </>
  );
};

export default CommonHeader;