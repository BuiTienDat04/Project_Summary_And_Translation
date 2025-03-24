import { useState, useEffect } from "react";
import { Upload, Download, Trash2 } from "lucide-react";
import ChatBox from "../Pages/ChatBox";
import { API_BASE_URL } from "../api/api";

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

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // Giới hạn 10MB

    const availableLanguages = [
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

    const filteredLanguages = availableLanguages.filter((lang) =>
        lang.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        return () => {
            if (summaryFile) {
                URL.revokeObjectURL(summaryFile);
            }
        };
    }, [summaryFile]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > MAX_FILE_SIZE) {
                setError(`File quá lớn! Kích thước tối đa là ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
                return;
            }
            if (selectedFile.type !== "application/pdf") {
                setError("Chỉ hỗ trợ file PDF!");
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
                setError(`File quá lớn! Kích thước tối đa là ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
                return;
            }
            if (droppedFile.type !== "application/pdf") {
                setError("Chỉ hỗ trợ file PDF!");
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
            setError("Vui lòng chọn file trước khi tạo tóm tắt.");
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
                throw new Error(
                    errorData.error || `Lỗi khi xử lý file (HTTP ${response.status})`
                );
            }

            const data = await response.json();
            if (!data.originalText || !data.summary) {
                throw new Error("Backend không trả về nội dung hoặc tóm tắt hợp lệ.");
            }
            setOriginalContent(data.originalText || "Không thể trích xuất nội dung.");
            setSummaryContent(data.summary || "Không thể tóm tắt nội dung.");
            setTranslatedContent("");

            const content = `File Name: ${file.name}\n\nOriginal Text:\n${data.originalText || "Không có nội dung"}\n\nSummary:\n${data.summary || "Không có tóm tắt"}`;
            updateSummaryFile(content);
        } catch (err) {
            if (err.name === "AbortError") {
                setError("Yêu cầu quá thời gian. Vui lòng thử lại.");
            } else if (err.message.includes("Failed to fetch")) {
                setError("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc server.");
            } else {
                setError(err.message);
            }
            console.error("Lỗi generateSummary:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const translateSummary = async () => {
        if (!summaryContent || !targetLang) {
            setError("Vui lòng tóm tắt văn bản trước và chọn ngôn ngữ mục tiêu.");
            return;
        }

        setIsLoading(true);
        setError(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const cleanedSummary = cleanText(summaryContent);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_BASE_URL}/translate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    text: cleanedSummary,
                    targetLang,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || `Lỗi khi dịch văn bản (HTTP ${response.status})`
                );
            }

            const data = await response.json();
            setTranslatedContent(data.translation || "Không thể dịch nội dung.");

            const content = `File Name: ${file?.name || "document"}\n\nOriginal Text:\n${originalContent}\n\nSummary:\n${summaryContent}\n\nTranslation (${availableLanguages.find((l) => l.code === targetLang)?.name || "English"}):\n${data.translation || "Không có bản dịch"}`;
            updateSummaryFile(content);
        } catch (err) {
            if (err.name === "AbortError") {
                setError("Yêu cầu quá thời gian. Vui lòng thử lại.");
            } else if (err.message.includes("Failed to fetch")) {
                setError("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc server.");
            } else {
                setError(err.message);
            }
            console.error("Lỗi translateSummary:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const documentSummaryContent = summaryContent
        ? `File Name: ${file?.name || "Unknown"}\nOriginal Content: ${originalContent}\nSummary: ${summaryContent}\nTranslation (${availableLanguages.find((l) => l.code === targetLang)?.name || "English"}): ${translatedContent}`
        : "";

    return (
        <div className="relative">
            <div className="max-w-7xl mx-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <section className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold text-gray-800 flex-grow">Upload Document</h2>
                            {file && (
                                <button
                                    onClick={handleRemoveFile}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                    title="Remove file"
                                >
                                    <Trash2 className="w-7 h-7" />
                                </button>
                            )}
                        </div>
                        <div
                            className={`relative bg-blue-50 p-12 rounded-xl border-3 border-dashed transition-all duration-300 ${
                                dragActive ? "border-blue-400 bg-blue-100 scale-105" : "border-gray-300 hover:border-blue-300"
                            }`}
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
                            <label htmlFor="fileInputDoc" className="flex flex-col items-center justify-center cursor-pointer w-full">
                                {!file ? (
                                    <>
                                        <Upload className="w-20 h-20 text-blue-400 animate-bounce" />
                                        <p className="text-center text-gray-600 text-lg font-medium mt-4">
                                            Drag and drop file or<br />
                                            <span className="text-blue-500 underline">browse files</span>
                                        </p>
                                    </>
                                ) : (
                                    <div className="mt-6 w-full">
                                        <div className="bg-green-100 px-4 py-2 rounded-md flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <span className="text-green-600 mr-2">✓</span>
                                                <span className="text-green-700 font-medium">{file.name}</span>
                                            </div>
                                        </div>
                                        {originalContent && (
                                            <div className="bg-gray-50 p-4 rounded-md h-64 overflow-y-auto text-gray-700 leading-relaxed whitespace-pre-wrap w-full">
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
                            className={`w-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg ${
                                !file || isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {isLoading ? "Processing..." : "Generate Summary"}
                        </button>
                        {error && <p className="text-red-500">{error}</p>}
                    </section>

                    <section className="space-y-6 p-6 bg-gray-50 rounded-2xl border-2 border-gray-100 shadow-inner">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Summary Result</h2>
                            {summaryFile && (
                                <a
                                    href={summaryFile}
                                    download={`summary_${file?.name || "document"}.txt`}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center transition-all shadow-md hover:shadow-lg"
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    Download
                                </a>
                            )}
                        </div>

                        {summaryContent && (
                            <article className="bg-white rounded-xl border-2 border-gray-200 p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 0 002-2M9 5a2 2 0 012-2h2a2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M6 15h.01M6 11h.01M9 11h.01M9 15h.01" />
                                        </svg>
                                        Summary
                                    </h3>
                                    <span className="text-sm text-gray-500 font-medium">{summaryContent.length} chars</span>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <textarea
                                        className="w-full min-h-[180px] bg-transparent focus:outline-none resize-none text-gray-700 placeholder-gray-400 text-md"
                                        value={summaryContent || ""}
                                        placeholder="✨ Your summary will appear here..."
                                        readOnly
                                    />
                                </div>
                            </article>
                        )}

                        {summaryContent && (
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
                                    onClick={translateSummary}
                                    className={`w-full bg-gradient-to-br from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg ${
                                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Translating..." : "Translate Now"}
                                </button>

                                {translatedContent && (
                                    <article className="bg-white rounded-xl border-2 border-gray-200 p-5 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Translation ({availableLanguages.find((l) => l.code === targetLang)?.name || "English"})
                                            </h3>
                                            <span className="text-sm text-gray-500 font-medium">{translatedContent.length} chars</span>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <textarea
                                                className="w-full min-h-[180px] bg-transparent focus:outline-none resize-none text-gray-700 text-md"
                                                value={translatedContent}
                                                placeholder="✨ Your translation will appear here..."
                                                readOnly
                                            />
                                        </div>
                                    </article>
                                )}
                            </div>
                        )}

                        {error && <p className="text-red-500">{error}</p>}
                        {!summaryContent && !error && !isLoading && (
                            <p className="text-gray-400 italic text-center">
                                Summary will appear here after processing...
                            </p>
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
            </div>

            <ChatBox documentSummaryContent={documentSummaryContent} />
        </div>
    );
}