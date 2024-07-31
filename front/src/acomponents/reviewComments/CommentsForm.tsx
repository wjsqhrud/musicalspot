import React from "react";
import { ContentInput } from "acomponents/createReview/ContentLength";
import { reviewCommentsCreate } from "services/review/reviewService";
import { useNavigate } from "react-router-dom";

interface CommentFormProps {
  reviewId: string;
  onCommentAdded: () => void;
  isAuthenticated: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  reviewId,
  onCommentAdded,
  isAuthenticated,
}) => {
  const navigate = useNavigate();

  const handleSubmit = async (content: string) => {
    if (!content.trim()) return;

    if (!isAuthenticated) {
      alert("댓글을 작성하려면 로그인이 필요합니다.");
      navigate("/auth/sign-in");
      return;
    }

    try {
      await reviewCommentsCreate(reviewId, content);
      onCommentAdded();
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      alert("댓글 작성에 실패했습니다.");
    }
  };

  return (
    <div className="mt-4">
      <ContentInput
        minLength={5}
        maxLength={200}
        placeholder="댓글을 작성하세요"
        onSubmit={handleSubmit}
        isTextArea={true}
        textAreaHeight="40px"
      />
    </div>
  );
};

export default CommentForm;
