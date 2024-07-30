import Modal from "components/Modal/Modal";
import React, { useEffect, useRef, useState } from "react";
import { FaRegUser, FaSearch } from "react-icons/fa";
import { categoryList } from "services/musical/musicalService";
import useNavigateHelper from "utils/NavigationUtil/navigationUtil";
import CommonDropDown from "./CommonDropDown";
import { combinedLogoutHandler } from "services/LogOutService/logOutService";
import { deleteAccount } from "services/Auth/authService";
import axios from "axios"; // axios 임포트
import { SEARCH_MUSICALS_BY_TITLE } from "utils/APIUrlUtil/apiUrlUtil"; // 경로에 따라 적절히 수정
import { useLocation, useNavigate } from "react-router-dom"; // useNavigate 임포트
import musicalSpotLogo from 'assets/images/musical-spot-logo.png';

type CommonHeaderProps = {
  isAuthenticated: boolean;
  myNickname: string | null;
  nicknameModalOpen: boolean;
  setNicknameModalOpen: (open: boolean) => void;
  checkAuthStatus: (
    onSuccess: (nickname: string) => void,
    onFailure: () => void
  ) => void;
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
  const navigate = useNavigate();
  const { navigateToCreateNickname, navigateToLogin, navigateToHome, navigateToMyblog } =
    useNavigateHelper();
  const [categories, setCategories] = useState<Category[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [logOutModalOpen, setLogOutModalOpen] = useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState<string>(""); // 검색 입력 상태
  const [searchResults, setSearchResults] = useState<any[]>([]); // 검색 결과 상태
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] =
    useState<boolean>(false); // 검색 드롭다운 상태
  const [noResults, setNoResults] = useState<boolean>(false); // 검색 결과 없음 상태
  const searchDropdownRef = useRef<HTMLDivElement>(null); // 드롭다운 요소에 대한 참조
  const searchInputRef = useRef<HTMLDivElement>(null); // 검색 입력 박스에 대한 참조

  useEffect(() => {
    console.log("첫 번째 로직");
    console.log("로그인 상태 : " + isAuthenticated);
    console.log("닉네임 : " + myNickname);
    handleCategoryList();
  }, [isAuthenticated, myNickname]);

  // 마우스 바깥클릭시 검색드랍다운 삭제
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchDropdownRef.current && 
        !searchDropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSearchDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCategoryList = async () => {
    try {
      const response = await categoryList();
      setCategories(response.data);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleAll = () => {
    navigate(`/auth/category/all`);
  };

  const handleCategory = (id: number) => {
    navigate(`/auth/category/${id}`);
  };

  const handleReview = () => {
    navigate(`/auth/reviewlist`);
  };

  const handleAuthButton = () => {
    console.log("AuthButtonClick");
    checkAuthStatus(
      (nickname: string) => {
        console.log("로그인상태 + 닉네임보유");
        setDropdownOpen(!dropdownOpen);
      },
      () => {
        console.log("로그인이 필요한 상태");
        navigateToLogin();
      }
    );
  };

  const nicknameModalConfirm = () => {
    console.log("헤더클릭");
    navigateToCreateNickname();
  };

  const handleMyPage =  () => {
    checkAuthStatus(
      (nickname) => {
        // todo: 인증성공시 로직실행하시면됩니다.
        console.log("인증된 사용자:", nickname);
        navigateToMyblog();
      },
      () => {
        // todo: 인증실패시에는 로그인하라는 알림을 띄울지, 로그인화면으로 보낼지 정하면됩니다.
        console.log("인증 필요함");
      }
    );
  }

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

  // 뮤지컬 제목으로 검색하는 함수
  const searchMusicalsByTitle = async (title: string) => {
    try {
      const result = await axios.get(SEARCH_MUSICALS_BY_TITLE(title));
      console.log(result.data); // 검색 결과 콘솔 출력
      return result.data;
    } catch (error) {
      return { data: [], message: "No results found" };
    }
  };

  // 검색 입력 변경 핸들러
  const handleSearchInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setSearchInput(value);
    if (value) {
      const encodedValue = encodeURIComponent(value);
      console.log(encodedValue);
      const results = await searchMusicalsByTitle(encodedValue); // API 호출로 검색 결과 가져오기
      if (results.data.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
        setSearchResults(results.data);
      }
      setIsSearchDropdownOpen(true); // 검색 드롭다운 열기
    } else {
      setSearchResults([]);
      setIsSearchDropdownOpen(false); // 검색 드롭다운 닫기
      setNoResults(false);
    }
  };

  // 검색 제출 핸들러
  const handleSearchSubmit = (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    console.log("클릭옴?")
    if (
      searchInput &&
      (event.type === "click" || (event as React.KeyboardEvent).key === "Enter")
    ) {
      
      navigate(`/auth/search?query=${encodeURIComponent(searchInput)}`);
    }
  };

  // 검색 결과 클릭 핸들러
  const handleSearchResultClick = (result: any) => {
    navigate(`/auth/search?query=${encodeURIComponent(result.title)}`);
  };

  // 클라이언트가 접속 중인 주소링크를 Navigate 하거나 연결하는 버튼 스타일 바꾸기
  const location = useLocation();
  const currentCategoryId = location.pathname.split('/').pop();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 flex justify-between items-center bg-white text-[#33313B] w-full min-w-[1300px] p-4 border-b border-gray-300 z-50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div
              className="text-2xl max-w-40 max-h-40 font-bold cursor-pointer pl-5"
              onClick={navigateToHome}
            >
             <img src={musicalSpotLogo} alt="Musical Spot-logo" className="scale-125 hover:animate-pulse duration-75"/>
            </div>
          </div>
        </div>
        <div className="flex gap-1 flex-wrap">
      <div
        className={`bg-white p-2 min-w-[60px] text-center cursor-pointer box-border transition-all ${
          currentCategoryId === 'all' ? 'text-signature font-bold text-lg border-b-violet-500' : 'text-[#33313B]'
        }`}
        onClick={handleAll}
      >
        All
      </div>
      {categories.map((category) => (
        <div
          key={category.id}
          className={`bg-white p-2 min-w-[60px] text-center cursor-pointer box-border transition-all ${
            currentCategoryId === category.id.toString() ? 'text-signature font-bold text-lg border-b-violet-500' : 'text-[#33313B]'
          }`}
          onClick={() => handleCategory(category.id)}
        >
          {category.category}
        </div>
      ))}
      <div
        className={`bg-white p-2 min-w-[60px] text-center cursor-pointer box-border transition-all ${
          location.pathname.includes('reviewlist') ? 'text-signature font-bold text-lg border-b-violet-500' : 'text-[#33313B]'
        }`}
        onClick={handleReview}
      >
        <span className="text-gray-300 mr-3 ">|</span> 리뷰
      </div>
    </div>
        <div className="flex items-center space-x-4 relative">
          <div ref={searchInputRef} className="flex items-center border-b-2 border-black">
            <input
              type="text"
              placeholder="Search"
              className="p-1 focus:outline-none"
              value={searchInput}
              onChange={handleSearchInputChange}
              onKeyDown={handleSearchSubmit}
              onClick={() => setIsSearchDropdownOpen(true)}
            />
            <button className="p-1" onClick={handleSearchSubmit}>
              <FaSearch />
            </button>
          </div>
          {isSearchDropdownOpen && (
            <div ref={searchDropdownRef} className="absolute top-12 left-0 right-0 bg-white border border-gray-300 z-10" style={{ height: '300px', overflowY: 'scroll' }}>
              {noResults ? (
                <div className="p-2">No results found</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSearchResultClick(result)}
                  >
                    {result.title}
                  </div>
                ))
              ) : (
                <div className="p-2">Loading...</div>
              )}
            </div>
          )}
          <div className="relative">
            <FaRegUser size={24} onClick={handleAuthButton} />
            {dropdownOpen && (
              <CommonDropDown
                onMyPageClick={handleMyPage}
                onLogoutClick={handleLogOut}
                onDeleteAccountClick={handleDeleteAccount}
              />
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
