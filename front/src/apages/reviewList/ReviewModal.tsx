import React from "react";
import { Review } from "./ReviewType";

interface ReviewModalProps {
  review: Review;
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ review, onClose, isLoggedIn }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">{review.title}</h2>
        <p className="mb-4">{review.content}</p>
        <div className="mb-4">
          <p>작성자: {review.nickname}</p>
          <p>작성일: {new Date(review.createdAt).toLocaleDateString()}</p>
          <p>좋아요: {review.likeCount}</p>
          <p>조회수: {review.viewCount}</p>
        </div>
        {isLoggedIn ? (
          <div className="mb-4">
            <textarea
              className="w-full p-2 border rounded"
              placeholder="댓글을 작성하세요..."
            ></textarea>
            <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              댓글 작성
            </button>
          </div>
        ) : (
          <p className="mb-4">댓글을 작성하려면 로그인이 필요합니다.</p>
        )}
        <button
          onClick={onClose}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          닫기
        </button>

      </div>
    </div>
  );
};

export default ReviewModal;

