import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/text" element={<TextPage updateTextSummarizerContent={setTextSummarizerContent} />} />
          <Route path="/document" element={<DocumentPage updateDocumentSummaryContent={setDocumentSummaryContent} />} />
          <Route path="/link" element={<LinkPage updateLinkPageContent={setLinkPageContent} />} />
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