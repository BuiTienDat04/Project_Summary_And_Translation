import { useState } from "react";
import { FaSignInAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import RegisterPage from "./RegisterPage";

const PasswordInput = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        id="loginPassword"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg"
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

const LoginPage = ({ onClose, onLoginSuccess, onOpenRegister }) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setLoginErrorMessage("Email and password are required!");
      setLoginSuccess(false);
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
      onLoginSuccess(user);

      setLoginSuccess(true);
      setTimeout(() => {
        setLoginSuccess(false);
        onClose();
      }, 2000);

      if (user.role === "admin") {
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setLoginErrorMessage(error.response?.data?.message || "Login failed!");
      setLoginSuccess(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-xl shadow-lg p-12 max-w-xl mx-auto">
        <div className="text-center mb-10">
          <FaSignInAlt className="mx-auto h-16 w-16 text-blue-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-800">Login</h1>
          <p className="text-lg text-gray-600">Login to use PDFSmart</p>
        </div>

        {loginErrorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {loginErrorMessage}</span>
          </div>
        )}

        {loginSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> Login successful.</span>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="loginEmail" className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
              <FaEnvelope className="mr-2 text-gray-500" />
              Email
            </label>
            <input
              type="email"
              id="loginEmail"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg"
              placeholder="Enter your Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="loginPassword" className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
              <FaLock className="mr-2 text-gray-500" />
              Password
            </label>
            <PasswordInput value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
          </div>
        </div>

        <div className="mt-8">
          <button
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center text-lg"
            onClick={handleLogin}
          >
            <FaSignInAlt className="mr-2" /> Login
          </button>
        </div>

        <div className="mt-6 text-lg text-gray-600 text-center">
          Don't have an account?
          <button onClick={onOpenRegister} className="text-blue-500 hover:underline">
            Register Now
          </button>
        </div>
        <div className="mt-4 text-center">
          <button onClick={onClose} className="text-blue-600 hover:underline">
            Close Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
