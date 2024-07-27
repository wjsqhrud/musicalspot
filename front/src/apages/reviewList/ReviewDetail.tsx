import React, { useState, useEffect, useCallback } from "react";
import { Review } from "./ReviewType";
import {
  privateReviewDetails,
  publicReviewDetails,
  reviewDetailsIncreaseView,
  reviewLike,
} from "services/review/reviewService";
import { getCookie } from "utils/CookieUtil/cookieUtis";
import EditDeleteButtons from "acomponents/review/EditDeleteButton";
import CommentForm from "acomponents/reviewComments/CommentsForm";
import ReviewLike from "acomponents/review/ReviewLike";
import ReviewForm from "acomponents/createReview/ReviewForm";
import CommentList from "./CommentList";

interface ReviewDetailProps {
  reviewId: number;
  onClose: () => void;
}

const ReviewDetail: React.FC<ReviewDetailProps> = ({ reviewId, onClose }) => {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isLoggedIn = useCallback((): boolean => {
    return !!getCookie("accessToken");
  }, []);

  const fetchReviewDetail = useCallback(async () => {
    try {
      setLoading(true);
      await reviewDetailsIncreaseView(reviewId.toString());

      const response = isLoggedIn()
        ? await privateReviewDetails(reviewId.toString())
        : await publicReviewDetails(reviewId.toString());

      setReview(response.data);

      if (isLoggedIn()) {
        const likeResponse = await reviewLike(reviewId.toString());
        setIsLiked(likeResponse.isLiked);
      }
    } catch (error) {
      console.error("Error fetching review details:", error);
      setError("리뷰를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [reviewId, isLoggedIn]);

  useEffect(() => {
    fetchReviewDetail();
  }, [fetchReviewDetail]);

  const handleCommentAdded = useCallback(() => {
    fetchReviewDetail();
  }, [fetchReviewDetail]);

  const handleLikeToggle = useCallback(() => {
    fetchReviewDetail();
  }, [fetchReviewDetail]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setIsEditing(false);
    fetchReviewDetail();
  }, [fetchReviewDetail]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!review) return <div>리뷰를 찾을 수 없습니다.</div>;

  if (isEditing) {
    return (
      <ReviewForm
        existingReview={reviewId.toString()}
        onClose={handleCloseEdit}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{review.title}</h1>
      <img
        src={review.musicalImageUrl}
        alt={review.musicalTitle}
        className="w-1/2 h-64 object-cover mb-4"
      />
      <p className="text-xl text-gray-700 mb-4">{review.musicalTitle}</p>
      <p className="text-gray-600 mb-2">카테고리: {review.musicalCategory}</p>
      <p className="text-gray-600 mb-2">작성자: {review.nickname}</p>
      <p className="text-gray-600 mb-2">
        작성일: {new Date(review.createdAt).toLocaleDateString()}
      </p>
      <p className="text-gray-600 mb-2">
        수정일: {new Date(review.updatedAt).toLocaleDateString()}
      </p>
      <p className="text-gray-600 mb-2">조회수: {review.viewCount}</p>
      <ReviewLike
        reviewId={review.id.toString()}
        isLiked={isLiked}
        likeCount={review.likeCount}
        onLikeToggle={handleLikeToggle}
      />
      <div className="my-6">
        <p className="text-gray-800 whitespace-pre-wrap">{review.content}</p>
      </div>
      <EditDeleteButtons
        reviewId={review.id.toString()}
        isOwner={review.owner}
        onEdit={handleEdit}
      />
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">
          댓글 ({review.comments.length})
        </h3>
        <CommentList comments={review.comments} onCommentUpdated={handleCommentAdded} />

        {isLoggedIn() && (
          <CommentForm
            reviewId={reviewId.toString()}
            onCommentAdded={handleCommentAdded}
          />
        )}
      </div>
      <button
        onClick={onClose}
        className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
      >
        닫기
      </button>
    </div>
  );
};

export default ReviewDetail;
