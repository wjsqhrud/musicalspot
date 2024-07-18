import React, { useEffect, useState } from "react";
import {
  categoryList,
  musicalSortedByStartDate,
  musicalSortedByViewCount,
} from "services/musical/musicalService";
import { FaSearch, FaRegUser } from "react-icons/fa";

interface Category {
  id: number;
  category: string;
}

interface Musical {
  id: number;
  title: string;
  startDate?: string;
  endDate?: string;
  viewCount?: number;
  imageUrl: string;
}

const JMainpage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [musicalsByStartDate, setMusicalsByStartDate] = useState<Musical[]>([]);
  const [musicalsByViewCount, setMusicalsByViewCount] = useState<Musical[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    console.log("사이트 랜더링 완료");
    handleCategoryList();
    handleMusicalSortedByStartDate();
    handleMusicalSortedByViewCount();
  }, []);

  const handleCategoryList = async () => {
    try {
      const response = await categoryList();
      setCategories(response.data);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleMusicalSortedByStartDate = async () => {
    try {
      const response = await musicalSortedByStartDate();
      setMusicalsByStartDate(response.data);
      console.log("StartDate Data:", response);
    } catch (error) {
      console.error("Error fetching start date sorted musicals:", error);
    }
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

  const handleClick = (id: number) => {
    console.log("Clicked ID:", id);
  };

  const handleAllCategory = ()=>{
    console.log("all클릭");
  };

  return (
    <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
      {/* Header */}
      <header className="flex justify-between items-center p-2.5 bg-white text-[#33313B] w-full mb-5"

        // style={{ 
        //   display: "flex",
        //   justifyContent: "space-between",
        //   alignItems: "center",
        //   padding: "10px",
        //   backgroundColor: "white",
        //   color: "#33313B",
        //   width: "100%",
        //   marginBottom: "20px",
        //   boxSizing: "border-box",
        // }}
      >
        <h1 style={{ flexShrink: 0, fontSize: "24px", margin: "0 10px 0 0" }}>MUSICAL SPOT</h1>
        <div style={{ display: "flex", alignItems: "center", flexGrow: 1, justifyContent: "center" }}>
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            <div style={{
              backgroundColor: "white",
              color: "#33313B",
              padding: "10px",
              minWidth: "60px",
              textAlign: "center",
              cursor: "pointer",
              boxSizing: "border-box",
            }}
              onClick={handleAllCategory}
            >
              All
            </div>
            {categories.map((category) => (
              <div
                key={category.id}
                style={{
                  backgroundColor: "white",
                  color: "#33313B",
                  padding: "10px",
                  minWidth: "60px",
                  textAlign: "center",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
                onClick={() => handleClick(category.id)}
              >
                {category.category}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "5px 0",
            }}
          >
            <input
              type="text"
              placeholder="Search"
              style={{
                border: "none",
                outline: "none",
                marginLeft: "5px",
                borderBottom: "1px solid #ccc",
                padding: "5px 0",
                boxSizing: "border-box",
              }}
            />
            <FaSearch />
          </div>
          <FaRegUser size={24} />
        </div>
      </header>

      {/* Slider */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "400px",
          overflow: "hidden",
          marginBottom: "40px",
        }}
      >
        {musicalsByStartDate.length > 0 && (
          <div
            key={musicalsByStartDate[currentSlide].id}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              transition: "opacity 1s ease-in-out",
              cursor: "pointer",
            }}
            onClick={() => handleClick(musicalsByStartDate[currentSlide].id)}
          >
            <img
              src={musicalsByStartDate[currentSlide].imageUrl}
              alt={musicalsByStartDate[currentSlide].title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
      </div>

      {/* Grid Section */}
      <div
        style={{
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "bold",
          margin: "20px 0",
        }}
      >
        WHAT'S HOT
      </div>
      <div
        style={{
          padding: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {musicalsByViewCount.map((musical) => (
          <div
            key={musical.id}
            style={{
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => handleClick(musical.id)}
          >
            <img
              src={musical.imageUrl}
              alt={musical.title}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "5px",
              }}
            />
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
          <p>© {new Date().getFullYear()} Musical Spot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default JMainpage;
