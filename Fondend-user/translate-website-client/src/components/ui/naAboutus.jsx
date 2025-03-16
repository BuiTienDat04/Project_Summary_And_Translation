import { FaBookOpen, FaLanguage, FaFileAlt, FaGlobe, FaClock, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
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
                <section className="group mb-24 mt-20">
                    <style jsx>{`
                        @keyframes text-rgb 0% {
                        background-position: 0% 50%;}
                        50% {background-position: 100% 50%;}
                        100% {background-position: 0% 50%;}
                        }
                        .animate-text-rgb {
                        animation: text-rgb 5s linear infinite;
                        background-size: 200% 200%; }
                  `}</style>
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-1 md:order-none">
                            <h1 className="text-5xl font-bold text-blue-700 mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-text-rgb">
                                Welcome to PDFSmart - Unlock the Power of Your Documents!
                            </h1>
                            <div className="text-lg text-gray-800 mb-8 leading-relaxed">
                                PDFSmart is not just a regular PDF processing tool, but a comprehensive solution designed to optimize your document workflow.
                                We understand that in the digital age, documents play a central role in all activities, from learning and research to business and management.
                                PDFSmart is here to help you maximize the value of your documents, turning them into powerful resources for your success.
                                With a user-friendly interface and a wide range of smart features, PDFSmart will be your ideal companion, helping you save time, improve efficiency, and confidently conquer all document challenges.
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-3xl shadow-xl transform transition-all duration-300 group-hover:-rotate-2">
                            <img
                                src={LogoPower3}
                                alt="Translation & Summary Demo"
                                className="w-full h-full object-cover rounded-3xl shadow-2xl border-8 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                    </div>
                </section>


                {/* Section 2 - PDFSmart Story */}
                <section className="group mb-24">
                    <style jsx>{`
                        @keyframes text-rgb-2 {
                        0% { background-position: 0% 50%;}
                        50% { background-position: 100% 50%;}
                        100% { background-position: 0% 50%;}
                       }
                        .animate-text-rgb-2 {
                        animation: text-rgb-2 7s linear infinite;
                        background-size: 200% 200%;
                       }
                   `}</style>

                    <div className="grid md:grid-cols-2 gap-16 items-center md:flex-row-reverse">
                        <div className="md:order-2">
                            <h2 className="text-4xl font-semibold text-gray-900 mb-8">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 animate-text-rgb-2">
                                    The Story of PDFSmart - From Idea to Reality
                                </span>
                            </h2>
                            <div className="text-lg text-gray-800 mb-8 leading-relaxed">
                                The story of PDFSmart originates from the concerns of students who face the daily challenge of processing a large volume of study documents.
                                Recognizing the lack of a truly effective, versatile, and accessible tool, we - a group of passionate students at BTEC FPT British College - decided to change that.
                                PDFSmart is not just a product of a graduation project, but also the culmination of passion, creativity, and relentless effort.
                                From the first lines of code to becoming a platform trusted by thousands of users, PDFSmart always puts user experience first and continuously improves to deliver the best value.
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-3xl shadow-xl transform transition-all duration-300 group-hover:rotate-2">
                            <img
                                src={BtecLogo}
                                alt="BTEC FPT Graduation Project"
                                className="w-full h-full object-cover rounded-3xl shadow-2xl border-8 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/60 text-white rounded-b-3xl">
                                <p className="text-lg font-semibold">BTEC FPT Graduation Project 2025</p>
                                <p className="text-sm">The PDFSmart platform was built from this project.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3 - PDFSmart Power */}
                <section className="group mb-24">
                    <style jsx>{`
                           @keyframes text-rgb-3 {
                            0% {background-position: 0% 50%;}
                            50% {background-position: 100% 50%;}
                            100% {background-position: 0% 50%;}
                        }
                      .animate-text-rgb-3 {
                      animation: text-rgb-3 6s linear infinite;
                      background-size: 200% 200%;
                      }
                  `}</style>
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-semibold text-gray-900 mb-8">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 animate-text-rgb-3">
                                    ⚡ The Superior Power of PDFSmart - An "All-in-One" Tool for Documents
                                </span>
                            </h2>
                            <div className="text-lg text-gray-800 mb-8 leading-relaxed">
                                PDFSmart is not just a collection of features, but a combination of the power of advanced AI technology and a user-friendly interface.
                                We bring you a comprehensive toolkit, helping you easily handle all document-related tasks, from the simplest to the most complex.
                                Discover the power of PDFSmart and experience the difference:
                            </div>
                            <ul className="space-y-8">
                                <li className="flex items-start">
                                    <FaBookOpen className="text-blue-600 mr-4 h-7 w-7 flex-shrink-0" />
                                    <div>
                                        <b className="text-lg text-gray-800">Smart Text Summarization:</b>
                                        <p className="text-gray-700 leading-relaxed">
                                            Quickly grasp the core content of dense documents in just a few minutes.
                                            Our advanced AI algorithms will help you filter out the most important information,
                                            saving reading time and enhancing learning and working efficiency.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <FaLanguage className="text-green-600 mr-4 h-7 w-7 flex-shrink-0" />
                                    <div>
                                        <b className="text-lg text-gray-800">Accurate Document Translation:</b>
                                        <p className="text-gray-700 leading-relaxed">
                                            Break down all language barriers with professional translation capabilities, supporting more than 50 popular languages worldwide.
                                            PDFSmart helps you access global knowledge easily and confidently, expanding learning and international collaboration opportunities.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <FaFileAlt className="text-orange-600 mr-4 h-7 w-7 flex-shrink-0" />
                                    <div>
                                        <b className="text-lg text-gray-800">Multiple Format Support:</b>
                                        <p className="text-gray-700 leading-relaxed">
                                            No more worries about format compatibility! PDFSmart supports over 50+ different document formats,
                                            from PDF, DOCX, PPT to common image and text formats.
                                            You can easily work with any type of document without any obstacles.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <FaGlobe className="text-purple-600 mr-4 h-7 w-7 flex-shrink-0" />
                                    <div>
                                        <b className="text-lg text-gray-800">Multi-Language Interface:</b>
                                        <p className="text-gray-700 leading-relaxed">
                                            PDFSmart provides a global user experience with an interface supporting over 20 languages.
                                            You can customize the display language according to your personal preferences,
                                            creating a familiar and comfortable feeling when using the platform.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="relative overflow-hidden rounded-3xl shadow-xl transform transition-all duration-300 group-hover:-rotate-2">
                            <img
                                src={LogoPower1}
                                alt="PDFSmart Power Features"
                                className="w-full h-full object-cover rounded-3xl shadow-2xl border-8 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </section>

                {/* Section 4 - Why Choose PDFSmart */}
                <section className="group mb-24">
                    <style jsx>{`
                         @keyframes text-rgb-4 {
                           0% {background-position: 0% 50%;}
                           50% {background-position: 100% 50%;}
                           100% {background-position: 0% 50%;}
                        }
                           .animate-text-rgb-4 {
                           animation: text-rgb-4 8s linear infinite;
                           background-size: 300% 300%; /* Tăng kích thước gradient */
                           }
                    `}</style>

                    <div className="grid md:grid-cols-2 gap-16 items-center md:flex-row-reverse">
                        <div className="md:order-2">
                            <h2 className="text-4xl font-semibold text-gray-900 mb-8">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-teal-500 to-orange-500 animate-text-rgb-4">
                                    Why PDFSmart is Your #1 Choice?
                                </span>
                            </h2>
                            <ul className="space-y-8">
                                <li className="flex items-start">
                                    <FaClock className="text-red-600 mr-4 h-7 w-7 flex-shrink-0" />
                                    <div>
                                        <b className="text-lg text-gray-800">Maximize Time Savings:</b>
                                        <p className="text-gray-700 leading-relaxed">
                                            PDFSmart helps you completely eliminate tedious and time-consuming manual tasks in the document processing process.
                                            Instead, you can focus on more important, strategic, and creative tasks.
                                            Time is a priceless asset, and PDFSmart will help you use it most effectively.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <FaCheckCircle className="text-blue-600 mr-4 h-7 w-7 flex-shrink-0" />
                                    <div>
                                        <b className="text-lg text-gray-800">Enhance Learning and Communication:</b>
                                        <p className="text-gray-700 leading-relaxed">
                                            With PDFSmart, accessing and grasping information from complex documents becomes easier than ever.
                                            You can quickly understand key concepts, ideas, and data,
                                            thereby improving your learning, research, and communication skills effectively.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <FaShieldAlt className="text-gray-700 mr-4 h-7 w-7 flex-shrink-0" />
                                    <div>
                                        <b className="text-lg text-gray-800">Absolute Safety and Security:</b>
                                        <p className="text-gray-700 leading-relaxed">
                                            We understand that data security is your top priority.
                                            PDFSmart is committed to protecting your personal information and documents absolutely.
                                            We do not store your documents after processing and apply the most advanced security measures to ensure your data's safety.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="relative overflow-hidden rounded-3xl shadow-xl transform transition-all duration-300 group-hover:-rotate-2">
                            <img
                                src={LogoPower2}
                                alt="Why Choose PDFSmart"
                                className="w-full h-full object-cover rounded-3xl shadow-2xl border-8 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </section>
                {/* Kết luận */}
                <section className="mt-32 mb-16 text-center"> {/* Increased margin and centered text */}
                    <div className="text-xl text-gray-700 bg-blue-50 p-12 rounded-3xl border border-blue-200 shadow-lg"> {/* Increased padding, rounded corners, shadow, larger text */}
                        Hãy để PDFSmart trở thành người bạn đồng hành tin cậy trên hành trình chinh phục tri thức và thành công trong công việc.
                        <br />
                        <b className="text-blue-600 font-semibold">Trải nghiệm PDFSmart ngay hôm nay</b> và khám phá sức mạnh của công nghệ xử lý tài liệu thông minh!
                    </div>
                </section>

            </div>
            <div className="w-full">
                <Footer />
            </div>

        </div>
    );
};

export default NaAboutus;
