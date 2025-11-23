import { useState, useEffect, useRef } from "react";
import { Upload, Download, Trash2, Languages, FileText, Sparkles } from "lucide-react";
import { API_BASE_URL } from "../api/api";
import nlp from "compromise";
import HistorySummary from "./HistorySummary";

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
    const [processingStep, setProcessingStep] = useState("");
    const dropdownRef = useRef(null);

    const MAX_FILE_SIZE = 10 * 1024 * 1024;

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
        { code: "sv", name: "Swedish" },
        { code: "fi", name: "Finnish" },
        { code: "no", name: "Norwegian" },
        { code: "da", name: "Danish" },
    ];

    const filteredLanguages = availableLanguages.filter((lang) =>
        lang.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        return () => {
            if (summaryFile) URL.revokeObjectURL(summaryFile);
        };
    }, [summaryFile]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > MAX_FILE_SIZE) {
                setError(`File size exceeds the ${MAX_FILE_SIZE / (1024 * 1024)}MB limit.`);
                return;
            }
            if (selectedFile.type !== "application/pdf") {
                setError("Only PDF files are supported.");
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
                setError(`File size exceeds the ${MAX_FILE_SIZE / (1024 * 1024)}MB limit.`);
                return;
            }
            if (droppedFile.type !== "application/pdf") {
                setError("Only PDF files are supported.");
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

    const extractProperNouns = (text) => {
        const doc = nlp(text);
        const people = doc.people().out('array');
        const places = doc.places().out('array');
        const organizations = doc.organizations().out('array');

        // Combine and remove duplicates
        let allEntities = [...new Set([...people, ...places, ...organizations])];

        // Làm sạch danh từ riêng: loại bỏ ký tự đặc biệt và chuỗi không hợp lệ
        allEntities = allEntities.map(entity =>
            entity.replace(/[*|":<>[\]{}`\\();'~^]/g, '').trim() // Loại bỏ ký tự đặc biệt
        ).filter(entity =>
            entity.length > 2 &&
            !['the', 'and', 'or', 'but', 'in', 'on', 'at'].includes(entity.toLowerCase()) &&
            entity !== '' // Loại bỏ chuỗi rỗng
        );

        return allEntities;
    };

    const createTranslationMap = (properNouns) => {
        const map = {};
        properNouns.forEach(noun => {
            // For proper nouns, we want to keep them as-is in translation
            // This tells the backend to not translate these terms
            map[noun] = noun;
        });
        return map;
    };

    const updateSummaryFile = (content) => {
        if (summaryFile) URL.revokeObjectURL(summaryFile);
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        setSummaryFile(url);
    };

    const generateSummary = async () => {
        if (!file) {
            setError("Please select a PDF file first.");
            return;
        }

        setIsLoading(true);
        setProcessingStep("Analyzing document...");
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
                throw new Error(errorData.error || `Server error (HTTP ${response.status})`);
            }

            const data = await response.json();

            if (!data.originalText || !data.summary) {
                throw new Error("Invalid response from server - missing content or summary.");
            }

            setOriginalContent(data.originalText);
            setSummaryContent(data.summary);
            setTranslatedContent("");

            const content = `Document: ${file.name}\n\nOriginal Content:\n${data.originalText}\n\nSummary:\n${data.summary}`;
            updateSummaryFile(content);

        } catch (err) {
            if (err.name === "AbortError") {
                setError("Request timeout. Please try again.");
            } else if (err.message.includes("Failed to fetch")) {
                setError("Network error. Please check your connection.");
            } else {
                setError(err.message);
            }
            console.error("Summary generation error:", err);
        } finally {
            setIsLoading(false);
            setProcessingStep("");
        }
    };

    const translateSummary = async () => {
        if (!summaryContent) {
            setError("Please generate a summary first.");
            return;
        }

        if (!targetLang) {
            setError("Please select a target language.");
            return;
        }

        setIsLoading(true);
        setProcessingStep("Translating summary...");
        setError(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);

        try {
            // Extract proper nouns from the summary
            const properNouns = extractProperNouns(summaryContent);
            const translationMap = createTranslationMap(properNouns);

            console.log("Detected proper nouns:", properNouns);

            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/translate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    text: summaryContent,
                    targetLang,
                    properNouns, // Send proper nouns to backend
                    translationMap,
                    isSummary: true // Thêm trường để xác nhận đây là bản tóm tắt
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Translation failed (HTTP ${response.status})`);
            }

            const data = await response.json();
            console.log("Translation result:", data);

            const translatedText = data.translation || "Translation unavailable.";
            setTranslatedContent(translatedText);

            const translatedLangName = availableLanguages.find((l) => l.code === targetLang)?.name || "English";
            const content = `Document: ${file?.name || "Unknown"}\n\nOriginal Content:\n${originalContent}\n\nSummary:\n${summaryContent}\n\nTranslation (${translatedLangName}):\n${translatedText}`;
            updateSummaryFile(content);

            // Thông báo thành công
            alert(`Translated summary to ${translatedLangName}`);
        } catch (err) {
            clearTimeout(timeoutId);

            if (err.name === "AbortError") {
                setError("Translation timeout. Please try again.");
            } else if (err.message.includes("Failed to fetch")) {
                setError("Network error. Please check your connection.");
            } else {
                setError(`Translation error: ${err.message}`);
            }
            console.error("Translation error:", err);
        } finally {
            setIsLoading(false);
            setProcessingStep("");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <HistorySummary />

            <div className="w-full px-6 lg:px-8 py-8">
                {/* Header Section - Full Width */}
                <div className="w-full text-center mb-12 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                        Document Intelligence
                    </h1>
                    <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                        Upload PDF documents for intelligent summarization and multilingual translation
                        with advanced proper noun preservation technology.
                    </p>
                </div>

                {/* Main Content Grid - Full Width */}
                <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Upload Section - Full Height */}
                    <div className="flex flex-col h-full">
                        <section className="flex-1 space-y-6 p-8 bg-white rounded-3xl shadow-2xl border border-gray-200/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                                        <Upload className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">Document Upload</h2>
                                        <p className="text-gray-600 mt-1">Upload your PDF for analysis</p>
                                    </div>
                                </div>
                                {file && (
                                    <button
                                        onClick={handleRemoveFile}
                                        className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
                                        title="Remove document"
                                    >
                                        <Trash2 className="w-9 h-9" />
                                    </button>
                                )}
                            </div>

                            <div
                                className={`relative border-4 border-dashed rounded-3xl transition-all duration-300 min-h-[400px] flex items-center justify-center ${dragActive
                                    ? "border-blue-400 bg-blue-50/80 scale-[1.02] shadow-inner"
                                    : "border-gray-300 hover:border-blue-300 hover:bg-blue-50/30"
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
                                <label
                                    htmlFor="fileInputDoc"
                                    className="flex flex-col items-center justify-center cursor-pointer w-full h-full p-12"
                                >
                                    {!file ? (
                                        <>
                                            <div className="p-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded-3xl mb-6 shadow-lg">
                                                <Upload className="w-16 h-16 text-blue-600" />
                                            </div>
                                            <p className="text-center text-gray-700 text-2xl font-semibold mb-3">
                                                Drag & Drop Your PDF File
                                            </p>
                                            <p className="text-center text-gray-600 text-lg">
                                                or <span className="text-blue-600 font-bold underline">browse files</span>
                                            </p>
                                            <p className="text-center text-gray-500 mt-6 text-sm">
                                                Maximum file size: 10MB • PDF format only
                                            </p>
                                        </>
                                    ) : (
                                        <div className="w-full max-w-2xl">
                                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-5 rounded-2xl flex items-center justify-between mb-8 border border-green-200 shadow-lg">
                                                <div className="flex items-center space-x-4">
                                                    <div className="p-3 bg-green-100 rounded-xl">
                                                        <FileText className="w-8 h-8 text-green-600" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-green-800 font-bold text-xl truncate max-w-md">
                                                            {file.name}
                                                        </span>
                                                        <span className="text-green-600 text-sm">
                                                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {originalContent && (
                                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-inner">
                                                    <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center">
                                                        <FileText className="w-5 h-5 mr-2 text-blue-500" />
                                                        Extracted Content Preview
                                                    </h4>
                                                    <div className="max-h-80 overflow-y-auto text-gray-700 leading-relaxed text-base bg-white p-4 rounded-xl">
                                                        {originalContent}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </label>
                            </div>

                            <button
                                onClick={generateSummary}
                                disabled={!file || isLoading}
                                className={`w-full py-5 px-6 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center justify-center space-x-4 shadow-lg ${!file || isLoading
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-2xl transform hover:scale-[1.02] hover:-translate-y-1"
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-7 w-7 border-3 border-white border-t-transparent"></div>
                                        <span className="text-lg">{processingStep}</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-7 h-7" />
                                        <span>Generate AI Summary</span>
                                    </>
                                )}
                            </button>
                        </section>
                    </div>

                    {/* Results Section - Full Height */}
                    <div className="flex flex-col h-full">
                        <section className="flex-1 space-y-6 p-8 bg-white rounded-3xl shadow-2xl border border-gray-200/50">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                                        <FileText className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">Analysis Results</h2>
                                        <p className="text-gray-600 mt-1">Summary and translation outputs</p>
                                    </div>
                                </div>
                                {summaryFile && (
                                    <a
                                        href={summaryFile}
                                        download={`summary_${file?.name || "document"}.txt`}
                                        className="flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
                                    >
                                        <Download className="w-5 h-5" />
                                        <span>Export Results</span>
                                    </a>
                                )}
                            </div>

                            {/* Summary Display */}
                            {summaryContent && (
                                <article className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-2xl border-2 border-blue-200/50 p-7 shadow-lg">
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-3">
                                            <div className="p-2 bg-yellow-100 rounded-xl">
                                                <Sparkles className="w-6 h-6 text-yellow-600" />
                                            </div>
                                            <span>AI Generated Summary</span>
                                        </h3>
                                        <span className="text-sm text-gray-600 bg-white/80 px-4 py-2 rounded-full font-semibold shadow-sm">
                                            {summaryContent.length.toLocaleString()} characters
                                        </span>
                                    </div>
                                    <div className="bg-white/90 rounded-xl p-5 border border-blue-100 shadow-inner">
                                        <div className="max-h-80 overflow-y-auto text-gray-800 leading-relaxed text-base">
                                            {summaryContent}
                                        </div>
                                    </div>
                                </article>
                            )}

                            {/* Translation Section */}
                            {/* Translation Section */}
                            {summaryContent && (
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 rounded-2xl border-2 border-green-200/50 p-7 shadow-lg">
                                        <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center space-x-3">
                                            <div className="p-2 bg-green-100 rounded-xl">
                                                <Languages className="w-6 h-6 text-green-600" />
                                            </div>
                                            <span>Translation Settings</span>
                                        </h3>

                                        <div className="space-y-5">
                                            <div className="relative" ref={dropdownRef}>
                                                <div className="flex items-center bg-white border-3 border-green-200 rounded-2xl pr-4 shadow-lg hover:border-green-300 transition-colors">
                                                    <Languages className="w-6 h-6 text-gray-500 ml-5" />
                                                    <input
                                                        type="text"
                                                        className="w-full p-5 bg-transparent placeholder-gray-500 focus:outline-none text-lg font-medium"
                                                        placeholder="Search for translation language..."
                                                        value={searchTerm}
                                                        onChange={(e) => {
                                                            setSearchTerm(e.target.value);
                                                            setIsDropdownOpen(true);
                                                        }}
                                                        onFocus={() => setIsDropdownOpen(true)}
                                                    />
                                                </div>
                                                {isDropdownOpen && filteredLanguages.length > 0 && (
                                                    <ul className="absolute z-20 mt-3 w-full bg-white border-2 border-green-300 rounded-2xl shadow-2xl max-h-80 overflow-y-auto backdrop-blur-sm">
                                                        {filteredLanguages.map((lang) => (
                                                            <li
                                                                key={lang.code}
                                                                className="px-5 py-4 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200 hover:pl-7"
                                                                onClick={() => handleLanguageSelect(lang.code, lang.name)}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <span className="font-semibold text-gray-800 text-lg">{lang.name}</span>
                                                                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg font-medium">
                                                                        {lang.code.toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            <button
                                                onClick={translateSummary}
                                                disabled={isLoading || !targetLang}
                                                className={`w-full py-5 px-6 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center justify-center space-x-4 shadow-lg ${isLoading || !targetLang
                                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                                                        : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:shadow-2xl transform hover:scale-[1.02] hover:-translate-y-1"
                                                    }`}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-7 w-7 border-3 border-white border-t-transparent"></div>
                                                        <span className="text-lg">{processingStep}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Languages className="w-7 h-7" />
                                                        <span>Translate Summary</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Translation Result */}
                                    {translatedContent ? (
                                        <article className="bg-gradient-to-br from-purple-50/80 to-pink-50/80 rounded-2xl border-2 border-purple-200/50 p-7 shadow-lg">
                                            <div className="flex items-center justify-between mb-5">
                                                <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-3">
                                                    <div className="p-2 bg-purple-100 rounded-xl">
                                                        <Languages className="w-6 h-6 text-purple-600" />
                                                    </div>
                                                    <span>
                                                        Translated to {availableLanguages.find((l) => l.code === targetLang)?.name || "English"}
                                                    </span>
                                                </h3>
                                                <span className="text-sm text-gray-600 bg-white/80 px-4 py-2 rounded-full font-semibold shadow-sm">
                                                    {translatedContent.length.toLocaleString()} characters
                                                </span>
                                            </div>
                                            <div className="bg-white/90 rounded-xl p-5 border border-purple-100 shadow-inner">
                                                <div className="max-h-80 overflow-y-auto text-gray-800 leading-relaxed text-base">
                                                    {translatedContent}
                                                </div>
                                            </div>
                                        </article>
                                    ) : targetLang && !isLoading ? (
                                        <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border-2 border-dashed border-gray-300 p-7 shadow-lg text-center">
                                            <p className="text-gray-500 text-lg italic">
                                                Please click "Translate Summary" to view the translation in {availableLanguages.find((l) => l.code === targetLang)?.name || "selected language"}.
                                            </p>
                                        </div>
                                    ) : null}
                                </div>
                            )}
                            {/* Status Messages */}
                            {error && (
                                <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
                                    <p className="text-red-700 font-bold text-lg text-center">{error}</p>
                                </div>
                            )}

                            {!summaryContent && !error && !isLoading && (
                                <div className="text-center py-16 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50/30 border-2 border-dashed border-gray-300">
                                    <FileText className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                                    <p className="text-gray-500 text-2xl font-semibold mb-2">
                                        Analysis Results Awaiting
                                    </p>
                                    <p className="text-gray-400 text-lg">
                                        Upload a PDF and generate summary to see results here
                                    </p>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
