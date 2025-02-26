import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import UserManagement from "./UserManagement";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          {/* Route chính cần có exact */}
          <Route path="/" element={<Dashboard />} exact />
          <Route path="/user-management" element={<UserManagement />} />
          
          {/* Xử lý khi truy cập đường dẫn không tồn tại */}
          <Route path="*" element={<h1 className="text-center text-red-500 mt-10">404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
