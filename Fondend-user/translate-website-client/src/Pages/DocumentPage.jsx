import React, { useState, useEffect } from "react"; // Import useEffect
import { HelpCircle, Upload, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaCheckCircle } from "react-icons/fa";
import { FaSignInAlt } from 'react-icons/fa';
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage"
import Navigation from "./Navigation";
import Footer from "./Footer";

import axios from "axios";

const DocumentPage = () => {
    const navigate = useNavigate();
    const [loginPromptVisible, setLoginPromptVisible] = useState(false);
    const [loggedInUsername, setLoggedInUsername] = useState("");
    const [showHelp, setShowHelp] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [summaryContent, setSummaryContent] = useState("");
    const [summaryFile, setSummaryFile] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
    const handleCloseLogin = () => setShowLogin(false);
    const handleCloseRegister = () => setShowRegister(false);
    const [translatedText, setTranslatedText] = useState("");
    const [targetLanguage, setTargetLanguage] = useState("vi"); // Default to Vietnamese
    const [summary, setSummary] = useState("");
    const availableLanguages = [
        { code: "en", name: "English" },
        { code: "vi", name: "Vietnamese" },
        { code: "fr", name: "French" },
    ];

    /**
     * @function handleFileChange
     * @description Hàm xử lý sự kiện thay đổi file khi người dùng chọn file tải lên.
     *               Khi tích hợp API, hàm này có thể được mở rộng để xử lý việc tải file lên server API.
     * @param {Event} e - Đối tượng sự kiện từ input file.
     */
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    /**
     * @function generateSummary
     * @description Hàm tạo bản tóm tắt văn bản. Hiện tại đang sử dụng bản tóm tắt mẫu (fakeSummary).
     *               Khi tích hợp API, hàm này sẽ gửi file đến API để tạo bản tóm tắt thực sự từ API trả về.
     *               Kết quả tóm tắt từ API sẽ được cập nhật vào state `summaryContent`.
     */
    const generateSummary = () => {
        if (!file) {
            alert("Please upload a file first.");
            return;
        }

        const fakeSummary = "This is a sample summary generated from the document.";
        setSummaryContent(fakeSummary);
    };

    /**
     * @function translateSummary
     * @async
     * @description Hàm dịch nội dung tóm tắt sang ngôn ngữ mục tiêu đã chọn.
     *               Hiện tại đang sử dụng Google Translate API (cần thay thế YOUR_GOOGLE_TRANSLATE_API_KEY bằng API key thật).
     *               Khi tích hợp API dịch thuật khác, cần điều chỉnh endpoint và cấu trúc dữ liệu gửi/nhận cho phù hợp.
     *               Kết quả dịch thuật từ API sẽ được cập nhật vào state `translatedText`.
     */
    const translateSummary = async () => {
        if (!summaryContent) {
            alert("Please generate a summary before translating.");
            return;
        }

        try {
            const response = await axios.post("https://translation.googleapis.com/language/translate/v2", {
                q: summaryContent,
                target: targetLanguage,
                source: "en", // Assume the summary is in English
                key: "YOUR_GOOGLE_TRANSLATE_API_KEY"
            });
            setTranslatedText(response.data.data.translations[0].translatedText);
        } catch (error) {
            console.error("Translation error:", error);
            alert("Failed to translate text. Check API key and network connection.");
        }
    };

    /**
     * @function handleLoginClick
     * @description Hàm xử lý sự kiện khi người dùng click vào nút "Login".
     *               Hàm này hiển thị form đăng nhập bằng cách set state `showLogin` thành true.
     *               Khi tích hợp API đăng nhập, hàm này có thể được điều chỉnh để gọi API thay vì chỉ hiển thị form.
     */
    const handleLoginClick = () => {
        setShowLogin(true);
    };

    /**
     * @function handleRegisterClick
     * @description Hàm xử lý sự kiện khi người dùng click vào nút "Register".
     *               Hàm này hiển thị form đăng ký bằng cách set state `showRegister` thành true.
     *               Khi tích hợp API đăng ký, hàm này có thể được điều chỉnh để gọi API thay vì chỉ hiển thị form.
     */
    const handleRegisterClick = () => {
        setShowRegister(true);
    };

    /**
     * @function handleRegistrationSuccess
     * @description Hàm xử lý sự kiện đăng ký thành công.
     *               Hàm này hiển thị popup thông báo đăng ký thành công và ẩn form đăng ký.
     *               Khi tích hợp API, hàm này có thể được gọi sau khi API đăng ký trả về thành công.
     */
    const handleRegistrationSuccess = () => {
        setIsPopupVisible(true);
        setShowRegister(false);
    };

    /**
     * @function handleLogout
     * @description Hàm xử lý sự kiện đăng xuất người dùng.
     *               Hàm này reset state `loggedInUsername` về rỗng để đăng xuất người dùng hiện tại.
     *               Khi tích hợp API quản lý phiên đăng nhập, hàm này cần được mở rộng để gọi API đăng xuất trên server.
     */
    const handleLogout = () => {
        setLoggedInUsername("");
    };

    /**
     * @function closeLoginPrompt
     * @description Hàm đóng thông báo yêu cầu đăng nhập.
     *               Hàm này ẩn thông báo bằng cách set state `loginPromptVisible` thành false và hiển thị form đăng nhập (có thể không cần thiết trong luồng đăng nhập thực tế).
     */
    const closeLoginPrompt = () => {
        setLoginPromptVisible(false);
        setIsLoginFormVisible(true);
    };

    /**
     * @function handleDragOver
     * @description Hàm xử lý sự kiện kéo file vào khu vực tải lên.
     *               Hàm này ngăn chặn hành vi mặc định của trình duyệt và set state `dragActive` thành true để hiển thị hiệu ứng kéo thả.
     */
    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    /**
     * @function handleDragLeave
     * @description Hàm xử lý sự kiện rời khỏi khu vực kéo file.
     *               Hàm này set state `dragActive` thành false để ẩn hiệu ứng kéo thả.
     */
    const handleDragLeave = () => {
        setDragActive(false);
    };

    /**
     * @function handleDrop
     * @description Hàm xử lý sự kiện thả file vào khu vực tải lên.
     *               Hàm này ngăn chặn hành vi mặc định của trình duyệt, set state `dragActive` thành false,
     *               và lấy file từ sự kiện để cập nhật state `file`.
     */
    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            setFile(files[0]);
        }
    };


    return (
        <div className="min-h-screen bg-indigo-200 font-sans">
            <Navigation
                loggedInUsername={loggedInUsername}
                onLoginClick={handleLoginClick}
                onRegisterClick={handleRegisterClick}
                onLogout={handleLogout}
            />

            {/* Hiển thị form đăng nhập */}
            {showLogin && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
                    <LoginPage onClose={handleCloseLogin} />
                </div>
            )}

            {/* Hiển thị form đăng kí */}
            {showRegister && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
                    <RegisterPage onClose={handleCloseRegister} onRegistrationSuccess={handleRegistrationSuccess} />
                </div>
            )}

            {/* Main Content */}
            <div className="container mx-auto px-6 pt-16"> 

                <header className="container mx-auto mt-20 px-6 text-center">

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                        <span className="bg-gradient-to-r from-blue-600 to-green-500 text-transparent bg-clip-text">
                            Smart Document Summarization
                        </span>
                        <FaFileAlt className="inline-block ml-4 text-blue-500 animate-pulse" />
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Transform complex documents into concise summaries with advanced AI technology. Supports various formats: PDF, DOCX, TXT.
                    </p>
                </header>


                {/* Feature Section */}
                <section className="mt-10 flex flex-col items-center gap-8">
                    <div className="flex space-x-6">
                        <button
                            onClick={() => navigate("/text")}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-200"
                        >
                            Summarize Text
                        </button>
                        <button
                            className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-green-200 border-2 border-green-600"
                        >
                            Summarize Document
                        </button>

                    </div>
                    {/* Help Section */}
                    <div className="relative group">
                        <HelpCircle className="w-8 h-8 text-gray-500 hover:text-blue-600 cursor-pointer transition-colors" />
                        <div className="absolute left-full top-1/2 ml-4 -translate-y-1/2 w-80 bg-white p-6 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                            <h3 className="text-lg font-bold text-gray-800 mb-3">Quick Guide</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start">
                                    <span className="text-blue-500 font-bold mr-2">1.</span>
                                    Upload a document (PDF, DOCX, TXT)
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 font-bold mr-2">2.</span>
                                    Click "Generate Summary"
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Upload & Result Section */}
                <section className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Upload Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Document</h2>
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
                                    <div className="mt-6 bg-green-100 px-4 py-2 rounded-md flex items-center">
                                        <span className="text-green-600 mr-2">✓</span>
                                        <span className="text-green-700 font-medium">{file.name}</span>
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
                                    download="summary.txt"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center transition-all shadow-md hover:shadow-lg"
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    Download
                                </a>
                            )}

                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl h-96 overflow-y-auto">
                            {summaryContent ? (
                                <div className="text-gray-700 leading-relaxed">
                                    {summaryContent}
                                </div>
                            ) : (
                                <p className="text-gray-400 italic text-center">
                                    Summary will appear here after processing...
                                </p>
                            )}
                        </div>
                        <div> {/* Container for select and button */}
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
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={translateSummary}
                                    className={`ml-2 px-4 py-2 rounded focus:outline-none focus:shadow-outline ${!summary ? 'opacity-50 cursor-not-allowed' : ''} bg-blue-500 hover:bg-blue-700 text-white font-bold`}
                                    disabled={!summary}
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
                        onClick={() => {
                            if (file) {
                                generateSummary(file);
                            }
                        }}
                        disabled={!file}
                        className={`px-12 py-3 rounded-xl font-bold text-lg transition-all ${file
                            ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-200 transform hover:scale-105"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        Generate Summary
                    </button>
                </section>

                {/* About Document Summarizer Section - Re-structured and visually improved text */}
                <section className="container mx-auto mt-20 px-6 py-10 bg-blue-50 rounded-xl shadow-md">
                    <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">
                        Learn About PDFSmart Document Summarizer
                    </h2>
                    <p className="text-gray-700 text-lg mb-6 text-center">
                        Welcome to **PDFSmart - Intelligent Document Summarization Tool**, the optimal solution to help you save time and improve information processing efficiency.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                                How does the PDFSmart document summarization tool work?
                            </h3>
                            <p className="text-gray-700 mb-5">
                                PDFSmart uses the power of **Artificial Intelligence (AI)**, specifically the most advanced natural language models available today, to analyze and summarize your documents. The tool's operation process includes:
                            </p>
                            <ul className="list-disc pl-5 text-gray-700 mb-5 space-y-2">
                                <li><strong>Read and Analyze Text:</strong> PDFSmart's AI reads the entire content of your uploaded document, understanding the structure and semantics of the text.</li>
                                <li><strong>Identify Important Information:</strong> The tool uses complex algorithms to identify the most important sentences, paragraphs, and main ideas.</li>
                                <li><strong>Remove Redundant Information:</strong> PDFSmart removes redundant, unimportant, or repetitive information.</li>
                                <li><strong>Synthesize and Restructure:</strong> AI synthesizes information, reinterprets it concisely, and restructures the summary coherently.</li>
                                <li><strong>Create Summary:</strong> Finally, PDFSmart creates a concise summary of the main ideas, helping you grasp the content quickly.</li>
                            </ul>
                            <p className="text-gray-700 mb-5">
                                AI technology allows PDFSmart to process various types of documents and create high-quality summaries, superior to manual methods.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                                Why choose PDFSmart to summarize your documents?
                            </h3>
                            <p className="text-gray-700 mb-5">
                                Among many summarization tools, PDFSmart stands out with superior advantages, providing the best experience.
                            </p>
                            <h4 className="text-lg font-semibold text-gray-800 mb-3">Key benefits of PDFSmart:</h4>
                            <ul className="list-disc pl-5 text-gray-700 space-y-2">
                                <li><strong>Save Valuable Time:</strong> PDFSmart helps you save up to 80-90% of reading time, focusing on important tasks.</li>
                                <li><strong>Accurate and Efficient Summarization:</strong> AI ensures accurate summarization of main ideas, without missing important information.</li>
                                <li><strong>Support for Various File Formats:</strong> PDFSmart supports summarizing `.txt`, `.docx`, `.pdf` files, meeting diverse needs.</li>
                                <li><strong>Friendly, Easy-to-Use Interface:</strong> Intuitive, simple interface, easy to operate for quality summaries.</li>
                                <li><strong>Flexible Summary Type Options:</strong> Choose "short" for an overview, or "main points" to delve into core content.</li>
                                <li><strong>Easy Download:</strong> Summaries are downloaded in `.txt` format, convenient for storage, sharing, and reuse.</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <Footer />

            {/* Success Popup */}
            {isPopupVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md text-center">
                        <FaCheckCircle className="text-green-500 w-16 h-16 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">You have successfully registered!</h3>
                        <button
                            onClick={() => setIsPopupVisible(false)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-medium w-full"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Thông báo đăng nhập ở giữa trang */}
            {loginPromptVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
                        <div className="text-center mb-6">
                            <FaSignInAlt className="mx-auto h-12 w-12 text-blue-500 mb-2" />
                            <h1 className="text-2xl font-bold text-gray-800">Please Log In</h1>
                            <p className="text-gray-600">You need to log in to use this feature.</p>
                        </div>
                        <div className="mt-6">
                            <button
                                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                                onClick={handleLoginClick}
                            >
                                Log In
                            </button>
                        </div>
                        <div className="mt-4 text-sm text-gray-600 text-center">
                            Don't have an account? <button onClick={() => setLoginPromptVisible(false)} className="text-blue-500 hover:underline">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default DocumentPage;