import { useState } from "react";

import { FaSignInAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaTwitter, FaGithub, FaApple, FaInstagram, FaLinkedin, FaYoutube, FaDiscord, FaSlack } from "react-icons/fa";

import { FaSignInAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import axios from "axios";

const LoginPage = ({ onClose, onLoginSuccess }) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility


  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setLoginErrorMessage("Email and password are required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/api/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        setLoginErrorMessage("Invalid response from server!");
        return;
      }

      localStorage.setItem("token", token);

      if (onLoginSuccess && typeof onLoginSuccess === "function") {
        onLoginSuccess(user);
      }

      setLoginSuccess(true);

      if (user.role === "admin") {
        window.location.href = "/dashboard";
      } else {
        setTimeout(() => {
          setLoginSuccess(false);
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setLoginErrorMessage(error.response?.data?.message || "Login failed!");
      setLoginSuccess(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden">
      {/* Background gradient với nhiều icon logo */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-800"
        style={{ backgroundPosition: "0% 50%" }}
      >
        {/* Các icon logo trang trí - tăng số lượng và độ rõ */}
        <FaGoogle className="absolute top-10 left-20 text-white/70 h-12 w-12 animate-[pulse_4s_ease_infinite]" />
        <FaFacebook className="absolute bottom-16 right-24 text-white/70 h-14 w-14 animate-[float_5s_ease_infinite]" />
        <FaTwitter className="absolute top-1/3 right-10 text-white/70 h-10 w-10 animate-[pulse_3s_ease_infinite]" />
        <FaGithub className="absolute bottom-1/4 left-16 text-white/70 h-11 w-11 animate-[spin_6s_linear_infinite]" />
        <FaApple className="absolute top-1/2 left-1/3 text-white/70 h-12 w-12 animate-[float_4s_ease_infinite]" />
        <FaInstagram className="absolute top-20 right-1/4 text-white/70 h-10 w-10 animate-[pulse_5s_ease_infinite]" />
        <FaLinkedin className="absolute bottom-1/3 left-1/4 text-white/70 h-11 w-11 animate-[float_4s_ease_infinite]" />
        <FaYoutube className="absolute top-1/4 left-1/2 text-white/70 h-12 w-12 animate-[spin_7s_linear_infinite]" />
        <FaDiscord className="absolute bottom-10 right-1/3 text-white/70 h-10 w-10 animate-[pulse_4s_ease_infinite]" />
        <FaSlack className="absolute top-1/2 right-1/2 text-white/70 h-11 w-11 animate-[float_5s_ease_infinite]" />
        <FaGoogle className="absolute bottom-1/2 left-10 text-white/70 h-9 w-9 animate-[pulse_3s_ease_infinite]" />
        <FaTwitter className="absolute top-10 right-1/2 text-white/70 h-10 w-10 animate-[spin_6s_linear_infinite]" />
      </div>
      {/* Lớp phủ mờ - giảm độ mờ để icon nổi hơn */}
      <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-sm"></div>
      
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 relative z-10">
        <div className="text-center mb-6">
          <div className="flex justify-center">
            <div className="bg-blue-100 p-4 rounded-full">
              <FaSignInAlt className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Admin Login</h1>
          <p className="text-gray-600">Welcome back! Please log in to continue.</p>
        </div>

        {loginErrorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {loginErrorMessage}</span>
          </div>
        )}

        {loginSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> Login successful.</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="loginEmail"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="loginPassword"
                className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center"
            onClick={handleLogin}
          >
            <FaSignInAlt className="mr-2" /> Login
          </button>
        </div>
      </div>

      {/* Inline keyframes cho animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.7;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
