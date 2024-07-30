import React, { useState, useEffect } from "react";
import { Review } from "./ReviewType";
import { truncateString } from "acomponents/review/ReviewContentLength";
import { EyeIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { reviewLike } from "services/review/reviewService";

interface ReviewItemProps {
  review: Review;
  isAuthenticated: boolean;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, isAuthenticated }) => {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (isAuthenticated) {
        try {
          const response = await reviewLike(review.id.toString());
          setIsLiked(response.data);
        } catch (error) {
          console.error("Error fetching like status:", error);
        }
      }
    };

    fetchLikeStatus();
  }, [review.id, isAuthenticated]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full h-full flex flex-col">
      <img
        src={review.musicalImageUrl}
        alt={review.musicalTitle}
        className="w-full object-cover"
      />
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-1 truncate">{review.title}</h3>
        <p className="text-sm text-gray-600 mb-1 truncate">
          {review.musicalTitle}
        </p>
        <p className="text-xs text-gray-500 mb-1">작성자: {review.nickname}</p>
        <p className="text-xs text-gray-700 mb-2 line-clamp-2 flex-grow">
          {truncateString(review.content, 50)}
        </p>
        <div className="flex justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <EyeIcon className="w-4 h-4 mr-1 text-blue-500" />
            <span>{review.viewCount}</span>
          </div>
          <div className="flex items-center">
            <ChatBubbleLeftIcon className="w-4 h-4 mr-1 text-green-500" />
            <span>{review.commentCount}</span>
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              isLiked ? (
                <FaHeart className="w-4 h-4 mr-1 text-red-500" />
              ) : (
                <FaRegHeart className="w-4 h-4 mr-1 text-red-500" />
              )
            ) : (
              <FaRegHeart className="w-4 h-4 mr-1 text-red-500" />
            )}
            <span>{review.likeCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
