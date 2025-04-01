import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { socket, connectSocket, disconnectSocket } from "./socket";
import { API_BASE_URL } from "./api/api";
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
  const [isOnline, setIsOnline] = useState(false); // Trạng thái kết nối socket
  const [totalOnline, setTotalOnline] = useState(0); // Tổng số người online

  const protectedRoutes = ["/text", "/document", "/link"];
  
  // Kiểm tra đăng nhập dựa trên token
  const isAuthenticated = () => !!localStorage.getItem("token");

  useEffect(() => {
    // Chỉ kết nối socket nếu đã đăng nhập
    if (isAuthenticated()) {
      connectSocket();
      setIsOnline(true);

      // Lắng nghe tổng số người online
      socket.on("updateTotalOnline", (total) => {
        setTotalOnline(total);
        console.log("Total online users:", total);
      });

      // (Tùy chọn) Lắng nghe trạng thái users nếu cần
      socket.on("updateUsers", (users) => {
        console.log("User status:", users);
      });

      // Cleanup khi component unmount hoặc logout
      return () => {
        socket.off("updateTotalOnline");
        socket.off("updateUsers");
      };
    }
  }, []); // Chạy một lần khi mount, sẽ cập nhật qua isAuthenticated

  // Hàm logout thủ công
  const handleLogout = () => {
    disconnectSocket();
    localStorage.removeItem("token");
    setIsOnline(false);
    setTotalOnline(0); // Reset khi logout
  };

  // ProtectedRoute component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navigation isOnline={isOnline} totalOnline={totalOnline} /> {/* Truyền totalOnline nếu cần */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
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