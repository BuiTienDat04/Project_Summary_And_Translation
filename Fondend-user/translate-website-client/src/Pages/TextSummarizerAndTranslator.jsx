import React, { useState, useEffect } from "react";

const TextSummarizerAndTranslator = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [translation, setTranslation] = useState("");
  const [targetLang, setTargetLang] = useState("en");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0); // Thêm state để đếm ký tự
  const maxCharLimit = 1000; // Giới hạn 1000 ký tự

  const languages = [
    { code: "en", name: "English" },
    { code: "vi", name: "Vietnamese" },
    { code: "fr", name: "French" },
    { code: "es", name: "Spanish" },
    { code: "de", name: "German" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "ru", name: "Russian" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
    { code: "tr", name: "Turkish" },
    { code: "nl", name: "Dutch" },
    { code: "pl", name: "Polish" },
    { code: "th", name: "Thai" },
    { code: "sv", name: "Swedish" },
    { code: "fi", name: "Finnish" },
    { code: "no", name: "Norwegian" },
  ];

  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset summary and translation when text is cleared
  useEffect(() => {
    if (!text) {
      setSummary("");
      setTranslation("");
      setError("");
    }
  }, [text]);

  // Cập nhật số ký tự khi text thay đổi
  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  // Handle text summarization
  const handleSummarize = async () => {
    if (!text) {
      setError("Please enter text to summarize.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setSummary(data.summary);
      setError("");
    } catch (error) {
      console.error("Error summarizing text:", error);
      setError("Error summarizing text. Please try again.");
    }
  };

  // Handle text translation
  const handleTranslate = async () => {
    if (!summary || !targetLang) {
      setError("Please summarize the text first and select a target language.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: summary, targetLang }),
      });
      const data = await response.json();
      setTranslation(data.translation);
      setError("");
    } catch (error) {
      console.error("Error translating text:", error);
      setError("Error translating text. Please try again.");
    }
  };

  // Handle language selection
  const handleLanguageSelect = (code, name) => {
    setTargetLang(code);
    setSearchTerm(name);
    setIsDropdownOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Column - Glassmorphism effect */}
        <section className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Text Summarizer & Translator</h2>
          <textarea
            className="w-full p-5 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 placeholder-gray-400 resize-none text-lg shadow-sm"
            rows="10"
            placeholder="Enter text to summarize and translate..."
            value={text}
            onChange={(e) => {
              if (e.target.value.length <= maxCharLimit) {
                setText(e.target.value);
              }
            }}
            maxLength={maxCharLimit} // Giới hạn ký tự
          />
          {/* Hiển thị số ký tự còn lại */}
          <div className="text-sm text-gray-500 text-right">
            {charCount}/{maxCharLimit} characters
          </div>

          <button
            className="w-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg"
            onClick={handleSummarize}
          >
            Generate Summary
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </section>

        {/* Output Column - Depth and clear separation */}
        <section className="space-y-6 p-6 bg-gray-50 rounded-2xl border-2 border-gray-100 shadow-inner">
          {/* Summary Section */}
          <article className="bg-white rounded-xl border-2 border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M6 15h.01M6 11h.01M9 11h.01M9 15h.01" />
                </svg>
                Summary
              </h3>
              {summary && <span className="text-sm text-gray-500 font-medium">{summary.length} chars</span>}
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <textarea
                className="w-full min-h-[180px] bg-transparent focus:outline-none resize-none text-gray-700 placeholder-gray-400 text-md"
                value={summary || ""}
                placeholder="✨ Your summary will appear here..."
                readOnly
              />
            </div>
          </article>

          {/* Translation Section */}
          {summary && (
            <div className="space-y-6">
              {/* Language selector */}
              <div className="relative">
                <div className="flex items-center border-2 border-emerald-200 bg-white rounded-xl pr-3 shadow-sm">
                  <input
                    type="text"
                    className="w-full p-4 bg-transparent placeholder-gray-400 focus:outline-none text-lg"
                    placeholder="Search language..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)} // Delay blur to allow click
                  />
                </div>
                {/* Dropdown menu */}
                {isDropdownOpen && filteredLanguages.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-emerald-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredLanguages.map((lang) => (
                      <li
                        key={lang.code}
                        className="px-4 py-2 hover:bg-emerald-100 cursor-pointer"
                        onClick={() => handleLanguageSelect(lang.code, lang.name)}
                      >
                        {lang.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                className="w-full bg-gradient-to-br from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg"
                onClick={handleTranslate}
              >
                Translate Now
              </button>

              {translation && (
                <article className="bg-white rounded-xl border-2 border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Translation ({languages.find(lang => lang.code === targetLang)?.name || 'Unknown'})
                    </h3>
                    <span className="text-sm text-gray-500 font-medium">{translation.length} chars</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <textarea
                      className="w-full min-h-[180px] bg-transparent focus:outline-none resize-none text-gray-700 text-md"
                      value={translation}
                      placeholder="✨ Your translation will appear here..."
                      readOnly
                    />
                  </div>
                </article>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TextSummarizerAndTranslator;