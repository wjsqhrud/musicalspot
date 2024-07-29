import React, { useState, useEffect } from "react";
import {
  createReview,
  updateReview,
  privateReviewDetails,
} from "services/review/reviewService";
import { Review } from "./CreateReviewType";
import MusicalSelector from "./MusicalSelector";

interface ReviewFormProps {
  existingReview?: string;
  onClose: () => void;
  onReviewSubmitted: () => void; // 새로운 prop 추가

}

const ReviewForm: React.FC<ReviewFormProps> = ({ existingReview, onClose, onReviewSubmitted }) => {
  const [formData, setFormData] = useState<Review>({
    reviewId: "",
    title: "",
    content: "",
    musicalId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>();

  useEffect(() => {
    if (existingReview) {
      fetchExistingReview(existingReview);
    }
  }, [existingReview]);

  const fetchExistingReview = async (reviewId: string) => {
    try {
      const response = await privateReviewDetails(reviewId);
      const reviewData = response.data;
      setFormData(reviewData);
      setSelectedImage(reviewData.musical?.imageUrl);
    } catch (error) {
      console.error("Error fetching existing review:", error);
      setError("기존 리뷰를 불러오는데 실패했습니다.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.musicalId) return;

    setLoading(true);
    try {
      if (existingReview) {
        await updateReview(
          existingReview,
          formData.title,
          formData.content,
          formData.musicalId
        );
      } else {
        await createReview(
          formData.title,
          formData.content,
          formData.musicalId
        );
      }
      setLoading(false);
      onReviewSubmitted();
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      setLoading(false);
      setError("리뷰를 제출하는 중에 오류가 발생했습니다.");
    }
  };

  const handleMusicalSelect = (musicalId: string, imageUrl?: string) => {
    setFormData((prev) => ({ ...prev, musicalId }));
    setSelectedImage(imageUrl);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex">
      <div className="w-1/3 pr-4">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Selected Musical"
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
            뮤지컬을 선택해주세요
          </div>
        )}
      </div>
      <div className="w-1/3 px-2">
        <MusicalSelector onMusicalSelect={handleMusicalSelect} />
      </div>
      <div className="w-1/3 pl-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">제목</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded text-gray-700 bg-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">내용</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className="w-full p-2 border rounded text-gray-700 bg-white"
              rows={5}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading
              ? "처리 중..."
              : existingReview
              ? "리뷰 수정"
              : "리뷰 작성"}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default ReviewForm;