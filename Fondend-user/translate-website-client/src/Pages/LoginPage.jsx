import { useState, useEffect } from "react";
import {
  FaSignInAlt,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaExclamationTriangle,
  FaCheckCircle,
  FaMagic,
  FaLanguage,
  FaBookOpen,
  FaCheckCircle as FaSecure,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../api/api";
import { motion, AnimatePresence } from "framer-motion";

const PasswordInput = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        id="loginPassword"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-base bg-white/80"
        placeholder="Enter your password"
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
};

const FeatureItem = ({ icon, title, description }) => (
  <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 shadow-md border border-white/10 flex items-center space-x-3">
    <div className="p-2 rounded-md bg-gradient-to-br from-gray-200/10 to-gray-700/10">
      {icon}
    </div>
    <div>
      <h4 className="text-base font-semibold text-white">{title}</h4>
      <p className="text-white/70 text-xs">{description}</p>
    </div>
  </div>
);

const LoginPage = ({ onClose, onOpenRegister }) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  };

  useEffect(() => {
    const footer = document.querySelector("footer");
    const chatbox = document.querySelector(".chatbox");
    if (footer) footer.style.display = "none";
    if (chatbox) chatbox.style.display = "none";

    return () => {
      if (footer) footer.style.display = "";
      if (chatbox) chatbox.style.display = "";
    };
  }, []);

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setLoginErrorMessage("Email and password are required!");
      setLoginSuccess(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: loginEmail,
        password: loginPassword,
      });

      const { token, user } = response.data;
      if (!token || !user) {
        setLoginErrorMessage("Invalid response from server!");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      setLoginSuccess(true);
      setTimeout(() => {
        setLoginSuccess(false);
        navigate("/text");
      }, 1000);
    } catch (error) {
      setLoginErrorMessage(error.response?.data?.message || "Login failed!");
      setLoginSuccess(false);
    }
  };

  // Animation variants for sliding
  const slideVariants = {
    hiddenLeft: { x: "-100%", opacity: 0 },
    hiddenRight: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-gradient-to-br from-purple-500 to-blue-600 overflow-y-auto">
      {/* Left Side - Features */}
      <motion.div
        className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 relative overflow-hidden"
        variants={slideVariants}
        initial="hiddenLeft"
        animate="visible"
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-700 opacity-30" />
        
        <div className="relative z-10 text-center space-y-6 w-full max-w-2xl">
          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-lg"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-cyan-300 to-lime-200 bg-clip-text text-transparent">
              PDFSmart
            </span>
          </motion.h1>
          <motion.h2
            className="text-base sm:text-lg lg:text-xl font-semibold text-white/90 drop-shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          >
            Intelligent Document Solutions, Simplified.
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FeatureItem
              icon={<FaMagic className="w-6 h-6 text-yellow-300" />}
              title="Summarize Smartly"
              description="Get key insights quickly with AI-powered summaries."
            />
            <FeatureItem
              icon={<FaLanguage className="w-6 h-6 text-green-300" />}
              title="Translate Instantly"
              description="Accurate translations at your fingertips."
            />
            <FeatureItem
              icon={<FaBookOpen className="w-6 h-6 text-purple-300" />}
              title="Manage Effortlessly"
              description="Streamline your PDF workflow."
            />
            <FeatureItem
              icon={<FaSecure className="w-6 h-6 text-cyan-300" />}
              title="Secure & Reliable"
              description="Fast, trustworthy document processing."
            />
          </div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8"
        variants={slideVariants}
        initial="hiddenRight"
        animate="visible"
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      >
        <div className="w-full max-w-md space-y-6 rounded-xl shadow-lg p-6 sm:p-8 backdrop-filter backdrop-blur-md bg-white/20">
          {/* Mobile Header */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              <span className="text-cyan-300">PDFSmart</span>
            </h2>
            <p className="text-white/80 text-sm sm:text-base">Log in to get started</p>
          </div>

          {/* Messages */}
          <AnimatePresence>
            {loginErrorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-100 border-l-4 border-red-500 p-3 rounded-md flex items-center text-sm"
              >
                <FaExclamationTriangle className="h-4 w-4 text-red-500 mr-2" />
                <p className="text-red-700">{loginErrorMessage}</p>
              </motion.div>
            )}
            {loginSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-100 border-l-4 border-green-500 p-3 rounded-md flex items-center text-sm"
              >
                <FaCheckCircle className="h-4 w-4 text-green-500 mr-2 animate-bounce" />
                <p className="text-green-700">Login successful, redirecting...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                <FaEnvelope className="inline-block mr-1 text-gray-300" />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 border rounded-md focus:ring-cyan-300 focus:border-cyan-300 text-base bg-white/80 backdrop-blur-sm"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                <FaLock className="inline-block mr-1 text-gray-300" />
                Password
              </label>
              <PasswordInput
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Login Button */}
          <motion.button
            className="w-full py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold rounded-md hover:shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 transition-all flex items-center justify-center text-base"
            onClick={handleLogin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaSignInAlt className="mr-2 animate-pulse" />
            Log In
          </motion.button>

          {/* Registration Link */}
          <div className="text-center text-sm text-white/80">
            Don't have an account?{' '}
            <button
              className="text-cyan-300 hover:text-cyan-200 font-medium focus:outline-none focus:underline transition-colors"
              onClick={() => navigate("/register")}
            >
              Sign up here
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;