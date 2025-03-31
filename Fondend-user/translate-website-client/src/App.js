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
  const [isOnline, setIsOnline] = useState(false);

  const protectedRoutes = ["/text", "/document", "/link"];
  
  // Kiểm tra xem người dùng đã đăng nhập hay chưa
  const isAuthenticated = () => !!localStorage.getItem("token");

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

  // ProtectedRoute component
  const ProtectedRoute = ({ children }) => {
    useEffect(() => {
      if (isAuthenticated()) {
        // Đảm bảo socket đã kết nối khi vào trang protected
        if (!socket.connected) {
          connectSocket();
        }
      }
    }, []);

    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navigation isOnline={isOnline} />
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