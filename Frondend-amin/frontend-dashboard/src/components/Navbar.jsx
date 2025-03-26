import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { API_BASE_URL } from "../api/api";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      console.log("✅ Logout successful");
      localStorage.removeItem("token"); // Xóa token
      navigate("/login", { replace: true }); // Điều hướng bằng React Router
      setIsLogoutConfirmOpen(false); // Đóng dialog
    } catch (error) {
      console.error("❌ Logout failed:", error);
      // Có thể thông báo lỗi mà không chuyển hướng ngay
      // Nếu muốn chuyển hướng dù lỗi, thêm navigate vào đây
    }
  }, [navigate]);

  const handleUserManagementClick = () => {
    navigate("/user-management");
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-md w-full">
      <div className="flex items-center">
        <div className="flex-shrink-0 ml-6">
          <Link to="/dashboard" className="text-white text-2xl font-bold tracking-tight">
            PDFSmart
          </Link>
        </div>
        <div className="flex-grow" />
        <ul className="flex items-center space-x-4 mr-6">
          <li>
            <button
              onClick={handleUserManagementClick}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition duration-200 text-sm font-medium"
            >
              User Management
            </button>
          </li>
          <li>
            <button
              onClick={() => setIsLogoutConfirmOpen(true)}
              className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition duration-200 text-sm font-medium"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      >
        <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
          <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">
            Leave site?
          </Dialog.Title>
          <Dialog.Description className="text-gray-600 mb-6">
            Are you sure you want to log out?
          </Dialog.Description>
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
    </nav>
  );
};

export default Navbar;