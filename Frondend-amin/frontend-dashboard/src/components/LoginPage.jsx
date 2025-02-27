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

      // Lưu token vào localStorage
      localStorage.setItem("token", token);

      // Cập nhật trạng thái người dùng
      if (onLoginSuccess && typeof onLoginSuccess === "function") {
        onLoginSuccess(user);
      }
      
      setLoginSuccess(true);

      // Nếu là admin, chuyển hướng ngay lập tức
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
    <div className="fixed inset-0 bg-gray-300 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
        <div className="text-center mb-6">
          <FaSignInAlt className="mx-auto h-12 w-12 text-blue-500 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-600">Login to use PDFSmart</p>
        </div>

        {loginErrorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {loginErrorMessage}</span>
          </div>
        )}

        {loginSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> Login successful.</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FaEnvelope className="mr-2 text-gray-500" />
              Email
            </label>
            <input
              type="email"
              id="loginEmail"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FaLock className="mr-2 text-gray-500" />
              Password
            </label>
            <input
              type="password"
              id="loginPassword"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center"
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
