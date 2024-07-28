import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { musicalDetails } from "services/musical/musicalService";
import { HeaderProvider } from "services/HeaderService/HeaderService";
import CommonHeader from "acomponents/header/CommonHeader";
import { useAuth } from "hooks/useAuthHook";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"; // 아이콘 사용을 위해 react-icons 패키지 사용

// 뮤지컬 상세 정보를 위한 인터페이스 정의
interface MusicalDetails {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  venue: string;
  price: number;
  ticketUrl: string;
  likeCount: number; // 좋아요 수 필드 추가
  reviewCount: number; // 리뷰 수 필드 추가
}

const DetailPage: React.FC = () => {
  const { musicalId } = useParams<{ musicalId: string }>(); // URL 파라미터에서 musicalId를 가져옴
  const [details, setDetails] = useState<MusicalDetails | null>(null); // 뮤지컬 상세 정보를 저장하는 상태
  const [error, setError] = useState<string | null>(null); // 에러 메시지를 저장하는 상태
  const [liked, setLiked] = useState(false); // 좋아요 상태를 저장하는 상태
  const [likeCount, setLikeCount] = useState(0); // 좋아요 수를 저장하는 상태
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 창의 열림/닫힘 상태를 저장하는 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  // 인증 관련 훅에서 필요한 값들을 가져옴
  const {
    isAuthenticated,
    myNickname,
    nicknameModalOpen,
    setNicknameModalOpen,
    checkAuthStatus,
  } = useAuth();

  // 날짜 형식을 변환하는 함수
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  // 뮤지컬 상세 정보를 가져오는 함수
  useEffect(() => {
    const getDetails = async () => {
      try {
        if (musicalId) {
          const data = await musicalDetails(musicalId);
          setDetails(data.data); // data.data가 실제 데이터임을 확인하고 상태에 저장
          setLikeCount(data.data.likeCount); // 초기 좋아요 수 설정
        }
      } catch (error) {
        console.error("Error fetching musical details:", error);
        setError("뮤지컬 세부 정보를 불러오는데 실패했습니다."); // 에러 발생 시 에러 메시지 설정
      }
    };

    getDetails();
  }, [musicalId]);

  // 좋아요 버튼 클릭 시 호출되는 함수
  const handleLikeClick = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(likeCount - 1); // 좋아요 수 감소
    } else {
      setLiked(true);
      setLikeCount(likeCount + 1); // 좋아요 수 증가
    }
  };

  // 모달 창 열기
  const openModal = () => {
    setModalIsOpen(true);
  };

  // 모달 창 닫기
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // 리뷰 클릭 시 호출되는 함수
  const handleReviewClick = () => {
    navigate(`/auth/reviewlist`);
  };

  return (
    <HeaderProvider>
      <div className="max-w-[1250px] mx-auto pt-20">
        {/* 공통 헤더 */}
        <CommonHeader
          isAuthenticated={isAuthenticated}
          myNickname={myNickname}
          nicknameModalOpen={nicknameModalOpen}
          setNicknameModalOpen={setNicknameModalOpen}
          checkAuthStatus={checkAuthStatus}
        />
        <div className="container mx-auto p-4">
          {/* 에러 메시지 표시 */}
          {error && <div>{error}</div>}
          {/* 뮤지컬 상세 정보 표시 */}
          {details && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">{details.title}</h1>
                {/* 예매처 버튼 */}
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={openModal}
                >
                  예매처
                </button>
                {/* 모달 창 */}
                {modalIsOpen && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div
                      className="bg-white p-6 rounded shadow-lg relative"
                      style={{ width: "300px" }}
                    >
                      <button
                        className="absolute top-2 right-2 text-xl font-bold"
                        onClick={closeModal}
                      >
                        X
                      </button>
                      <h2 className="text-xl font-bold mb-4">예매처</h2>
                      <button
                        className="block w-full py-2 my-2 bg-gray-500 text-white rounded"
                        onClick={() =>
                          (window.location.href = "https://ticket.yes24.com")
                        }
                      >
                        YES24
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex mb-4 space-x-4">
                <div className="w-1/2 relative z-10">
                  {/* 뮤지컬 이미지 */}
                  <img
                    src={details.imageUrl}
                    alt={details.title}
                    className="w-full h-auto"
                  />
                  <div className="flex justify-between mt-2">
                    {/* 좋아요 버튼 */}
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={handleLikeClick}
                    >
                      {liked ? (
                        <AiFillHeart className="text-xl text-red-500 mr-1" />
                      ) : (
                        <AiOutlineHeart className="text-xl text-black mr-1" />
                      )}
                      <span className="text-lg">{likeCount}</span>
                    </div>
                    {/* 리뷰 수 */}
                    <div className="flex items-center text-black">
                      <span
                        className="text-lg underline cursor-pointer"
                        onClick={handleReviewClick}
                      >
                        {details.reviewCount} reviews
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 p-4">
                  {/* 뮤지컬 정보 */}
                  <p className="mb-2">
                    <strong>공연기간:</strong> {formatDate(details.startDate)} -{" "}
                    {formatDate(details.endDate)}
                  </p>
                  <p className="mb-2">
                    <strong>공연장소:</strong> {details.venue}
                  </p>
                  <p className="mb-2">
                    <strong>티켓가격:</strong> {details.price}원
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </HeaderProvider>
  );
};

export default DetailPage;
