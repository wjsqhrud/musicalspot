import React, { useState } from "react";
import { reviewCommentsCreate } from "services/review/reviewService";

interface CommentFormProps {
  reviewId: string;
  onCommentAdded: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ reviewId, onCommentAdded }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await reviewCommentsCreate(reviewId, content);
      setContent("");
      onCommentAdded();
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      alert("댓글 작성에 실패했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="댓글을 작성하세요"
        rows={3}
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