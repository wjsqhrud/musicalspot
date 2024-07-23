import React, { useState } from "react";
import { createReview } from "services/review/reviewService";

const ReviewForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [musicalId, setMusicalId] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await createReview(title, content, musicalId);
    } catch (error) {
      console.error("리뷰 작성에 실패했습니다:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용"
        className="w-full p-2 border rounded h-40"
        required
      />
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        작성
      </button>
    </form>
  );
};

export default ReviewForm;
