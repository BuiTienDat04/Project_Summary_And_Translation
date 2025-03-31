import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import UserManagement from "./components/UserManagement";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/loginad" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-management" element={<UserManagement />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
