import React, { useState, useEffect, useCallback, useRef } from "react";
import ReviewItem from "./ReviewItem";
import { reviewRecent40, reviewLikes40, reviewViews40 } from "services/review/reviewService";
import { Review } from "./ReviewType";
import ReviewDetail from "./ReviewDetail";
import ReviewFormModal from "acomponents/createReview/ReviewFormModal";
import Modal from "acomponents/review/Modal";

type SortType = 'recent' | 'likes' | 'views';

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [sortType, setSortType] = useState<SortType>('recent');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastReviewElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      switch (sortType) {
        case 'recent':
          response = await reviewRecent40(page);
          break;
        case 'likes':
          response = await reviewLikes40(page);
          break;
        case 'views':
          response = await reviewViews40(page);
          break;
        default:
          response = await reviewRecent40(page);
      }
      const data = response.data;

      if (!Array.isArray(data)) {
        throw new Error("데이터 형식이 올바르지 않습니다.");
      }

      if (data.length < 40) {
        setHasMore(false);
      }
      setReviews((prevReviews) => [...prevReviews, ...data]);
    } catch (error) {
      console.error("리뷰 로딩 중 오류 발생:", error);
      setError("리뷰를 불러오는 데 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    setReviews([]);
    setHasMore(true);
    fetchReviews();
  }, [sortType]);

  useEffect(() => {
    if (page > 0) {
      fetchReviews();
    }
  }, [page]);

  const handleReviewClick = (reviewId: number) => {
    setSelectedReviewId(reviewId);
  };

  const handleCloseModal = () => {
    setSelectedReviewId(null);
  };

  const handleCreateReviewClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleSortChange = (newSortType: SortType) => {
    setSortType(newSortType);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">최근 리뷰</h2>
      <div className="flex justify-between mb-4">
        <button
          onClick={handleCreateReviewClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          리뷰 작성
        </button>
        <div className="relative">
          <button 
            onClick={toggleDropdown}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          >
            {sortType === 'recent' ? '최신순' : sortType === 'likes' ? '좋아요순' : '조회수순'}
            <svg className="fill-current h-4 w-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => handleSortChange('recent')}>최신순</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => handleSortChange('likes')}>좋아요순</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => handleSortChange('views')}>조회수순</a>
            </div>
          )}
        </div>
      </div>
      <ReviewFormModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
        {reviews.map((review, index) => (
          <div
            key={`${review.id}-${index}`}
            ref={index === reviews.length - 1 ? lastReviewElementRef : null}
            onClick={() => handleReviewClick(review.id)}
            className="cursor-pointer"
          >
            <ReviewItem review={review} />
          </div>
        ))}
      </div>
      {loading && <p className="text-center mt-4">로딩 중...</p>}
      {!hasMore && <p className="text-center mt-4">더 이상 리뷰가 없습니다.</p>}

      <Modal isOpen={!!selectedReviewId} onClose={handleCloseModal}>
        {selectedReviewId && (
          <ReviewDetail
            reviewId={selectedReviewId}
            onClose={handleCloseModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default ReviewList;