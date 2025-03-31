import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import io from "socket.io-client";
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
  const [socket, setSocket] = useState(null);

  const protectedRoutes = ["/text", "/document", "/link"];
  const isAuthenticated = () => !!localStorage.getItem("token");

  // Quản lý Socket.IO dựa trên trạng thái đăng nhập
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId && !socket) {
      const socketInstance = io(API_BASE_URL, {
        query: { userId },
        auth: { token },
        withCredentials: true,
      });

      socketInstance.on("connect", () => {
        console.log("Socket.IO connected with userId:", userId);
      });

      socketInstance.on("updateUsers", (users) => {
        console.log("Received user statuses:", users);
        window.userStatuses = users; // Lưu trạng thái toàn cục
      });

      socketInstance.on("updateTotalOnline", (total) => {
        console.log("Total online users:", total);
      });

      socketInstance.on("disconnect", (reason) => {
        console.log("Socket.IO disconnected:", reason);
      });

      setSocket(socketInstance);
    } else if ((!token || !userId) && socket) {
      // Ngắt kết nối khi không còn đăng nhập
      socket.disconnect();
      setSocket(null);
      console.log("Socket.IO disconnected due to logout");
    }

    return () => {
      if (socket) {
        socket.disconnect();
        console.log("Socket.IO disconnected on cleanup");
        setSocket(null);
      }
    };
  }, [socket]); // Theo dõi socket để tránh tạo nhiều kết nối

  const connectSocketIfAuthenticated = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId && !socket) {
      const socketInstance = io(API_BASE_URL, {
        query: { userId },
        auth: { token },
        withCredentials: true,
      });

      socketInstance.on("connect", () => {
        console.log("Socket.IO reconnected with userId:", userId);
      });

      socketInstance.on("updateUsers", (users) => {
        console.log("Received user statuses:", users);
        window.userStatuses = users;
      });

      setSocket(socketInstance);
    }
  };

  const ProtectedRoute = ({ children, path }) => {
    useEffect(() => {
      if (protectedRoutes.includes(path) && isAuthenticated()) {
        connectSocketIfAuthenticated();
      }
    }, [path]);

    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/text"
            element={
              <ProtectedRoute path="/text">
                <TextPage updateTextSummarizerContent={setTextSummarizerContent} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/document"
            element={
              <ProtectedRoute path="/document">
                <DocumentPage updateDocumentSummaryContent={setDocumentSummaryContent} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/link"
            element={
              <ProtectedRoute path="/link">
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