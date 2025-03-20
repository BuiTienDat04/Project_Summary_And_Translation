import React, { useState, useEffect } from "react";
import { HelpCircle, Link2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaCheckCircle } from "react-icons/fa";
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";
import Navigation from "../Pages/Navigation";
import Footer from "../Pages/Footer";
import { motion } from "framer-motion";
import { FaFilePdf, FaLink } from "react-icons/fa";
import axios from "axios";
import ChatBox from "../Pages/ChatBox"; // Import the ChatBox component

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

    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

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

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="relative group"
                        >
                            <HelpCircle className="w-8 h-8 text-gray-500 hover:text-blue-600 cursor-pointer transition-colors" />
                            <div className="absolute left-full top-1/2 ml-4 -translate-y-1/2 w-80 bg-white p-6 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                                <h3 className="text-lg font-bold text-gray-800 mb-3">Quick Guide</h3>
                                <ul className="space-y-3 text-gray-600">
                                    <li className="flex items-start">
                                        <span className="text-blue-500 font-bold mr-2">1.</span>
                                        Enter a URL link
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-500 font-bold mr-2">2.</span>
                                        Click "Generate Summary"
                                    </li>
                                </ul>
                            </div>
                        </motion.div>
                    </section>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10"
                    >
                        {/* Upload Link Section */}
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload Link</h3>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6">
                                <Link2 className="w-12 h-12 text-blue-500 mb-4" />
                                <input
                                    type="text"
                                    placeholder="Enter URL here (e.g., https://example.com)"
                                    value={linkInput}
                                    onChange={handleLinkChange}
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        error ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGenerateSummary}
                                disabled={isLoading}
                                className={`mt-6 w-full py-3 rounded-xl font-semibold text-white transition-colors ${
                                    isLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"
                                }`}
                            >
                                {isLoading ? "Generating..." : "Generate Summary"}
                            </motion.button>
                        </div>

                        {/* Summary Result Section */}
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Summary Result</h3>
                            <div className="space-y-6">
                                {/* Summary Section */}
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

                                {/* Translation Section */}
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

                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="container mx-auto mt-20 px-6 py-12 bg-white rounded-xl shadow-lg"
                >
                    <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">
                        Discover WebSummarizer - AI-powered Web Content Summarization
                    </h2>
                    <p className="text-gray-700 text-lg mb-6 text-center">
                        <strong>WebSummarizer</strong> helps you instantly extract key insights from any webpage,
                        saving you time and effort with AI-driven summarization.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                                How does WebSummarizer work?
                            </h3>
                            <p className="text-gray-700 mb-5">
                                WebSummarizer utilizes <strong>Artificial Intelligence (AI)</strong> to analyze and
                                summarize online content. The process includes:
                            </p>
                            <ul className="list-disc pl-5 text-gray-700 mb-5 space-y-2">
                                <li>
                                    <strong>Extract Webpage Content:</strong> The AI scans the webpage to extract all
                                    readable text.
                                </li>
                                <li>
                                    <strong>Analyze and Identify Key Points:</strong> AI identifies the main arguments,
                                    key sentences, and important sections.
                                </li>
                                <li>
                                    <strong>Filter Out Redundant Information:</strong> Unnecessary or repetitive details
                                    are removed.
                                </li>
                                <li>
                                    <strong>Generate a Concise Summary:</strong> AI rephrases and structures the summary
                                    in a readable, logical format.
                                </li>
                            </ul>
                            <p className="text-gray-700 mb-5">
                                This technology enables WebSummarizer to process news articles, blogs, and academic
                                papers, delivering high-quality summaries in seconds.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                                Why choose WebSummarizer?
                            </h3>
                            <p className="text-gray-700 mb-5">
                                WebSummarizer stands out among summarization tools with key advantages:
                            </p>
                            <h4 className="text-lg font-semibold text-gray-800 mb-3">Key benefits:</h4>
                            <ul className="list-disc pl-5 text-gray-700 space-y-2">
                                <li>
                                    <strong>Summarize Instantly:</strong> No need to read long articles—get key insights
                                    in seconds.
                                </li>
                                <li>
                                    <strong>Accurate AI Summaries:</strong> AI ensures key points are retained without
                                    unnecessary details.
                                </li>
                                <li>
                                    <strong>Supports Multiple Languages:</strong> Works with various languages for
                                    diverse content.
                                </li>
                                <li>
                                    <strong>User-Friendly Interface:</strong> Simple and intuitive for a seamless
                                    experience.
                                </li>
                                <li>
                                    <strong>Flexible Summary Types:</strong> Choose between short summaries or detailed
                                    key points.
                                </li>
                                <li>
                                    <strong>Easy Copy & Download:</strong> Save or share summaries effortlessly.
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-10">
                        <h3 className="text-2xl font-semibold text-blue-600 mb-4 text-center">
                            Real-World Applications
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                            >
                                <h4 className="text-xl font-bold text-blue-700 mb-3">For Students</h4>
                                <p className="text-gray-700">
                                    Quickly summarize academic papers, research articles, and textbooks to save time and
                                    focus on key concepts.
                                </p>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-green-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                            >
                                <h4 className="text-xl font-bold text-green-700 mb-3">For Professionals</h4>
                                <p className="text-gray-700">
                                    Stay updated with industry trends by summarizing lengthy reports, whitepapers, and
                                    news articles.
                                </p>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-purple-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                            >
                                <h4 className="text-xl font-bold text-purple-700 mb-3">For Researchers</h4>
                                <p className="text-gray-700">
                                    Extract key insights from multiple sources to streamline your research process.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </motion.section>
            </div>

            <div className="mt-40">
                <Footer />
            </div>

            {/* Add the ChatBox component */}
            <ChatBox />
        </div>
    );
};

export default LinkPage;