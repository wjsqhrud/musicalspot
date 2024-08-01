import Modal from "components/Modal/Modal";
import React, { useState } from "react";
import {
  deleteReview,
  privateReviewDetails,
} from "services/review/reviewService";

interface EditDeleteButtonsProps {
  reviewId: string;
  isOwner: boolean;
  onEdit: (reviewData: any) => void;
  onDelete: () => void;
}

const EditDeleteButtons: React.FC<EditDeleteButtonsProps> = ({
  reviewId,
  isOwner,
  onEdit,
  onDelete,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEdit = async () => {
    try {
      const response = await privateReviewDetails(reviewId);
      const reviewData = response.data;
      onEdit(reviewData);
    } catch (error) {
      console.error("리뷰 데이터 불러오기 중 오류 발생:", error);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteReview(reviewId);
      onDelete();
    } catch (error) {
      console.error("리뷰 삭제 중 오류 발생:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (!isOwner) return null;

  return (
    <div className="edit-delete-buttons">
      <button
        onClick={handleEdit}
        className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        수정
      </button>
      <button
        onClick={handleDeleteClick}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        삭제
      </button>
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        message="정말로 이 리뷰를 삭제하시겠습니까?"
      />
    </div>
  );
};

export default EditDeleteButtons;

