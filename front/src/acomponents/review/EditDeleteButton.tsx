// EditDeleteButtons.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { deleteReview } from "services/review/reviewService";

interface EditDeleteButtonsProps {
  reviewId: string;
  isOwner: boolean;
}

const EditDeleteButtons: React.FC<EditDeleteButtonsProps> = ({
  reviewId,
  isOwner,
}) => {
  const navigate = useNavigate();

  if (!isOwner) return null;

  const handleEdit = () => {
    navigate(`/review/edit/${reviewId}`);
  };

  const handleDelete = async () => {
    if (window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
      try {
        await deleteReview(reviewId);
        navigate("/reviewlist");
      } catch (error) {
        console.error("리뷰 삭제 중 오류 발생:", error);
      }
    }
  };

  return (
    <div className="edit-delete-buttons">
      <button onClick={handleEdit}>수정</button>
      <button onClick={handleDelete}>삭제</button>
    </div>
  );
};

export default EditDeleteButtons;