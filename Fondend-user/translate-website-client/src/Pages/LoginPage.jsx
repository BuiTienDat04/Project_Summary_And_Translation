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
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg bg-white/80 backdrop-blur-sm text-gray-700"
        placeholder="Enter your password"
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        className="absolute right-3 top-[50%] translate-y-[-50%] text-gray-500"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
};

const LoginPage = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setLoginErrorMessage("Email and password are required!");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { email: loginEmail, password: loginPassword },
        { withCredentials: true }
      );

      const { token, user } = response.data;

      if (!token || !user || !user._id) {
        setLoginErrorMessage("Invalid response from server! Missing token or user ID.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("_id", user._id);
      localStorage.setItem("loggedInUser", JSON.stringify(user));

      setLoginSuccess(true);
      setLoginErrorMessage("");
      setTimeout(() => {
        navigate("/text", { replace: true });
      }, 2000);
    } catch (error) {
      setLoginErrorMessage(error.response?.data?.message || "Login failed!");
      setLoginSuccess(false);
    }
  };

  useEffect(() => {
    const handleInitialLogout = async () => {
      try {
        await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
        localStorage.removeItem("token");
        localStorage.removeItem("_id");
        localStorage.removeItem("loggedInUser");
      } catch (error) {
        console.error("Logout error on mount:", error.message);
      }
    };
    handleInitialLogout();
  }, []);

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

  const FeatureItem = ({ icon, title, description }) => (
    <div className="bg-white/5 backdrop-blur-md rounded-lg p-5 shadow-md border border-white/10 flex items-center space-x-4">
      <div className="p-2 rounded-md bg-gradient-to-br from-gray-200/10 to-gray-700/10">{icon}</div>
      <div>
        <h4 className="text-lg font-semibold text-white">{title}</h4>
        <p className="text-white/70 text-sm">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-purple-500 to-blue-600 overflow-hidden">
      {/* Left Side - Static Content */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 text-white">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">
            <span className="bg-gradient-to-r from-cyan-300 to-lime-200 bg-clip-text text-transparent">
              PDFSmart
            </span>
          </h1>
          <h2 className="text-lg md:text-xl font-semibold text-white/90">
            Intelligent Document Solutions, Simplified.
          </h2>
          <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
            <FeatureItem
              icon={<FaMagic className="w-6 h-6 text-yellow-300" />}
              title="Summarize Smartly"
              description="Get key insights quickly with AI-powered summaries."
            />
            <FeatureItem
              icon={<FaLanguage className="w-6 h-6 text-green-300" />}
              title="Translate Instantly"
              description="Break language barriers with accurate translations."
            />
            <FeatureItem
              icon={<FaBookOpen className="w-6 h-6 text-purple-300" />}
              title="Manage Effortlessly"
              description="Organize, merge, and split PDFs with ease."
            />
            <FeatureItem
              icon={<FaCheckCircle className="w-6 h-6 text-cyan-300" />}
              title="Secure & Reliable"
              description="Fast, trustworthy processing for your documents."
            />
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md space-y-6 rounded-xl shadow-lg p-6 bg-white/20 backdrop-blur-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome to <span className="text-cyan-300">PDFSmart</span>
            </h2>
            <p className="text-white/80 mb-4">Log in to streamline your document workflows.</p>
          </div>

          <AnimatePresence>
            {loginErrorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-100 border-l-4 border-red-500 p-3 rounded-md flex items-center"
              >
                <FaExclamationTriangle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{loginErrorMessage}</p>
              </motion.div>
            )}
            {loginSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-100 border-l-4 border-green-500 p-3 rounded-md flex items-center"
              >
                <FaCheckCircle className="h-5 w-5 text-green-500 mr-2 animate-bounce" />
                <p className="text-green-700">Login successful, redirecting...</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <FaEnvelope className="inline-block mr-1 text-gray-300" /> Email Address
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 border rounded-md focus:ring-cyan-300 focus:border-cyan-300 text-gray-700 bg-white/80 backdrop-blur-sm"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <FaLock className="inline-block mr-1 text-gray-300" /> Password
              </label>
              <PasswordInput value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
            </div>
          </div>

          <motion.button
            className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold rounded-md hover:shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 transition-all flex items-center justify-center"
            onClick={handleLogin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            disabled={loginSuccess}
          >
            <FaSignInAlt className={`mr-2 ${loginSuccess ? "" : "animate-pulse"}`} />
            {loginSuccess ? "Redirecting..." : "Log In"}
          </motion.button>

          <div className="text-center text-sm text-white/80">
            Don't have an account?{" "}
            <button
              className="text-cyan-300 hover:text-cyan-200 font-medium focus:underline"
              onClick={() => navigate("/register")}
            >
              Sign up here
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;