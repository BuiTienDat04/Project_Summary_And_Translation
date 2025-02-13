// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 mt-8">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          © 2023 Tóm tắt và Dịch thuật. Được phát triển bởi <span className="font-semibold">Your Team</span>.
        </p>
        <p className="text-sm mt-2">
          Liên hệ: <a href="mailto:info@example.com" className="underline">info@example.com</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;