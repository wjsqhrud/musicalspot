import React, { useState } from "react";
import { reviewCommentsUpdate, reviewCommentsDelete } from "services/review/reviewService";
import { Comment } from "./ReviewType";

interface CommentListProps {
  comments: Comment[];
  onCommentUpdated: () => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, onCommentUpdated }) => {
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdate = async (commentId: number) => {
    try {
      await reviewCommentsUpdate(commentId.toString(), editContent);
      setEditingCommentId(null);
      onCommentUpdated();
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  const handleDelete = async (commentId: number) => {
    if (window.confirm("이 댓글을 삭제하시겠습니까?")) {
      try {
        await reviewCommentsDelete(commentId.toString());
        onCommentUpdated();
      } catch (error) {
        console.error("댓글 삭제 실패:", error);
        alert("댓글 삭제에 실패했습니다.");
      }
    }
  };

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-100 p-4 rounded-lg mb-2">
          <p className="font-semibold">{comment.nickname}</p>
          {editingCommentId === comment.id ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border rounded mt-2"
            />
          ) : (
            <p className="mt-2">{comment.content}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            {new Date(comment.createdAt).toLocaleString()}
          </p>
          {comment.owner && (
            <div className="mt-2">
              {editingCommentId === comment.id ? (
                <>
                  <button onClick={() => handleUpdate(comment.id)} className="text-blue-500 mr-2">저장</button>
                  <button onClick={() => setEditingCommentId(null)} className="text-gray-500">취소</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEdit(comment)} className="text-blue-500 mr-2">수정</button>
                  <button onClick={() => handleDelete(comment.id)} className="text-red-500">삭제</button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;