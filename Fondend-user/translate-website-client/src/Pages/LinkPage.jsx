import React, { useState, useEffect } from "react";
import { HelpCircle, Link2, X, Sparkles, Zap, Globe, Cpu, Clock, Languages } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaCheckCircle, FaFilePdf, FaLink } from "react-icons/fa";
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";
import Navigation from "../Pages/Navigation";
import Footer from "../Pages/Footer";
import { motion } from "framer-motion";
import api from "../api/api";
import HistorySummary from "./HistorySummary";

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
    const [targetLang, setTargetLang] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [historyUpdated, setHistoryUpdated] = useState(false);
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

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

    const handleLanguageSelect = (code, name) => {
        setTargetLang(code);
        setSearchTerm(name);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("loggedInUser");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setLoggedInUser(user);
            setLoggedInUsername(user.email);
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsNavVisible(false);
            } else {
                setIsNavVisible(true);
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

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
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
    };

    const handleLinkChange = (e) => {
        setLinkInput(e.target.value);
        setError("");
        setSummaryResult("");
        setTranslatedContent("");
    };

    const handleGenerateSummary = async () => {
        const token = localStorage.getItem("token");
        if (!loggedInUser || !token) {
            setError("Please log in to generate a summary.");
            setShowLogin(true);
            return;
        }
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
            const response = await api.post("/summarize-link", { url: linkInput });
            const { summary } = response.data;
            setSummaryResult(summary || "No summary generated.");
            setHistoryUpdated(prev => !prev);
        } catch (error) {
            console.error("Error summarizing link:", error);
            if (error.response?.status === 401) {
                setError("Session expired. Please log in again.");
                localStorage.removeItem("token");
                localStorage.removeItem("loggedInUser");
                setShowLogin(true);
            } else {
                setError(error.response?.data?.error || "Error generating summary. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const translateSummary = async () => {
        const token = localStorage.getItem("token");
        if (!loggedInUser || !token) {
            setError("Please log in to translate the summary.");
            setShowLogin(true);
            return;
        }
        if (!summaryResult) {
            setError("Please generate a summary first.");
            return;
        }
        if (!targetLang) {
            setError("Please select a target language.");
            return;
        }
        setIsLoading(true);
        setError("");
        setTranslatedContent("");
        try {
            const response = await api.post("/translate", {
                text: summaryResult,
                targetLang,
                isSummary: true,
            });
            const { translation } = response.data;
            setTranslatedContent(translation || "No translation generated.");
            setHistoryUpdated(prev => !prev);
        } catch (error) {
            console.error("Error translating summary:", error);
            if (error.response?.status === 401) {
                setError("Session expired. Please log in again.");
                localStorage.removeItem("token");
                localStorage.removeItem("loggedInUser");
                setShowLogin(true);
            } else {
                setError(error.response?.data?.error || "Error translating summary. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-10"></div>
            </div>

            {/* Popups for Login and Register */}
            {showLogin && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[1000]">
                    <LoginPage onClose={handleCloseLogin} onLoginSuccess={onLoginSuccess} />
                </div>
            )}
            {showRegister && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[1000]">
                    <RegisterPage onClose={handleCloseRegister} onRegistrationSuccess={handleRegistrationSuccess} />
                </div>
            )}

            {/* Navigation Bar - Fixed with smooth hide/show */}
            <div className={`fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-white/20 transition-transform duration-300 ${isNavVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <Navigation
                    loggedInUsername={loggedInUsername}
                    onLoginClick={handleLoginClick}
                    onRegisterClick={handleRegisterClick}
                    onLogout={handleLogout}
                />
            </div>

            {/* Add padding to account for fixed nav */}
            <div className="pt-16"></div>

            {/* Hero Section */}
            <section className="relative py-16 lg:py-24">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/10"></div>
                <div className="container mx-auto px-4 relative">
                    <motion.div
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.7 }}
                        className="text-center max-w-4xl mx-auto mb-16"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 mb-8"
                        >
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">AI-Powered Web Content Intelligence</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Summarize Any Website with{" "}
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                Advanced AI
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                            Extract key insights, translate content, and unlock knowledge from any webpage instantly with our cutting-edge artificial intelligence technology.
                        </p>
                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap justify-center gap-8 mb-12"
                        >
                            {[
                                { number: "1M+", label: "Websites Processed" },
                                { number: "96%", label: "Accuracy Rate" },
                                { number: "50+", label: "Languages Supported" },
                                { number: "10s", label: "Average Processing" }
                            ].map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                                    <div className="text-sm text-gray-500">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                    {/* Service Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16"
                    >
                        {[
                            {
                                title: "Text Summarizer",
                                description: "Process direct text input with intelligent AI analysis",
                                icon: FaFileAlt,
                                color: "from-blue-500 to-cyan-500",
                                hoverColor: "hover:from-blue-600 hover:to-cyan-600",
                                features: ["Smart Extraction", "Context Aware", "Multiple Formats"],
                                onClick: () => navigate("/text")
                            },
                            {
                                title: "Document Processor",
                                description: "Upload and analyze PDF documents with advanced AI",
                                icon: FaFilePdf,
                                color: "from-green-500 to-emerald-500",
                                hoverColor: "hover:from-green-600 hover:to-emerald-600",
                                features: ["PDF Support", "Batch Processing", "Secure Upload"],
                                onClick: () => navigate("/document")
                            },
                            {
                                title: "Web Content",
                                description: "Extract and summarize content from any webpage URL",
                                icon: FaLink,
                                color: "from-purple-500 to-pink-500",
                                hoverColor: "hover:from-purple-600 hover:to-pink-600",
                                features: ["URL Processing", "Real-time Fetch", "Content Cleaning"],
                                onClick: () => {}
                            }
                        ].map((service, index) => (
                            <motion.div
                                key={service.title}
                                whileHover={{ y: -8, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative group cursor-pointer"
                                onClick={service.onClick}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 rounded-3xl shadow-lg border border-gray-200 transform group-hover:scale-105 transition-all duration-300" />
                                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                                    <div className={`relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${service.color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                        <service.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3 relative">{service.title}</h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                                    <div className="space-y-2 mb-6">
                                        {service.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-sm text-gray-500">
                                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color}`} />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                    <div className={`flex items-center gap-2 text-sm font-medium bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                                        Get Started
                                        <Zap className="w-4 h-4" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <button
                            onClick={() => setShowHelp(true)}
                            className="flex items-center gap-3 px-8 py-4 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700 font-semibold hover:scale-105"
                        >
                            <HelpCircle className="w-5 h-5 text-blue-600" />
                            How It Works
                        </button>
                        {!loggedInUser && (
                            <button
                                onClick={handleRegisterClick}
                                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-white font-semibold hover:scale-105 hover:from-blue-700 hover:to-purple-700"
                            >
                                <Sparkles className="w-5 h-5" />
                                Start Free Today
                            </button>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* History Summary */}
            <HistorySummary key={historyUpdated ? 'refresh' : 'normal'} />

            {/* Main Content Section */}
            <section className="relative py-12">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-7xl mx-auto"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                            {/* Input Section */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                                            <Link2 className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">Enter Website URL</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-medium text-gray-700">Website URL</label>
                                            <input
                                                type="text"
                                                placeholder="https://example.com/article"
                                                value={linkInput}
                                                onChange={handleLinkChange}
                                                className={`w-full p-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 ${error ? "border-red-500" : "border-gray-200"}`}
                                            />
                                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleGenerateSummary}
                                            disabled={isLoading}
                                            className={`w-full py-4 rounded-2xl font-semibold text-white transition-all duration-300 shadow-lg ${isLoading
                                                ? "bg-indigo-400 cursor-not-allowed"
                                                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
                                                }`}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center gap-3">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Generating Summary...
                                                </div>
                                            ) : (
                                                "Generate Summary"
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                            {/* Results Section */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">Summary Results</h3>
                                    </div>
                                    <div className="space-y-6">
                                        {summaryResult && (
                                            <div className="space-y-6">
                                                {/* Summary */}
                                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="text-lg font-semibold text-gray-800">Summary</h4>
                                                        <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                                                            {summaryResult.length} chars
                                                        </span>
                                                    </div>
                                                    <div className="max-h-60 overflow-y-auto">
                                                        <p className="text-gray-700 leading-relaxed">{summaryResult}</p>
                                                    </div>
                                                </div>
                                                {/* Translation Section */}
                                                <div className="space-y-4">
                                                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100 shadow-md">
                                                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Translate Summary</h4>
                                                        <div className="space-y-4">
                                                            {/* Language Selection */}
                                                            <div className="relative z-10">
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Select Target Language
                                                                </label>
                                                                <div className="relative">
                                                                    <input
                                                                        type="text"
                                                                        className="w-full p-4 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 bg-white shadow-sm pr-10"
                                                                        placeholder="Search language..."
                                                                        value={searchTerm}
                                                                        onChange={(e) => {
                                                                            setSearchTerm(e.target.value);
                                                                            setIsDropdownOpen(true);
                                                                        }}
                                                                        onFocus={() => setIsDropdownOpen(true)}
                                                                        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                                                                    />
                                                                    <Languages className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                                                                    {isDropdownOpen && (
                                                                        <ul className="absolute z-20 mt-2 w-full bg-white border border-emerald-200 rounded-2xl shadow-lg max-h-48 overflow-y-auto">
                                                                            {filteredLanguages.map((lang) => (
                                                                                <li
                                                                                    key={lang.code}
                                                                                    className="px-4 py-3 hover:bg-emerald-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200 flex items-center justify-between"
                                                                                    onClick={() => handleLanguageSelect(lang.code, lang.name)}
                                                                                >
                                                                                    <span className="text-gray-700">{lang.name}</span>
                                                                                    <span className="text-emerald-600 font-medium">{lang.code.toUpperCase()}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {/* Translate Button */}
                                                            <motion.button
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                onClick={translateSummary}
                                                                disabled={isLoading || !summaryResult || !targetLang}
                                                                className={`w-full py-4 rounded-2xl font-semibold text-white transition-all duration-300 shadow-lg flex items-center justify-center gap-3 ${
                                                                    isLoading || !summaryResult || !targetLang
                                                                        ? "bg-gray-400 cursor-not-allowed"
                                                                        : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 hover:shadow-xl"
                                                                }`}
                                                            >
                                                                {isLoading ? (
                                                                    <>
                                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                                        Translating...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Languages className="w-5 h-5" />
                                                                        Translate Summary
                                                                    </>
                                                                )}
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                    {/* Translation Result */}
                                                    {translatedContent && (
                                                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <h4 className="text-lg font-semibold text-gray-800">
                                                                    Translation ({availableLanguages.find((l) => l.code === targetLang)?.name || "Unknown"})
                                                                </h4>
                                                                <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                                                                    {translatedContent.length} chars
                                                                </span>
                                                            </div>
                                                            <div className="max-h-60 overflow-y-auto">
                                                                <p className="text-gray-700 leading-relaxed">{translatedContent}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {!summaryResult && !error && !isLoading && (
                                            <div className="text-center py-12">
                                                <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                    <Sparkles className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 text-lg">Your summary will appear here after processing...</p>
                                            </div>
                                        )}
                                        {isLoading && !error && (
                                            <div className="text-center py-12">
                                                <div className="w-20 h-20 bg-gradient-to-br from-blue-200 to-blue-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                                </div>
                                                <p className="text-gray-600 text-lg">Processing your request...</p>
                                            </div>
                                        )}
                                        {error && (
                                            <div className="text-center py-12">
                                                <p className="text-red-500 text-lg">{error}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-20 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Why Choose Our{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Web Summarizer
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Experience the power of AI-driven web content analysis that saves you time and enhances productivity
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        {[
                            {
                                icon: <Globe className="w-8 h-8 text-blue-600" />,
                                title: "Universal Compatibility",
                                description: "Works with any website, blog, news article, or online content",
                                color: "bg-blue-50"
                            },
                            {
                                icon: <Cpu className="w-8 h-8 text-green-600" />,
                                title: "Smart AI Processing",
                                description: "Advanced algorithms extract key insights while maintaining context",
                                color: "bg-green-50"
                            },
                            {
                                icon: <Languages className="w-8 h-8 text-purple-600" />,
                                title: "Multi-language Support",
                                description: "Translate summaries into 20+ languages with high accuracy",
                                color: "bg-purple-50"
                            },
                            {
                                icon: <Clock className="w-8 h-8 text-orange-600" />,
                                title: "Instant Results",
                                description: "Get summarized content in seconds, not hours",
                                color: "bg-orange-50"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="text-center group"
                            >
                                <div className={`w-20 h-20 ${feature.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="relative py-20 bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Perfect For Every{" "}
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Use Case
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            From students to professionals, our web summarizer adapts to your needs
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                icon: "🎓",
                                title: "Students & Researchers",
                                description: "Quickly digest academic papers, research articles, and study materials",
                                features: ["Academic Research", "Study Materials", "Paper Analysis"]
                            },
                            {
                                icon: "💼",
                                title: "Professionals",
                                description: "Stay updated with industry news, reports, and competitor analysis",
                                features: ["Market Research", "Business Intelligence", "Competitor Analysis"]
                            },
                            {
                                icon: "📰",
                                title: "Content Creators",
                                description: "Gather insights and inspiration from various sources efficiently",
                                features: ["Content Research", "Trend Analysis", "Inspiration Gathering"]
                            }
                        ].map((useCase, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <div className="text-4xl mb-6">{useCase.icon}</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{useCase.title}</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">{useCase.description}</p>
                                <div className="space-y-2">
                                    {useCase.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-gray-700">
                                            <FaCheckCircle className="w-4 h-4 text-green-500" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="relative py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            What Our{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Users Say
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Hear from those who have transformed their workflow with our AI-powered summarizer
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {[
                            {
                                name: "Sarah T., Student",
                                quote: "This tool has saved me hours of reading time! I can quickly get the gist of any research paper.",
                                avatar: "🎓",
                                rating: 5
                            },
                            {
                                name: "James R., Marketing Manager",
                                quote: "Perfect for keeping up with industry news without getting overwhelmed by lengthy articles.",
                                avatar: "💼",
                                rating: 5
                            },
                            {
                                name: "Emily K., Blogger",
                                quote: "The translation feature is a game-changer for researching international content ideas!",
                                avatar: "📰",
                                rating: 4
                            }
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{testimonial.name}</h3>
                                <p className="text-gray-600 mb-4 leading-relaxed">"{testimonial.quote}"</p>
                                <div className="flex justify-center gap-1">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <span key={i} className="text-yellow-400">★</span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Help Modal */}
            {showHelp && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <HelpCircle className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">How to Use Web Summarizer</h3>
                            </div>
                            <button
                                onClick={() => setShowHelp(false)}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {[
                                {
                                    step: "1",
                                    title: "Enter Website URL",
                                    description: "Paste any webpage URL starting with http:// or https://",
                                    icon: "🔗"
                                },
                                {
                                    step: "2",
                                    title: "AI Processing",
                                    description: "Our advanced AI analyzes and extracts key content from the webpage",
                                    icon: "🤖"
                                },
                                {
                                    step: "3",
                                    title: "Get Summary & Translate",
                                    description: "Receive concise summary and translate to any language instantly",
                                    icon: "🌍"
                                }
                            ].map((item) => (
                                <div key={item.step} className="flex gap-4 group">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center font-semibold text-white text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            {item.icon}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 text-lg mb-2">{item.title}</h4>
                                        <p className="text-gray-600 leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <button
                                onClick={() => setShowHelp(false)}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Got It, Let's Start!
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default LinkPage;