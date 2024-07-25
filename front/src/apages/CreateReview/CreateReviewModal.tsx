// CreateReviewModal.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { createReview } from "services/review/reviewService";
import {
  categoryList,
  categoryMusical,
  musicalDetails,
} from "services/musical/musicalService";
import { getCookie } from "utils/CookieUtil/cookieUtis";
import Modal from "acomponents/review/Modal";

interface CreateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateReviewModal: React.FC<CreateReviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [musicals, setMusicals] = useState<any[]>([]);
  const [selectedMusical, setSelectedMusical] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = (): boolean => {
    return !!getCookie("accessToken");
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const result = await categoryList();
      setCategories(result.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("카테고리를 불러오는 중에 오류가 발생했습니다.");
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

  const fetchMusicalDetails = async (musicalId: string) => {
    try {
      const result = await musicalDetails(musicalId);
      setSelectedMusical(result.data);
    } catch (error) {
      console.error("Error fetching musical details:", error);
      setError("뮤지컬 상세 정보를 불러오는 중에 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMusical) return;

    setLoading(true);
    try {
      await createReview(title, content, selectedMusical.id.toString());
      setLoading(false);
      onClose();
    } catch (error) {
      console.error("Error creating review:", error);
      setLoading(false);
      setError("리뷰를 작성하는 중에 오류가 발생했습니다.");
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedMusical(null);
    fetchMusicals(categoryId);
  };

  const handleMusicalChange = (musicalId: string) => {
    setSelectedMusical(musicals.find((m) => m.id.toString() === musicalId));
    fetchMusicalDetails(musicalId);
  };

  if (!isLoggedIn()) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex">
        <div className="w-1/2 pr-4">
          <h2 className="text-2xl font-bold mb-4">리뷰 작성</h2>
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
                  <option
                    key={category.id}
                    value={category.id}
                    className="text-gray-700"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700">뮤지컬</label>
              <select
                value={selectedMusical?.id || ""}
                onChange={(e) => handleMusicalChange(e.target.value)}
                className="w-full p-2 border rounded text-gray-700 bg-white"
              >
                <option value="">뮤지컬 선택</option>
                {musicals.map((musical) => (
                  <option
                    key={musical.id}
                    value={musical.id}
                    className="text-gray-700"
                  >
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
              {loading ? "작성 중..." : "리뷰 작성"}
            </button>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
        <div className="w-1/2 pl-4">
          {selectedMusical && (
            <div>
              <h3 className="text-xl font-bold mb-2">
                {selectedMusical.title}
              </h3>
              <img
                src={selectedMusical.imageUrl}
                alt={selectedMusical.title}
                className="w-full h-64 object-cover mb-4"
              />
              <p>{selectedMusical.description}</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CreateReviewModal;

