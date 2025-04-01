import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connectSocket, disconnectSocket, socket } from "./socket";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import UserManagement from "./components/UserManagement";

function App() {
  const [totalOnline, setTotalOnline] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    // Chỉ kết nối socket nếu đã đăng nhập
    if (isAuthenticated) {
      connectSocket();

      socket.on("updateTotalOnline", (total) => {
        setTotalOnline(total);
        console.log("Total online users (admin):", total);
      });

      socket.on("updateUsers", (users) => {
        console.log("User status (admin):", users);
      });

      return () => {
        socket.off("updateTotalOnline");
        socket.off("updateUsers");
      };
    }
  }, [isAuthenticated]); // Phụ thuộc vào trạng thái đăng nhập

  // Hàm logout thủ công
  const handleLogout = () => {
    disconnectSocket();
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setTotalOnline(0);
  };

  // ProtectedRoute cho admin
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/loginad" replace />;
    }
    return children;
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-gray-100">
        <Navbar totalOnline={totalOnline} onLogout={handleLogout} /> {/* Truyền totalOnline và logout */}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/loginad" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard totalOnline={totalOnline} />
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
        </Routes>
      </div>
    </>
  );
}

export default App;