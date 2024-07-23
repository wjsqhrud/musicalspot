import React, { useState, useEffect } from 'react';
import { categoryMusical } from 'services/musical/musicalService';

interface Musical {
  id: string;
  title: string;
  imageUrl: string;
}

interface MusicalListProps {
  categoryId: string;
  onMusicalSelect: (musicalId: string) => void;
}

const MusicalList: React.FC<MusicalListProps> = ({ categoryId, onMusicalSelect }) => {
  const [musicals, setMusicals] = useState<Musical[]>([]);

  useEffect(() => {
    if (categoryId) {
      fetchMusicals();
    }
  }, [categoryId]);

  const fetchMusicals = async () => {
    try {
      const data = await categoryMusical(categoryId);
      setMusicals(data);
    } catch (error) {
      console.error('뮤지컬 목록 로딩 중 오류 발생:', error);
    }
  };

  return (
    <div className="musical-list">
      <h3>뮤지컬 목록</h3>
      <ul>
        {musicals.map(musical => (
          <li key={musical.id} onClick={() => onMusicalSelect(musical.id)}>
            <img src={musical.imageUrl} alt={musical.title} />
            <p>{musical.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MusicalList;