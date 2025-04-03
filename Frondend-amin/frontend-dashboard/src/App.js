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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Thêm loading state
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(false); // Giả lập hoàn tất khởi tạo
  }, []);

  const handleLogout = async () => {
    console.log("handleLogout triggered");
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      console.log("API logout called successfully");
    } catch (error) {
      console.error("Error calling logout API:", error);
    }
    console.log("Token before removal:", localStorage.getItem("token"));
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("loggedInUser");
    console.log("Token after removal:", localStorage.getItem("token"));
    setIsAuthenticated(false);
    console.log("Logged out, isAuthenticated set to false");
    navigate("/loginad", { replace: true });
    console.log("Navigated to /loginad");
  };

  const ProtectedRoute = ({ children }) => {
    const isLoggedIn = !!localStorage.getItem("token");
    console.log("ProtectedRoute check, isLoggedIn:", isLoggedIn);
    return isLoggedIn ? children : <Navigate to="/loginad" replace />;
  };

  if (isLoading) {
    return <div>Loading...</div>; // Hiển thị loading trong khi chờ
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
                <>
                  {console.log("Route /loginad, isAuthenticated:", isAuthenticated)}
                  {isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <LoginPage setIsAuthenticated={setIsAuthenticated} />
                  )}
                </>
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