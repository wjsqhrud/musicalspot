// ReviewDetail.tsx
import React, { useState, useEffect } from "react";
import { Review } from "./ReviewType";
import { privateReviewDetails, publicReviewDetails, reviewDetailsIncreaseView } from "services/review/reviewService";
import { getCookie } from "utils/CookieUtil/cookieUtis";
import EditDeleteButtons from "acomponents/review/EditDeleteButton";

interface ReviewDetailProps {
  reviewId: number;
  onClose: () => void;
}

const ReviewDetail: React.FC<ReviewDetailProps> = ({ reviewId, onClose }) => {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = (): boolean => {
    return !!getCookie('accessToken');
  };

  useEffect(() => {
    const fetchReviewDetail = async () => {
      try {
        await reviewDetailsIncreaseView(reviewId.toString());

        const response = isLoggedIn() 
          ? await privateReviewDetails(reviewId.toString())
          : await publicReviewDetails(reviewId.toString());

        setReview(response.data);
      } catch (error) {
        console.error("Error fetching review details:", error);
        setError("리뷰를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviewDetail();
  }, [reviewId]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!review) return <div>리뷰를 찾을 수 없습니다.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{review.title}</h1>
      <img src={review.musicalImageUrl} alt={review.musicalTitle} className="w-full h-64 object-cover mb-4" />
      <p className="text-xl text-gray-700 mb-4">{review.musicalTitle}</p>
      <p className="text-gray-600 mb-2">카테고리: {review.musicalCategory}</p>
      <p className="text-gray-600 mb-2">작성자: {review.nickname}</p>
      <p className="text-gray-600 mb-2">작성일: {new Date(review.createdAt).toLocaleDateString()}</p>
      <p className="text-gray-600 mb-2">수정일: {new Date(review.updatedAt).toLocaleDateString()}</p>
      <p className="text-gray-600 mb-2">조회수: {review.viewCount}</p>
      <p className="text-gray-600 mb-2">좋아요: {review.likeCount}</p>
      <div className="my-6">
        <p className="text-gray-800 whitespace-pre-wrap">{review.content}</p>
      </div>
      <EditDeleteButtons 
        reviewId={review.id.toString()} 
        isOwner={review.owner}
      />
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">댓글 ({review.comments.length})</h3>
        {review.comments.map(comment => (
          <div key={comment.id} className="bg-gray-100 p-3 rounded mb-2">
            <p className="font-semibold">{comment.nickname}</p>
            <p>{comment.content}</p>
            <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <button onClick={onClose} className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
        닫기
      </button>
    </div>
  );
};

export default ReviewDetail;