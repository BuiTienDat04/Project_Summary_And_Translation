import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleUserManagementClick = () => {
    navigate("/user-management");
  };

  const handleLogoutClick = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      onLogout();
    }
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
              onClick={handleLogoutClick}
              className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition duration-200 text-sm font-medium"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;