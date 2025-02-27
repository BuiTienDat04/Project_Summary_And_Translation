import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import UserManagement from "./components/UserManagement";
import LoginPage from "./components/LoginPage";

function App() {
  const isAuthenticated = localStorage.getItem("adminToken"); // Kiểm tra token admin

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
      <Route
  path="/"
  element={<LoginPage onLoginSuccess={(user) => {
    if (user.role === "admin") {
      localStorage.setItem("adminToken", "your_admin_token_here"); // Giả lập token admin
      window.location.href = "/dashboard"; // Chuyển hướng sau khi login thành công
    } else {
      alert("Bạn không có quyền truy cập vào trang admin.");
    }
  }} />}
/>

        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/user-management"
          element={isAuthenticated ? <UserManagement /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;
