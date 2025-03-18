import React, { useState, useEffect } from "react"; // Import useEffect
import { HelpCircle, Upload, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaCheckCircle } from "react-icons/fa";
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

                        {/* Help Section */}
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
                                        Upload a document (PDF)
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-500 font-bold mr-2">2.</span>
                                        Click "Generate Summary"
                                    </li>
                                </ul>
                            </div>
                        </motion.div>
                    </section>

                    {/* Upload & Result Section */}
                    <DocumentSummarySection />
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
                        <strong>WebSummarizer</strong> helps you instantly extract key insights from any webpage, saving you time and effort with AI-driven summarization.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                                How does WebSummarizer work?
                            </h3>
                            <p className="text-gray-700 mb-5">
                                WebSummarizer utilizes <strong>Artificial Intelligence (AI)</strong> to analyze and summarize online content. The process includes:
                            </p>
                            <ul className="list-disc pl-5 text-gray-700 mb-5 space-y-2">
                                <li><strong>Extract Webpage Content:</strong> The AI scans the webpage to extract all readable text.</li>
                                <li><strong>Analyze and Identify Key Points:</strong> AI identifies the main arguments, key sentences, and important sections.</li>
                                <li><strong>Filter Out Redundant Information:</strong> Unnecessary or repetitive details are removed.</li>
                                <li><strong>Generate a Concise Summary:</strong> AI rephrases and structures the summary in a readable, logical format.</li>
                            </ul>
                            <p className="text-gray-700 mb-5">
                                This technology enables WebSummarizer to process news articles, blogs, and academic papers, delivering high-quality summaries in seconds.
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
                                <li><strong>Summarize Instantly:</strong> No need to read long articles—get key insights in seconds.</li>
                                <li><strong>Accurate AI Summaries:</strong> AI ensures key points are retained without unnecessary details.</li>
                                <li><strong>Supports Multiple Languages:</strong> Works with various languages for diverse content.</li>
                                <li><strong>User-Friendly Interface:</strong> Simple and intuitive for a seamless experience.</li>
                                <li><strong>Flexible Summary Types:</strong> Choose between short summaries or detailed key points.</li>
                                <li><strong>Easy Copy & Download:</strong> Save or share summaries effortlessly.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Additional Content */}
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
                                    Quickly summarize academic papers, research articles, and textbooks to save time and focus on key concepts.
                                </p>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-green-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                            >
                                <h4 className="text-xl font-bold text-green-700 mb-3">For Professionals</h4>
                                <p className="text-gray-700">
                                    Stay updated with industry trends by summarizing lengthy reports, whitepapers, and news articles.
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


            {/* Footer */}
            <div className="mt-40">
                <Footer />
            </div>
        </div>
    )
}

export default LinkPage
