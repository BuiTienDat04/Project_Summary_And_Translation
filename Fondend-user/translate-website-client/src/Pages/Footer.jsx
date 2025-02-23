import React from "react";

const Footer = () => {
  return (
    <footer className="mt-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 rounded-t-2xl shadow-2xl">
      <div className="container mx-auto px-6 text-center">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="text-3xl font-bold mb-4 md:mb-0">PDFSmart</div>
          <div className="flex space-x-8">
            <span className="cursor-default hover:text-blue-200 transition-colors">About</span>
            <span className="cursor-default hover:text-blue-200 transition-colors">Contact</span>
            <span className="cursor-default hover:text-blue-200 transition-colors">Terms</span>
          </div>
        </div>
        <p className="text-blue-100 text-sm">
          © {new Date().getFullYear()} PDFSmart. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
