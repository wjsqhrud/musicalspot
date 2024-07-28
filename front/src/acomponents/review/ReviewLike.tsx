import { HeartIcon } from "@heroicons/react/24/outline";
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
      <HeartIcon className="w-4 h-4 mr-1 text-red-500" />

      </button>
      <span>{likeCount}</span>
    </div>
  );
};

export default ReviewLike;
