import React, { useState, useEffect } from "react";
import { HelpCircle, X, FileText, Sparkles, Zap, Globe, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import Navigation from "./Navigation";
import ServicesSection from "./ServicesSection";
import TextSummarizerAndTranslator from "../Pages/TextSummarizerAndTranslator";
import Footer from "./Footer";

import { FaFileAlt, FaSignInAlt, FaCheckCircle, FaStar, FaRocket, FaUsers } from "react-icons/fa";
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
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
      setLoggedInUsername(JSON.parse(storedUser).email);
    }
  }, []);

  // Fix navigation scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px - hide nav
        setIsNavVisible(false);
      } else {
        // Scrolling up - show nav
        setIsNavVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    setLoggedInUsername(null);
    setLoggedInUser(null);
    localStorage.removeItem('loggedInUser');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans overflow-x-hidden">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-10"></div>
      </div>

      {/* Popups for Login and Register */}
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[1000]">
          <LoginPage onClose={handleCloseLogin} onLoginSuccess={handleLoginSuccess} />
        </div>
      )}

      {showRegister && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[1000]">
          <RegisterPage onClose={handleCloseRegister} onRegistrationSuccess={handleRegistrationSuccess} />
        </div>
      )}

      {/* Navigation Bar - Fixed with smooth hide/show */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-white/20 transition-transform duration-300 ${isNavVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <Navigation
          loggedInUsername={loggedInUsername}
          onLoginClick={handleLoginClick}
          onRegisterClick={handleRegisterClick}
          onLogout={handleLogout}
        />
      </div>

      {/* Add padding to account for fixed nav */}
      <div className="pt-16"></div>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden -mt-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/10"></div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 mb-8"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Text Intelligence</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your Text with{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Advanced AI
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Summarize lengthy documents, translate across languages, and extract key insights instantly with our cutting-edge artificial intelligence technology.
            </p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-8 mb-12"
            >
              {[
                { number: "10K+", label: "Documents Processed" },
                { number: "98%", label: "Accuracy Rate" },
                { number: "20+", label: "Languages Supported" },
                { number: "2s", label: "Average Response" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Service Cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16"
          >
            {[
              {
                title: "Text Summarizer",
                description: "Process direct text input with intelligent AI analysis",
                icon: FaFileAlt,
                color: "from-blue-500 to-cyan-500",
                hoverColor: "hover:from-blue-600 hover:to-cyan-600",
                features: ["Smart Extraction", "Context Aware", "Multiple Formats"],
                onClick: () => { }
              },
              {
                title: "Document Processor",
                description: "Upload and analyze PDF, DOC, and other document formats",
                icon: FaFilePdf,
                color: "from-green-500 to-emerald-500",
                hoverColor: "hover:from-green-600 hover:to-emerald-600",
                features: ["PDF Support", "Batch Processing", "Secure Upload"],
                onClick: () => navigate("/document")
              },
              {
                title: "Web Content",
                description: "Extract and summarize content from any webpage URL",
                icon: FaLink,
                color: "from-purple-500 to-pink-500",
                hoverColor: "hover:from-purple-600 hover:to-pink-600",
                features: ["URL Processing", "Real-time Fetch", "Content Cleaning"],
                onClick: () => navigate("/link")
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative group cursor-pointer"
                onClick={service.onClick}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 rounded-3xl shadow-lg border border-gray-200 transform group-hover:scale-105 transition-all duration-300" />
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl overflow-hidden">
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  {/* Icon */}
                  <div className={`relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${service.color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 relative">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-gray-500">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color}`} />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Action Indicator */}
                  <div className={`flex items-center gap-2 text-sm font-medium bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                    Get Started
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => setShowHelp(true)}
              className="flex items-center gap-3 px-8 py-4 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700 font-semibold hover:scale-105"
            >
              <HelpCircle className="w-5 h-5 text-blue-600" />
              How It Works
            </button>

            {!loggedInUser && (
              <button
                onClick={handleRegisterClick}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-white font-semibold hover:scale-105 hover:from-blue-700 hover:to-purple-700"
              >
                <FaRocket className="w-5 h-5" />
                Start Free Today
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content Area - Simplified and Clean */}
      <section className="relative backdrop-blur-sm mt-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Try Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Text Analyzer</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience the power of AI-driven text processing with our intuitive interface
              </p>
            </div>
          </motion.div>
        </div>
      </section>
       <TextSummarizerAndTranslator loggedInUser={loggedInUser} />

      {/* Features Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6"
            >
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-white">Powered by Advanced AI</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Enterprise-Grade AI Capabilities
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed"
            >
              Leveraging state-of-the-art natural language processing to deliver accurate, efficient, and secure text analysis
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Summarization Feature */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="group relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaFileAlt className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Intelligent Summarization</h3>
                </div>
                <p className="text-blue-100 mb-6 leading-relaxed text-lg">
                  Our advanced AI extracts key information while maintaining context and meaning, delivering concise summaries that perfectly capture the essence of your content.
                </p>
                <div className="space-y-4">
                  {[
                    { label: "Processing Speed", value: "Instant", color: "bg-green-400", icon: "⚡" },
                    { label: "Accuracy Rate", value: "98%+", color: "bg-blue-400", icon: "🎯" },
                    { label: "Context Preservation", value: "Excellent", color: "bg-purple-400", icon: "🔍" }
                  ].map((metric, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-white/10 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{metric.icon}</span>
                        <span className="text-blue-200">{metric.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{metric.value}</span>
                        <div className={`w-3 h-3 rounded-full ${metric.color} shadow-sm`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Translation Feature */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="group relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Neural Translation</h3>
                </div>
                <p className="text-blue-100 mb-6 leading-relaxed text-lg">
                  Break language barriers with advanced neural machine translation supporting 50+ languages while preserving nuance, tone, and cultural context.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: "🌍", label: "Languages", value: "50+", color: "from-blue-500 to-cyan-500" },
                    { icon: "⚡", label: "Speed", value: "Real-time", color: "from-green-500 to-emerald-500" },
                    { icon: "🤖", label: "AI Models", value: "Multiple", color: "from-purple-500 to-pink-500" },
                    { icon: "🎯", label: "Accuracy", value: "95%+", color: "from-orange-500 to-red-500" }
                  ].map((item, index) => (
                    <div key={index} className="text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                      <div className="text-2xl mb-3">{item.icon}</div>
                      <div className="text-sm text-blue-200 mb-1">{item.label}</div>
                      <div className="font-bold text-white text-lg">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Security Feature */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-4xl mx-auto mt-12"
          >
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Shield className="w-8 h-8 text-green-400" />
                <h3 className="text-2xl font-bold">Enterprise-Grade Security</h3>
              </div>
              <p className="text-blue-100 text-lg mb-6">
                Your data is protected with military-grade encryption. We never store your personal documents and ensure complete privacy throughout the processing.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                {["End-to-End Encryption", "GDPR Compliant", "No Data Storage", "SSL Secure"].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                    <FaCheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-white">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">How to Use PDFSmart</h3>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {[
                {
                  step: "1",
                  title: "Input Your Content",
                  description: "Paste your text, upload documents, or provide webpage URLs for processing",
                  icon: "📝"
                },
                {
                  step: "2",
                  title: "AI Processing",
                  description: "Our advanced AI analyzes and understands your content contextually",
                  icon: "🤖"
                },
                {
                  step: "3",
                  title: "Get Results",
                  description: "Receive summarized insights and translations in seconds",
                  icon: "🎯"
                }
              ].map((item) => (
                <div key={item.step} className="flex gap-4 group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center font-semibold text-white text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg mb-2">{item.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setShowHelp(false)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Got It, Let's Start!
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Services Section */}
      <ServicesSection />
    </div>
  );
}

export default TextPage;