import React from "react";
import { Review } from "./ReviewType";

interface ReviewModalProps {
  review: Review;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ review, onClose }) => {
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto flex">
        <div className="w-1/3 pr-4">
          <img
            src={review.musicalImageUrl}
            alt={review.musicalTitle}
            className="w-full h-auto rounded-lg"
          />
        </div>
        <div className="w-2/3">
          <h2 className="text-2xl font-bold mb-4">{review.title}</h2>
          <p className="mb-4 text-gray-700">{review.content}</p>
          <div className="mb-4">
            <p>
              <strong>작성자:</strong> {review.nickname}
            </p>
            <p>
              <strong>작성일:</strong>{" "}
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>뮤지컬:</strong> {review.musicalTitle}
            </p>
            <p>
              <strong>좋아요:</strong> {review.likeCount}
            </p>
            <p>
              <strong>조회수:</strong> {review.viewCount}
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
