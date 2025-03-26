import React, { useEffect, useCallback, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import UserManagement from "./components/UserManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import { API_BASE_URL } from "./api/api";
import { Dialog } from "@headlessui/react";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // Check authentication status and redirect
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && (location.pathname === "/login" || location.pathname === "/")) {
      navigate("/dashboard");
    } else if (!token && location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleLogout = useCallback(async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
      navigate("/login", { replace: true });
      setIsLogoutConfirmOpen(false); // Đóng dialog sau khi logout
    }
  }, [navigate]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <AuthHandler />
      <div className="min-h-screen bg-gray-100">
        <Navbar onLogout={() => setIsLogoutConfirmOpen(true)} />
        
        {/* Logout Confirmation Dialog */}
        <Dialog
          open={isLogoutConfirmOpen}
          onClose={() => setIsLogoutConfirmOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        >
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
            <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">Leave site?</Dialog.Title>
            <Dialog.Description className="text-gray-600 mb-6">Changes you made may not be saved.</Dialog.Description>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Leave
              </button>
            </div>
          </Dialog.Panel>
        </Dialog>

        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

function AuthHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const allowedPaths = ["/dashboard", "/user-management"];
    const token = localStorage.getItem("token");

    if (token) {
      if (!allowedPaths.includes(location.pathname) && location.pathname !== "/login") {
        console.log("Redirecting from invalid path");
        handleForcedLogout(navigate);
      }
    }
  }, [location, navigate]);

  return null;
}

async function handleForcedLogout(navigate) {
  try {
    await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
  } catch (error) {
    console.error("Forced logout error:", error);
  } finally {
    localStorage.clear();
    navigate("/login", { replace: true });
  }
}

export default App;