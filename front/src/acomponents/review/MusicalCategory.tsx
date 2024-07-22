import React, { useState, useEffect } from 'react';
import { categoryList } from 'services/musical/musicalService';

interface Category {
  id: string;
  name: string;
}

interface MusicalCategoryProps {
  onCategorySelect: (categoryId: string) => void;
}

const MusicalCategory: React.FC<MusicalCategoryProps> = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryList();
      setCategories(data);
    } catch (error) {
      console.error('카테고리 로딩 중 오류 발생:', error);
    }
  };

  return (
    <div className="musical-category">
      <h3>뮤지컬 카테고리</h3>
      <ul>
        {categories.map(category => (
          <li key={category.id} onClick={() => onCategorySelect(category.id)}>
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MusicalCategory;