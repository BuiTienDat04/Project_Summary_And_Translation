import React, { useState, useEffect } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { Trash2 } from 'lucide-react';

const TextSummarizerAndTranslator = ({ loggedInUser  }) => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [translation, setTranslation] = useState("");
  const [targetLang, setTargetLang] = useState("en");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState("");

  const [charCount, setCharCount] = useState(0);
  const [loginPromptVisible, setLoginPromptVisible] = useState(false);
  const maxCharLimit = 1000;


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

  useEffect(() => {
    if (!text) {
      setSummary("");
      setTranslation("");
      setError("");
    }
  }, [text]);

  // Handle text summarization

  useEffect(() => {
    setCharCount(text.length);
  }, [text]);


  const handleSummarize = async () => {
    if (!loggedInUser) {
      setLoginPromptVisible(true);
      return;
    }
    if (!text) {
      setError("Please enter text to summarize.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/summarize", {
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

  const handleTranslate = async () => {
    if (!summary || !targetLang) {
      setError("Please summarize the text first and select a target language.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/translate", {
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 flex-grow">Text Summarizer & Translator</h2>
            {(text || error) && (
              <button
                onClick={() => {
                  setText('');    // Xóa text
                  setError('');   // Xóa thông báo lỗi
                  // Thêm các state khác cần xóa ở đây
                }}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Clear all"
              >
                <Trash2 className="w-7 h-7" />
              </button>
            )}
          </div>

          <textarea
            className="w-full p-5 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 placeholder-gray-400 resize-none text-lg shadow-sm"
            rows="10"
            placeholder="Enter text to summarize and translate..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

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
                  {/* Dropdown button - Removed, input field itself is the selector */}
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
                {/* Button icon */}
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

          {/* Login Required Modal */}
          {loginPromptVisible && (
            <div className="fixed inset-0 bg-indigo-100/90 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all scale-95 hover:scale-100 border border-indigo-50 mx-4">
                {/* Header với hiệu ứng gradient */}
                <div className="text-center mb-6 space-y-3">
                  <div className="mx-auto bg-gradient-to-br from-indigo-500 to-blue-500 w-fit p-4 rounded-2xl">
                    <FaSignInAlt className="h-8 w-8 text-white animate-bounce" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                    Welcome Friend!
                  </h2>
                </div>

                {/* Nội dung chính */}
                <div className="space-y-5 text-center">
                  <p className="text-gray-600 text-lg leading-relaxed">
                    To access all features and enjoy a personalized experience, please sign in to your account.
                  </p>

                  {/* Nhóm button */}
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={() => setLoginPromptVisible(false)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl 
            transform transition-all duration-300 hover:scale-105 shadow-md hover:shadow-indigo-200"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TextSummarizerAndTranslator;