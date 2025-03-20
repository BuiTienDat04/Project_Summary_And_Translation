import React, { useState, useEffect } from "react";
import { HelpCircle, BookOpen, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import Navigation from "./Navigation";
import ServicesSection from "./ServicesSection";
import TextSummarizerAndTranslator from "./TextSummarizerAndTranslator";
import Footer from "./Footer";

import { FaFileAlt, FaSignInAlt, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { FaFilePdf, FaLink } from "react-icons/fa";

function TextPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [welcomeMessageVisible, setWelcomeMessageVisible] = useState(true);
  const [loginPromptVisible, setLoginPromptVisible] = useState(false);

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
  };

  useEffect(() => {
    // Kiểm tra localStorage khi component được mount
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
      setLoggedInUsername(JSON.parse(storedUser).email); // Giả sử email là thuộc tính để hiển thị username
    }
  }, []);


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

      {/* Navigation Bar */}
      <div className="bg-indigo-100 py-2">
        <Navigation
          loggedInUsername={loggedInUsername}
          onLoginClick={handleLoginClick}
          onRegisterClick={handleRegisterClick}
          onLogout={handleLogout}
        />
      </div>

      {/* Header Section */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto mt-20 px-6 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 flex items-center justify-center">
          {/* Gradient Text with LED Effect */}
          <span className="bg-gradient-to-r from-blue-600 to-green-500 text-transparent bg-clip-text bg-[length:200%_auto] animate-gradient">
            AI-Powered Text Summarization & Translation Tool
          </span>

          {/* Simple Icon */}
          <FaFileAlt className="ml-4 text-blue-500" />
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Quickly grasp the main points from any text and translate it into your desired language.
        </p>
      </motion.header>

      {/* Features and Help Section */}
      <div className="flex items-center space-x-8 justify-center mt-12">
        <div className="flex space-x-4">
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
        </div>
      </div>
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
                  <p className="font-medium text-gray-700">Input Your Text</p>
                  <p className="text-sm text-gray-500 mt-1">Type or paste your content into the text area</p>
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
                  <p className="text-sm text-gray-500 mt-1">Click the "Summary" button for AI-powered summary</p>
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
                  <p className="text-sm text-gray-500 mt-1">Select language and click "Translate" for instant translation</p>
                </div>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </div>

      {/* Main Content: Text Summarizer and Translator */}
      <div className=" mx-auto px-4 pt-2">
        <TextSummarizerAndTranslator loggedInUser={loggedInUser} />
      </div>

      {/* About Section */}
      <section className="w-full min-h-screen flex flex-col items-center px-0 bg-white mt-20 px-6 py-16 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-2xl shadow-2xl shadow-indigo-100/50 hover:shadow-2xl hover:shadow-indigo-200/60 transition-all duration-500 border-2 border-white/50 relative overflow-hidden group">
        {/* Animated background elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-200/20 rounded-full group-hover:scale-150 transition-transform duration-1000 animate-[pulse_7s_infinite]"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-200/20 rounded-full group-hover:scale-150 transition-transform duration-1000 delay-150 animate-[pulse_7s_infinite]"></div>

        <div className="relative z-10 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-extrabold mb-8 text-center group/title bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent inline-block relative">
              <span className="inline-block animate-gradient bg-[length:200%] bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 hover:animate-gradient-flow">
                Introduction to AI Summarization & Translation Tool
              </span>
              <div className="absolute bottom-0 left-1/2 w-4/5 h-1 bg-indigo-100/50 transform -translate-x-1/2 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-40 animate-shine" />
              </div>
            </h2>


            <div className="max-w-4xl w-full relative group">
              {/* Enhanced background effects */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%),linear-gradient(-45deg,#f0f0f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f0f0f0_75%),linear-gradient(-45deg,transparent_75%,#f0f0f0_75%)] bg-[size:20px_20px] opacity-10 animate-grid-move" />

              {/* Particle system */}
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-indigo-400/30 rounded-full animate-float pointer-events-none"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: `${8 + Math.random() * 15}s`
                  }}
                />
              ))}


              <div className="absolute -top-12 sm:-top-16 left-1/4 rotate-12 opacity-10 text-[80px] sm:text-[100px] md:text-[120px] font-bold text-indigo-200/30 animate-pulse-slow pointer-events-none select-none">
                AI POWERED
              </div>

              <div className="space-y-4 text-gray-800 leading-relaxed text-base sm:text-lg">
                <section className="hover:bg-indigo-50/30 rounded-xl p-6 transition-all duration-300 shadow-sm hover:shadow-md relative">
                  <span className="absolute left-4 top-6 w-4 h-4 bg-indigo-400 rounded-full animate-pulse" />
                  <p className="font-medium text-left">
                    <span className="text-3xl float-left mr-3">📌</span>
                    In an age where information flows at an unprecedented rate,
                    <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent font-bold">
                      text summarization
                    </span>
                    has emerged as an indispensable tool. It condenses extensive documents, reports, and articles into concise, insightful summaries, preserving the essence of the content without losing contextual depth.
                    <br />
                    <br />
                    Cutting-edge
                    <span className="font-semibold text-indigo-600">Natural Language Processing (NLP)</span>
                    techniques empower AI to identify key insights, extract meaningful data, and present information in a digestible manner. Imagine analyzing thousands of documents in minutes—enhancing decision-making, boosting productivity, and making knowledge more accessible than ever.
                  </p>
                </section>

                <section className="hover:bg-purple-50/30 rounded-xl p-6 transition-all duration-300 shadow-sm hover:shadow-md relative">
                  <span className="absolute left-4 top-6 w-4 h-4 bg-purple-400 rounded-full animate-pulse delay-1000" />
                  <p className="font-medium text-left">
                    <span className="text-3xl float-left mr-3">🧠</span>
                    Modern AI models, built on
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                      transformer-based architectures
                    </span>,
                    have redefined the boundaries of semantic understanding and text processing.
                    <br />
                    <br />
                    Advanced systems like
                    <span className="font-semibold text-purple-600">GPT-4</span>,
                    <span className="font-semibold text-purple-600">DeepSeek R1</span>,
                    <span className="font-semibold text-purple-600">Gemini</span>,
                    and other state-of-the-art models leverage billions of parameters to process and generate human-like text with unprecedented accuracy. These AI systems excel in:
                  </p>
                  <ul className="mt-2 space-y-2 pl-8">
                    <li className="flex items-center hover:translate-x-2 transition-transform">
                      <div className="w-2 h-2 bg-indigo-400 mr-3 rounded-full" />
                      Understanding and synthesizing key themes across vast datasets.
                    </li>
                    <li className="flex items-center hover:translate-x-2 transition-transform">
                      <div className="w-2 h-2 bg-purple-400 mr-3 rounded-full" />
                      Ensuring factual consistency through cross-referencing large-scale information sources.
                    </li>
                    <li className="flex items-center hover:translate-x-2 transition-transform">
                      <div className="w-2 h-2 bg-pink-400 mr-3 rounded-full" />
                      Adapting tone, style, and context for diverse audiences and use cases.
                    </li>
                    <li className="flex items-center hover:translate-x-2 transition-transform">
                      <div className="w-2 h-2 bg-indigo-500 mr-3 rounded-full" />
                      Generating human-like responses for interactive AI applications, from chatbots to content creation.
                    </li>
                    <li className="flex items-center hover:translate-x-2 transition-transform">
                      <div className="w-2 h-2 bg-purple-500 mr-3 rounded-full" />
                      Supporting multilingual processing, breaking language barriers in global communication.
                    </li>
                  </ul>
                </section>
              </div>


            </div>
          </div>
          {/* Feature Cards */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="relative group transition-all duration-700">
                <div className="bg-gradient-to-br from-white to-indigo-50 p-8 rounded-3xl shadow-2xl shadow-indigo-100/40 hover:shadow-indigo-200/60 transition-all duration-500 transform-style-preserve-3d group-hover:rotate-x-3 group-hover:rotate-y-2 group-hover:translate-z-20 h-full">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start gap-5 mb-6">
                      <div className="p-4 bg-indigo-500/10 rounded-2xl transition-all duration-500 group-hover:rotate-12">
                        <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path>
                        </svg>
                      </div>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mt-2">
                        Smart Summarization
                      </h3>
                    </div>

                    <p className="text-gray-600 mb-8 text-lg leading-relaxed flex-1">
                      Harness deep learning algorithms to extract key insights from any text while maintaining contextual integrity.
                    </p>

                    <div className="space-y-5 border-l-2 border-indigo-100 pl-5">
                      {[
                        { title: 'Compression Rate', value: '95%', color: 'from-indigo-400 to-purple-400' },
                        { title: 'Speed', value: '0.2s/page', color: 'from-green-400 to-cyan-400' },
                        { title: 'Accuracy', value: '98%', color: 'from-amber-400 to-orange-400' }
                      ].map((item, index) => (
                        <div key={index} className="relative">
                          <div className="absolute -left-5 top-3 w-3 h-3 bg-indigo-200 rounded-full transition-all duration-300 group-hover:scale-150"></div>
                          <div className="flex justify-between items-center text-gray-700 hover:text-gray-900 transition-colors duration-300">
                            <span className="font-medium">{item.title}</span>
                            <span className={`bg-gradient-to-r ${item.color} bg-clip-text text-transparent font-bold`}>
                              {item.value}
                            </span>
                          </div>
                          <div className="h-1 mt-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`w-full h-full bg-gradient-to-r ${item.color} transition-all duration-1000 delay-${index * 200}`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Translator Card */}
              <div className="relative group transition-all duration-700">
                <div className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-3xl shadow-2xl shadow-purple-100/40 hover:shadow-purple-200/60 transition-all duration-500 transform-style-preserve-3d group-hover:rotate-x-3 group-hover:-rotate-y-2 group-hover:translate-z-20 h-full">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start gap-5 mb-6">
                      <div className="p-4 bg-purple-500/10 rounded-2xl transition-all duration-500 group-hover:-rotate-12">
                        <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                        </svg>
                      </div>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mt-2">
                        Neural Translation
                      </h3>
                    </div>

                    <p className="text-gray-600 mb-8 text-lg leading-relaxed flex-1">
                      Break language barriers with real-time translation supporting 50+ languages using transformer architecture.
                    </p>

                    <div className="grid grid-cols-2 gap-6">
                      {[
                        { icon: '🌍', title: 'Languages', value: '50+' },
                        { icon: '⚡', title: 'Speed', value: '0.1s/word' },
                        { icon: '🤖', title: 'AI Models', value: '15+' },
                        { icon: '🎯', title: 'Accuracy', value: '99%' }
                      ].map((item, index) => (
                        <div key={index} className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                          <div className="text-2xl mb-2">{item.icon}</div>
                          <div className="text-gray-700 font-medium">{item.title}</div>
                          <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Đoạn văn bổ sung */}
              <div className="relative mt-12 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <div className="text-sm font-medium text-blue-800">
                  🚀 Pro Tip: Combine summarization with keyword extraction for maximum efficiency. Use hierarchical approaches for complex documents, and always validate results against original context!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute w-2 h-2 bg-indigo-400/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`
              }} />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default TextPage;