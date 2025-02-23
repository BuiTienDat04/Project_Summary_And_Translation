import React, { useState } from "react";
import { HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage"
import Navigation from "./Navigation";
import ServicesSection from "./ServicesSection";
import TextSummarizer from "./TextSummarizer";
import TextTranslator from "./TextTranslator";
import Footer from "./Footer";

import { FaFileAlt, FaSignInAlt, FaCheckCircle } from "react-icons/fa";
// Component TextPage quản lý trạng thái đăng nhập, đăng ký và giao diện người dùng
function TextPage() {
    // Quản lý trạng thái hiển thị của popup đăng nhập
    const [showLogin, setShowLogin] = useState(false);
    
    // Quản lý trạng thái hiển thị của popup đăng ký
    const [showRegister, setShowRegister] = useState(false);
    
    // Quản lý trạng thái hiển thị của popup thông báo khi đăng ký thành công
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    
    // Lưu tên người dùng đã đăng nhập (email)
    const [loggedInUsername, setLoggedInUsername] = useState(null);
    
    // Trạng thái hiển thị thông báo nhắc nhở đăng nhập
    const [loginPromptVisible, setLoginPromptVisible] = useState(false);
    
    // Trạng thái hiển thị trang trợ giúp
    const [showHelp, setShowHelp] = useState(false);
    
    // Lưu thông tin người dùng đã đăng nhập
    const [loggedInUser, setLoggedInUser] = useState(null); 
    
    // Kiểm soát trạng thái hiển thị thông báo chào mừng
    const [welcomeMessageVisible, setWelcomeMessageVisible] = useState(true);

    // Đóng popup đăng nhập
    const handleCloseLogin = () => setShowLogin(false);

    // Đóng popup đăng ký
    const handleCloseRegister = () => setShowRegister(false);

    // Hook điều hướng trang
    const navigate = useNavigate();

    // Mở popup đăng nhập khi nhấn vào nút "Đăng nhập"
    const handleLoginClick = () => setShowLogin(true);

    // Mở popup đăng ký khi nhấn vào nút "Đăng ký"
    const handleRegisterClick = () => setShowRegister(true);

    // Xử lý khi đăng ký thành công: hiển thị popup thông báo và đóng popup đăng ký
    const handleRegistrationSuccess = () => {
        setIsPopupVisible(true);
        setShowRegister(false);
    };

    // Xử lý khi đăng nhập thành công: lưu thông tin người dùng, đóng popup đăng nhập
    const handleLoginSuccess = (user) => {
        setLoggedInUser(user); // Lưu thông tin đầy đủ của người dùng
        setLoggedInUsername(user.email); // Lưu email người dùng
        setShowLogin(false); // Đóng popup đăng nhập
    };

    // Xử lý khi đăng xuất: xóa thông tin người dùng
    const handleLogout = () => {
        setLoggedInUsername(null);
        setLoggedInUser(null);
    };

    return (

        <div className="min-h-screen bg-indigo-200 font-sans">

            {showLogin && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
                    <LoginPage onClose={handleCloseLogin}
                        onLoginSuccess={handleLoginSuccess} />
                </div>
            )}

            {showRegister && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
                    <RegisterPage onClose={handleCloseRegister} onRegistrationSuccess={handleRegistrationSuccess} />
                </div>
            )}


            {/* Navigation Bar Explanation Text */}
            <div className="bg-indigo-100 py-2">
                <Navigation
                    loggedInUsername={loggedInUsername}
                    onLoginClick={handleLoginClick}
                    onRegisterClick={handleRegisterClick}
                    onLogout={handleLogout}
                />
            </div>

            {/* Header Section */}
            <header className="container mx-auto mt-24 px-6 text-center">

                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                    <span className="bg-gradient-to-r from-blue-600 to-green-500 text-transparent bg-clip-text">
                        AI-Powered Text Summarization Tool
                    </span>
                    <FaFileAlt className="inline-block ml-4 text-blue-500 animate-pulse" />
                </h1>
                <div className="container mx-auto px-6 text-center text-indigo-700 text-xl mt-10"> {/* Updated header text color to indigo-700 */}
                    Unlock the power of AI text summarization to simplify your reading and learning.
                </div>

                <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center">
                    Quickly grasp the main points from any type of text with advanced AI technology.
                </p>
            </header>

            {/* Features and Help Section */}
            <div className="flex items-center space-x-8 justify-center mt-12">
                <div className="flex space-x-4">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-200"
                    >
                        Summarize Text
                    </button>

                    <button
                        className="px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-green-200 border-2 border-green-600 bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => navigate("/")}
                    >
                        Summarize Document
                    </button>
                </div>

                {/* Help Icon */}
                <div className="relative">
                    <HelpCircle
                        className="w-7 h-7 text-gray-500 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                        onMouseEnter={() => setShowHelp(true)}
                        onMouseLeave={() => setShowHelp(false)}
                    />
                    {showHelp && (
                        <div className="absolute left-full top-1/2 ml-3 w-64 transform -translate-y-1/2 bg-white shadow-md p-4 rounded-md border border-gray-200 text-gray-700 z-10">
                            <h3 className="font-semibold text-gray-800 mb-2">Quick Guide:</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    <span className="font-semibold text-gray-600">1.</span> Enter text in the left panel.
                                </li>
                                <li>
                                    <span className="font-semibold text-gray-600">2.</span> Select the desired summary length.
                                </li>
                                <li>
                                    <span className="font-semibold text-gray-600">3.</span> Click the "Summarize" button.
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Layout chính: Tóm Tắt và Dịch nằm ngang nhau */}
            <div className="container mx-auto px-4 pt-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Cột Tóm Tắt */}
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <TextSummarizer />
                    </div>

                    {/* Cột Dịch */}
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <TextTranslator />
                    </div>
                </div>
            </div>

            {/* About Text Summarizer Section */}
            <section className="container mx-auto mt-20 px-6 py-10 bg-indigo-50 rounded-xl shadow-md border-2 border-gray-100"> {/* Updated section background and border to indigo-50 */}
                <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center"> {/* Updated heading text color to indigo-700 */}
                    About PDFSmart Text Summarizer
                </h2>
                <p className="text-gray-700 text-lg mb-6">
                    The PDFSmart Text Summarizer uses artificial intelligence to help you easily summarize any type of text. Below is some detailed information and benefits of using our tool.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-2xl font-semibold text-indigo-600 mb-3"> {/* Updated subheading text color to indigo-600 */}
                            What is a Text Summarizer?
                        </h3>
                        <p className="text-gray-700 mb-4">
                            A text summarizer helps users quickly grasp the main content of a long text without having to read the entire thing. It works by analyzing the text and extracting the most important parts, then synthesizing them into a concise and easy-to-understand summary.
                        </p>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Key Features:</h4> {/* Kept key features heading dark gray */}
                        <ul className="list-disc pl-5 text-gray-700">
                            <li>Automatic and fast text summarization.</li>
                            <li>Summary length options (short, medium, long).</li>
                            <li>Supports summarizing various types of text.</li>
                            <li>Friendly and easy-to-use interface.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-2xl font-semibold text-indigo-600 mb-3"> {/* Updated subheading text color to indigo-600 */}
                            Why Use a Text Summarizer?
                        </h3>
                        <p className="text-gray-700 mb-4">
                            In the age of information explosion, processing and grasping information quickly is extremely important. The PDFSmart Text Summarizer helps you save time and improve learning and work efficiency.
                        </p>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Benefits of Use:</h4> {/* Kept benefits heading dark gray */}
                        <ul className="list-disc pl-5 text-gray-700">
                            <li>Saves time reading and researching documents.</li>
                            <li>Effectively grasps core information.</li>
                            <li>Supports students, researchers.</li>
                            <li>Increases work and study productivity.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Services Section as Card Grid */}
            <ServicesSection />

            {/* Footer */}
            <Footer />

            {/* Success Registration Popup - Placed at the end of the component */}
            {isPopupVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4 border-2 border-gray-100"> {/* Updated popup border to light gray */}
                        <FaCheckCircle className="text-green-500 h-10 w-10" />
                        <h2 className="text-lg font-semibold mb-0 text-gray-700">You have successfully registered!</h2> {/* Updated popup text color to gray */}
                        <button
                            onClick={() => setIsPopupVisible(false)}
                            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {welcomeMessageVisible && loggedInUser && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg z-50 shadow-lg animate-slide-down">
                    <span className="font-medium">👋 Welcome back, {loggedInUser.email}!</span>
                    <button
                        onClick={() => setWelcomeMessageVisible(false)}
                        className="ml-4 text-green-700 hover:text-green-800"
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
}

export default TextPage