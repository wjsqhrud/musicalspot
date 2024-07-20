import React, { useEffect, useState } from "react";
import {
  musicalSortedByStartDate,
  musicalSortedByViewCount,
} from "services/musical/musicalService";

import { HeaderProvider } from "services/HeaderService/HeaderService";
import CommonHeader from "acomponents/header/CommonHeader";
import { useAuth } from "hooks/useAuthHook";
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

  const [musicalsByStartDate, setMusicalsByStartDate] = useState<Musical[]>([]);
  const [musicalsByViewCount, setMusicalsByViewCount] = useState<Musical[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    console.log("사이트 랜더링 완료");
    handleMusicalSortedByStartDate();
    handleMusicalSortedByViewCount();
  }, []);

  const handleMusicalSortedByStartDate = async () => {
    try {
      const response = await musicalSortedByStartDate();
      setMusicalsByStartDate(response.data);
      console.log("StartDate Data:", response);
    } catch (error) {
      console.error("Error fetching start date sorted musicals:", error);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(date).replace(/\. /g, ".").replace(".", "");
  };

  const handleMusicalSortedByViewCount = async () => {
    try {
      const response = await musicalSortedByViewCount();
      setMusicalsByViewCount(response.data);
      console.log("ViewCount Data:", response.data);
    } catch (error) {
      console.error("Error fetching view count sorted musicals:", error);
    }
  };

  useEffect(() => {
    if (musicalsByStartDate.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide(
          (prevSlide) => (prevSlide + 1) % musicalsByStartDate.length
        );
      }, 3000); // 3초마다 슬라이드 변경

      return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
    }
  }, [musicalsByStartDate.length]);

  const handleNext = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide + 1) % musicalsByStartDate.length
    );
  };

  const handlePrev = () => {
    setCurrentSlide(
      (prevSlide) =>
        (prevSlide - 1 + musicalsByStartDate.length) %
        musicalsByStartDate.length
    );
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  const handleClick = (id: number) => {
    console.log("Clicked ID:", id);
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
        <div className="relative w-full pt-[30%] overflow-hidden mb-10">
          {musicalsByStartDate.length > 0 && (
            <>
              <div
                key={musicalsByStartDate[currentSlide].id}
                className="absolute top-0 left-0 w-full h-full transition-opacity duration-1000 cursor-pointer"
                onClick={() =>
                  handleClick(musicalsByStartDate[currentSlide].id)
                }
              >
                <img
                  src={musicalsByStartDate[currentSlide].imageUrl}
                  alt={musicalsByStartDate[currentSlide].title}
                  className="w-full h-full object-contain"
                />
              </div>
              <button
                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
                onClick={handlePrev}
              >
                <GrPrevious />
              </button>
              <button
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
                onClick={handleNext}
              >
                <GrNext />
              </button>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {musicalsByStartDate.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentSlide ? "bg-white" : "bg-gray-300"
                    }`}
                    onClick={() => handleDotClick(index)}
                  />
                ))}
              </div>
            </>
          )}
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
                <div className="absolute bottom-0 left-0 w-full h-full bg-black bg-opacity-40 text-white text-center p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center">
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
                <div className="absolute bottom-0 left-0 w-full h-full bg-black bg-opacity-40 text-white text-center p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center">
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
        <footer>
          <div
            style={{
              backgroundColor: "#f8f8f8",
              textAlign: "center",
              padding: "10px 0",
              borderTop: "1px solid #e7e7e7",
            }}
          >
            <p>
              © {new Date().getFullYear()} Musical Spot. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </HeaderProvider>
  );
};

export default Mainpage;
