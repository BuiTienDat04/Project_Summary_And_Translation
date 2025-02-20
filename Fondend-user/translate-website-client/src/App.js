import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Homepage from "./pages/Homepage";
import TextPage from "./pages/TextPage";
import GomePage from "./pages/GomePage";
import TailieuPage from "./pages/TailieuPage";
import AdminPage from "./pages/AdminPage";

const API_BASE_URL = "http://localhost:3000"; // Cập nhật URL của backend nếu cần

function App() {
  const [message, setMessage] = useState("");

  // Kiểm tra kết nối với backend khi ứng dụng chạy
  useEffect(() => {
    fetch(`${API_BASE_URL}/test`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error("Lỗi kết nối backend:", err));
  }, []);

  return (
    <BrowserRouter>
      <div>
        <h3>Trạng thái Backend: {message || "Đang kết nối..."}</h3>
      </div>
      <Routes>
        <Route path="/" element={<TextPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/gome" element={<GomePage />} />
        <Route path="/tailieu" element={<TailieuPage />} />
        <Route path="/adminadmin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
