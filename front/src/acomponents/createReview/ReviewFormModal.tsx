import React from "react";
import ReviewForm from "./ReviewForm";
import { Review } from "./CreateReviewType";
import Modal from "acomponents/review/Modal";

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingReview?: Review;
  onReviewSubmitted: () => void;
}

const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  isOpen,
  onClose,
  existingReview,
  onReviewSubmitted
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full h-full">
        <h2 className="text-2xl font-bold mb-4">
          {existingReview ? "리뷰 수정" : "리뷰 작성"}
        </h2>
        <ReviewForm onClose={onClose} existingReview={existingReview?.reviewId} onReviewSubmitted={onReviewSubmitted} />
      </div>
    </Modal>
  );
};

export default ReviewFormModal;