import React, { useState, useEffect } from "react";
import { Category, Musical } from "./CreateReviewType";
import { categoryList, categoryMusical } from "services/musical/musicalService";

interface MusicalSelectorProps {
  onMusicalSelect: (musicalId: string) => void;
}

const MusicalSelector: React.FC<MusicalSelectorProps> = ({
  onMusicalSelect,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [musicals, setMusicals] = useState<Musical[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedMusical, setSelectedMusical] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | undefined>();

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
    }
  };

  const fetchMusicals = async (categoryId: string) => {
    try {
      const result = await categoryMusical(categoryId);
      setMusicals(result.data);
      console.log("Fetched Musicals:", result.data);
    } catch (error) {
      console.error("Error fetching musicals:", error);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setSelectedMusical("");
    setSelectedImage(undefined);
  };

  const handleMusicalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedMusical(selectedId);
    onMusicalSelect(selectedId);
    console.log("Selected Musical ID:", selectedId);

    const selectedMusicalData = musicals.find((v) => v.id === selectedId);
    setSelectedImage(selectedMusicalData?.imageUrl);
    console.log("Selected Image URL:", selectedMusicalData?.imageUrl);
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
            <option key={category.id} value={category.id}>
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
            <option key={musical.id} value={musical.id}>
              {musical.title}
            </option>
          ))}
        </select>

        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected Musical"
            className="w-full h-64 object-cover rounded mt-4"
          />
        )}
      </div>
    </>
  );
};

export default MusicalSelector;
