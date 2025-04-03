import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import UserManagement from "./components/UserManagement";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { API_BASE_URL } from "./api/api";

function App() {
  // Khởi tạo isAuthenticated dựa trên token trong localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (token && !isAuthenticated) { // Chỉ kiểm tra nếu chưa xác thực
        try {
          // (Tùy chọn) Xác thực token với server
          const response = await axios.get(`${API_BASE_URL}/api/auth/verify`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Token verified:", response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("_id");
          localStorage.removeItem("loggedInUser");
          setIsAuthenticated(false);
          navigate("/loginad", { replace: true });
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, [navigate]); // Loại isAuthenticated khỏi dependency để tránh vòng lặp

  const handleLogout = async () => {
    console.log("handleLogout triggered");
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      console.log("API logout called successfully");
    } catch (error) {
      console.error("Error calling logout API:", error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("_id");
    localStorage.removeItem("loggedInUser");
    setIsAuthenticated(false);
    navigate("/loginad", { replace: true });
  };

  const ProtectedRoute = ({ children }) => {
    const isLoggedIn = !!localStorage.getItem("token");
    console.log("ProtectedRoute check, isLoggedIn:", isLoggedIn);
    return isLoggedIn ? children : <Navigate to="/loginad" replace />;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {console.log("App rendering, isAuthenticated:", isAuthenticated)}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="min-h-screen bg-gray-100">
        {isAuthenticated && <Navbar onLogout={handleLogout} />}
        <main className={isAuthenticated ? "pt-0" : ""}>
          <Routes>
            <Route
              path="/loginad"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-management"
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/loginad" replace />
                )
              }
            />
            <Route
              path="*"
              element={
                <Navigate to={isAuthenticated ? "/dashboard" : "/loginad"} replace />
              }
            />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;