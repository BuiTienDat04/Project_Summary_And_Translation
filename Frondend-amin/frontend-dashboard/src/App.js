import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage"; 
import UserManagement from "./components/UserManagement";

function App() {
  // Kiểm tra trạng thái đăng nhập ban đầu từ localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));

  // Cập nhật useEffect để lắng nghe thay đổi localStorage từ tab khác (tùy chọn)
  useEffect(() => {
    const handleStorageChange = () => {
       setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener khi component unmount
    return () => {
       window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId"); // Nên xóa cả userId nếu có lưu
    localStorage.removeItem("loggedInUser"); // Xóa cả thông tin user nếu có
    setIsAuthenticated(false);
  };

  // Component ProtectedRoute cho admin (giữ nguyên)
  const ProtectedRoute = ({ children }) => {
    // Kiểm tra lại trạng thái xác thực mỗi lần render Route
    const isLoggedIn = !!localStorage.getItem("token");
    if (!isLoggedIn) {
      // Nếu không đăng nhập, chuyển hướng đến trang login của admin
      return <Navigate to="/loginad" replace />;
    }
    // Nếu đã đăng nhập, hiển thị component con
    return children;
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="min-h-screen bg-gray-100">
         {/* Chỉ hiển thị Navbar nếu đã đăng nhập */}
         {isAuthenticated && <Navbar /* totalOnline={totalOnline} */ onLogout={handleLogout} /> } {/* Đã loại bỏ props totalOnline */}
        <main className={isAuthenticated ? "pt-16" : ""}> {/* Thêm padding top nếu Navbar hiển thị */}
          <Routes>
             {/* Route cho trang Login Admin */}
             {/* Nếu đã đăng nhập thì chuyển hướng khỏi trang login */}
            <Route
               path="/loginad"
               element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage setIsAuthenticated={setIsAuthenticated} /* Đây là hàm để LoginPage cập nhật trạng thái sau khi login thành công */ />}
            />

             {/* Route cho Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard /> {/* Đã loại bỏ props totalOnline */}
                </ProtectedRoute>
              }
            />

             {/* Route cho User Management */}
            <Route
              path="/user-management"
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              }
            />

            {/* Route mặc định: Chuyển hướng đến login nếu chưa đăng nhập, đến dashboard nếu đã đăng nhập */}
            <Route
               path="/"
               element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/loginad" replace />}
            />

             {/* Route bắt các đường dẫn không khớp (404 Not Found) */}
             <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/loginad"} replace />} />

          </Routes>
        </main>
      </div>
    </>
    // </BrowserRouter>
  );
}

export default App;