import { useState } from "react";
import axios from "axios";
import { FaSignInAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";

const LoginPage = ({ onClose, onLoginSuccess }) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token);

      setLoginSuccess(true);
      setLoginErrorMessage("");

      setTimeout(() => {
        setLoginSuccess(false);
        if (onLoginSuccess) onLoginSuccess(response.data);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Login failed:", error);
      setLoginErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto relative">
        {/* Nút đóng */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900">
          <FaTimes size={20} />
        </button>

        <div className="text-center mb-6">
          <FaSignInAlt className="mx-auto h-12 w-12 text-blue-500 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Login</h1>
        </div>

        {loginErrorMessage && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">{loginErrorMessage}</div>}
        {loginSuccess && <div className="bg-green-100 text-green-700 px-4 py-3 rounded mb-4">Login successful!</div>}

        <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full p-2 border rounded-lg mb-2" />

        {/* Input mật khẩu với nút hiển thị/ẩn */}
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="w-full p-2 border rounded-lg pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button onClick={handleLogin} className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg mt-4">Login</button>
      </div>
    </div>
  );
};

export default LoginPage;
