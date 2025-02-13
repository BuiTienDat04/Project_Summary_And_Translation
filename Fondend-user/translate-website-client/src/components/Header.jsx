// src/components/Header.js
import React from 'react';
import { FaHome, FaSignInAlt, FaUserPlus } from 'react-icons/fa'; // Import các icon

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <span className="mr-2">📝</span> {/* Icon văn bản */}
          Tóm tắt và Dịch thuật
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="hover:text-yellow-300 transition-colors duration-300 flex items-center">
                <FaHome className="mr-1" /> Trang chủ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-300 transition-colors duration-300 flex items-center">
                <FaSignInAlt className="mr-1" /> Đăng nhập
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-300 transition-colors duration-300 flex items-center">
                <FaUserPlus className="mr-1" /> Đăng ký
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;