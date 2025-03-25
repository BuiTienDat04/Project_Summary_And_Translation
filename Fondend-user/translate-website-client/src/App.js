import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom"; // 🟢 Đúng import
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

export default function App() {
    const [textSummarizerContent, setTextSummarizerContent] = useState("");
    const [linkPageContent, setLinkPageContent] = useState("");
    const [documentSummaryContent, setDocumentSummaryContent] = useState("");

    return (
        <BrowserRouter>  {/* 🟢 Sử dụng BrowserRouter đúng cách */}
            <AuthHandler /> {/* 🟢 Kiểm tra token */}
            <div className="App">
                <Navigation />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/text"
                        element={<TextPage updateTextSummarizerContent={setTextSummarizerContent} />}
                    />
                    <Route
                        path="/document"
                        element={<DocumentPage updateDocumentSummaryContent={setDocumentSummaryContent} />}
                    />
                    <Route path="/service" element={<ServicesSection />} />
                    <Route path="/" element={<Homepage />} />
                    <Route path="/aboutus" element={<NaAboutus />} />
                    <Route
                        path="/link"
                        element={<LinkPage updateLinkPageContent={setLinkPageContent} />}
                    />
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

// ✅ Kiểm tra token & logout nếu truy cập trang không hợp lệ
function AuthHandler() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const allowedPaths = ["/text", "/document", "/link"];
        const token = localStorage.getItem("token");

        if (token) {
            if (!allowedPaths.includes(location.pathname)) {
                console.log("🔹 Trang không hợp lệ! Xóa token và logout...");
                localStorage.removeItem("token"); // 🟢 Xóa token
                navigate("/login"); // 🟢 Chuyển hướng về login
            }
        }
    }, [location, navigate]);

    return null;
}
