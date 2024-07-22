import React, { useState } from 'react';
import { reviewCommentsCreate } from 'services/review/reviewService';

interface CommentFormProps {
  reviewId: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ reviewId }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await reviewCommentsCreate(reviewId, content);
      setContent('');
    } catch (error) {
      console.error('댓글 작성 중 오류 발생:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요"
      />
      <button type="submit">댓글 작성</button>
    </form>
  );
};

export default CommentForm;