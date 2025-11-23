import React, { useState, useEffect } from "react";
import { FaSignInAlt, FaCopy, FaDownload } from "react-icons/fa";
import { Trash2, Globe, Sparkles } from "lucide-react";
import api from "../api/api";
import HistorySummary from "./HistorySummary";

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
    const [isSummarizing, setIsSummarizing] = useState(false); // Riêng cho tóm tắt
    const [isTranslating, setIsTranslating] = useState(false); // Riêng cho dịch
    const maxCharLimit = 20000;

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

    const handleSummarize = async () => {
        const token = localStorage.getItem("token");
        if (!loggedInUser || !token) {
            setLoginPromptVisible(true);
            return;
        }
        if (!text.trim()) {
            setError("Please enter text before summarizing.");
            return;
        }

        setIsSummarizing(true);
        setError("");

        try {
            const { data } = await api.post(
                "/summarize",
                { text },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSummary(data.summary || "Unable to summarize content.");
        } catch (err) {
            const msg = err.response?.data?.error || err.message;
            if (msg.includes("429")) {
                setError("Too many requests. Please wait 60 seconds and try again.");
            } else if (msg.includes("Text quá ngắn")) {
                setError("Text is too short.");
            } else {
                setError(msg);
            }
            console.error("Summarize error:", err);
        } finally {
            setIsSummarizing(false);
        }
    };

    const handleTranslate = async () => {
        const token = localStorage.getItem("token");
        if (!loggedInUser || !token) {
            setLoginPromptVisible(true);
            return;
        }
        if (!summary) {
            setError("Vui lòng tóm tắt văn bản trước khi dịch.");
            return;
        }
        if (!targetLang) {
            setError("Vui lòng chọn ngôn ngữ đích.");
            return;
        }

        setIsTranslating(true);
        setError("");

        try {
            const { data } = await api.post(
                "/translate",
                { text: summary, targetLang }, // Đảm bảo gửi summary
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setTranslation(data.translation || "Không thể dịch văn bản.");
            // Hiển thị thông báo thành công
            alert("Đã dịch bản tóm tắt sang " + languages.find(l => l.code === targetLang)?.name || targetLang);
        } catch (err) {
            const msg = err.response?.data?.error || err.message;
            if (msg.includes("429")) {
                setError("Quá nhiều yêu cầu dịch. Vui lòng chờ 60 giây.");
            } else {
                setError(msg);
            }
            console.error("Lỗi dịch:", err);
        } finally {
            setIsTranslating(false);
        }
    };


    const handleLanguageSelect = (code, name) => {
        setTargetLang(code);
        setSearchTerm(name);
        setIsDropdownOpen(false);
    };

    const copyToClipboard = (content) => {
        navigator.clipboard.writeText(content);
        alert("Copied to clipboard!");
    };

    const downloadText = (content, filename) => {
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-10">
                {/* Header */}

                {/* History Summary */}
                <div className="mb-4 sm:mb-6">
                    <HistorySummary />
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* === INPUT SECTION === */}
                    <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-5 sm:p-7 flex flex-col min-h-[600px] lg:min-h-[700px]">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
                                <Sparkles className="w-8 h-8 text-indigo-600" />
                                Enter Text
                            </h2>
                            {(text || summary || translation) && (
                                <button
                                    onClick={() => {
                                        setText("");
                                        setSummary("");
                                        setTranslation("");
                                        setError("");
                                    }}
                                    className="p-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-300 group shadow-md hover:shadow-lg"
                                    title="Clear All"
                                >
                                    <Trash2 className="w-7 h-7 group-hover:scale-110 transition-transform" />
                                </button>
                            )}
                        </div>

                        {/* Character Counter */}
                        <div className="mb-4 flex justify-between items-center text-sm sm:text-base">
                            <span className="text-gray-500 font-medium">Text Length</span>
                            <div className="flex items-center gap-2">
                                <span className={`font-bold ${charCount > maxCharLimit * 0.9 ? "text-red-600" : "text-gray-700"}`}>
                                    {charCount.toLocaleString()}
                                </span>
                                <span className="text-gray-400">/ {maxCharLimit.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-5 overflow-hidden shadow-inner">
                            <div
                                className={`h-full transition-all duration-500 rounded-full ${charCount > maxCharLimit * 0.9 ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-blue-500 to-indigo-600"}`}
                                style={{ width: `${Math.min((charCount / maxCharLimit) * 100, 100)}%` }}
                            />
                        </div>

                        {/* TEXTAREA */}
                        <textarea
                            className="flex-1 w-full p-5 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 placeholder-gray-400 resize-none text-base shadow-inner bg-gray-50/70 font-medium overflow-y-auto"
                            placeholder="Paste or type text to summarize..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            maxLength={maxCharLimit}
                        />

                        <button
                            onClick={handleSummarize}
                            disabled={isSummarizing || !text.trim()}
                            className={`mt-5 w-full bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white font-bold px-6 py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 text-lg disabled:opacity-60 disabled:cursor-not-allowed`}
                        >
                            {isSummarizing ? (
                                <>
                                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" className="opacity-30" />
                                        <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" className="opacity-75" />
                                    </svg>
                                    Summarizing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-6 h-6" />
                                    Generate Summary
                                </>
                            )}
                        </button>

                        {error && (
                            <p className="mt-4 text-red-600 font-medium text-center bg-red-50 py-3 rounded-2xl text-sm shadow-md">
                                {error}
                            </p>
                        )}
                    </div>

                    {/* === OUTPUT SECTION === */}
                    {/* === OUTPUT SECTION === */}
                    {/* === OUTPUT SECTION === */}
                    <div className="flex flex-col gap-6">
                        {/* Summary Card */}
                        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-5 sm:p-7 flex flex-col min-h-[500px] max-h-[600px]">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-3">
                                    <div className="p-2.5 bg-green-100 rounded-2xl shadow-md">
                                        <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 0 002-2M9 5a2 2 0 012-2h2a2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M6 15h.01M6 11h.01M9 11h.01M9 15h.01" />
                                        </svg>
                                    </div>
                                    Summary
                                </h3>
                                {summary && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                                            {summary.length} chars
                                        </span>
                                        <button
                                            onClick={() => copyToClipboard(summary)}
                                            className="p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-all duration-300 group shadow-md hover:shadow-lg"
                                            title="Copy"
                                        >
                                            <FaCopy className="w-7 h-7 group-hover:scale-110 transition-transform" />
                                        </button>
                                        <button
                                            onClick={() => downloadText(summary, `summary.txt`)}
                                            className="p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-all duration-300 group shadow-md hover:shadow-lg"
                                            title="Download"
                                        >
                                            <FaDownload className="w-7 h-7 group-hover:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200 overflow-y-auto shadow-inner">
                                {isSummarizing ? (
                                    <div className="space-y-4">
                                        <div className="h-5 bg-gray-300 rounded-full animate-pulse w-full"></div>
                                        <div className="h-5 bg-gray-300 rounded-full animate-pulse w-11/12"></div>
                                        <div className="h-5 bg-gray-300 rounded-full animate-pulse w-10/12"></div>
                                        <div className="h-5 bg-gray-300 rounded-full animate-pulse w-9/12"></div>
                                    </div>
                                ) : (
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base font-medium">
                                        {summary || "Summary will appear here after processing..."}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Translation Card */}
                        {summary && (
                            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-5 sm:p-7 flex flex-col min-h-[500px] max-h-[600px]">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-3">
                                        <Globe className="w-8 h-8 text-purple-600" />
                                        Translate To
                                    </h3>
                                </div>

                                <div className="relative mb-5">
                                    <div className="flex items-center border-2 border-purple-200 bg-white rounded-2xl shadow-md overflow-hidden">
                                        <Globe className="w-6 h-6 text-purple-600 ml-4" />
                                        <input
                                            type="text"
                                            className="w-full p-4 pl-3 bg-transparent placeholder-gray-400 focus:outline-none text-base font-medium"
                                            placeholder="Search language..."
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setIsDropdownOpen(true);
                                            }}
                                            onFocus={() => setIsDropdownOpen(true)}
                                        />
                                    </div>
                                    {isDropdownOpen && (
                                        <div className="absolute z-20 mt-2 w-full bg-white border border-purple-200 rounded-2xl shadow-2xl max-h-64 overflow-y-auto">
                                            {filteredLanguages.map((lang) => (
                                                <div
                                                    key={lang.code}
                                                    onClick={() => handleLanguageSelect(lang.code, lang.name)}
                                                    className="px-5 py-3 hover:bg-purple-50 cursor-pointer transition-colors flex items-center justify-between text-base"
                                                >
                                                    <span className="font-medium text-gray-800">{lang.name}</span>
                                                    {targetLang === lang.code && (
                                                        <div className="w-2.5 h-2.5 bg-purple-600 rounded-full"></div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleTranslate}
                                    disabled={isTranslating || !targetLang}
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-6 py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isTranslating ? (
                                        <>
                                            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" className="opacity-30" />
                                                <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" className="opacity-75" />
                                            </svg>
                                            Translating...
                                        </>
                                    ) : (
                                        "Translate Now"
                                    )}
                                </button>

                                {translation && (
                                    <div className="mt-5 flex-1 flex flex-col min-h-0">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-bold text-gray-800 text-lg">
                                                {languages.find(l => l.code === targetLang)?.name || "Unknown"}
                                            </h4>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => copyToClipboard(translation)}
                                                    className="p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-all duration-300 group shadow-md hover:shadow-lg"
                                                    title="Copy"
                                                >
                                                    <FaCopy className="w-7 h-7 group-hover:scale-110 transition-transform" />
                                                </button>
                                                <button
                                                    onClick={() => downloadText(translation, `translation_${targetLang}.txt`)}
                                                    className="p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-all duration-300 group shadow-md hover:shadow-lg"
                                                    title="Download"
                                                >
                                                    <FaDownload className="w-7 h-7 group-hover:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-200 overflow-y-auto shadow-inner">
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base font-medium">
                                                {translation}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Login Prompt */}
                {loginPromptVisible && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/50">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h3>
                            <p className="text-gray-600 mb-6">Please log in to use summarization and translation features.</p>
                            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                                <FaSignInAlt className="w-6 h-6" />
                                Login Now
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TextSummarizerAndTranslator;