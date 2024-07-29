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
import {
  HeartIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";

interface ReviewDetailProps {
  reviewId: number;
  onClose: () => void;
  onDelete: () => void;
}

const ReviewDetail: React.FC<ReviewDetailProps> = ({
  reviewId,
  onClose,
  onDelete,
}) => {
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
        onReviewSubmitted={handleCommentAdded}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 pr-4">
          <img
            src={review.musicalImageUrl}
            alt={review.musicalTitle}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
          <h2 className="text-2xl font-bold mt-4 mb-2">
            {review.musicalTitle}
          </h2>
          <p className="text-gray-600 mb-2">
            카테고리: {review.musicalCategory}
          </p>
        </div>
        <div className="md:w-2/3 pl-4">
          <h1 className="text-3xl font-bold mb-4">{review.title}</h1>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">작성자: {review.nickname}</p>
            <div>
              <p className="text-gray-600">
                작성일: {new Date(review.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                수정일: {new Date(review.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center text-gray-600">
              <EyeIcon className="w-4 h-4 mr-1 text-blue-500" />
              <span>{review.viewCount}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <ChatBubbleLeftIcon className="w-4 h-4 mr-1 text-green-500" />
              <span>{review.comments.length}</span>
            </div>
            <ReviewLike
              reviewId={review.id.toString()}
              isLiked={isLiked}
              likeCount={review.likeCount}
              onLikeToggle={handleLikeToggle}
            />
          </div>
          <div className="bg-gray-100 p-6 rounded-lg mb-6 h-96 overflow-y-auto">
            <p className="text-gray-800 whitespace-pre-wrap">
              {review.content}
            </p>
          </div>
          <EditDeleteButtons
            reviewId={review.id.toString()}
            isOwner={review.owner}
            onEdit={handleEdit}
            onDelete={onDelete}
          />
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">
              댓글 ({review.comments.length})
            </h3>
            <CommentList
              comments={review.comments}
              onCommentUpdated={handleCommentAdded}
            />
            {isLoggedIn() && (
              <CommentForm
                reviewId={reviewId.toString()}
                onCommentAdded={handleCommentAdded}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReviewDetail;

