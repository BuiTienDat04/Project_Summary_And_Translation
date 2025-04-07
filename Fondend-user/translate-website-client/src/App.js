import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import HistorySummary from "./Pages/HistorySummary"; // Đã import

// Component chính để sử dụng useLocation
function MainApp() {
  const [textSummarizerContent, setTextSummarizerContent] = useState("");
  const [linkPageContent, setLinkPageContent] = useState("");
  const [documentSummaryContent, setDocumentSummaryContent] = useState("");
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại

  // Kiểm tra đăng nhập dựa trên token
  const isAuthenticated = () => !!localStorage.getItem("token");

  // Kiểm tra xem có nên hiển thị ChatBox và HistorySummary không
  const shouldShowChatAndHistory = () => {
    const allowedPaths = ["/text", "/document", "/link"];
    return isAuthenticated() && allowedPaths.includes(location.pathname);
  };

  // ProtectedRoute component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <div className="App">
      <Navigation />
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
      </Routes>
      <Footer />

      {/* Hiển thị ChatBox và HistorySummary chỉ trên /text, /document, /link */}
      {shouldShowChatAndHistory() && (
        <>
          <HistorySummary />
          <ChatBox
            textSummarizerContent={textSummarizerContent}
            linkPageContent={linkPageContent}
            documentSummaryContent={documentSummaryContent}
            loggedInUser={isAuthenticated()}
          />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}