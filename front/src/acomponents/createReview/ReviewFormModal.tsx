import React from "react";
import ReviewForm from "./ReviewForm";
import { Review } from "./CreateReviewType";
import Modal from "acomponents/review/Modal";

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingReview?: Review;
}

const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  isOpen,
  onClose,
  existingReview,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex">
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">
            {existingReview ? "리뷰 수정" : "리뷰 작성"}
          </h2>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewFormModal;
