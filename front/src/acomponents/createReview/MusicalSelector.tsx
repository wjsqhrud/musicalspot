import React, { useState, useEffect } from "react";
import { Category, Musical } from "./CreateReviewType";
import { categoryList, categoryMusical } from "services/musical/musicalService";

interface MusicalSelectorProps {
  onMusicalSelect: (musicalId: string, imageUrl?: string) => void;
}

const MusicalSelector: React.FC<MusicalSelectorProps> = ({
  onMusicalSelect,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [musicals, setMusicals] = useState<Musical[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedMusical, setSelectedMusical] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchMusicals(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const result = await categoryList();
      setCategories(result.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("카테고리를 불러오는데 실패했습니다.");
    }
  };

  const fetchMusicals = async (categoryId: string) => {
    try {
      const result = await categoryMusical(categoryId);
      if (result.code === "SU") {
        setMusicals(result.data);
        setError(null);
      } else if (result.code === "NF") {
        setMusicals([]);
        setError("해당 카테고리에 뮤지컬이 없습니다.");
      }
    } catch (error) {
      console.error("Error fetching musicals:", error);
      setError("뮤지컬 목록을 불러오는데 실패했습니다.");
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setSelectedMusical("");
    onMusicalSelect("", undefined);
  };

  const handleMusicalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedMusical(selectedId);
    const selectedMusicalData = musicals.find((v) => v.id.toString() === selectedId);
    onMusicalSelect(selectedId, selectedMusicalData?.imageUrl);
  };

  return (
    <>
      <div className="mb-4">
        <label className="block mb-2 text-gray-700">카테고리</label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full p-2 border rounded text-gray-700 bg-white"
        >
          <option value="">카테고리 선택</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id.toString()}>
              {category.category}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-gray-700">뮤지컬</label>
        <select
          value={selectedMusical}
          onChange={handleMusicalChange}
          className="w-full p-2 border rounded text-gray-700 bg-white"
        >
          <option value="">뮤지컬 선택</option>
          {musicals.map((musical) => (
            <option key={musical.id} value={musical.id.toString()}>
              {musical.title}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
};

export default MusicalSelector;