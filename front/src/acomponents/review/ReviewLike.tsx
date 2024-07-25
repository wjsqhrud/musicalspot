import React from "react";
import { toggleReviewLike } from "services/review/reviewService";

interface ReviewLikeProps {
  reviewId: string;
  isLiked: boolean;
  likeCount: number;
  onLikeToggle: () => void;
}

const ReviewLike: React.FC<ReviewLikeProps> = ({
  reviewId,
  isLiked,
  likeCount,
  onLikeToggle,
}) => {
  const handleLikeSubmit = async () => {
    try {
      await toggleReviewLike(reviewId);
      onLikeToggle();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleLikeSubmit}
        className={`mr-2 text-2xl focus:outline-none ${
          isLiked ? "text-blue-500" : "text-gray-400 hover:text-blue-500"
        }`}
        aria-label={isLiked ? "좋아요 취소" : "좋아요"}
      >
        👍
      </button>
      <span>{likeCount} 좋아요</span>
    </div>
  );
};

export default ReviewLike;
