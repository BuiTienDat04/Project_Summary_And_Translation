import React, { useState } from "react";

const TextTranslator = () => {
  const [text, setText] = useState("");
  const [targetLang, setTargetLang] = useState("en");
  const [translation, setTranslation] = useState("");
  const [error, setError] = useState("");

  const languages = [
    { code: "en", name: "English" },
    { code: "vi", name: "Tiếng Việt" },
    { code: "fr", name: "French" },
    { code: "es", name: "Spanish" },
    { code: "de", name: "German" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
  ];

  const handleTranslate = async () => {
    if (!text || !targetLang) {
      setError("Vui lòng nhập văn bản và chọn ngôn ngữ đích.");
      return;
    }

    if (targetLang === "vi") {
      setError("Không thể dịch sang cùng ngôn ngữ (tiếng Việt). Vui lòng chọn ngôn ngữ khác.");
      return;
    }

    setError("");

    try {
      const response = await fetch("http://localhost:3000/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang }),
      });
      const data = await response.json();
      setTranslation(data.translation);
    } catch (error) {
      console.error("Lỗi khi dịch văn bản:", error);
      setError("Lỗi khi dịch văn bản. Vui lòng thử lại.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Dịch Văn Bản</h2>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="5"
        placeholder="Nhập văn bản cần dịch..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <select
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={targetLang}
        onChange={(e) => setTargetLang(e.target.value)}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      <button
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        onClick={handleTranslate}
      >
        Dịch
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {translation && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Bản dịch:</h3>
          <p className="text-gray-600">{translation}</p>
        </div>
      )}
    </div>
  );
};

export default TextTranslator;