import { useState } from "react";
import { FaSignInAlt, FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios"; // Import axios để gọi API
import RegisterPage from "./RegisterPage";

const LoginPage = ({ onClose, onLoginSuccess, onOpenRegister }) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  const handleOpenRegister = () => {
    setShowLogin(false); // Ẩn modal đăng nhập
    setShowRegister(true); // Hiển thị form đăng ký
  };

  const handleCloseRegister = () => {
    setShowRegister(false); // Ẩn form đăng ký
  };

  // Xử lý đăng nhập khi người dùng nhấn nút "Đăng nhập"
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

      localStorage.setItem("token", token); // Lưu token để sử dụng sau này
      onLoginSuccess(user); // Cập nhật trạng thái người dùng

      setLoginSuccess(true);
      setTimeout(() => {
        setLoginSuccess(false);
        onClose();
      }, 2000);

      // 🔥 Nếu là admin, chuyển hướng đến Dashboard
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
      <div className="bg-white rounded-xl shadow-lg p-12 max-w-xl mx-auto"> {/* Tăng padding và max-width */}
        <div className="text-center mb-10"> {/* Tăng margin bottom */}
          <FaSignInAlt className="mx-auto h-16 w-16 text-blue-500 mb-4" /> {/* Tăng kích thước icon và margin bottom */}
          <h1 className="text-4xl font-bold text-gray-800">Login</h1> {/* Tăng kích thước tiêu đề */}
          <p className="text-lg text-gray-600">Login to use PDFSmart</p> {/* Tăng kích thước đoạn văn bản */}
        </div>

        {loginErrorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"> {/* Tăng margin bottom */}
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {loginErrorMessage}</span>
          </div>
        )}

        {loginSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6"> {/* Tăng margin bottom */}
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> Login successful.</span>
          </div>
        )}

        <div className="space-y-6"> {/* Tăng khoảng cách giữa các phần tử */}
          <div>
            <label htmlFor="loginEmail" className="block text-lg font-medium text-gray-700 mb-2 flex items-center"> {/* Tăng kích thước label và margin bottom */}
              <FaEnvelope className="mr-2 text-gray-500" />
              Email
            </label>
            <input
              type="email"
              id="loginEmail"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg" // Tăng padding và kích thước text
              placeholder="Enter your Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="loginPassword" className="block text-lg font-medium text-gray-700 mb-2 flex items-center"> {/* Tăng kích thước label và margin bottom */}
              <FaLock className="mr-2 text-gray-500" />
              Password
            </label>
            <input
              type="password"
              id="loginPassword"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg" // Tăng padding và kích thước text
              placeholder="Enter your password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-8"> {/* Tăng margin top */}
          <button
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center text-lg" // Tăng padding, kích thước text
            onClick={handleLogin}
          >
            <FaSignInAlt className="mr-2" /> Login
          </button>
        </div>

        <div className="mt-6 text-lg text-gray-600 text-center">
          Don't have an account?
          <button onClick={onOpenRegister} className="text-blue-500 hover:underline"> {/* Gọi onOpenRegister */}
            Register Now
          </button>
        </div>
        <div className="mt-4 text-center"> {/* Add a div to center the button */}
          <button onClick={onClose} className="text-blue-600 hover:underline">
            Close Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
