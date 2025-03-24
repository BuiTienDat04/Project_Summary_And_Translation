import React, { useState, useEffect } from "react";
import { HelpCircle, Link2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaCheckCircle } from "react-icons/fa";
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";
import Navigation from "../Pages/Navigation";
import Footer from "../Pages/Footer";
import { motion } from "framer-motion";
import { FaFilePdf, FaLink } from "react-icons/fa";
import axios from "axios";
import ChatBox from "../Pages/ChatBox";
import { API_BASE_URL } from "../api/api";
import {
    SparklesIcon,
    CpuChipIcon,
    GlobeAltIcon,
    ScaleIcon,
    FunnelIcon,
    DocumentTextIcon,
    RocketLaunchIcon,
    ClockIcon,
    LanguageIcon,
    AdjustmentsHorizontalIcon,
    CloudArrowDownIcon,
    AcademicCapIcon,
    BriefcaseIcon,
    NewspaperIcon
} from "@heroicons/react/24/outline";

const LinkPage = () => {
    const navigate = useNavigate();
    const [loggedInUsername, setLoggedInUsername] = useState("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [linkInput, setLinkInput] = useState("");
    const [summaryResult, setSummaryResult] = useState("");
    const [translatedContent, setTranslatedContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [targetLang, setTargetLang] = useState("en");
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
      const [showHelp, setShowHelp] = useState(false);


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

    const handleCloseLogin = () => setShowLogin(false);
    const handleCloseRegister = () => setShowRegister(false);

    const handleRegistrationSuccess = () => {
        setIsPopupVisible(true);
        setShowRegister(false);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("loggedInUser");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setLoggedInUser(user);
            setLoggedInUsername(user.email);
        }
    }, []);

    const handleLoginClick = () => setShowLogin(true);
    const handleRegisterClick = () => setShowRegister(true);

    const onLoginSuccess = (user) => {
        setLoggedInUser(user);
        setLoggedInUsername(user.email);
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        setShowLogin(false);
    };

    const handleLogout = () => {
        setLoggedInUsername(null);
        setLoggedInUser(null);
        localStorage.removeItem("loggedInUser");
        navigate("/");
        window.location.reload();
    };

    const handleLinkChange = (e) => {
        setLinkInput(e.target.value);
        setError("");
    };

    const handleLanguageSelect = (code, name) => {
        setTargetLang(code);
        setSearchTerm(name);
        setIsDropdownOpen(false);
    };

    const handleGenerateSummary = async () => {
        if (!linkInput) {
            setError("Please enter a valid URL.");
            return;
        }

        const urlPattern = /^https?:\/\//;
        if (!urlPattern.test(linkInput)) {
            setError("URL must start with http:// or https://");
            return;
        }

        setIsLoading(true);
        setError("");
        setSummaryResult("");
        setTranslatedContent("");

        try {
            const response = await axios.post(`${API_BASE_URL}/summarize-link`, {
                url: linkInput,
                language: "English",
            });

            const { summary } = response.data;
            setSummaryResult(summary || "No summary generated.");
        } catch (error) {
            console.error("Error summarizing link:", error);
            setError(error.response?.data?.error || "Error generating summary. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const translateSummary = async () => {
        if (!summaryResult || !targetLang) {
            setError("Please generate a summary first and select a target language.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post(`${API_BASE_URL}/translate`, {
                text: summaryResult,
                targetLang,
            });

            const { translation } = response.data;
            setTranslatedContent(translation || "No translation generated.");
        } catch (error) {
            console.error("Error translating summary:", error);
            setError(error.response?.data?.error || "Error translating summary. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Nội dung gửi đến ChatBox
    const linkPageContent = `URL: ${linkInput}\nSummary: ${summaryResult}\nTranslation (${availableLanguages.find((l) => l.code === targetLang)?.name || "English"}): ${translatedContent}`;

    return (
        <div className="relative min-h-screen bg-indigo-200 font-sans">
            <Navigation
                loggedInUsername={loggedInUsername}
                onLoginClick={handleLoginClick}
                onRegisterClick={handleRegisterClick}
                onLogout={handleLogout}
            />

            {showLogin && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]"
                >
                    <LoginPage onClose={handleCloseLogin} onLoginSuccess={onLoginSuccess} />
                </motion.div>
            )}

            {showRegister && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]"
                >
                    <RegisterPage onClose={handleCloseRegister} onRegistrationSuccess={handleRegistrationSuccess} />
                </motion.div>
            )}

            <div className="container mx-auto px-6 pt-16">
                <motion.header
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="container mx-auto mt-20 px-6 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                        <span className="bg-gradient-to-r from-blue-600 to-green-500 text-transparent bg-clip-text bg-[length:200%_auto] animate-gradient">
                            Summarize Any Website Instantly
                        </span>
                        <FaLink className="inline-block ml-4 text-blue-500" />
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Enter a URL and get a concise summary powered by AI. Save time by extracting key insights from web pages instantly.
                    </p>
                </motion.header>

                <div className="max-w-7xl mx-auto p-8">
                    <section className="mt-10 flex flex-col items-center gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-wrap justify-center gap-4"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative bg-gradient-to-r from-blue-500 to-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 overflow-hidden group"
                                onClick={() => navigate("/text")}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center justify-center gap-2">
                                    <span className="group-hover:scale-110 transition-transform duration-300">Summarize Text</span>
                                    <FaFileAlt className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
                                </div>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 overflow-hidden group"
                                onClick={() => navigate("/document")}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center justify-center gap-2">
                                    <span className="group-hover:scale-110 transition-transform duration-300">Summarize Document</span>
                                    <FaFilePdf className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
                                </div>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative bg-gradient-to-r from-purple-500 to-purple-600 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center justify-center gap-2">
                                    <span className="group-hover:scale-110 transition-transform duration-300">Summarize Link</span>
                                    <FaLink className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
                                </div>
                            </motion.button>
                        </motion.div>

                        <div className="relative flex items-center justify-center mt-4">
                            <button
                                onClick={() => setShowHelp(!showHelp)}
                                className="group relative rounded-full p-2 transition-all duration-500 hover:rotate-[360deg] focus:outline-none"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                                <HelpCircle
                                    className={`w-9 h-9 transition-all duration-500 ${showHelp
                                        ? 'text-purple-600 drop-shadow-[0_4px_8px_rgba(99,102,241,0.3)]'
                                        : 'text-gray-400 hover:text-blue-500 group-hover:scale-110 group-hover:drop-shadow-[0_4px_12px_rgba(59,130,246,0.25)]'
                                        }`}
                                    strokeWidth={1.5}
                                />
                            </button>

                            {showHelp && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.97 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="absolute top-full left-1/2 mt-2 w-80 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm shadow-2xl p-6 rounded-2xl border border-white/20 z-50"
                                    style={{
                                        background: 'radial-gradient(at top right, #f8fafc 0%, #f1f5f9 100%)',
                                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                    }}
                                >
                                    {/* Arrow indicator */}
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t border-l border-white/20" />

                                    <div className="flex justify-between items-start mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
                                                <FaLink className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                                                Quick Start Guide
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => setShowHelp(false)}
                                            className="p-1 hover:bg-gray-100/50 rounded-full transition-all duration-200 hover:rotate-90"
                                        >
                                            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                        </button>
                                    </div>

                                    <ul className="space-y-4">
                                        <motion.li
                                            className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/50 transition-colors"
                                            whileHover={{ x: 5 }}
                                        >
                                            <div className="flex-shrink-0 w-7 h-7 bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                                                1
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-700">Enter Document URL</p>
                                                <p className="text-sm text-gray-500 mt-1">Paste your document URL link to analyze</p>
                                            </div>
                                        </motion.li>

                                        <motion.li
                                            className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/50 transition-colors"
                                            whileHover={{ x: 5 }}
                                        >
                                            <div className="flex-shrink-0 w-7 h-7 bg-purple-500/10 text-purple-600 rounded-full flex items-center justify-center font-semibold">
                                                2
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-700">Generate Summary</p>
                                                <p className="text-sm text-gray-500 mt-1">Click the "Summarize" button for AI-powered analysis</p>
                                            </div>
                                        </motion.li>

                                        <motion.li
                                            className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/50 transition-colors"
                                            whileHover={{ x: 5 }}
                                        >
                                            <div className="flex-shrink-0 w-7 h-7 bg-pink-500/10 text-pink-600 rounded-full flex items-center justify-center font-semibold">
                                                3
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-700">Translate Results</p>
                                                <p className="text-sm text-gray-500 mt-1">Select language and click "Translate" for instant conversion</p>
                                            </div>
                                        </motion.li>
                                    </ul>
                                </motion.div>
                            )}
                        </div>


                    </section>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10"
                    >
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload Link</h3>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6">
                                <Link2 className="w-12 h-12 text-blue-500 mb-4" />
                                <input
                                    type="text"
                                    placeholder="Enter URL here (e.g., https://example.com)"
                                    value={linkInput}
                                    onChange={handleLinkChange}
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGenerateSummary}
                                disabled={isLoading}
                                className={`mt-6 w-full py-3 rounded-xl font-semibold text-white transition-colors ${isLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"
                                    }`}
                            >
                                {isLoading ? "Generating..." : "Generate Summary"}
                            </motion.button>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Summary Result</h3>
                            <div className="space-y-6">
                                {summaryResult && (
                                    <article className="bg-white rounded-xl border-2 border-gray-200 p-5 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                                <svg
                                                    className="w-6 h-6 text-green-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M6 15h.01M6 11h.01M9 11h.01M9 15h.01"
                                                    />
                                                </svg>
                                                Summary
                                            </h3>
                                            <span className="text-sm text-gray-500 font-medium">
                                                {summaryResult.length} chars
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <textarea
                                                className="w-full min-h-[180px] bg-transparent focus:outline-none resize-none text-gray-700 placeholder-gray-400 text-md"
                                                value={summaryResult}
                                                placeholder="✨ Your summary will appear here..."
                                                readOnly
                                            />
                                        </div>
                                    </article>
                                )}

                                {summaryResult && (
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
                                            className="w-full bg-gradient-to-br from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Translating..." : "Translate Now"}
                                        </button>

                                        {translatedContent && (
                                            <article className="bg-white rounded-xl border-2 border-gray-200 p-5 shadow-sm">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                                        <svg
                                                            className="w-6 h-6 text-purple-600"
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
                                                        {availableLanguages.find((l) => l.code === targetLang)?.name ||
                                                            "English"}
                                                        )
                                                    </h3>
                                                    <span className="text-sm text-gray-500 font-medium">
                                                        {translatedContent.length} chars
                                                    </span>
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
                                {!summaryResult && !error && !isLoading && (
                                    <p className="text-gray-400 italic text-center">
                                        Summary will appear here after processing...
                                    </p>
                                )}
                                {isLoading && !error && (
                                    <div className="text-center">
                                        <svg
                                            className="animate-spin h-5 w-5 text-gray-600 inline-block mr-2"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                        </svg>
                                        <p className="text-gray-600 inline">Processing...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
                
            </div>

            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="mx-auto mt-20 px-6 py-16 bg-gradient-to-br from-blue-50 to-purple-50 shadow-2xl shadow-blue-100/50"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mb-16 text-left"
                >
                    {/* Highlighted Title */}
                    <h2 className="flex items-center justify-center text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent mb-8">
                        Advanced Summarization & Translation
                        <span className="block mt-2 text-3xl md:text-4xl">with WebSummarizer</span>
                    </h2>

                    {/* Service Introduction */}
                    <p className="text-lg text-gray-700 max-w-3xl leading-relaxed">
                        WebSummarizer empowers you to <strong>quickly summarize web content</strong> and <strong>translate with precision</strong>.
                        Harnessing the power of <strong className="text-indigo-600">artificial intelligence</strong>, it effortlessly condenses lengthy articles into concise summaries
                        while delivering highly accurate translations across multiple languages.
                        Save time, stay informed, and experience seamless content transformation with WebSummarizer today!
                    </p>
                </motion.div>



                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
                    {/* How It Works Section */}
                    <motion.div
                        initial={{ x: -50 }}
                        whileInView={{ x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-blue-100 rounded-xl">
                                <CpuChipIcon className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">
                                Smart Summarization Process
                            </h3>
                        </div>

                        <motion.ul className="space-y-6">
                            {[
                                {
                                    icon: <GlobeAltIcon className="h-6 w-6 text-blue-500" />,
                                    title: "Web Content Extraction",
                                    desc: "Our AI-powered engine intelligently crawls and extracts the most relevant information from any webpage URL, ensuring you get the core content without distractions."
                                },
                                {
                                    icon: <ScaleIcon className="h-6 w-6 text-purple-500" />,
                                    title: "Contextual Analysis",
                                    desc: "Leveraging advanced Natural Language Processing (NLP), our system identifies key themes, concepts, and relationships within the text to provide a deeper understanding."
                                },
                                {
                                    icon: <FunnelIcon className="h-6 w-6 text-green-500" />,
                                    title: "Noise Reduction",
                                    desc: "Automatically eliminates ads, navigation menus, and other irrelevant elements, allowing you to focus solely on the essential information without unnecessary clutter."
                                },
                                {
                                    icon: <DocumentTextIcon className="h-6 w-6 text-pink-500" />,
                                    title: "Adaptive Summarization",
                                    desc: "Generates concise yet informative summaries tailored to your needs, whether you prefer a brief overview or a more detailed breakdown of the original content."
                                }
                            ].map((item, idx) => (
                                <motion.li
                                    key={idx}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex gap-4 p-4 hover:bg-blue-50/50 rounded-xl transition-colors"
                                >
                                    <div className="flex-shrink-0 p-3 bg-white rounded-lg shadow">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                            {item.title}
                                        </h4>
                                        <p className="text-gray-600">
                                            {item.desc}
                                        </p>
                                    </div>
                                </motion.li>
                            ))}
                        </motion.ul>

                    </motion.div>

                    {/* Benefits Section */}
                    <motion.div
                        initial={{ x: 50 }}
                        whileInView={{ x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-purple-100 rounded-xl">
                                <RocketLaunchIcon className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">
                                Why Choose WebSummarizer?
                            </h3>
                        </div>

                        <div className="grid gap-6">
                            {[
                                {
                                    color: "bg-blue-100",
                                    icon: <ClockIcon className="h-6 w-6 text-blue-600" />,
                                    title: "Lightning-Fast Summaries",
                                    desc: "Receive accurate and concise summaries in under 15 seconds with real-time AI processing, saving you valuable time."
                                },
                                {
                                    color: "bg-green-100",
                                    icon: <LanguageIcon className="h-6 w-6 text-green-600" />,
                                    title: "Seamless Multi-Language Support",
                                    desc: "Translate and summarize content across 50+ languages effortlessly, ensuring global accessibility and comprehension."
                                },
                                {
                                    color: "bg-orange-100",
                                    icon: <AdjustmentsHorizontalIcon className="h-6 w-6 text-orange-600" />,
                                    title: "Flexible Summarization Styles",
                                    desc: "Customize your summaries with structured bullet points or fluid paragraph formats to match your preferred reading style."
                                },
                                {
                                    color: "bg-pink-100",
                                    icon: <CloudArrowDownIcon className="h-6 w-6 text-pink-600" />,
                                    title: "Effortless Export & Sharing",
                                    desc: "Download your summaries in TXT format or copy them instantly to your clipboard for quick and easy access."
                                }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.02 }}
                                    className={`p-5 rounded-xl ${item.color} transition-all shadow-sm hover:shadow-md`}
                                >
                                    <div className="flex gap-4 items-center">
                                        <div className="p-2 bg-white rounded-lg">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800">
                                                {item.title}
                                            </h4>
                                            <p className="text-gray-600 mt-1">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                </div>

                {/* Use Cases Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-20"
                >
                    <h3 className="text-3xl font-bold text-center text-gray-800 mb-16">
                        Transform Your Workflow
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <AcademicCapIcon className="h-8 w-8 text-blue-600" />,
                                title: "Academic Research",
                                desc: "Quickly digest research papers and scholarly articles",
                                color: "bg-blue-100"
                            },
                            {
                                icon: <BriefcaseIcon className="h-8 w-8 text-purple-600" />,
                                title: "Business Intelligence",
                                desc: "Stay ahead with instant market reports analysis",
                                color: "bg-purple-100"
                            },
                            {
                                icon: <NewspaperIcon className="h-8 w-8 text-green-600" />,
                                title: "Media Monitoring",
                                desc: "Track news trends across multiple sources",
                                color: "bg-green-100"
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className={`${item.color} p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow`}
                            >
                                <div className="mb-6">
                                    <div className="p-4 bg-white w-fit rounded-2xl shadow">
                                        {item.icon}
                                    </div>
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 mb-4">
                                    {item.title}
                                </h4>
                                <p className="text-gray-600 leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-20 bg-gradient-to-r from-blue-600 to-purple-500 rounded-2xl p-12 text-center shadow-2xl"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
                        {[
                            { number: "5M+", label: "Pages Summarized" },
                            { number: "98%", label: "Accuracy Rate" },
                            { number: "50", label: "Languages Supported" },
                            { number: "15s", label: "Average Processing" }
                        ].map((stat, idx) => (
                            <div key={idx} className="space-y-4">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="text-4xl font-bold drop-shadow"
                                >
                                    {stat.number}
                                </motion.div>
                                <div className="text-sm font-medium opacity-90">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.section>

            {/* Truyền dữ liệu vào ChatBox */}
            <ChatBox linkPageContent={linkPageContent} />
        </div>
    );
};

export default LinkPage;