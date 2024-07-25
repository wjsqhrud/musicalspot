import React from "react";
import { Musical } from "./CreateReviewType";

interface MusicalPreviewProps {
  musical: Musical | null;
}

const MusicalPreview: React.FC<MusicalPreviewProps> = ({ musical }) => {
  if (!musical) return null;

  return (
    <div>
      <h3 className="text-xl font-bold mb-2">{musical.title}</h3>
      <img
        src={musical.imageUrl}
        alt={musical.title}
        className="w-full h-64 object-cover mb-4"
      />
      <p>{musical.description}</p>
    </div>
  );
};

export default MusicalPreview;
