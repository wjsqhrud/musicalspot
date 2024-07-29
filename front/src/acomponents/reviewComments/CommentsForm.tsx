import { ContentInput } from "acomponents/createReview/ContentLength";
import React from "react";
import { reviewCommentsCreate } from "services/review/reviewService";

interface CommentFormProps {
  reviewId: string;
  onCommentAdded: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  reviewId,
  onCommentAdded,
}) => {
  const handleSubmit = async (content: string) => {
    if (!content.trim()) return;

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
        minLength={1}
        maxLength={200}
        placeholder="댓글을 작성하세요"
        onSubmit={handleSubmit}
        isTextArea={true}
      />
    </div>
  );
};

export default CommentForm;
