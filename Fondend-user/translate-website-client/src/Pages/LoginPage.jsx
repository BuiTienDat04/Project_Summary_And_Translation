import { useState } from "react";
import { FaSignInAlt, FaEnvelope, FaLock } from "react-icons/fa";

// Component LoginPage xử lý đăng nhập người dùng
const LoginPage = ({ onClose, onLoginSuccess }) => {
  // Trạng thái lưu email người dùng nhập vào
  const [loginEmail, setLoginEmail] = useState("");

  // Trạng thái lưu mật khẩu người dùng nhập vào
  const [loginPassword, setLoginPassword] = useState("");

  // Trạng thái lưu thông báo lỗi nếu email hoặc mật khẩu không hợp lệ
  const [loginErrorMessage, setLoginErrorMessage] = useState("");

  // Trạng thái xác nhận đăng nhập thành công hay không
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Lưu thông tin người dùng sau khi đăng nhập thành công
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Kiểm soát hiển thị thông báo chào mừng sau khi đăng nhập thành công
  const [welcomeMessageVisible, setWelcomeMessageVisible] = useState(false); 

  // Xử lý đăng nhập khi người dùng nhấn nút "Đăng nhập"
  const handleLogin = () => {
    // Kiểm tra nếu email hoặc mật khẩu bị bỏ trống
    if (!loginEmail || !loginPassword) {
      setLoginErrorMessage("Email and password are required!"); // Hiển thị lỗi
      setLoginSuccess(false); // Đặt trạng thái đăng nhập thất bại
      console.log("onLoginSuccess:", onLoginSuccess); // Debug (nếu cần kiểm tra)
      return;
    }

    // Nếu nhập đúng, xóa thông báo lỗi và đặt trạng thái đăng nhập thành công
    setLoginErrorMessage("");
    setLoginSuccess(true);

    // Tạo một đối tượng user chỉ chứa email
    const user = {
      email: loginEmail,
    };

    setLoggedInUser(user); // Lưu thông tin người dùng
    onLoginSuccess(user); // Gọi hàm từ props để thông báo đăng nhập thành công
    setWelcomeMessageVisible(true); // Hiển thị thông báo chào mừng

    // Sau 2 giây, đặt lại trạng thái đăng nhập và đóng popup đăng nhập
    setTimeout(() => {
      setLoginSuccess(false);
      onClose(); 
    }, 2000);

    // Sau 3 giây, ẩn thông báo chào mừng
    setTimeout(() => {
      setWelcomeMessageVisible(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
        <div className="text-center mb-6">
          <FaSignInAlt className="mx-auto h-12 w-12 text-blue-500 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Login</h1>
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
        {welcomeMessageVisible && loggedInUser && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg z-50 shadow-lg animate-slide-down">
            <span className="font-medium">👋 Welcome back, {loggedInUser.email}!</span>
            <button
              onClick={() => setWelcomeMessageVisible(false)}
              className="ml-4 text-green-700 hover:text-green-800"
            >
              ×
            </button>
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
        <div className="mt-4 text-sm text-gray-600 text-center">
          Don't have an account? <button onClick={onClose} className="text-blue-500 hover:underline">Close Login</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;