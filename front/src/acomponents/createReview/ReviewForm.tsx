import React, { useState, useEffect } from "react";
import {
  createReview,
  updateReview,
  privateReviewDetails,
} from "services/review/reviewService";
import {
  categoryList,
  categoryMusical,
  musicalDetails,
} from "services/musical/musicalService";
import { Category, Musical, Review } from "./CreateReviewType";
import MusicalPreview from "./MusicalCategory";

interface ReviewFormProps {
  existingReview?: string; // reviewId
  onClose: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ existingReview, onClose }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [musicals, setMusicals] = useState<Musical[]>([]);
  const [selectedMusical, setSelectedMusical] = useState<string>("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    if (existingReview) {
      fetchExistingReview(existingReview);
    }
  }, [existingReview]);

  const fetchCategories = async () => {
    try {
      const result = await categoryList();
      setCategories(result.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("카테고리를 불러오는 중에 오류가 발생했습니다.");
    }
  };

  const fetchExistingReview = async (reviewId: string) => {
    try {
      const response = await privateReviewDetails(reviewId);
      const reviewData = response.data;
      setTitle(reviewData.title);
      setContent(reviewData.content);
      setSelectedCategory(reviewData.categoryId);
      setSelectedMusical(reviewData.musicalId);
      fetchMusicals(reviewData.categoryId);
    } catch (error) {
      console.error("Error fetching existing review:", error);
      setError("기존 리뷰를 불러오는데 실패했습니다.");
    }
  };

  const fetchMusicals = async (categoryId: string) => {
    try {
      const result = await categoryMusical(categoryId);
      setMusicals(result.data);
    } catch (error) {
      console.error("Error fetching musicals:", error);
      setError("뮤지컬을 불러오는 중에 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMusical) return;

    setLoading(true);
    try {
      if (existingReview) {
        await updateReview(existingReview, title, content, selectedMusical);
      } else {
        await createReview(title, content, selectedMusical);
      }
      setLoading(false);
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      setLoading(false);
      setError("리뷰를 제출하는 중에 오류가 발생했습니다.");
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedMusical("");
    fetchMusicals(categoryId);
  };

  return (
    <div className="flex">
      <div className="w-1/2 pr-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">카테고리</label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full p-2 border rounded text-gray-700 bg-white"
            >
              <option value="">카테고리 선택</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">뮤지컬</label>
            <select
              value={selectedMusical}
              onChange={(e) => setSelectedMusical(e.target.value)}
              className="w-full p-2 border rounded text-gray-700 bg-white"
            >
              <option value="">뮤지컬 선택</option>
              {musicals.map((musical) => (
                <option key={musical.id} value={musical.id}>
                  {musical.title}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded text-gray-700 bg-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
      <div className="w-1/2 pl-4"></div>
    </div>
  );
};

export default ReviewForm;
