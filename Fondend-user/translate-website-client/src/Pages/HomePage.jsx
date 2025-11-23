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
    ShieldCheckIcon,
    Play,
    Star,
    Zap,
    Globe,
    CheckCircle,
    ArrowRight,
    Languages,
    Clock,
    Users,
    FileText,
    Target,
    Sparkles
} from 'lucide-react';

const Homepage = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [loggedInUsername, setLoggedInUsername] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const navFeaturesRef = useRef(null);
    const contactRef = useRef(null);
    const [showContact, setShowContact] = useState(false);
    const [showFeatures, setShowFeatures] = useState(false);
    const handleCloseLogin = () => setShowLogin(false);
    const handleCloseRegister = () => setShowRegister(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleLoginClick = () => setShowLogin(true);
    const handleRegisterClick = () => setShowRegister(true);

    const handleOpenRegister = () => {
        setShowLogin(false);
        setShowRegister(true);
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
        setTimeout(() => {
            if (contactRef.current) {
                contactRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }, 100);
    };

    // Language data with more details
    const popularLanguages = [
        { code: 'en', name: 'English', native: 'English', flag: '🇺🇸', level: 'Advanced' },
        { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', level: 'Advanced' },
        { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', level: 'Advanced' },
        { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪', level: 'Advanced' },
        { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳', level: 'Advanced' },
        { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵', level: 'Advanced' },
        { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷', level: 'Advanced' },
        { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', level: 'Intermediate' },
        { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', level: 'Intermediate' },
        { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹', level: 'Advanced' },
        { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺', level: 'Intermediate' },
        { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹', level: 'Advanced' }
    ];

    const languageGroups = [
        {
            category: "Popular Languages",
            languages: popularLanguages.slice(0, 6)
        },
        {
            category: "Global Languages",
            languages: popularLanguages.slice(6, 12)
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 font-sans overflow-hidden">
            {/* Enhanced Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow"></div>
                <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-medium"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-fast"></div>
            </div>

            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-lg shadow-lg fixed w-full z-50 border-b border-gray-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0 flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PDFSmart</span>
                        </div>

                        <div className="bg-white/50 rounded-full px-6 py-2 shadow-sm border border-gray-200/50">
                            <Navigation
                                onContactClick={handleContactClick}
                                onFeaturesClick={handleFeaturesClick} />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Enhanced Hero Section */}
            <section className="pt-32 pb-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        {/* Left Content */}
                        <div className="lg:w-1/2 space-y-8 transform transition-all duration-1000"
                            style={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(30px)'
                            }}>
                            <div className="space-y-6">
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-medium mb-4 animate-pulse">
                                    <Zap className="w-4 h-4 mr-2" />
                                    AI-Powered Document Processing
                                </div>

                                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                    <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">
                                        Smart Translation
                                    </span>
                                    <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x animation-delay-2000">
                                        & AI Summaries
                                    </span>
                                </h1>

                                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                                    Transform your documents with dual AI capabilities:
                                    <span className="font-semibold text-blue-600"> Instant Translation </span>
                                    across 20+ languages and
                                    <span className="font-semibold text-purple-600"> Intelligent Summarization</span>
                                </p>
                            </div>

                            {/* Enhanced Stats with Icons */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
                                {[
                                    { number: '3', label: 'Smart Modes', color: 'from-blue-500 to-blue-600', icon: Sparkles },
                                    { number: '20+', label: 'Languages', color: 'from-purple-500 to-purple-600', icon: Languages },
                                    { number: '500K+', label: 'Documents', color: 'from-indigo-500 to-indigo-600', icon: FileText }
                                ].map((stat, index) => (
                                    <div
                                        key={index}
                                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                                    >
                                        <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent flex items-center justify-between`}>
                                            {stat.number}
                                            <stat.icon className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                        <div className="text-sm text-gray-600 mt-2 font-medium">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Enhanced CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-6 pt-6">
                                <button
                                    onClick={() => navigate("/login")}
                                    className="group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg flex items-center justify-center min-w-[180px]"
                                >
                                    <span className="relative z-10 flex items-center">
                                        Get Started
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </button>

                                <button
                                    onClick={() => navigate("/register")}
                                    className="group relative bg-white/80 backdrop-blur-sm border-2 border-gray-300 hover:border-blue-300 text-gray-700 hover:text-blue-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center min-w-[180px]"
                                >
                                    <span className="flex items-center">
                                        <Play className="w-5 h-5 mr-2" />
                                        Watch Demo
                                    </span>
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 border border-purple-100">
                                <div className="text-center">
                                    <div className="text-5xl font-black text-purple-600">50,000+</div>
                                    <p className="text-gray-700 font-semibold mt-2">Người dùng hoạt động</p>
                                </div>
                                <div className="w-px h-16 bg-purple-200 hidden sm:block" />
                                <div className="text-center">
                                    <div className="flex justify-center gap-1 mb-3">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 font-semibold">4.9/5 từ 8,247 đánh giá</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Enhanced Hero Image */}
                        <div className="lg:w-1/2 relative">
                            <div className="relative max-w-2xl">
                                {/* Main Image Container */}
                                <div className="relative z-10 transform transition-all duration-1000 hover:scale-105"
                                    style={{
                                        opacity: isVisible ? 1 : 0,
                                        transform: isVisible ? 'translateY(0) rotate(0)' : 'translateY(30px) rotate(5deg)'
                                    }}>
                                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                                        <img
                                            src={HomeLogo}
                                            alt="AI Document Processing"
                                            className="w-full h-auto"
                                        />
                                        {/* Floating Elements */}
                                        <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-2xl border border-gray-200 animate-float">
                                            <div className="flex items-center space-x-2">
                                                <Globe className="w-5 h-5 text-green-500" />
                                                <span className="text-sm font-semibold">20+ Languages</span>
                                            </div>
                                        </div>

                                        <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-2xl border border-gray-200 animate-float animation-delay-2000">
                                            <div className="flex items-center space-x-2">
                                                <Zap className="w-5 h-5 text-yellow-500" />
                                                <span className="text-sm font-semibold">AI Powered</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Background Decorations */}
                                <div className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
                                <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-gradient-to-r from-indigo-200 to-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse animation-delay-2000"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* New Language Showcase Section */}
            <section className="py-20 bg-gradient-to-br from-white to-blue-50/30 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 transform transition-all duration-1000"
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? 'translateY(0)' : 'translateY(30px)'
                        }}>
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-sm font-medium mb-6">
                            <Languages className="w-4 h-4 mr-2" />
                            Global Language Support
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Translate Across{' '}
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                20+ Languages
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Break language barriers with our advanced neural machine translation supporting major global languages and dialects
                        </p>
                    </div>

                    {/* Language Groups */}
                    <div className="grid lg:grid-cols-2 gap-12 mb-16">
                        {languageGroups.map((group, groupIndex) => (
                            <div key={groupIndex} className="space-y-6">
                                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                                    <Target className="w-6 h-6 mr-3 text-purple-600" />
                                    {group.category}
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {group.languages.map((lang, langIndex) => (
                                        <div
                                            key={lang.code}
                                            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                                            style={{
                                                opacity: isVisible ? 1 : 0,
                                                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                                                transitionDelay: `${(groupIndex * 100) + (langIndex * 100)}ms`
                                            }}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span className="text-2xl">{lang.flag}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-gray-900 text-sm group-hover:text-purple-600 transition-colors truncate">
                                                        {lang.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate">{lang.native}</div>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex justify-between items-center">
                                                <span className={`text-xs px-2 py-1 rounded-full ${lang.level === 'Advanced'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {lang.level}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Additional Language Info */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 shadow-lg border border-purple-200/50">
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            {[
                                { icon: Globe, number: '50+', label: 'Global Languages', description: 'Covering 95% of world population' },
                                { icon: Clock, number: '< 2s', label: 'Average Speed', description: 'Lightning-fast translation' },
                                { icon: Users, number: '99%', label: 'Accuracy Rate', description: 'Context-aware translations' }
                            ].map((item, index) => (
                                <div key={index} className="space-y-4">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                                        <item.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">{item.number}</div>
                                    <div className="font-semibold text-gray-800">{item.label}</div>
                                    <div className="text-sm text-gray-600">{item.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Value Proposition Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-100/30"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center mb-20 transform transition-all duration-1000"
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? 'translateY(0)' : 'translateY(30px)'
                        }}>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Why Choose{' '}
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                PDFSmart?
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Experience the future of document processing with our cutting-edge AI technology
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-20">
                        {[
                            {
                                icon: ShieldCheck,
                                title: "Enterprise-Grade Security",
                                description: "Your data is protected with military-grade encryption and never stored after processing.",
                                features: ["SOC 2 Compliant", "End-to-End Encryption", "Zero Data Retention"],
                                color: "from-green-500 to-emerald-600",
                                bgColor: "green"
                            },
                            {
                                icon: Rocket,
                                title: "Lightning Fast Processing",
                                description: "Advanced AI technology processes documents in seconds, regardless of size or complexity.",
                                features: ["Real-time Processing", "Batch Operations", "Scalable Infrastructure"],
                                color: "from-purple-500 to-pink-600",
                                bgColor: "purple"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 hover:border-transparent hover:bg-gradient-to-br hover:from-white hover:to-gray-50/80"
                                style={{
                                    opacity: isVisible ? 1 : 0,
                                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                                    transitionDelay: `${index * 200}ms`
                                }}
                            >
                                <div className="flex items-start space-x-6">
                                    <div className={`p-4 bg-gradient-to-r ${feature.color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed mb-6">
                                            {feature.description}
                                        </p>
                                        <div className="space-y-3">
                                            {feature.features.map((item, idx) => (
                                                <div key={idx} className="flex items-center space-x-3">
                                                    <CheckCircle className={`w-5 h-5 text-${feature.bgColor}-500`} />
                                                    <span className="text-gray-700 font-medium">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Enhanced Features Grid */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: BookOpen,
                                title: "Multi-Format Support",
                                description: "Process text from PDFs, websites, and various document formats with ease.",
                                color: "blue"
                            },
                            {
                                icon: Lightbulb,
                                title: "High Accuracy AI",
                                description: "Preserve essential meaning with state-of-the-art AI technology.",
                                color: "yellow"
                            },
                            {
                                icon: Zap,
                                title: "Instant Results",
                                description: "Get translations and summaries in seconds, not minutes.",
                                color: "purple"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200/50 hover:-translate-y-2"
                                style={{
                                    opacity: isVisible ? 1 : 0,
                                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                                    transitionDelay: `${index * 150}ms`
                                }}
                            >
                                <div className={`w-12 h-12 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Trust Badge */}
                    <div className="text-center mt-16">
                        <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg border border-gray-200/50 text-gray-700 font-semibold hover:shadow-xl transition-all duration-300 group cursor-pointer">
                            <span className="flex items-center space-x-2">
                                <span className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform" />
                                    ))}
                                </span>
                                <span>Rated 4.9/5 by 10,000+ global users</span>
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features and Contact Sections */}
            <div ref={navFeaturesRef} className="transform transition-all duration-1000"
                style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)'
                }}>
                <NavFeatures />
            </div>

            <div ref={contactRef} className="transform transition-all duration-1000"
                style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)'
                }}>
                <NaContact />
            </div>

            {/* Custom CSS for animations */}
            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                @keyframes float-medium {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-15px) scale(1.1); }
                }
                @keyframes float-fast {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-25px); }
                }
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                }
                .animate-float-medium {
                    animation: float-medium 6s ease-in-out infinite;
                }
                .animate-float-fast {
                    animation: float-fast 4s ease-in-out infinite;
                }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 3s ease infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    );
};

export default Homepage;