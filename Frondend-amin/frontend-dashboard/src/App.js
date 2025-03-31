import React, { useState, useEffect } from "react"; // Thêm useState, useEffect
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client"; // Thêm Socket.IO
import { API_BASE_URL } from "./api/api"; // Giả sử bạn có file api.js
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import UserManagement from "./components/UserManagement";

function App() {
  const [totalOnline, setTotalOnline] = useState(0); // State để lưu totalOnline

  useEffect(() => {
    // Khởi tạo Socket.IO
    const socket = io(API_BASE_URL, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Socket.IO connected for admin");
    });

    socket.on("updateTotalOnline", (total) => {
      console.log("Total online users (admin):", total);
      setTotalOnline(total); // Cập nhật state
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket.IO disconnected for admin:", reason);
    });

    // Cleanup khi App unmount
    return () => {
      socket.disconnect();
      console.log("Socket.IO disconnected on cleanup (admin)");
    };
  }, []); // Chỉ chạy một lần khi App mount

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/loginad" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard totalOnline={totalOnline} />} /> {/* Truyền totalOnline */}
          <Route path="/user-management" element={<UserManagement />} />
        </Routes>
      </div>
    </>
  );
}

export default App;