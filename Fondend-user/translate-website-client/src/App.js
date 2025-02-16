import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Homepage from "./pages/Homepage";
import TextPage from "./pages/TextPage";
import GomePage from "./pages/GomePage";
import TailieuPage from "./pages/TailieuPage";
import AdminPage from "./pages/AdminPage";
 // Kiểm tra file này có tồn tại không!


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TextPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/gome" element={<GomePage />} />
        <Route path="/tailieu" element={<TailieuPage />} />
        <Route path="/adminadmin" element={<AdminPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
