import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { socket, connectSocket, disconnectSocket } from "./socket"; // Đã loại bỏ
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

export default function App() {
  const [textSummarizerContent, setTextSummarizerContent] = useState("");
  const [linkPageContent, setLinkPageContent] = useState("");
  const [documentSummaryContent, setDocumentSummaryContent] = useState("");

  // Kiểm tra đăng nhập dựa trên token
  const isAuthenticated = () => !!localStorage.getItem("token");


  // ProtectedRoute component (Giữ nguyên vì dựa trên localStorage)
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      // Người dùng chưa đăng nhập, chuyển hướng đến trang login
      return <Navigate to="/login" replace />;
    }
    // Người dùng đã đăng nhập, hiển thị component con
    return children;
  };

  return (
    <BrowserRouter>
      <div className="App">
        {/* Truyền hàm xử lý logout hoặc trạng thái đăng nhập vào Navigation nếu cần */}
        <Navigation /* isOnline={isOnline} totalOnline={totalOnline} */ /> {/* Đã loại bỏ props socket */}
        <Routes>
          {/* Các Route công khai */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/service" element={<ServicesSection />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/aboutus" element={<NaAboutus />} />

          {/* Các Route cần bảo vệ */}
          <Route
            path="/text"
            element={
              <ProtectedRoute>
                <TextPage updateTextSummarizerContent={setTextSummarizerContent} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/document"
            element={
              <ProtectedRoute>
                <DocumentPage updateDocumentSummaryContent={setDocumentSummaryContent} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/link"
            element={
              <ProtectedRoute>
                <LinkPage updateLinkPageContent={setLinkPageContent} />
              </ProtectedRoute>
            }
          />

          {/* Route mặc định hoặc trang 404 (Tùy chọn) */}
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}

        </Routes>
        <Footer />
        {/* ChatBox có thể cần kiểm tra isAuthenticated() trước khi hiển thị nếu chỉ dành cho người dùng đăng nhập */}
        {isAuthenticated() && (
             <ChatBox
                textSummarizerContent={textSummarizerContent}
                linkPageContent={linkPageContent}
                documentSummaryContent={documentSummaryContent}
             />
        )}

      </div>
    </BrowserRouter>
  );
}