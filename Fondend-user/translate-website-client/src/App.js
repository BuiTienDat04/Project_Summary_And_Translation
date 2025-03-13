import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import TextPage from "./Pages/TextPage"
import DocumentPage from "./Pages/DocumentPage"
import Navigation from "./Pages/Navigation";
import Footer from "./Pages/Footer";
import ServicesSection from "./Pages/ServicesSection";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigation />} /> {/* Đặt trang chính là Navigation */}
        <Route path="/document" element={<DocumentPage />} /> {/* Thêm route này */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/text" element={<TextPage />} />
        <Route path="/na" element={<Navigation />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/service" element={<ServicesSection />} />
      </Routes>

    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);