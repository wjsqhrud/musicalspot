// ReviewItem.tsx
import React from "react";
import { Review } from "./ReviewType";
import { truncateString } from "acomponents/review/ReviewContentLength";

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full md:w-1/2">
      <img
        src={review.musicalImageUrl}
        alt={review.musicalTitle}
        className="w- h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 truncate">{review.title}</h3>
        <p className="text-gray-600 mb-2 truncate">{review.musicalTitle}</p>
        <p className="text-sm text-gray-500 mb-2">
          카테고리: {review.musicalCategory}
        </p>
        <p className="text-sm text-gray-500 mb-2">작성자: {review.nickname}</p>
        <p className="text-sm text-gray-500 mb-2">
          작성일: {new Date(review.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">
          {truncateString(review.content, 30)}
        </p>
        <div className="flex justify-between text-sm text-gray-500">
          <span>좋아요: {review.likeCount}</span>
          <span>조회수: {review.viewCount}</span>
          <span>댓글: {review.commentCount}</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
