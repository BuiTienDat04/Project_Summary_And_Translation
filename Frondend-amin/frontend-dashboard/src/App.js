import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import UserManagement from "./components/UserManagement";

function App() {
  const [showLogin, setShowLogin] = useState(true);

  const handleClose = () => {
    setShowLogin(false); // Ẩn trang đăng nhập nếu cần
    console.log("Login page closed!");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={showLogin ? <LoginPage onClose={handleClose} /> : <Dashboard />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage onClose={handleClose} />} />
        <Route path="/user-management" element={<UserManagement />} />
      </Routes>
    </div>
  );
}

export default App;
