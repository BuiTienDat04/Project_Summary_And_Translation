import React, { useState, useEffect } from "react";

const TextSummarizerAndTranslator = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [translation, setTranslation] = useState("");
  const [targetLang, setTargetLang] = useState("en");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState("");

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
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 max-w-6xl mx-auto">
      {/* Header với icon */}
      <header className="text-center mb-8 space-y-2">
        <h2 className="text-2xl font-bold text-gray-800 inline-flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
          </svg>
          Summarize & Translate
        </h2>
        <p className="text-gray-500">Paste your text and get instant results</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Column */}
        <section className="space-y-5">
          <textarea
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 placeholder-gray-400 resize-none"
            rows="8"
            placeholder="Enter your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            onClick={handleSummarize}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd"/>
            </svg>
            Generate Summary
          </button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          )}
        </section>

        {/* Output Column */}
        <section className="space-y-5">
          {/* Summary Section */}
          <article className="bg-gray-50 rounded-xl border-2 border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H6zm4 11a1 1 0 11-2 0 1 1 0 012 0zm0-4a1 1 0 11-2 0 1 1 0 012 0zm0-4a1 1 0 11-2 0 1 1 0 012 0z"/>
                </svg>
                Summary
              </h3>
              {summary && <span className="text-sm text-gray-500">{summary.length} characters</span>}
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <textarea
                className="w-full min-h-[150px] bg-transparent focus:outline-none resize-none text-gray-700 placeholder-gray-400"
                value={summary || ""}
                placeholder="Your summary will appear here..."
                readOnly
              />
            </div>
          </article>

          {/* Translation Section */}
          {summary && (
            <div className="space-y-5">
              <div className="relative">
                <div className="flex items-center border-2 border-gray-200 bg-white rounded-xl pr-2">
                  <input
                    type="text"
                    className="w-full p-3 bg-transparent placeholder-gray-400 focus:outline-none"
                    placeholder="Search language..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                  />
                  <button
                    className="text-gray-400 hover:text-blue-500 transition-colors p-2"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {filteredLanguages.map((lang) => (
                      <div
                        key={lang.code}
                        className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                        onClick={() => handleLanguageSelect(lang.code, lang.name)}
                      >
                        <span className="text-sm font-medium text-gray-500 w-8">🌐</span>
                        <span className="flex-1">{lang.name}</span>
                        <span className="text-xs text-gray-400 uppercase">{lang.code}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="w-full bg-gradient-to-br from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                onClick={handleTranslate}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026A1 1 0 1110 13H8v-1a1 1 0 10-2 0v1H5a1 1 0 110-2h.463A17.11 17.11 0 018 5.998 17.15 17.15 0 0110 8a16.71 16.71 0 011.89.518 1 1 0 11-.219 1.962c-.4-.1-.809-.151-1.219-.152a19.027 19.027 0 00-1.188 3.028c.346.022.693.034 1.041.034 2.225 0 4.34-.584 6.256-1.632a1 1 0 111.008 1.723A12.938 12.938 0 0110 16c-2.169 0-4.206-.553-6-1.5V15a1 1 0 11-2 0v-2a1 1 0 011-1h1a1 1 0 100-2H7V3a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
                Translate Now
              </button>

              {translation && (
                <article className="bg-gray-50 rounded-xl border-2 border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm3.5 2.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm5.585 5.832a.809.809 0 01-.113.178l-3 4a1 1 0 01-1.493-1.114l1.25-5a1 1 0 01.89-.746l2.906-.291a.81.81 0 01.11 1.623l-2.906.291-.75 3z"/>
                      </svg>
                      Translation
                    </h3>
                    <span className="text-sm text-gray-500">{translation.length} characters</span>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-3">
                    <textarea
                      className="w-full min-h-[150px] bg-transparent focus:outline-none resize-none text-gray-700"
                      value={translation}
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