import { useState } from "react";
import { FaSignInAlt, FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";

const LoginPage = ({ onClose, onLoginSuccess }) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setLoginErrorMessage("Email and password are required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
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
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="flex justify-center">
            <div className="bg-blue-100 p-4 rounded-full">
              <FaSignInAlt className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Admin Login</h1>
          <p className="text-gray-600">Welcome back! Please login to continue.</p>
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
                type="password"
                id="loginPassword"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
    </div>
  );
};

export default LoginPage;