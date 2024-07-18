import React, { useState, useEffect } from "react";
import { reviewRecent40 } from "services/review/reviewService";

// 리뷰 데이터 인터페이스
interface Review {
  id: number;  // ID가 숫자로 정의되어 있는 것을 반영
  title: string;
  content: string;
  musicalId: number;  // musicalId로 변경
  musicalTitle: string;  // musicalTitle 추가
  createdAt: string;
  likeCount: number;
  viewCount: number;
  nickname: string;  // 작성자의 닉네임 추가
}

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await reviewRecent40(0);
        console.log(response)
        if (response.code === 'SU') {
          setReviews(response.data);
        } else {
          setError('리뷰를 불러오는 데 실패했습니다.');
        }
        setLoading(false);
      } catch (err) {
        setError("리뷰를 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleReviewClick = (review: Review): void => {
    console.log("클릭된 리뷰의 작성자 닉네임:", review.nickname);
  };

  const handleKeyDown = (event: React.KeyboardEvent, review: Review): void => {
    if (event.key === "Enter" || event.key === " ") {
      handleReviewClick(review);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="review-list p-4">
      <h2 className="text-2xl font-bold mb-4">최근 리뷰</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((review) => (
          <button
            key={review.id}
            className="review-item p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => handleReviewClick(review)}
            onKeyDown={(e) => handleKeyDown(e, review)}
            aria-label={`리뷰: ${review.title}, 작성자: ${review.nickname}`}
          >
            <h3 className="text-xl font-semibold mb-2">{review.title}</h3>
            <p className="text-gray-600 mb-4">{review.content.substring(0, 100)}...</p>
            <div className="review-meta text-sm text-gray-500">
              <span className="block">작성자: {review.nickname}</span>
              <span className="block">작성일: {new Date(review.createdAt).toLocaleDateString()}</span>
              <span className="block">좋아요: {review.likeCount}</span>
              <span className="block">조회수: {review.viewCount}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;