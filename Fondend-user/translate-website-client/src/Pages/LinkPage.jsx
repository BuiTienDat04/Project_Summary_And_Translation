import React, { useState, useEffect } from "react"; // Import useEffect
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaCheckCircle, } from "react-icons/fa";
import { HelpCircle, BookOpen, X } from "lucide-react";
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

import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage"
import Navigation from "./Navigation";
import Footer from "./Footer";
import DocumentSummarySection from "./DocumentSummarySection";
import { motion } from "framer-motion";
import { FaFilePdf, FaLink } from "react-icons/fa";

const LinkPage = () => {
    const navigate = useNavigate();
    const [loggedInUsername, setLoggedInUsername] = useState("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const handleCloseLogin = () => setShowLogin(false);
    const handleCloseRegister = () => setShowRegister(false);
    const [showHelp, setShowHelp] = useState(false);

    // Xử lý đăng nhập/đăng ký
    const handleRegistrationSuccess = () => {
        setIsPopupVisible(true);
        setShowRegister(false);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
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

        // Xóa dữ liệu loggedInUser khỏi localStorage
        localStorage.removeItem('loggedInUser');

        // Điều hướng người dùng về trang đăng nhập (hoặc trang chủ)
        navigate('/');
        window.location.reload();
    };



    return (
        <div className="min-h-screen bg-indigo-200 font-sans">
            {/* Navigation */}
            <Navigation
                loggedInUsername={loggedInUsername}
                onLoginClick={handleLoginClick}
                onRegisterClick={handleRegisterClick}
                onLogout={handleLogout}
            />

            {/* Login Modal */}
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

            {/* Registration Modal */}
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

            {/* Main Content */}
            <div className="container mx-auto px-6 pt-16">
                {/* Header */}
                <motion.header
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="container mx-auto mt-20 px-6 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                        {/* Gradient Text with LED Effect */}
                        <span className="bg-gradient-to-r from-blue-600 to-green-500 text-transparent bg-clip-text bg-[length:200%_auto] animate-gradient">
                            Summarize Any Website Instantly
                        </span>

                        {/* Simple Icon */}
                        <FaLink className="inline-block ml-4 text-blue-500" />
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Enter a URL and get a concise summary powered by AI. Save time by extracting key insights from web pages instantly.
                    </p>
                </motion.header>

                {/* Feature Section */}
                <div className="max-w-7xl mx-auto p-8">
                    <section className="mt-10 flex flex-col items-center gap-8">
                        {/* Buttons */}
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
                                {/* Gradient Animation */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Button Content */}
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
                                {/* Gradient Animation */}
                                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Button Content */}
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
                                {/* Gradient Animation */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Button Content */}
                                <div className="relative flex items-center justify-center gap-2">
                                    <span className="group-hover:scale-110 transition-transform duration-300">Summarize Link</span>
                                    <FaLink className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
                                </div>
                            </motion.button>
                        </motion.div>
                    </section>

                    {/* Help Icon */}
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
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="absolute top-full left-1/2 mt-2 w-80 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm shadow-2xl p-6 rounded-2xl border border-white/20 z-50"
                                style={{
                                    background: 'radial-gradient(at top right, #f8fafc 0%, #f1f5f9 100%)',
                                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                                    border: '1px solid rgba(255,255,255,0.3)'
                                }}
                            >
                                {/* Arrow indicator */}
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t border-l border-white/20" />

                                <div className="flex justify-between items-start mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
                                            <BookOpen className="w-6 h-6 text-white" />
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

                    {/* Upload & Result Section */}
                    <DocumentSummarySection />
                </div>

            </div>
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="mx-auto mt-20 px-6 py-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-2xl shadow-blue-100/50"
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


            {/* Footer */}
            <div className="mt-40">
                <Footer />
            </div>
        </div>
    )
}

export default LinkPage
