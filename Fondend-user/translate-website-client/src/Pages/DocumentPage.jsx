import React, { useState, useEffect } from "react"; // Import useEffect
import { HelpCircle, Upload, Download, BookOpen, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaCheckCircle } from "react-icons/fa";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage"
import Navigation from "./Navigation";
import Footer from "./Footer";
import DocumentSummarySection from "./DocumentSummarySection";

import axios from "axios";
import { motion } from "framer-motion";
import { FaFilePdf, FaLink } from "react-icons/fa";

const DocumentPage = () => {
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
            <Navigation
                loggedInUsername={loggedInUsername}
                onLoginClick={handleLoginClick}
                onRegisterClick={handleRegisterClick}
                onLogout={handleLogout}
            />

            {/* Hiển thị form đăng nhập */}
            {showLogin && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
                    <LoginPage onClose={handleCloseLogin} onLoginSuccess={onLoginSuccess} />
                </div>
            )}

            {/* Hiển thị form đăng kí */}
            {showRegister && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
                    <RegisterPage onClose={handleCloseRegister} onRegistrationSuccess={handleRegistrationSuccess} />
                </div>
            )}

            {/* Main Content */}
            <div className="container mx-auto min-h-screen">
                <motion.header
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="container mx-auto px-6 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 flex items-center justify-center">
                        {/* Gradient Text with LED Effect */}
                        <span className="bg-gradient-to-r from-blue-600 to-green-500 text-transparent bg-clip-text bg-[length:200%_auto] animate-gradient">
                            Smart Document Summarization
                        </span>

                        {/* Simple Icon */}
                        <FaFilePdf className="ml-4 text-blue-500" />
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Transform complex documents into concise summaries with advanced AI technology. Supports various formats: PDF.
                    </p>
                </motion.header>

                {/* Feature Section */}
                <div className="max-w-7xl mx-auto p-8"> {/* Thêm div max-w-7xl ở đây */}
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
                                onClick={() => navigate("/link")}>
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
                            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.97 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="w-full max-w-md mx-4 bg-white/95 backdrop-blur-lg shadow-2xl p-6 rounded-2xl border border-white/20 relative"
                                    style={{
                                        background: 'radial-gradient(at top right, #f8fafc 0%, #f1f5f9 100%)',
                                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                    }}
                                >
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
                                        {["Upload PDF Document", "Generate Summary", "Translate Results"].map((title, index) => (
                                            <motion.li
                                                key={index}
                                                className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/50 transition-colors"
                                                whileHover={{ x: 5 }}
                                            >
                                                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-semibold ${index === 0 ? 'bg-blue-500/10 text-blue-600' : index === 1 ? 'bg-purple-500/10 text-purple-600' : 'bg-pink-500/10 text-pink-600'}`}>
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-700">{title}</p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {index === 0 ? "Drag & drop or click to upload your PDF file" : index === 1 ? "Click the 'Summarize' button for AI-powered analysis" : "Select language and click 'Translate' for instant conversion"}
                                                    </p>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </div>
                        )}
                    </div>



                    {/* Upload & Result Section */}
                    <DocumentSummarySection />
                </div>
            </div>


            <div className="flex flex-col items-center justify-start min-h-screen">
                <section className="w-full min-h-screen flex flex-col items-center px-0 bg-white">
                    <div className="relative w-full max-w-none flex flex-col items-center py-24">
                        {/* Animated Header Section */}
                        <div className="text-center mb-20 w-full max-w-none px-4 animate-fade-in-up">
                            <h2 className="text-4xl xl:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-8 animate-gradient-flow px-4">
                                📑 Master Your PDFs with AI-Powered Summarization
                            </h2>
                            <p className="text-gray-700 text-xl mb-12 leading-relaxed w-full max-w-none px-4">
                                Unlock the power of quick insights with <span className="font-semibold text-blue-600">PDFSmart</span>. Upload your PDF files and let our advanced AI transform them into
                                <span className="highlight-text"> concise, actionable summaries </span>
                                in seconds.
                            </p>
                        </div>

                        {/* Enhanced Feature Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 bg-gradient-to-r from-blue-100 to-blue-300 p-8 rounded-xl shadow-md">
                            {[
                                {
                                    icon: "⏱️",
                                    title: "Rapid PDF Processing",
                                    content: "Turn lengthy PDFs into summaries instantly with lightning-fast AI analysis.",
                                },
                                {
                                    icon: "🎯",
                                    title: "Pinpoint Accuracy",
                                    content: "Extract key points with 97% precision using smart context recognition.",
                                },
                                {
                                    icon: "📄",
                                    title: "PDF Expertise",
                                    content: "Designed to handle multi-page PDFs with seamless efficiency.",
                                },
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-fade-in-up"
                                    style={{ animationDelay: `${index * 0.2}s` }}
                                >
                                    <div className="text-4xl mb-4 animate-bounce-slow">{feature.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.content}</p>
                                </div>
                            ))}
                        </div>

                        {/* Detailed Explanation Section */}
                        <div className="space-y-10 animate-fade-in-up">
                            {/* Workflow Process */}
                            <div className="bg-purple-50 p-10 rounded-3xl shadow-2xl border-l-6 border-gradient-to-r from-blue-500 to-purple-500 transition-shadow duration-500 hover:shadow-xl">
                                <h3 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-4 animate__animated animate__fadeInDown">
                                    <span className="text-blue-600 animate__animated animate__pulse animate__infinite">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                        </svg>
                                    </span>
                                    How PDFSmart Transforms Your PDFs
                                </h3>
                                <div className="space-y-8">
                                    {[
                                        {
                                            title: "1. Upload & Analyze",
                                            description:
                                                "Simply upload your PDF, and our AI dives deep into its structure, decoding complex layouts and text with precision.",
                                            icon: "📤",
                                        },
                                        {
                                            title: "2. Core Insight Extraction",
                                            description:
                                                "Using advanced algorithms, we identify and pull out the most critical ideas, stripping away filler content effortlessly.",
                                            icon: "💡",
                                        },
                                        {
                                            title: "3. Smart Summarization",
                                            description:
                                                "Our AI condenses the PDF into a clear, concise summary, keeping the original meaning intact with no compromise.",
                                            icon: "📝",
                                        },
                                        {
                                            title: "4. Ready-to-Use Output",
                                            description:
                                                "Get a polished summary instantly, crafted in natural language for easy reading and immediate use.",
                                            icon: "✅",
                                        },
                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-6 p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors duration-300 animate__animated animate__fadeInUp"
                                        >
                                            <div className="text-3xl text-blue-500">{item.icon}</div>
                                            <div>
                                                <h4 className="font-semibold text-xl text-gray-800 mb-2">{item.title}</h4>
                                                <p className="text-gray-700 leading-relaxed">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Benefits Section */}
                            <div className="bg-gradient-to-br from-teal-500 to-purple-600 p-10 rounded-3xl text-white shadow-2xl transition-shadow duration-500 hover:shadow-xl mt-12">
                                <h3 className="text-3xl font-extrabold mb-8 flex items-center gap-4 animate__animated animate__fadeInDown">
                                    <span className="bg-white/20 p-3 rounded-xl animate__animated animate__bounce animate__infinite">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </span>
                                    Why Choose TextSum for PDFs?
                                </h3>
                                <div className="grid gap-8 md:grid-cols-2">
                                    {[
                                        {
                                            title: "⚡ Speed Up Your Workflow",
                                            description:
                                                "Summarize multi-page PDFs in seconds, cutting down reading time by up to 85%. Focus on decisions, not details.",
                                            icon: "⏱️",
                                        },
                                        {
                                            title: "🎯 Crystal-Clear Insights",
                                            description:
                                                "Achieve 97% accuracy in capturing key points, ensuring you never miss the essence of your documents.",
                                            icon: "✅",
                                        },
                                        {
                                            title: "📄 PDF Mastery",
                                            description:
                                                "Effortlessly handle complex PDFs, from reports to research papers, with tailored AI precision.",
                                            icon: "📚",
                                        },
                                        {
                                            title: "🛡️ Secure & Reliable",
                                            description:
                                                "Your PDFs are protected with top-tier encryption, guaranteeing privacy and peace of mind.",
                                            icon: "🔒",
                                        },
                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            className="p-8 bg-white/10 rounded-2xl backdrop-blur-md hover:bg-white/20 transition-all duration-300 animate__animated animate__fadeInUp"
                                        >
                                            <div className="text-4xl mb-4">{item.icon}</div>
                                            <div className="font-semibold text-xl mb-3">{item.title}</div>
                                            <div className="text-lg opacity-90 leading-relaxed">{item.description}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Animated Stats Section */}
                        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center animate-staggered-fade">
                            {[
                                ["📑 PDFs Processed", "500K+", "text-blue-600"],
                                ["⏱️ Time Saved", "1M+ Hours", "text-green-600"],
                                ["🎯 Accuracy Rate", "97%", "text-purple-600"],
                                ["📄 Pages Summarized", "10M+", "text-orange-600"],
                            ].map(([title, value, color], index) => (
                                <div
                                    key={index}
                                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                                    style={{ animationDelay: `${index * 0.3}s` }}
                                >
                                    <div className={`text-3xl font-bold mb-2 ${color}`}>{value}</div>
                                    <div className="text-sm text-gray-600">{title}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <style jsx>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes bounceSlow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          @keyframes gradient-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .animate-gradient-flow {
            background-size: 200% auto;
            animation: gradient-flow 5s ease infinite;
          }

          .highlight-text {
            background-image: linear-gradient(120deg, #93c5fd 0%, #c4b5fd 100%);
            background-repeat: no-repeat;
            background-size: 100% 45%;
            background-position: 0 95%;
            padding-bottom: 2px;
            transition: all 0.3s ease;
          }

          .highlight-text:hover {
            background-size: 100% 100%;
            padding-bottom: 0;
          }

          .space-y-10 > * + * {
            margin-top: 4rem;
          }
        `}</style>
                </section>
            </div>

        </div>
    );
};

export default DocumentPage;