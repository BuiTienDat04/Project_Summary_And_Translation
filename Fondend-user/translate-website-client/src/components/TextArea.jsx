// src/components/TextArea.js
import React from 'react';

const TextArea = ({ value, onChange, placeholder, maxWords }) => {
  // Hàm đếm số từ
  const countWords = (text) => {
    if (!text.trim()) return 0; // Nếu text rỗng, trả về 0
    return text.trim().split(/\s+/).length; // Tách chuỗi dựa trên khoảng trắng và đếm
  };

  const wordCount = countWords(value); // Đếm số từ hiện tại
  const isOverLimit = wordCount > maxWords;

  // Xử lý thay đổi giá trị
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const words = countWords(inputValue);

    // Nếu số từ <= giới hạn, cập nhật giá trị
    if (words <= maxWords) {
      onChange(e);
    }
  };

  return (
    <div>
      <textarea
        className={`w-full p-4 border-2 ${
          isOverLimit ? 'border-red-500' : 'border-gray-300'
        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        rows="6"
      />
      <div className="mt-2 text-sm text-gray-600">
        Số từ: {wordCount}/{maxWords}
        {isOverLimit && (
          <span className="ml-2 text-red-500">(Đã vượt quá giới hạn)</span>
        )}
      </div>
    </div>
  );
};

export default TextArea;