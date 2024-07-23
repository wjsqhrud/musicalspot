// RenderComments.tsx

import React from "react";
import { Review } from "./ReviewType";

interface RenderCommentsProps {
  review: Review;
}

const RenderComments: React.FC<RenderCommentsProps> = ({ review }) => {
  if (!review.comments || review.comments.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">댓글</h3>
        <p className="text-gray-600">댓글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-2">댓글</h3>
      {review.comments.map((comment) => (
        <div key={comment.id} className="bg-gray-100 p-4 rounded-lg mb-2">
          <p className="text-sm text-gray-600 mb-2">
            작성자: {comment.nickname}
          </p>
          <p className="text-sm text-gray-700">{comment.content}</p>
          <p className="text-xs text-gray-500 mt-2">
            작성일: {new Date(comment.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RenderComments;
