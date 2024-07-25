// ReviewList.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import ReviewItem from "./ReviewItem";
import { reviewRecent40 } from "services/review/reviewService";
import { Review } from "./ReviewType";
import ReviewDetail from "./ReviewDetail";
import Modal from "acomponents/review/Modal";
import CreateReviewModal from "apages/CreateReview/CreateReviewModal";
import ReviewFormModal from "acomponents/createReview/ReviewFormModal";

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
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

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reviewRecent40(page);
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

  const handleReviewClick = (reviewId: number) => {
    setSelectedReviewId(reviewId);
  };

  const handleCloseModal = () => {
    setSelectedReviewId(null);
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">최근 리뷰</h2>
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        리뷰 작성
      </button>
      <ReviewFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
