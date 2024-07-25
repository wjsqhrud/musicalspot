// CommentForm.tsx
import React, { useState } from "react";
import { reviewCommentsCreate } from "services/review/reviewService";

interface CommentFormProps {
  reviewId: string;
  onCommentAdded: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  reviewId,
  onCommentAdded,
}) => {
  const [commentContent, setCommentContent] = useState("");

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      await reviewCommentsCreate(reviewId, commentContent);
      setCommentContent("");
      onCommentAdded(); // 댓글 추가 후 부모 컴포넌트에 알림
    } catch (error) {
      console.error("Error creating comment:", error);
      // 에러 처리 로직 추가 (예: 사용자에게 알림)
    }
  };

  return (
    <form onSubmit={handleCommentSubmit} className="mt-4">
      <textarea
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        className="w-full p-2 border rounded"
        rows={3}
        placeholder="댓글을 작성해주세요"
      />
      <button
        type="submit"
        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        댓글 작성
      </button>
    </form>
  );
};

export default CommentForm;
