import React, { useEffect, useState } from "react";
import { useAuth } from "hooks/useAuthHook";
import { HeaderProvider } from "services/HeaderService/HeaderService";
import CommonHeader from "acomponents/header/CommonHeader";
import CommonFooter from "acomponents/footer/CommonFooter";

const CategoryPage: React.FC = () => {
  const {
    isAuthenticated,
    myNickname,
    nicknameModalOpen,
    setNicknameModalOpen,
    checkAuthStatus,
  } = useAuth();
  //todo : isAuthenticated는 최종 인증된 사용자인지 boolean값으로 반환된다.
  // 좋아요로직 :
  // 첫랜더링시에 로그인사용자인지 판단해야댐
  //ㄴ isAuthenticated로 true/ false 판단하면댐
  // 로그인사용자라면 서버에 좋아요를 누른적있는지 요청해야댐
  //ㄴ isAuthenticated 상태변화를 감지하는 useEffect 함수를 만든다음에
  // ㄴ isAuthenticated = true이면 서버에 좋아요누른적있는지 요청
  // 요청값으로 좋아요상태를 (빨강: 검은) 변경해야댐
  //  const [isLiked, setIsLiked] = useState<boolean>(false);
  //   useEffect(() => {
  //     if(isAuthenticated){
  //       console.log("인증된사용자")
  //       // 서버에 좋아요누른적있는지 요청
  //         // try catch
  //         // 누른적있다면
  //           setIsLiked(true);
  //           //  누른적없다면
  //           setIsLiked(false);
  //     } else {
  //       console.log("인증되지않은사용자")
  //       setIsLiked(false);
  //     }
  //   }, [isAuthenticated);

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
        alert("로그인이 필요합니다");
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
          카테고리 페이지
          <button
            onClick={handleAuthCheck}
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            인증 여부 확인
          </button>
        </div>
      </div>
      {/* 공통 푸터 컴포넌트 */}
      <CommonFooter />
    </HeaderProvider>
  );
};

export default CategoryPage;
