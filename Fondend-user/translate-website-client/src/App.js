import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import TextPage from "./Pages/TextPage"
import DocumentPage from "./Pages/DocumentPage"
import Navigation from "./Pages/Navigation";
import Footer from "./Pages/Footer";
import ServicesSection from "./Pages/ServicesSection";
import Homepage from "./Pages/HomePage";



export default function App() {

  
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> {/* Route cho RegisterPage */}
        <Route path="/text" element={<TextPage />} /> {/* Route cho RegisterPage */}
        <Route path="/document" element={<DocumentPage/>} /> {/* Route cho RegisterPage */}
        <Route path="/na" element={<Navigation/>}/>
        <Route path="/footer" element={<Footer/>}/>
        <Route path="/service" element={<ServicesSection/>}/>
        <Route path="/" element={<Homepage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);