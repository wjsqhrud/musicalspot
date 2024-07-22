import React, { useState, useEffect } from 'react';
import { reviewCommentsDelete } from 'services/review/reviewService';

interface Comment {
  id: string;
  content: string;
  nickname: string;
  createdAt: string;
}

interface CommentListProps {
  reviewId: string;
}

const CommentList: React.FC<CommentListProps> = ({ reviewId }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetchComments();
  }, [reviewId]);

  const fetchComments = async () => {
    // 댓글 목록을 가져오는 API 호출 구현 필요
    // const data = await getComments(reviewId);
    // setComments(data);
  };

  const handleDelete = async (commentId: string) => {
    try {
      await reviewCommentsDelete(commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('댓글 삭제 중 오류 발생:', error);
    }
  };

  return (
    <div className="comment-list">
      <h3>댓글</h3>
      {comments.map(comment => (
        <div key={comment.id} className="comment">
          <p>{comment.content}</p>
          <p>작성자: {comment.nickname}</p>
          <p>작성일: {new Date(comment.createdAt).toLocaleDateString()}</p>
          <button onClick={() => handleDelete(comment.id)}>삭제</button>
        </div>
      ))}
    </div>
  );
};

export default CommentList;