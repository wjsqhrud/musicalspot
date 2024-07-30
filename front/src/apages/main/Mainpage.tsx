import React, { useEffect, useState, useRef } from "react";
import {
  musicalSortedByStartDate,
  musicalSortedByViewCount,
  musicalDetailsIncrementView, // 조회수 증가 함수 import
} from "services/musical/musicalService";

import { HeaderProvider } from "services/HeaderService/HeaderService";
import CommonHeader from "acomponents/header/CommonHeader";
import { useAuth } from "hooks/useAuthHook";
import { useNavigate } from "react-router-dom"; // import useNavigate 추가
import { GrPrevious, GrNext } from "react-icons/gr";

interface Musical {
  id: number;
  title: string;
  startDate?: string;
  endDate?: string;
  viewCount?: number;
  imageUrl: string;
}

const Mainpage: React.FC = () => {
  const {
    isAuthenticated,
    myNickname,
    nicknameModalOpen,
    setNicknameModalOpen,
    checkAuthStatus,
  } = useAuth();

  const navigate = useNavigate(); // useNavigate 훅 사용
  const [musicalsByStartDate, setMusicalsByStartDate] = useState<Musical[]>([]);
  const [musicalsByViewCount, setMusicalsByViewCount] = useState<Musical[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 현재 설정된 타임아웃을 초기화
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // 시작일 기준으로 정렬된 뮤지컬 목록을 가져오는 함수
  const handleMusicalSortedByStartDate = async () => {
    try {
      const response = await musicalSortedByStartDate();
      setMusicalsByStartDate(response.data);
      console.log("StartDate Data:", response);
    } catch (error) {
      console.error("Error fetching start date sorted musicals:", error);
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  // 조회수 기준으로 정렬된 뮤지컬 목록을 가져오는 함수
  const handleMusicalSortedByViewCount = async () => {
    try {
      const response = await musicalSortedByViewCount();
      setMusicalsByViewCount(response.data);
      console.log("ViewCount Data:", response.data);
    } catch (error) {
      console.error("Error fetching view count sorted musicals:", error);
    }
  };

  // 컴포넌트가 마운트될 때 시작일 기준과 조회수 기준 뮤지컬 목록을 로드
  useEffect(() => {
    console.log("사이트 랜더링 완료");
    handleMusicalSortedByStartDate();
    handleMusicalSortedByViewCount();
  }, []);

  // 슬라이드 자동 전환 설정
  useEffect(() => {
    if (musicalsByStartDate.length > 0) {
      resetTimeout();
      timeoutRef.current = setTimeout(() => {
        setCurrentSlide(
          (prevSlide) => (prevSlide + 1) % musicalsByStartDate.length
        );
      }, 3000); // 3초마다 슬라이드 변경

      return () => {
        resetTimeout(); // 컴포넌트 언마운트 시 타임아웃 정리
      };
    }
  }, [musicalsByStartDate, currentSlide]);

  // 다음 슬라이드로 이동하는 함수
  const handleNext = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide + 1) % musicalsByStartDate.length
    );
  };

  // 이전 슬라이드로 이동하는 함수
  const handlePrev = () => {
    setCurrentSlide(
      (prevSlide) =>
        (prevSlide - 1 + musicalsByStartDate.length) %
        musicalsByStartDate.length
    );
  };

  // 특정 슬라이드로 이동하는 함수
  const handleLineClick = (index: number) => {
    setCurrentSlide(index);
  };

  // 이미지 클릭 시 호출되는 함수
  const handleClick = async (id: number) => {
    try {
      const result = await musicalDetailsIncrementView(id.toString()); // 조회수 증가 함수 호출
      console.log("View Count Increment Response:", result); // 결과 콘솔 출력
      navigate(`/auth/details/${id}`); // DetailPage로 이동
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  return (
    <HeaderProvider>
      <div className="max-w-[1250px] mx-auto pt-20">
        <CommonHeader
          isAuthenticated={isAuthenticated}
          myNickname={myNickname}
          nicknameModalOpen={nicknameModalOpen}
          setNicknameModalOpen={setNicknameModalOpen}
          checkAuthStatus={checkAuthStatus}
        />
        <div className="relative flex justify-around mb-10">
  {/* 슬라이드 버튼 컨테이너 */}
  <div className="absolute top-0 -left-12 -right-12 bottom-0 flex items-center justify-between overflow-hidden">
    {/* 이전 슬라이드 버튼 */}
    <button
      className="bg-black text-white bg-opacity-50 rounded-full p-2 m-2 hover:bg-opacity-100 hover:scale-110 transition-all"
      onClick={handlePrev}
    >
      <GrPrevious />
    </button>
    {/* 다음 슬라이드 버튼 */}
    <button
      className="bg-black text-white bg-opacity-50 rounded-full p-2 m-2 hover:bg-opacity-100 hover:scale-110 transition-all"
      onClick={handleNext}
    >
      <GrNext />
    </button>
  </div>
  
  {/* 슬라이드 컨테이너 */}
  <div className="flex-wrap relative w-full h-[600px] pt-[5%] overflow-hidden">
  <div
    className="flex transition-transform duration-500 ease-in-out"
    style={{
      transform: `translateX(-${
        currentSlide * (100 / musicalsByStartDate.length)
      }%)`,
    }}
  >
    {musicalsByStartDate.length > 0 &&
      musicalsByStartDate.map((musical, index) => (
        <div
          key={musical.id}
          className={`flex-shrink-0 w-1/4 h-fit mx-2 transition-all duration-500 ease-in-out  
            ${
              index === currentSlide
                ? "opacity-100 transform scale-110"
                : "opacity-65 transform scale-90"
            } cursor-pointer`}
          onClick={() => handleClick(musical.id)}
          style={{ zIndex: 100 }} // z-index 설정
        >
          <img
            src={musical.imageUrl}
            alt={musical.title}
            className="w-full h-full object-fit shadow-modalShadow shadow-stone-600 mx-auto"
            style={{ pointerEvents: 'auto' }} // pointer-events 설정
          />
        </div>

      ))}
  </div>
  {/* 슬라이드 네비게이션 */}
  <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2 mt-2">
    {musicalsByStartDate.map((_, index) => (
      <div
        key={index}
        className={`h-1 cursor-pointer ${
          index === currentSlide
            ? "bg-black w-16 h-1 rounded-lg"
            : "bg-gray-300 w-6 h-1 rounded-lg"
        } transition-all duration-300`}
        onClick={() => handleLineClick(index)}
      />
    ))}
  </div>
</div>
</div>

      <div className="flex flex-row items-center justify-start w-fit ml-7 border-b-2 border-signature">
        <span className="text-2xl text-signature font-extrabold left-4 pt-7 italic">What's Hot</span>
      </div>

        {/* Grid Section */}
        <div className="p-5 grid grid-cols-5 gap-4">
          {musicalsByViewCount.slice(0, 1).map((musical) => (
            <div
              key={musical.id}
              className="col-span-2 row-span-2 text-white p-2.5 rounded flex flex-col items-center cursor-pointer overflow-hidden group"
              onClick={() => handleClick(musical.id)}
            >
              <div className="relative w-full h-full">
                <img
                  src={musical.imageUrl}
                  alt={musical.title}
                  className="w-full h-full object-contain rounded"
                />
                <div className="absolute bottom-0 left-0 w-full h-full bg-black bg-opacity-0 text-white text-center p-2.5 opacity-0 group-hover:opacity-100 hover:bg-opacity-65 transition-opacity duration-300 flex flex-col justify-center items-center">
                  <div>{musical.title}</div>
                  <div>{formatDate(musical.startDate)}</div>
                  {musical.startDate !== musical.endDate ? (
                    <div>{formatDate(musical.endDate)}</div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
          {musicalsByViewCount.slice(1, 7).map((musical) => (
            <div
              key={musical.id}
              className="text-white p-2.5 rounded flex flex-col items-center cursor-pointer overflow-hidden group"
              onClick={() => handleClick(musical.id)}
            >
              <div className="relative w-full h-full">
                <img
                  src={musical.imageUrl}
                  alt={musical.title}
                  className="w-full h-full object-contain rounded"
                />
                <div className="absolute bottom-0 left-0 w-full h-full bg-black bg-opacity-0 text-white text-center 
                p-2.5 opacity-0 group-hover:opacity-100 hover:bg-opacity-65 transition-opacity duration-300 flex flex-col 
                justify-center items-center">
                  <div>{musical.title}</div>
                  <div>{formatDate(musical.startDate)}</div>
                  {musical.startDate !== musical.endDate ? (
                    <div>{formatDate(musical.endDate)}</div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <footer className="bg-gray-100 text-center py-2.5 border-t border-gray-300">
          <p>© {new Date().getFullYear()} Musical Spot. All rights reserved.</p>
        </footer>
      </div>
    </HeaderProvider>
  );
};

export default Mainpage;
