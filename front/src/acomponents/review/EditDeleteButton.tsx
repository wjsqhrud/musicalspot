// <<<<<<< HEAD
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { deleteReview } from "services/review/reviewService";
// interface EditDeleteButtonsProps {
//   reviewId: string;
//   authorId: string;
//   currentUserId: string | null;
// =======
// EditDeleteButtons.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { deleteReview } from "services/review/reviewService";

interface EditDeleteButtonsProps {
  reviewId: string;
  isOwner: boolean;
// >>>>>>> origin/hwanhee
}

const EditDeleteButtons: React.FC<EditDeleteButtonsProps> = ({
  reviewId,
// <<<<<<< HEAD
//   authorId,
//   currentUserId,
// }) => {
//   const navigate = useNavigate();

//   if (currentUserId !== authorId) return null;
// =======
  isOwner,
}) => {
  const navigate = useNavigate();

  if (!isOwner) return null;
// >>>>>>> origin/hwanhee

  const handleEdit = () => {
    navigate(`/review/edit/${reviewId}`);
  };

  const handleDelete = async () => {
    if (window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
      try {
        await deleteReview(reviewId);
// <<<<<<< HEAD
//         navigate("/reviews"); // 리뷰 목록 페이지로 이동
// =======
        navigate("/reviewlist");
// >>>>>>> origin/hwanhee
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

// <<<<<<< HEAD
// export default EditDeleteButtons;
// =======
export default EditDeleteButtons;
// >>>>>>> origin/hwanhee
