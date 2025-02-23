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
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Summarize and Translate Text</h2>

      {/* Grid layout for input and output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column: Input area */}
        <div>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="10"
            placeholder="Enter text to summarize..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>

          {/* Summarize button */}
          <button
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 mb-4"
            onClick={handleSummarize}
          >
            Summarize
          </button>
        </div>

        {/* Right column: Output area */}
        <div>
          {/* Display summary */}
          {summary && (
            <div className="p-4 bg-gray-50 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Summary:</h3>
              <p className="text-gray-600">{summary}</p>
            </div>
          )}

          {/* Translation section */}
          {summary && (
            <>
              <div className="relative mb-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <input
                    type="text"
                    className="w-full p-3 focus:outline-none rounded-lg"
                    placeholder="Search for a language..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                  />
                  <button
                    className="p-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors duration-300"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    ▼
                  </button>
                </div>

                {/* Language dropdown */}
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredLanguages.length > 0 ? (
                      filteredLanguages.map((lang) => (
                        <div
                          key={lang.code}
                          className="p-3 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleLanguageSelect(lang.code, lang.name)}
                        >
                          {lang.name}
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500">No languages found.</div>
                    )}
                  </div>
                )}
              </div>

              {/* Translate button */}
              <button
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 mb-4"
                onClick={handleTranslate}
              >
                Translate
              </button>
            </>
          )}

          {/* Display translation */}
          {translation && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Translation:</h3>
              <p className="text-gray-600">{translation}</p>
            </div>
          )}
        </div>
      </div>

      {/* Display error messages */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default TextSummarizerAndTranslator;