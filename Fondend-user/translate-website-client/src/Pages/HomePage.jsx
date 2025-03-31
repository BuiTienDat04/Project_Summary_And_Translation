import React, { useState, useEffect, useRef } from 'react';
import Navigation from './Navigation';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import { useNavigate } from 'react-router-dom';
import Footer from "./Footer";
import googleLogo from './images/google.png';
import microsoftLogo from './images/microsoft.png';
import openaiLogo from './images/openai.png';
import amazonLogo from './images/amazon.png';
import homeLogo from './images/logo.png'
import NavFeatures from "../components/ui/navFeatures";
import NaContact from '../components/ui/naContact';
import naAboutus from '../components/ui/naAboutus';
import HomeLogo from './images/logo1.png'

import {
    BookOpen, Lightbulb, Rocket, ShieldCheck,
    ArrowRightIcon,
    ShieldCheckIcon
} from 'lucide-react';



const Homepage = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [loggedInUsername, setLoggedInUsername] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const navFeaturesRef = useRef(null);
    const contactRef = useRef(null);
    const [showContact, setShowContact] = useState(false);
    const [showFeatures, setShowFeatures] = useState(false);
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


    const handleFeaturesClick = () => {
        setShowFeatures(true);
        if (navFeaturesRef.current) {
            navFeaturesRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleContactClick = () => {
        setShowContact(true);
        // Sử dụng setTimeout để đảm bảo component đã render
        setTimeout(() => {
            if (contactRef.current) {
                contactRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }, 100);
    };


    return (
        <div className="min-h-screen bg-indigo-200 font-sans">
            {/* Navigation */}
            <nav className="bg-white shadow-md fixed w-full z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <span className="text-2xl font-bold text-blue-600">PDFSmart</span>
                        </div>
                        {/* Navigation Bar */}
                        <div className="bg-indigo-100 py-2" >
                            <Navigation
                                onContactClick={handleContactClick}
                                onFeaturesClick={handleFeaturesClick} />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Nâng cấp */}
            <section className="pt-32 pb-28 bg-indigo-200 font-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="md:w-1/2 space-y-8">
                            <h1 className="text-5xl font-bold text-gray-900 leading-[1.2]">
                                <span className="animate-gradient bg-clip-text text-transparent bg-[length:400%] bg-gradient-to-r from-red-400 via-green-400 to-blue-400 block">
                                    Smart Translation
                                </span>
                                <span className="animate-gradient bg-clip-text text-transparent bg-[length:400%] bg-gradient-to-r from-red-400 via-green-400 to-blue-400 block">
                                    & AI-Powered Summaries
                                </span>
                            </h1>
                            <style jsx global>{`
                                @keyframes gradient-wave {
                                0% { background-position: 0% 50%; }
                                50% { background-position: 100% 50%; }
                                100% { background-position: 0% 50%; }
                               }
                                  .animate-gradient {
                                 animation: gradient-wave 6s ease infinite;
                             }
                           `}</style>
                            <p className="text-xl text-gray-600">
                                Transform documents with dual capabilities:
                                <span className="font-semibold text-blue-600"> Instant Translation </span>
                                across 50+ languages and
                                <span className="font-semibold text-indigo-600"> Intelligent Summarization</span>
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
                                <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <div className="text-3xl font-bold text-blue-600">3</div>
                                    <div className="text-sm text-gray-600 mt-1">Smart Summarization Modes</div>
                                </div>
                                <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <div className="text-3xl font-bold text-purple-600">20+</div>
                                    <div className="text-sm text-gray-600 mt-1">Translation Languages</div>
                                </div>
                                <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <div className="text-3xl font-bold text-green-600">500K+</div>
                                    <div className="text-sm text-gray-600 mt-1">Summaries Generated</div>
                                </div>
                            </div>
                            {/* Login/Register Buttons */}
                            <div className="flex justify-center mt-6 space-x-6">
                                <button
                                    onClick={() => navigate("/login")}
                                    className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg hover:shadow-green-300/50 active:scale-95 uppercase tracking-wide"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate("/register")}
                                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg hover:shadow-blue-300/50 active:scale-95 uppercase tracking-wide"
                                >
                                    Register
                                </button>
                            </div>
                        </div>

                        <div className="md:w-1/2 relative">
                            <div className="relative max-w-xl">
                                <img
                                    src={HomeLogo}
                                    alt="Translation & Summary Demo"
                                    className=" w-172 h-172 rounded-xl shadow-2xl border-8 border-white transform rotate-2 hover:rotate-0 transition-transform"
                                />
                                {/* Language Badges */}
                                <div className="absolute -bottom-4 right-0 flex space-x-2">
                                    <span className="bg-white px-3 py-1 rounded-full shadow-md text-sm flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        EN → VI
                                    </span>
                                    <span className="bg-white px-3 py-1 rounded-full shadow-md text-sm flex items-center">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                        Summarize
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Value Proposition Section - Simplified */}
            <section className="relative py-24 bg-gradient-to-br from-indigo-50 to-blue-50 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-200/20 to-transparent blur-3xl" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            <span className="animate-gradient bg-clip-text text-transparent bg-[length:400%] bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600">
                                Why Choose PDFSmart?
                            </span>
                        </h2>
                        <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
                            A tool that helps process documents quickly, safely, and intelligently with advanced AI technology.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        <div className="group relative bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-100/90 hover:border-indigo-100">
                            <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-indigo-100/50 transition-all pointer-events-none" />
                            <div className="flex items-start space-x-6">
                                <div className="p-4 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl shadow-sm">
                                    <ShieldCheckIcon className="w-10 h-10 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        Top Security
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        Your data is always protected, carefully encrypted, and not stored after processing.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Data Safety', 'Compliance with Security Standards', 'Privacy Protection'].map((badge, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="group relative bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-100/90 hover:border-indigo-100">
                            <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-indigo-100/50 transition-all pointer-events-none" />
                            <div className="flex items-start space-x-6">
                                <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl shadow-sm">
                                    <Rocket className="w-10 h-10 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        Fast Processing
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        Advanced technology helps you process documents in an instant, regardless of size.
                                    </p>
                                    <div className="flex items-center space-x-4 text-sm">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                                            <span className="text-gray-600">Stable Operation</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2" />
                                            <span className="text-gray-600">Global Compatibility</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Preview */}
                    <section className="py-20 pt-10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid md:grid-cols-3 gap-12">
                                <div className="p-6 border rounded-xl bg-white hover:shadow-lg transition-shadow text-center">
                                    <BookOpen className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold mb-4">Supports Multiple Document Types</h3>
                                    <p className="text-gray-600">Easily process text from PDFs, websites, and many other formats.</p>
                                </div>

                                <div className="p-6 border rounded-xl bg-white hover:shadow-lg transition-shadow text-center">
                                    <Lightbulb className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold mb-4">High Accuracy</h3>
                                    <p className="text-gray-600">Preserves the essential meaning of the content with modern AI technology.</p>
                                </div>

                                <div className="p-6 border rounded-xl bg-white hover:shadow-lg transition-shadow text-center">
                                    <Rocket className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold mb-4">Ultra-Fast Processing</h3>
                                    <p className="text-gray-600">Completed in just seconds, maximizing time savings.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="mt-10 text-center">
                        <div className="inline-flex items-center bg-indigo-100/50 px-8 py-3 rounded-full text-gray-700 font-medium">
                            <span className="mr-3">⭐</span>
                            Trusted by hundreds of thousands of users worldwide
                            <ArrowRightIcon className="w-5 h-5 ml-3 text-indigo-600" />
                        </div>
                    </div>
                </div>
            </section>


            <div ref={navFeaturesRef}>
                <NavFeatures />
            </div>

            <div ref={contactRef}>
                <NaContact />

            </div>


        </div>
    );
};

export default Homepage;