import {
    FaBookOpen, FaLanguage, FaFileAlt, FaGlobe,
    FaClock, FaShieldAlt, FaCheckCircle, FaRocket,
    FaLightbulb, FaCode, FaPaintBrush, FaMagic, FaRobot, FaBrain, FaCloud
} from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useRef } from "react";
import { useNavigate } from 'react-router-dom';
import LoginPage from '../../Pages/LoginPage';
import RegisterPage from '../../Pages/RegisterPage';
import Navigation from '../../Pages/Navigation';
import Footer from '../../Pages/Footer';
import homeLogo from '../../Pages/images/logo.png';
import BtecLogo from '../../Pages/images/btec.png'
import AboutusLogo from '../../Pages/images/aboutus.png'
import LogoPower from '../../Pages/images/logo2.png'
import LogoPower1 from '../../Pages/images/logo3.png'
import LogoPower2 from '../../Pages/images/logo3.png'
import LogoPower3 from '../../Pages/images/logo5.png'


const NaAboutus = () => {  // ✅ Renamed to start with an uppercase letter

    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [loggedInUsername, setLoggedInUsername] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const handleCloseLogin = () => setShowLogin(false);
    const handleCloseRegister = () => setShowRegister(false);
    const navigate = useNavigate();

    const handleLoginClick = () => setShowLogin(true);
    const handleRegisterClick = () => setShowRegister(true);

    const handleOpenRegister = () => {
        setShowLogin(false); // Ẩn modal đăng nhập
        setShowRegister(true); // Hiển thị form đăng ký
    };


    const handleRegistrationSuccess = () => {
        setIsPopupVisible(true);
        setShowRegister(false);
    };


    const handleLoginSuccess = (user) => {
        setLoggedInUser(user);
        setLoggedInUsername(user.email);
        setShowLogin(false);
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        navigate('/text');
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            setLoggedInUser(JSON.parse(storedUser));
            setLoggedInUsername(JSON.parse(storedUser).email);
        }
    }, []);





    return (

        <div className="min-h-screen bg-indigo-200 font-sans"> {/* Thêm padding-top để tránh navigation */}
            {/* Navigation Bar */}
            <nav className="bg-indigo-200 font-sans shadow-md fixed w-full z-50 top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <span className="text-2xl font-bold text-blue-600">PDFSmart</span>
                        </div>
                        <div className="bg-indigo-100 py-2 rounded-lg">
                            <Navigation
                                onLoginClick={handleLoginClick}
                                onRegisterClick={handleRegisterClick}
                            />
                        </div>
                        {/* Popups for Login and Register */}
                        {showLogin && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
                                <LoginPage onClose={handleCloseLogin}
                                    onLoginSuccess={handleLoginSuccess}
                                    onOpenRegister={handleOpenRegister} />
                            </div>
                        )}

                        {showRegister && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
                                <RegisterPage
                                    onClose={handleCloseRegister}
                                    onRegistrationSuccess={handleRegistrationSuccess}
                                />
                            </div>
                        )}

                    </div>
                </div>
            </nav>

            <div className="bg-indigo-200 font-sans p-6 shadow-lg rounded-lg px-8 md:px-24 pt-20"> {/* Removed max-w, added horizontal padding */}

                {/* Section 1 - Introduction with Image */}
                <section className="group mb-24 mt-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/20 transform -skew-y-3 -rotate-3 opacity-50" />
                    <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
                        <div className="space-y-8">
                            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500 mb-6 leading-tight animate-gradient-x">
                                Unlock the Full Potential of Your Documents with PDFSmart
                            </h1>

                            <div className="space-y-6">
                                <p className="text-xl text-gray-700 leading-relaxed opacity-0 animate-fade-in-up [animation-delay:200ms] [animation-fill-mode:forwards]">
                                    Revolutionizing document management through AI-powered solutions. PDFSmart redefines how you interact with digital content.
                                </p>

                                {/* Thêm các điểm nổi bật */}
                                <div className="opacity-0 animate-fade-in-up [animation-delay:300ms] [animation-fill-mode:forwards]">
                                    <div className="flex items-center space-x-4 text-blue-600">
                                        <FaCheckCircle className="flex-shrink-0" />
                                        <span className="font-semibold">AI-Powered Document Processing</span>
                                    </div>
                                </div>

                                <div className="opacity-0 animate-fade-in-up [animation-delay:400ms] [animation-fill-mode:forwards]">
                                    <div className="flex items-center space-x-4 text-purple-600">
                                        <FaClock className="flex-shrink-0" />
                                        <span className="font-semibold">Save 50%+ Time on Document Tasks</span>
                                    </div>
                                </div>

                                <div className="opacity-0 animate-fade-in-up [animation-delay:500ms] [animation-fill-mode:forwards]">
                                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-transform shadow-lg hover:shadow-xl relative overflow-hidden group"
                                        onClick={handleLoginClick}>
                                        <span className="relative z-10">Start Free Trial</span>
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Image Container với hiệu ứng méo động */}
                        <div className="relative group perspective-1000">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl transform rotate-[8deg] skew-y-3 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                            <div className="relative overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 
                group-hover:[transform:rotate3d(1,-1,0,8deg)_scale(1.05)]">
                                <img
                                    src={LogoPower3}
                                    alt="PDFSmart Interface"
                                    className="w-full h-full object-cover rounded-3xl border-8 border-white/90 transform transition-transform duration-500 
                        clip-path-[polygon(0_0,100%_0,100%_90%,90%_100%,0_100%)]"
                                />

                                {/* Gradient Overlay Animation */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Border Animation */}
                                <div className="absolute inset-0 border-8 border-transparent group-hover:border-white/20 
                    transition-all duration-500 rounded-3xl" />
                            </div>

                            {/* Floating Effect */}
                            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-purple-500/10 rounded-full blur-xl 
                animate-float opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                    </div>
                </section>

                <style jsx global>{`
    @keyframes gradient-x {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(10deg); }
    }
    .animate-gradient-x {
        background-size: 200% auto;
        animation: gradient-x 5s ease infinite;
    }
    .animate-fade-in-up {
        animation: fade-in-up 0.6s ease-out forwards;
    }
    .animate-float {
        animation: float 4s ease-in-out infinite;
    }
    .perspective-1000 {
        perspective: 1000px;
    }
`}</style>

                {/* Section 2 - PDFSmart Story */}
                <section className="">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            {/* Image Container với hiệu ứng mới */}
                            <div className="relative group perspective-1000">
                                <div className="absolute -left-8 -top-8 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-float" />
                                <div className="flex flex-col items-center">
                                    <div className="text-center mb-4">
                                        <h3 className="text-4xl font-bold text-blue-700">BTEC FPT Collaboration Project</h3>
                                        <p className="text-lg text-gray-800">Journey of building and development</p>
                                    </div>
                                    <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl border-8 border-white/90 transform transition-all duration-700 hover:rotate-2 hover:scale-[1.02] group">
                                        <img
                                            src={BtecLogo}
                                            alt="BTEC FPT Project"
                                            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-float delay-1000" />
                                    </div>
                                </div>
                            </div>

                            {/* Content Container */}
                            <div className="space-y-8 relative">
                                <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent opacity-0 animate-fade-in-up [animation-fill-mode:forwards]">
                                    From Classroom Innovation to Global Solution
                                </h2>

                                <div className="space-y-8">
                                    <div className="space-y-8">
                                        {/* Timeline */}
                                        <div className="relative opacity-0 animate-fade-in-up [animation-delay:200ms] [animation-fill-mode:forwards]">
                                            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-green-500 to-teal-400 rounded-full" />

                                            <div className="ml-8 space-y-10">
                                                {/* Timeline Item 1 */}
                                                <div className="relative">
                                                    <div className="absolute -left-11 top-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                                        <FaPaintBrush className="text-white w-4 h-4" />
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">🚀 Frontend Foundation (January 2025)</h3>
                                                    <p className="text-gray-600 leading-relaxed">
                                                        Starting with interface development, the team focused on creating modern, user-friendly UI/UX design.
                                                        Design principles like Material Design and Tailwind CSS were implemented to ensure aesthetic appeal
                                                        and scalability while optimizing user experience.
                                                    </p>
                                                </div>

                                                {/* Timeline Item 2 */}
                                                <div className="relative">
                                                    <div className="absolute -left-11 top-2 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                                                        <FaCode className="text-white w-4 h-4" />
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">🔧 Backend Development & Data Integration (February - March 2025)</h3>
                                                    <p className="text-gray-600 leading-relaxed">
                                                        Parallel with frontend work, the team developed a robust backend system using Node.js and PostgreSQL
                                                        to ensure fast processing speeds and scalability. During this phase, APIs were designed with both
                                                        RESTful and GraphQL architectures to optimize performance.
                                                    </p>
                                                </div>

                                                {/* Timeline Item 3 */}
                                                <div className="relative">
                                                    <div className="absolute -left-11 top-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                                        <FaRocket className="text-white w-4 h-4" />
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">🎉 Testing, Finalization & Launch (April 2025)</h3>
                                                    <p className="text-gray-600 leading-relaxed">
                                                        After multiple testing phases incorporating user feedback, the product was optimized for both
                                                        performance and user experience. Finally in April, we officially launched the first version,
                                                        aiming to deliver an optimal solution for the global user community.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Achievement Stats */}
                                    <div className="grid grid-cols-2 gap-6 opacity-0 animate-fade-in-up [animation-delay:400ms] [animation-fill-mode:forwards]">
                                        <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                                            <div className="text-3xl font-bold text-green-600 mb-2">15K+</div>
                                            <div className="text-gray-600">Daily Processed Documents</div>
                                        </div>
                                        <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                                            <div className="text-3xl font-bold text-teal-600 mb-2">4.9/5</div>
                                            <div className="text-gray-600">User Satisfaction Score</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <style jsx global>{`
    @keyframes timeline-entry {
        0% { opacity: 0; transform: translateX(-20px); }
        100% { opacity: 1; transform: translateX(0); }
    }
    .animate-timeline {
        animation: timeline-entry 0.6s ease-out forwards;
    }
`}</style>

                <style jsx global>{`
    @keyframes gradient-x {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-gradient-x {
        background-size: 200% auto;
        animation: gradient-x 5s ease infinite;
    }
    .animate-fade-in-up {
        animation: fade-in-up 0.6s ease-out forwards;
    }
`}</style>
                {/* Section 3 - PDFSmart Power */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Feature List */}
                            <div className="space-y-12 relative z-10">
                                <h2 className="text-5xl font-bold mb-12 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent animate-gradient-x text-center whitespace-nowrap">
                                    ⚡ PDFSmart Superpowers
                                </h2>

                                <div className="space-y-10">
                                    {/* Feature Item 1 */}
                                    <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 opacity-0 animate-fade-in-up [animation-delay:200ms]">
                                        <div className="flex items-start space-x-6">
                                            <div className="flex-shrink-0 w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                                                <FaBookOpen className="w-7 h-7 text-blue-600 transform hover:scale-110 transition-transform" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-semibold text-gray-800 mb-3">AI-Powered Summarization</h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    Distill complex documents into key insights instantly using our neural network algorithms.
                                                    Achieve 85% faster comprehension with intelligent content extraction.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Feature Item 2 */}
                                    <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 opacity-0 animate-fade-in-up [animation-delay:400ms]">
                                        <div className="flex items-start space-x-6">
                                            <div className="flex-shrink-0 w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                                                <FaLanguage className="w-7 h-7 text-green-600 transform hover:scale-110 transition-transform" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Real-Time Translation</h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    Seamlessly translate between 68 languages with industry-leading accuracy.
                                                    Maintain original formatting and context across all translations.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Feature Item 3 */}
                                    <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 opacity-0 animate-fade-in-up [animation-delay:600ms]">
                                        <div className="flex items-start space-x-6">
                                            <div className="flex-shrink-0 w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                                                <FaFileAlt className="w-7 h-7 text-orange-600 transform hover:scale-110 transition-transform" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Universal Format Support</h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    Handle 150+ file types including PDF, DOCX, Markdown, and images.
                                                    Cloud-synced conversion preserves all elements perfectly.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Feature Item 4 */}
                                    <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 opacity-0 animate-fade-in-up [animation-delay:800ms]">
                                        <div className="flex items-start space-x-6">
                                            <div className="flex-shrink-0 w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                                                <FaGlobe className="w-7 h-7 text-purple-600 transform hover:scale-110 transition-transform" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Global Accessibility</h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    28-language interface with RTL support.
                                                    ADA-compliant design ensures accessibility for all users.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Image Container */}
                            <div className="relative group h-[600px] perspective-2000">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-400 rounded-[3rem] transform rotate-3 scale-105 blur-3xl opacity-20 animate-pulse" />

                                <div className="relative h-full overflow-hidden rounded-[2.5rem] shadow-2xl border-8 border-white transform transition-all duration-700 hover:rotate-0 group-hover:scale-95">
                                    <img
                                        src={LogoPower1}
                                        alt="PDFSmart Features"
                                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                                    {/* Floating Elements */}
                                    <div className="absolute top-8 left-8 p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg w-64">
                                        <div className="flex items-center space-x-3">
                                            <FaMagic className="text-purple-600 w-6 h-6" />
                                            <span className="font-semibold">Smart Formatting</span>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-8 right-8 p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg w-64">
                                        <div className="flex items-center space-x-3">
                                            <FaRobot className="text-pink-600 w-6 h-6" />
                                            <span className="font-semibold">AI Analysis</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-gradient-to-br from-indigo-50 to-teal-50 relative overflow-visible w-screen -mx-[calc((100vw-100%)/2)]">
                    <div className="container mx-auto px-4 w-full max-w-none">
                        <div className="w-full lg:px-8">
                            {/* Tiêu đề */}
                            <div className="text-center mb-20 opacity-0 animate-fade-in-up [animation-fill-mode:forwards]">
                                <h2 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-teal-500 to-orange-400 bg-clip-text text-transparent animate-gradient-x pb-3 leading-tight mx-auto max-w-4xl">
                                    Why PDFSmart Stands Out
                                </h2>
                                <p className="text-xl text-gray-600 mt-6 px-4">Discover the unparalleled advantages that make us the top choice</p>
                            </div>

                            {/* Grid container */}
                            <div className="grid md:grid-cols-3 gap-8 w-full max-w-7xl mx-auto px-4">
                                {/* Feature Card 1 */}
                                <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 animate-fade-in-up [animation-delay:200ms] group h-full">
                                    <div className="mb-6">
                                        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                                            <FaClock className="w-8 h-8 text-red-600" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">10x Efficiency Boost</h3>
                                    <p className="text-gray-600 mb-6">
                                        Automate 90% of document tasks with smart AI workflows, reclaiming 15+ hours monthly for strategic work.
                                    </p>
                                    <div className="bg-red-50 px-4 py-2 rounded-full inline-flex items-center">
                                        <span className="text-red-600 text-sm font-semibold">Time Saved: 15h+/month</span>
                                    </div>
                                </div>

                                {/* Feature Card 2 */}
                                <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 animate-fade-in-up [animation-delay:400ms] group h-full">
                                    <div className="mb-6">
                                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center transform group-hover:-rotate-12 transition-transform">
                                            <FaBrain className="w-8 h-8 text-blue-600" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Cognitive Enhancement</h3>
                                    <p className="text-gray-600 mb-6">
                                        85% users report improved comprehension and faster decision-making with our AI-powered insights.
                                    </p>
                                    <div className="bg-blue-50 px-4 py-2 rounded-full inline-flex items-center">
                                        <span className="text-blue-600 text-sm font-semibold">85% Improved Comprehension</span>
                                    </div>
                                </div>

                                {/* Feature Card 3 */}
                                <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 animate-fade-in-up [animation-delay:600ms] group h-full">
                                    <div className="mb-6">
                                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                            <FaShieldAlt className="w-8 h-8 text-green-600" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Military-Grade Security</h3>
                                    <p className="text-gray-600 mb-6">
                                        End-to-end encryption with zero data retention. GDPR compliant and ISO 27001 certified infrastructure.
                                    </p>
                                    <div className="bg-green-50 px-4 py-2 rounded-full inline-flex items-center">
                                        <span className="text-green-600 text-sm font-semibold">100% Data Privacy</span>
                                    </div>
                                </div>
                            </div>

                            {/* Background elements */}
                            <div className="absolute top-1/4 -left-[500px] w-[1000px] h-[1000px] bg-indigo-100 rounded-full blur-[150px] opacity-40 animate-pulse -z-10" />
                            <div className="absolute bottom-1/4 -right-[500px] w-[1000px] h-[1000px] bg-teal-100 rounded-full blur-[150px] opacity-30 animate-pulse delay-1000 -z-10" />
                        </div>
                    </div>
                </section>

                <style jsx global>{`
    @keyframes gradient-x {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    .animate-gradient-x {
        background-size: 300% auto;
        animation: gradient-x 8s linear infinite;
    }
    @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
        animation: fade-in-up 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
    }
`}</style>

                {/* Conclusion Section */}
                <section className="my-32 w-screen -mx-[calc((100vw-100%)/2)] relative overflow-hidden">
                    <div className="container mx-auto px-0 max-w-none">
                        <div className="relative bg-gradient-to-br from-blue-50/50 to-purple-50/50 backdrop-blur-sm border-y border-white/80 shadow-2xl shadow-blue-100/30 transition-all duration-500">
                            <div className="flex flex-col items-center text-center px-8 py-16 space-y-10 lg:py-24 lg:space-y-14">
                                {/* Main Heading */}
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-5xl leading-tight opacity-0 animate-fade-in-up [animation-fill-mode:forwards]">
                                    <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                        Transform Your Document Experience
                                    </span>
                                    <span className="block mt-6 text-3xl md:text-4xl text-gray-700 font-normal">
                                        Powered by PDFSmart AI
                                    </span>
                                </h2>

                                {/* Feature Highlights */}
                                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-0 animate-fade-in-up [animation-delay:200ms] [animation-fill-mode:forwards]">
                                    {['Auto-Summarization', 'Smart Translation', 'Format Support', 'Cloud Sync'].map((feature, index) => (
                                        <div
                                            key={index}
                                            className="p-6 bg-white/90 backdrop-blur-md transition-all hover:shadow-lg hover:-translate-y-2 cursor-pointer"
                                        >
                                            <div className="w-12 h-12 mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto">
                                                {index === 0 && <FaFileAlt className="w-6 h-6 text-white" />}
                                                {index === 1 && <FaLanguage className="w-6 h-6 text-white" />}
                                                {index === 2 && <FaCode className="w-6 h-6 text-white" />}
                                                {index === 3 && <FaCloud className="w-6 h-6 text-white" />}
                                            </div>
                                            <span className="text-gray-800 font-semibold text-lg">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <div className="opacity-0 animate-fade-in-up [animation-delay:400ms] [animation-fill-mode:forwards]">
                                    <button
                                        onClick={handleLoginClick}
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-14 py-6 lg:px-20 lg:py-7 text-xl lg:text-2xl font-semibold hover:scale-105 
                               transition-all shadow-2xl hover:shadow-3xl relative overflow-hidden group"
                                    >
                                        <span className="relative z-10 block">
                                            Start Free Trial
                                            <span className="block text-sm font-normal mt-1">No credit card required</span>
                                        </span>
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </button>
                                </div>

                                {/* Security Badge */}
                                <div className="flex items-center space-x-4 lg:space-x-5 bg-white/80 backdrop-blur-sm px-6 py-3 opacity-0 animate-fade-in-up [animation-delay:600ms] [animation-fill-mode:forwards]">
                                    <FaShieldAlt className="w-7 h-7 text-purple-600" />
                                    <span className="text-gray-700 font-medium lg:text-lg">
                                        <span className="text-purple-600">256-bit Encryption</span> • GDPR Compliant • ISO Certified
                                    </span>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/30 blur-3xl -z-10 animate-float" />
                            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-100/30 blur-3xl -z-10 animate-float delay-2000" />
                        </div>
                    </div>
                </section>

            </div >
            <div className="w-full">
                <Footer />
            </div>

        </div >
    );
};

export default NaAboutus;
