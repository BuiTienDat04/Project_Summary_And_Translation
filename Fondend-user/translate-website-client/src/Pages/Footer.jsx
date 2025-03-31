import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
        {/* Cột 1: Thông tin liên hệ */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <FaMapMarkerAlt className="text-gray-400" />
            <span>
              <span className="block">Duong Noi Street</span>
              <span className="font-bold">Ha Noi, Viet Nam </span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <FaPhoneAlt className="text-gray-400" />
            <span className="font-bold">+84 866638629</span>
          </div>

          <div className="flex items-center space-x-3">
            <FaEnvelope className="text-gray-400" />
            <a href="mailto:nguyendhieu1210@gmail.com" className="text-blue-400 hover:underline">
              nguyendhieu1210@gmail.com
            </a>
          </div>
        </div>

        {/* Cột 2: Giới thiệu công ty */}
        <div className="max-w-md text-left mt-6 md:mt-0">
          <h3 className="font-semibold mt-1">About PDFSMART</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            PDFSMART helps you quickly and accurately summarize text content while also supporting multilingual translation, making it easier for you to access information.
          </p>
        </div>

        {/* Cột 3: Social Icons */}
        <div className="flex space-x-4 mt-4">
            <a href="https://www.facebook.com/people/Nguy%E1%BB%85n-%C4%90%C3%ACnh-Hi%E1%BA%BFu/pfbid02GdryD7MoU1VE6qEjwPk7HUMTHUVEXwcnbvyRHQxUd7Gn47QNU22ciW1jBNsqtUJdl/" className="text-gray-400 hover:text-white"><FaFacebook size={24} /></a>
            <a href="https://x.com/dinhhieu1210?s=21" className="text-gray-400 hover:text-white"><FaTwitter size={24} /></a>
            <a href="https://www.linkedin.com/in/nguyendinhhieu2004"className="text-gray-400 hover:text-white"><FaLinkedin size={24} /></a>
            <a href="https://github.com/nguyendinhhieu1210" className="text-gray-400 hover:text-white"><FaGithub size={24} /></a>
          </div>
      </div>
    </footer>
  );
};

export default Footer;
