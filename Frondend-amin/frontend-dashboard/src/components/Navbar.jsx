import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate(); // Hook để điều hướng

  const handleLogout = () => {
    // Xóa dữ liệu đăng nhập
    localStorage.removeItem("token");  // Nếu dùng token JWT
    localStorage.removeItem("user");   // Nếu lưu thông tin user

    // Chuyển hướng về trang đăng nhập
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          PDFSmart
        </Link>
        <ul className="flex space-x-6">
          <li>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-600 transition duration-200"
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
