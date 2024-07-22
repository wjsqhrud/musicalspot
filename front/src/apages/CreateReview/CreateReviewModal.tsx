import React, { useState, useEffect } from "react";
import { createReview } from "services/review/reviewService";
import { categoryList, categoryMusical } from "services/musical/musicalService";

interface CreateReviewModalProps {
  onClose: () => void;
  onReviewCreated: () => void;
}

interface Category {
  id: string;
  name: string;
}

interface Musical {
  id: string;
  title: string;
  imageUrl: string;
}

const CreateReviewModal: React.FC<CreateReviewModalProps> = ({
  onClose,
  onReviewCreated,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedMusicalId, setSelectedMusicalId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [musicals, setMusicals] = useState<Musical[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchMusicals(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await categoryList();
      if (response.code === "SU") {
        setCategories(response.data);
      } else {
        setError("카테고리 목록을 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("카테고리 목록 로딩 중 오류 발생:", error);
      setError("카테고리 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMusicals = async (categoryId: string) => {
    setIsLoading(true);
    try {
      const response = await categoryMusical(categoryId);
      if (response.code === "SU") {
        setMusicals(response.data);
      } else {
        setError("뮤지컬 목록을 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("뮤지컬 목록 로딩 중 오류 발생:", error);
      setError("뮤지컬 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title || !content || !selectedMusicalId) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    try {
      await createReview(title, content, selectedMusicalId);
      onReviewCreated();
    } catch (error) {
      console.error("리뷰 작성 중 오류 발생:", error);
      setError("리뷰 작성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  const selectedMusical = musicals.find(m => m.id === selectedMusicalId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full flex">
        <div className="w-1/3 pr-4">
          {selectedMusical && (
            <img
              src={selectedMusical.imageUrl}
              alt={selectedMusical.title}
              className="w-full h-auto rounded-lg"
            />
          )}
        </div>
        <div className="w-2/3">
          <h2 className="text-2xl font-bold mb-4">리뷰 작성</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="category" className="block mb-2">
                카테고리 선택
              </label>
              <select
                id="category"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">카테고리를 선택해주세요</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="musical" className="block mb-2">
                뮤지컬 선택
              </label>
              <select
                id="musical"
                value={selectedMusicalId}
                onChange={(e) => setSelectedMusicalId(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">뮤지컬을 선택해주세요</option>
                {musicals.map((musical) => (
                  <option key={musical.id} value={musical.id}>
                    {musical.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="title" className="block mb-2">
                제목
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="block mb-2">
                내용
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 border rounded h-40"
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2 hover:bg-gray-400"
              >
                취소
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                작성
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateReviewModal;