// ContentInput.tsx
import React, { useState } from "react";

interface ContentInputProps {
  minLength: number;
  maxLength: number;
  placeholder: string;
  onSubmit: (content: string) => void;
  isTextArea?: boolean;
  textAreaHeight: string;
}

export const ContentInput: React.FC<ContentInputProps> = ({
  minLength,
  maxLength,
  placeholder,
  onSubmit,
  isTextArea = false,
  textAreaHeight,
}) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newContent = e.target.value;
    if (newContent.length <= maxLength) {
      setContent(newContent);
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.length < minLength) {
      setError(`최소 ${minLength}자 이상 입력해주세요.`);
    } else {
      onSubmit(content);
      setContent("");
    }
  };

  const InputComponent = isTextArea ? "textarea" : "input";

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <InputComponent
          value={content}
          onChange={handleContentChange}
          placeholder={placeholder}
          className="w-full p-2 border rounded text-gray-700 bg-white no-scrollbar"
          rows={isTextArea ? 5 : undefined}
          style={{ height: isTextArea ? textAreaHeight : "auto" }}
        />
        <span className="absolute bottom-2 right-2 text-sm text-gray-500">
          {content.length}/{maxLength}
        </span>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        제출
      </button>
    </form>
  );
};
