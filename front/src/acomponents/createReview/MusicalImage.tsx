import { Musical } from "./CreateReviewType";

interface MusicalPreviewProps {
  musical: Musical | null | undefined;
}

const MusicalPreview: React.FC<MusicalPreviewProps> = ({ musical }) => {
  if (!musical) return null;

  return (
    <div className="mt-4">
      <img
        src={musical.imageUrl}
        alt={musical.title}
        className="w-full h-64 object-cover rounded"
      />
      <p className="mt-2 text-sm text-gray-600">{musical.title}</p>
    </div>
  );
};
export default MusicalPreview;
