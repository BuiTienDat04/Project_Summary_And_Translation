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
import { BookOpen, Lightbulb, Rocket, ShieldCheck, } from 'lucide-react'; // Import các icon từ lucide-react
import {
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    ClockIcon,
    UserCircleIcon,
    ChatBubbleLeftIcon,
} from '@heroicons/react/24/solid';

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

    const handleRegistrationSuccess = () => {
        setIsPopupVisible(true);
        setShowRegister(false);
    };

    const handleLoginSuccess = (user) => {
        setLoggedInUser(user);
        setLoggedInUsername(user.email);
        setShowLogin(false);
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        navigate('/text'); // Chuyển hướng đến TextPage sau khi đăng nhập thành công
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

    const ContactInfo = ({ icon, title, content }) => (
        <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg shadow-sm hover:scale-105 transition-transform">
            <div className="p-3 bg-white rounded-lg shadow-md">{icon}</div>
            <div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-gray-600">{content}</p>
            </div>
        </div>
    );


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
                                onLoginClick={handleLoginClick}
                                onRegisterClick={handleRegisterClick}
                                onContactClick={handleContactClick}
                                onFeaturesClick={handleFeaturesClick} />
                        </div>

                        {/* Popups for Login and Register */}
                        {showLogin && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
                                <LoginPage onClose={handleCloseLogin} onLoginSuccess={handleLoginSuccess} />
                            </div>
                        )}

                        {showRegister && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
                                <RegisterPage onClose={handleCloseRegister} onRegistrationSuccess={handleRegistrationSuccess} />
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section - Nâng cấp */}
            <section className="pt-32 pb-28 bg-indigo-200 font-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="md:w-1/2 space-y-8">
                            <h1 className="text-5xl font-bold text-gray-900 leading-[1.2]">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                    Smart Translation<br />
                                </span>
                                & AI-Powered Summaries
                            </h1>

                            <p className="text-xl text-gray-600">
                                Transform documents with dual capabilities:
                                <span className="font-semibold text-blue-600"> Instant Translation </span>
                                across 20+ languages and
                                <span className="font-semibold text-indigo-600"> Intelligent Summarization</span>
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4 mt-8">
                                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                    <div className="text-3xl font-bold text-blue-600">50+</div>
                                    <div className="text-sm text-gray-600">Supported Formats</div>
                                </div>
                                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                    <div className="text-3xl font-bold text-purple-600">20</div>
                                    <div className="text-sm text-gray-600">Languages</div>
                                </div>
                                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                    <div className="text-3xl font-bold text-green-600">1M+</div>
                                    <div className="text-sm text-gray-600">Docs Processed</div>
                                </div>
                            </div>

                            {/* Login/Register Buttons */}
                            <div className="flex justify-center mt-6 space-x-6">
                                <button
                                    onClick={handleLoginClick}
                                    className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg hover:shadow-green-300/50 active:scale-95 uppercase tracking-wide"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={handleRegisterClick}
                                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg hover:shadow-blue-300/50 active:scale-95 uppercase tracking-wide"
                                >
                                    Register
                                </button>
                            </div>
                        </div>

                        <div className="md:w-1/2 relative">
                            <div className="relative max-w-xl">
                                <img
                                    src={homeLogo}
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
            {/* New: Value Proposition Section */}
            <section className="py-20 bg-indigo-200 font-sans pt-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Why Choose PDFSmart?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We combine cutting-edge AI technology with user-centric design to deliver
                            unparalleled document processing capabilities
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex items-start mb-4">
                                <ShieldCheck className="w-12 h-12 text-green-500 mr-4" />
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Enterprise-Grade Security</h3>
                                    <p className="text-gray-600">
                                        Your documents are protected with military-grade encryption
                                        and GDPR compliance. We never store your data without permission.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex items-start mb-4">
                                <Rocket className="w-12 h-12 text-purple-500 mr-4" />
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Lightning-Fast Processing</h3>
                                    <p className="text-gray-600">
                                        Leverage our distributed cloud infrastructure to process
                                        documents 3x faster than conventional solutions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Preview */}
            <section className="py-20 pt-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="p-6 border rounded-xl bg-white hover:shadow-lg transition-shadow text-center">
                            <BookOpen className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-4">Diverse Summarization</h3>
                            <p className="text-gray-600">Supports all text formats from PDF to websites.</p>
                        </div>

                        <div className="p-6 border rounded-xl bg-white hover:shadow-lg transition-shadow text-center">
                            <Lightbulb className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-4">High Accuracy</h3>
                            <p className="text-gray-600">Advanced AI technology preserves the main idea of the text.</p>
                        </div>

                        <div className="p-6 border rounded-xl bg-white hover:shadow-lg transition-shadow text-center">
                            <Rocket className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-4">Fast Processing</h3>
                            <p className="text-gray-600">Processes in seconds with blazing speed.</p>
                        </div>
                    </div>
                </div>
            </section>

            {showFeatures && (
                <div ref={navFeaturesRef}>
                    <NavFeatures />
                </div>
            )}




            {/* Trusted By Section - Nâng cấp */}
            <section className="py-20 bg-indigo-200 font-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
                            Trusted by innovative teams worldwide
                        </h2>
                        <p className="text-lg text-gray-700 max-w-2xl mx-auto font-semibold">
                            Join thousands of organizations transforming their document workflows
                            with PDFSmart's enterprise solutions
                        </p>

                    </div>
                    <p className="text-center text-black text-lg font-bold mb-12">Trusted by</p>
                    <section className="py-16 bg-indigo-200 font-sans">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
                            <img src={googleLogo} alt="Google" className="h-16 mx-auto opacity-100 contrast-125" />
                            <img src={microsoftLogo} alt="Microsoft" className="h-14 mx-auto opacity-100 contrast-125" />
                            <img src={openaiLogo} alt="OpenAI" className="h-14 mx-auto opacity-100 contrast-125" />
                            <img src={amazonLogo} alt="Amazon" className="h-14 mx-auto opacity-100 contrast-125" />
                        </div>
                    </section>
                </div>
            </section>

            {showContact && (
                <div ref={contactRef}> {/* Thêm ref vào đây */}
                    {/* Nội dung contact */}
                    <div className="text-center py-8 max-w-3xl mx-auto">
                        <div className="text-center py-8 max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold text-gray-900">Kết nối cùng chúng tôi</h2>
                            <p className="text-gray-600 mt-3 text-lg">
                                Bạn cần hỗ trợ tóm tắt văn bản hoặc dịch thuật tài liệu một cách nhanh chóng và chính xác?
                                Hãy liên hệ ngay với chúng tôi để được tư vấn và hỗ trợ tận tình!
                            </p>
                        </div>
                        < div className="max-w-7xl mx-auto px-4 py-16 pt-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                <ContactInfo
                                    icon={<PhoneIcon className="h-7 w-7 text-blue-600" />}
                                    title="Hotline"
                                    content="+84 123 456 789"
                                />
                                <ContactInfo
                                    icon={<EnvelopeIcon className="h-7 w-7 text-green-600" />}
                                    title="Email"
                                    content="support@pdfsmart.com"
                                />
                                <ContactInfo
                                    icon={<MapPinIcon className="h-7 w-7 text-purple-600" />}
                                    title="Văn phòng"
                                    content="Hà Nội, Việt Nam"
                                />
                                <ContactInfo
                                    icon={<ClockIcon className="h-7 w-7 text-orange-600" />}
                                    title="Giờ làm việc"
                                    content="Mon - Fri: 8:00 - 17:00"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}





            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Homepage;