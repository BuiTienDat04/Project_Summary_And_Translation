import { useState, useEffect } from "react";
import { Upload, Download, Trash2 } from "lucide-react";

export default function DocumentSummarySection() {
    const [file, setFile] = useState(null);
    const [summaryContent, setSummaryContent] = useState("");
    const [summaryFile, setSummaryFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [targetLanguage, setTargetLanguage] = useState("en");

    const availableLanguages = [
        { code: "en", name: "English" },
        { code: "fr", name: "French" },
        { code: "es", name: "Spanish" },
        { code: "de", name: "German" }
    ];

    // Cleanup object URLs
    useEffect(() => {
        return () => {
            if (summaryFile) {
                URL.revokeObjectURL(summaryFile);
            }
        };
    }, [summaryFile]);

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            setFile(event.target.files[0]);
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
        if (event.dataTransfer.files.length > 0) {
            setFile(event.dataTransfer.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setSummaryContent("");
        setSummaryFile(null);
    };

    const generateSummary = () => {
        if (!file) return;

        const content = `File Name: ${file.name}\n\nSummary:\n${'This is a detailed summary of the document. '.repeat(10)}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        setSummaryContent(content);
        setSummaryFile(url);
    };

    const translateSummary = () => {
        setSummaryContent(prev => `[Translated to ${targetLanguage}] ${prev}`);
    };

    return (
        <div>
            {/* Upload & Result Section */}
            <section className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Upload Card */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex items-center justify-start mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex-grow">Upload Document</h2>
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
                        className={`relative bg-blue-50 p-12 rounded-xl border-3 border-dashed transition-all duration-300 ${dragActive
                            ? "border-blue-400 bg-blue-100 scale-105"
                            : "border-gray-300 hover:border-blue-300"
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
                            accept=".pdf,.docx,.txt"
                        />
                        <label
                            htmlFor="fileInputDoc"
                            className="flex flex-col items-center justify-center cursor-pointer"
                        >
                            <Upload className="w-20 h-20 text-blue-400 animate-bounce" />
                            <p className="text-center text-gray-600 text-lg font-medium mt-4">
                                Drag and drop file or<br />
                                <span className="text-blue-500 underline">browse files</span>
                            </p>
                            {file && (
                                <div className="mt-6 bg-green-100 px-4 py-2 rounded-md flex items-center justify-between w-full">
                                    <div className="flex items-center">
                                        <span className="text-green-600 mr-2">✓</span>
                                        <span className="text-green-700 font-medium">{file.name}</span>
                                    </div>
                                </div>
                            )}
                        </label>
                    </div>
                </div>

                {/* Result Card */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Summary Result</h2>
                        {summaryFile && (
                            <a
                                href={summaryFile}
                                download={`summary_${new Date().getTime()}.txt`}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center transition-all shadow-md hover:shadow-lg"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Download
                            </a>
                        )}
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl h-96 overflow-y-auto">
                        {summaryContent ? (
                            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {summaryContent}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic text-center">
                                Summary will appear here after processing...
                            </p>
                        )}
                    </div>
                    <div className="mt-4">
                        <label htmlFor="languageSelect" className="block text-sm font-medium text-gray-700 mb-1">
                            Translate to:
                        </label>
                        <div className="flex items-center">
                            <select
                                id="languageSelect"
                                className="block appearance-none w-auto bg-white border border-gray-300 hover:border-blue-400 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
                                value={targetLanguage}
                                onChange={(e) => setTargetLanguage(e.target.value)}
                            >
                                {availableLanguages.map((lang) => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.name}
                                 SS   </option>
                                ))}
                            </select>
                            <button
                                onClick={translateSummary}
                                className={`ml-2 px-4 py-2 rounded focus:outline-none focus:shadow-outline ${!summaryContent ? 'opacity-50 cursor-not-allowed' : ''
                                    } bg-blue-500 hover:bg-blue-700 text-white font-bold`}
                                disabled={!summaryContent}
                            >
                                Translate
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Generate Button */}
            <section className="mt-14 flex justify-center">
                <button
                    onClick={generateSummary}
                    disabled={!file}
                    className={`px-12 py-3 rounded-xl font-bold text-lg transition-all ${file
                        ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-200 transform hover:scale-105"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    Generate Summary
                </button>
            </section>
        </div>
    );
}