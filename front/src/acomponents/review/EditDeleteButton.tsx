

import React from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const handleEdit = async () => {
    try {
      const response = await privateReviewDetails(reviewId);
      const reviewData = response.data;
      onEdit(reviewData);
    } catch (error) {
      console.error("리뷰 데이터 불러오기 중 오류 발생:", error);
    }

  };

  const handleDelete = async () => {
    if (window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
      try {
        await deleteReview(reviewId);
        navigate(`/auth/reviewlist`);
        onDelete();
      } catch (error) {
        console.error("리뷰 삭제 중 오류 발생:", error);
      }
    }
  };

  if (!isOwner) return null;

  return (
    <div className="edit-delete-buttons">
      <button onClick={handleEdit}>수정</button>
      <button onClick={handleDelete}>삭제</button>
    </div>
  );
};


export default EditDeleteButtons;

