import React, { useState, useEffect } from "react"; // Import useEffect
import { HelpCircle, Upload, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaCheckCircle } from "react-icons/fa";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage"
import Navigation from "./Navigation";
import Footer from "./Footer";
import DocumentSummarySection from "./DocumentSummarySection";

import axios from "axios";

const DocumentPage = () => {
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
        setLoggedInUsername("");
        localStorage.removeItem("loggedInUser");
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
                <div className="max-w-7xl mx-auto p-8"> {/* Thêm div max-w-7xl ở đây */}
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
                    <DocumentSummarySection />
                </div> {/* Đóng div max-w-7xl */}

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
        </div>
    );
};

export default DocumentPage;