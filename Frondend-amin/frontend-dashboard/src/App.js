import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import UserManagement from "./components/UserManagement";
import LoginPage from "./components/LoginPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user-management" element={<UserManagement />} />
      </Routes>
    </div>
  );
}

export default App;
