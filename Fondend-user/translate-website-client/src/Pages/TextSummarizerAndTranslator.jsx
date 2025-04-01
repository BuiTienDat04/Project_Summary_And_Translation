import React, { useState, useEffect } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import ChatBox from "../Pages/ChatBox";
import { API_BASE_URL } from "../api/api";

const TextSummarizerAndTranslator = ({ loggedInUser }) => {
    const [text, setText] = useState("");
    const [summary, setSummary] = useState("");
    const [translation, setTranslation] = useState("");
    const [targetLang, setTargetLang] = useState("en");
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [error, setError] = useState("");
    const [charCount, setCharCount] = useState(0);
    const [loginPromptVisible, setLoginPromptVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading
    const maxCharLimit = 10000;


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

    useEffect(() => {
        setCharCount(text.length);
    }, [text]);

    const cleanText = (text) => {
        return text
            .replace(/[^\w\s.,!?]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    };

    const handleSummarize = async () => {
        if (!loggedInUser) {
            setLoginPromptVisible(true);
            return;
        }
        if (!text) {
            setError("Vui lòng nhập văn bản trước khi tạo tóm tắt.");
            return;
        }
    
        setIsLoading(true);
        setError(null);
    
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
    
        try {
            const token = localStorage.getItem("token"); // Lấy token từ localStorage
            const response = await fetch(`${API_BASE_URL}/summarize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "", // Thêm header Authorization
                },
                body: JSON.stringify({ text }),
                signal: controller.signal,
            });
    
            clearTimeout(timeoutId);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Lỗi khi tóm tắt văn bản.");
            }
    
            const data = await response.json();
            setSummary(data.summary || "Không thể tóm tắt nội dung.");
            setError(null);
        } catch (err) {
            setError(err.name === "AbortError" ? "Yêu cầu quá thời gian." : err.message);
            console.error("Lỗi handleSummarize:", err);
        } finally {
            setIsLoading(false);
        }
    };  

    

    const handleLanguageSelect = (code, name) => {
        setTargetLang(code);
        setSearchTerm(name);
        setIsDropdownOpen(false);
    };

    // Nội dung gửi đến ChatBox
    const textSummarizerContent = `Original Text: ${text}\nSummary: ${summary}\nTranslation (${languages.find(lang => lang.code === targetLang)?.name || 'Unknown'}): ${translation}`;

    return (
        <div className="max-w-7xl mx-auto p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Column */}
                <section className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold text-gray-800 flex-grow">Text Summarizer & Translator</h2>
                        {(text || error) && (
                            <button
                                onClick={() => {
                                    setText("");
                                    setError("");
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
                        maxLength={maxCharLimit}
                    />

                    <button
                        className={`w-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={handleSummarize}
                        disabled={isLoading}
                    >
                        {isLoading ? "Processing..." : "Generate Summary"}
                    </button>
                    {error && <p className="text-red-500">{error}</p>}
                </section>

                {/* Output Column */}
                <section className="space-y-6 p-6 bg-gray-50 rounded-2xl border-2 border-gray-100 shadow-inner">
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

                    {summary && (
                        <div className="space-y-6">
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
                                        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)}
                                    />
                                </div>
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
                                className={`w-full bg-gradient-to-br from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={handleTranslate}
                                disabled={isLoading}
                            >
                                {isLoading ? "Translating..." : "Translate Now"}
                            </button>

                            {translation && (
                                <article className="bg-white rounded-xl border-2 border-gray-200 p-5 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Translation ({languages.find(lang => lang.code === targetLang)?.name || "Unknown"})
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


                    {isLoading && !error && (
                        <div className="text-center">
                            <svg className="animate-spin h-5 w-5 text-gray-600 inline-block mr-2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            </svg>
                            <p className="text-gray-600 inline">Processing...</p>
                        </div>
                    )}
                </section>
            </div>

            {/* Truyền dữ liệu vào ChatBox */}
            <ChatBox textSummarizerContent={textSummarizerContent} loggedInUser={loggedInUser} />
        </div>
    );
};

export default TextSummarizerAndTranslator;