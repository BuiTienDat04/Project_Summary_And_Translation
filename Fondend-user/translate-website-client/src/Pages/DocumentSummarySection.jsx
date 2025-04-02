import { useState, useEffect } from "react";
import { Upload, Download, Trash2 } from "lucide-react";
import ChatBox from "../Pages/ChatBox";
import { API_BASE_URL } from "../api/api";
import nlp from "compromise";

export default function DocumentSummarySection() {
    const [file, setFile] = useState(null);
    const [originalContent, setOriginalContent] = useState("");
    const [summaryContent, setSummaryContent] = useState("");
    const [translatedContent, setTranslatedContent] = useState("");
    const [summaryFile, setSummaryFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [targetLang, setTargetLang] = useState("en");
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

    const availableLanguages = [
        { code: "en", name: "English (United States)" },
        { code: "vi", name: "Vietnamese (Vietnam)" },
        { code: "fr", name: "French (France)" },
        { code: "es", name: "Spanish (Spain)" },
        { code: "de", name: "German (Germany)" },
        { code: "zh", name: "Chinese (Simplified, China)" },
        { code: "ja", name: "Japanese (Japan)" },
        { code: "ko", name: "Korean (South Korea)" },
        { code: "ru", name: "Russian (Russia)" },
        { code: "it", name: "Italian (Italy)" },
        { code: "pt", name: "Portuguese (Portugal)" },
        { code: "ar", name: "Arabic (Standard Arabic)" },
        { code: "hi", name: "Hindi (India)" },
        { code: "tr", name: "Turkish (Turkey)" },
        { code: "nl", name: "Dutch (Netherlands)" },
        { code: "pl", name: "Polish (Poland)" },
        { code: "sv", name: "Swedish (Sweden)" },
        { code: "fi", name: "Finnish (Finland)" },
        { code: "no", name: "Norwegian (Norway)" },
        { code: "da", name: "Danish (Denmark)" },
    ];

    const filteredLanguages = availableLanguages.filter((lang) =>
        lang.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        return () => {
            if (summaryFile) URL.revokeObjectURL(summaryFile);
        };
    }, [summaryFile]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > MAX_FILE_SIZE) {
                setError(`File too large! Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
                return;
            }
            if (selectedFile.type !== "application/pdf") {
                setError("Only PDF files are supported!");
                return;
            }
            setFile(selectedFile);
            setOriginalContent("");
            setSummaryContent("");
            setTranslatedContent("");
            setError(null);
            setSearchTerm("");
            setTargetLang("en");
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragActive(false);
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile) {
            if (droppedFile.size > MAX_FILE_SIZE) {
                setError(`File too large! Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
                return;
            }
            if (droppedFile.type !== "application/pdf") {
                setError("Only PDF files are supported!");
                return;
            }
            setFile(droppedFile);
            setOriginalContent("");
            setSummaryContent("");
            setTranslatedContent("");
            setError(null);
            setSearchTerm("");
            setTargetLang("en");
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setOriginalContent("");
        setSummaryContent("");
        setTranslatedContent("");
        if (summaryFile) URL.revokeObjectURL(summaryFile);
        setSummaryFile(null);
        setError(null);
        setSearchTerm("");
        setTargetLang("en");
    };

    const handleLanguageSelect = (code, name) => {
        setTargetLang(code);
        setSearchTerm(name);
        setIsDropdownOpen(false);
    };

    const cleanText = (text) => {
        return text
            .replace(/[^\w\s.,!?]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    };

    const updateSummaryFile = (content) => {
        if (summaryFile) URL.revokeObjectURL(summaryFile);
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        setSummaryFile(url);
    };

    const generateSummary = async () => {
        if (!file) {
            setError("Please select a file before generating a summary.");
            return;
        }
        setIsLoading(true);
        setError(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: "POST",
                body: formData,
                signal: controller.signal,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            clearTimeout(timeoutId);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error processing file (HTTP ${response.status})`);
            }

            const data = await response.json();
            if (!data.originalText || !data.summary) {
                throw new Error("Backend did not return valid content or summary.");
            }

            // Process summary to keep only the last name part
            let summaryText = data.summary || "Unable to summarize content.";
            const doc = nlp(summaryText);
            const people = doc.people().out("array");

            people.forEach((fullName) => {
                const nameParts = fullName.trim().split(" "); // Tách thành mảng các phần
                const lastName = nameParts[nameParts.length - 1]; // Lấy phần cuối cùng
                const escapedFullName = fullName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                summaryText = summaryText.replace(
                    new RegExp(`\\b${escapedFullName}\\b`, "gi"),
                    lastName
                );
            });

            setOriginalContent(data.originalText || "Unable to extract content.");
            setSummaryContent(summaryText);
            setTranslatedContent("");

            const content = `File Name: ${file.name}\n\nOriginal Text:\n${data.originalText || "No content"}\n\nSummary:\n${summaryText}`;
            updateSummaryFile(content);
        } catch (err) {
            if (err.name === "AbortError") {
                setError("Request timed out. Please try again.");
            } else if (err.message.includes("Failed to fetch")) {
                setError("Unable to connect to server. Check your network or server status.");
            } else {
                setError(err.message);
            }
            console.error("Error in generateSummary:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm loại bỏ dấu tiếng Việt
    function removeVietnameseDiacritics(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
    }

    // Cập nhật trong translateSummary
    const translateSummary = async () => {
        if (!summaryContent || !targetLang) {
            setError("Please summarize the text first and select a target language.");
            return;
        }

        setIsLoading(true);
        setError(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);

        // Loại bỏ dấu cho toàn bộ summaryContent
        let textToTranslate = removeVietnameseDiacritics(summaryContent);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/translate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    text: textToTranslate, // Gửi text đã bỏ dấu
                    targetLang,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Translation failed (HTTP ${response.status})`);
            }

            const data = await response.json();
            console.log("Translation response:", data);

            const translatedText = data.translation || "Unable to translate content.";
            setTranslatedContent(translatedText);

            const translatedLangName = availableLanguages.find((l) => l.code === targetLang)?.name || "English";
            const content = `File Name: ${file?.name || "document"}\n\nOriginal Text:\n${originalContent}\n\nSummary:\n${summaryContent}\n\nTranslation (${translatedLangName}):\n${translatedText}`;
            updateSummaryFile(content);
        } catch (err) {
            clearTimeout(timeoutId);

            if (err.name === "AbortError") {
                setError("Request timed out after 60 seconds. Please try again.");
            } else if (err.message.includes("Failed to fetch")) {
                setError("Unable to connect to server. Check your network or server status.");
            } else {
                setError(`Translation error: ${err.message}`);
            }
            console.error("Error in translateSummary:", err);
        } finally {
            setIsLoading(false);
        }
    };


    const documentSummaryContent = summaryContent
        ? `File Name: ${file?.name || "Unknown"}\nOriginal Content: ${originalContent}\nSummary: ${summaryContent}\nTranslation (${availableLanguages.find((l) => l.code === targetLang)?.name || "English"}): ${translatedContent}`
        : "";

    return (
        <div className="relative min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <section className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Upload PDF</h2>
                            {file && (
                                <button
                                    onClick={handleRemoveFile}
                                    className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0 ml-2"
                                    title="Remove file"
                                >
                                    <Trash2 className="w-6 h-6 sm:w-7 sm:h-7" />
                                </button>
                            )}
                        </div>
                        <div
                            className={`relative bg-blue-50 p-6 sm:p-12 rounded-xl border-2 border-dashed transition-all duration-300 ${dragActive ? "border-blue-400 bg-blue-100 scale-105" : "border-gray-300 hover:border-blue-300"}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                                id="fileInputDoc"
                                accept=".pdf"
                            />
                            <label
                                htmlFor="fileInputDoc"
                                className="flex flex-col items-center justify-center cursor-pointer w-full"
                            >
                                {!file ? (
                                    <>
                                        <Upload className="w-12 h-12 sm:w-20 sm:h-20 text-blue-400 animate-bounce" />
                                        <p className="text-center text-gray-600 text-base sm:text-lg font-medium mt-2 sm:mt-4">
                                            Drag and drop PDF or<br />
                                            <span className="text-blue-500 underline">browse files</span>
                                        </p>
                                    </>
                                ) : (
                                    <div className="mt-4 sm:mt-6 w-full">
                                        <div className="bg-green-100 px-3 py-2 sm:px-4 sm:py-2 rounded-md flex items-center justify-between mb-3 sm:mb-4 overflow-hidden">
                                            <div className="flex items-center overflow-hidden">
                                                <span className="text-green-600 mr-2 flex-shrink-0">✓</span>
                                                <span className="text-green-700 font-medium text-sm sm:text-base truncate flex-shrink-1 min-w-0">
                                                    {file.name}
                                                </span>
                                            </div>
                                        </div>
                                        {originalContent && (
                                            <div className="bg-gray-50 p-3 sm:p-4 rounded-md h-40 sm:h-64 overflow-y-auto text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                                                <strong>Original Content:</strong>
                                                <br />
                                                {originalContent}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </label>
                        </div>
                        <button
                            onClick={generateSummary}
                            disabled={!file || isLoading}
                            className={`w-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg ${!file || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {isLoading ? "Processing..." : "Generate Summary"}
                        </button>
                        {error && <p className="text-red-500 text-sm sm:text-base">{error}</p>}
                    </section>

                    {/* Summary & Translation Section */}
                    <section className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-gray-50 rounded-2xl border-2 border-gray-100 shadow-inner">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Summary & Translation</h2>
                            {summaryFile && (
                                <a
                                    href={summaryFile}
                                    download={`summary_${file?.name || "document"}.txt`}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                                >
                                    <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                                    Download
                                </a>
                            )}
                        </div>

                        {/* Summary Display */}
                        {summaryContent && (
                            <article className="bg-white rounded-xl border-2 border-gray-200 p-4 sm:p-5 shadow-sm mb-4">
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                                        <svg
                                            className="w-5 h-5 sm:w-6 sm:h-6 text-green-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 0 002-2M9 5a2 2 0 012-2h2a2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M6 15h.01M6 11h.01M9 11h.01M9 15h.01"
                                            />
                                        </svg>
                                        Summary
                                    </h3>
                                    <span className="text-xs sm:text-sm text-gray-500 font-medium">
                                        {summaryContent.length} chars
                                    </span>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                    <textarea
                                        className="w-full min-h-[120px] sm:min-h-[180px] bg-transparent focus:outline-none resize-none text-gray-700 placeholder-gray-400 text-sm sm:text-base"
                                        value={summaryContent || ""}
                                        placeholder="✨ Your summary will appear here..."
                                        readOnly
                                    />
                                </div>
                            </article>
                        )}

                        {summaryContent && (
                            <div className="space-y-4 sm:space-y-6">
                                <div className="relative">
                                    <div className="flex items-center border-2 border-emerald-200 bg-white rounded-xl pr-2 sm:pr-3 shadow-sm">
                                        <input
                                            type="text"
                                            className="w-full p-3 sm:p-4 bg-transparent placeholder-gray-400 focus:outline-none text-sm sm:text-lg"
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
                                        <ul className="absolute z-10 mt-1 w-full bg-white border border-emerald-300 rounded-md shadow-lg max-h-40 sm:max-h-48 overflow-y-auto">
                                            {filteredLanguages.map((lang) => (
                                                <li
                                                    key={lang.code}
                                                    className="px-3 py-2 sm:px-4 sm:py-2 hover:bg-emerald-100 cursor-pointer text-sm sm:text-base"
                                                    onMouseDown={() => handleLanguageSelect(lang.code, lang.name)} // Dùng onMouseDown thay onClick để tránh onBlur chạy trước
                                                >
                                                    {lang.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <button
                                    onClick={translateSummary}
                                    className={`w-full bg-gradient-to-br from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Translating..." : "Translate Now"}
                                </button>

                                {translatedContent && (
                                    <article className="bg-white rounded-xl border-2 border-gray-200 p-4 sm:p-5 shadow-sm">
                                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                                                <svg
                                                    className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                Translation (
                                                {availableLanguages.find((l) => l.code === targetLang)?.name || "English"})
                                            </h3>
                                            <span className="text-xs sm:text-sm text-gray-500 font-medium">
                                                {translatedContent.length} chars
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                            <textarea
                                                className="w-full min-h-[120px] sm:min-h-[180px] bg-transparent focus:outline-none resize-none text-gray-700 text-sm sm:text-base"
                                                value={translatedContent}
                                                placeholder="✨ Your translation will appear here..."
                                                readOnly
                                            />
                                        </div>
                                    </article>
                                )}
                            </div>
                        )}
                        {/* Status Messages */}
                        {error && <p className="text-red-500 text-sm sm:text-base">{error}</p>}
                        {!summaryContent && !error && !isLoading && (
                            <p className="text-gray-400 italic text-center text-sm sm:text-base">
                                Summary will appear here after processing...
                            </p>
                        )}
                        {isLoading && !error && (
                            <div className="text-center">
                                <svg
                                    className="animate-spin h-5 w-5 text-gray-600 inline-block mr-2"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                </svg>
                                <p className="text-gray-600 inline text-sm sm:text-base">Processing...</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            <ChatBox documentSummaryContent={documentSummaryContent} />
        </div>
    );
}