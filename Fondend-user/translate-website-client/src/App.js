import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import TextPage from "./Pages/TextPage";
import DocumentPage from "./Pages/DocumentPage";
import Navigation from "./Pages/Navigation";
import Footer from "./Pages/Footer";
import ServicesSection from "./Pages/ServicesSection";
import Homepage from "./Pages/HomePage";
import NaAboutus from "./components/ui/naAboutus";
import LinkPage from "./Pages/LinkPage";
import ChatBox from "./Pages/ChatBox";
import { API_BASE_URL } from "./api/api";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [textSummarizerContent, setTextSummarizerContent] = useState("");
  const [linkPageContent, setLinkPageContent] = useState("");
  const [documentSummaryContent, setDocumentSummaryContent] = useState("");

  // Hàm logout
  const handleLogout = async () => {
    try {
      // Gọi API logout
      await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      console.log("✅ Logout successful");

      // Xóa tất cả các key trong Local Storage
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("loggedInUser");

      // Chuyển hướng về trang đăng nhập
      window.location.href = "/";
    } catch (error) {
      console.error("❌ Logout API failed:", error);

      // Vẫn xóa Local Storage ngay cả khi API thất bại
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("loggedInUser");

      // Chuyển hướng về
      window.location.href = "/";
    }
  };

  return (
    <BrowserRouter>
      <LogoutOnTabClose />
      <AuthHandler />
      <div className="App">
        <Navigation onLogout={handleLogout} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/text" element={<ProtectedRoute><TextPage updateTextSummarizerContent={setTextSummarizerContent} /></ProtectedRoute>} />
          <Route path="/document" element={<ProtectedRoute><DocumentPage updateDocumentSummaryContent={setDocumentSummaryContent} /></ProtectedRoute>} />
          <Route path="/link" element={<ProtectedRoute><LinkPage updateLinkPageContent={setLinkPageContent} /></ProtectedRoute>} />
          <Route path="/service" element={<ServicesSection />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/aboutus" element={<NaAboutus />} />
        </Routes>
        <Footer />
        <ChatBox
          textSummarizerContent={textSummarizerContent}
          linkPageContent={linkPageContent}
          documentSummaryContent={documentSummaryContent}
        />
      </div>
    </BrowserRouter>
  );
}

function AuthHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const allowedPaths = ["/text", "/document", "/link"];
    const token = localStorage.getItem("token");

    if (token) {
      if (!allowedPaths.includes(location.pathname)) {
        console.log("🔹 Trang không hợp lệ! Xóa token và logout...");
        localStorage.removeItem("token");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("loggedInUser");
        navigate("/");
      }
    }
  }, [location, navigate]);

  return null;
}

function LogoutOnTabClose() {
  const location = useLocation(); // Thêm useLocation

  useEffect(() => {
    const handleLogout = (event) => {
      // Chỉ hiển thị thông báo xác nhận nếu không phải trang /login
      if (location.pathname !== "/login") {
        event.preventDefault();
        event.returnValue = "Are you sure you want to leave? You will be logged out.";
      }

      // Sử dụng navigator.sendBeacon để gửi yêu cầu logout
      const url = `${API_BASE_URL}/api/auth/logout`;
      const data = new Blob([JSON.stringify({})], { type: "application/json" });
      navigator.sendBeacon(url, data);

      // Xóa Local Storage ngay lập tức
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("loggedInUser");

      console.log("🔹 Logout request sent via sendBeacon at:", new Date().toISOString());
    };

    window.addEventListener("beforeunload", handleLogout);

    return () => {
      window.removeEventListener("beforeunload", handleLogout);
    };
  }, [location.pathname]); // Thêm dependency

  return null;
}