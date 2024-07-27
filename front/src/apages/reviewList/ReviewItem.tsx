import React from "react";
import { Review } from "./ReviewType";
import { truncateString } from "acomponents/review/ReviewContentLength";

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full h-full">
      <img
        src={review.musicalImageUrl}
        alt={review.musicalTitle}
        className="w-full h-32 object-cover"
      />
      <div className="p-3">
        <h3 className="text-lg font-semibold mb-1 truncate">{review.title}</h3>
        <p className="text-sm text-gray-600 mb-1 truncate">{review.musicalTitle}</p>
        <p className="text-xs text-gray-500 mb-1">작성자: {review.nickname}</p>
        <p className="text-xs text-gray-700 mb-2 line-clamp-2">
          {truncateString(review.content, 50)}
        </p>
        <div className="flex justify-between text-xs text-gray-500">
          <span>좋아요: {review.likeCount}</span>
          <span>조회수: {review.viewCount}</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;