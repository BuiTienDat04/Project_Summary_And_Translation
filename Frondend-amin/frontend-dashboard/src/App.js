import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connectSocket, disconnectSocket, socket } from "./socket"; // Import socket đúng cách
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import UserManagement from "./components/UserManagement";

function App() {
  const [totalOnline, setTotalOnline] = useState(0);

  useEffect(() => {
    // 🟢 Kết nối WebSocket khi App mount
    connectSocket();

    // Lắng nghe sự kiện cập nhật số người online
    socket.on("updateTotalOnline", (total) => {
      console.log("Total online users (admin):", total);
      setTotalOnline(total);
    });

    // 🔴 Cleanup khi App unmount
    return () => {
      disconnectSocket();
      socket.off("updateTotalOnline"); // Ngừng lắng nghe sự kiện
      console.log("Socket.IO disconnected on cleanup (admin)");
    };
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/loginad" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard totalOnline={totalOnline} />} />
          <Route path="/user-management" element={<UserManagement />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
