import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navigation = ({ loggedInUsername, onLoginClick, onRegisterClick, onLogout, onContactClick, onFeaturesClick }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-md py-3 z-50 min-h-[64px]">
            <div className="container mx-auto flex justify-between items-center px-6">
                {/* Logo với hiệu ứng RGB */}
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-green-400 to-blue-500 animate-[rgb_6s_linear_infinite] bg-[length:400%_100%]">
                    <a href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-green-400 to-blue-500 animate-[rgb_6s_linear_infinite] bg-[length:400%_100%]">
                        PDFSmart
                    </a>

                </div>

                {/* Menu */}
                <div className="flex gap-6">
                    {!loggedInUsername && (
                        <>
                            <a href="/" className="text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-lg text-base min-w-[100px] text-center">
                                Home
                            </a>
                            <button className="text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-lg text-base min-w-[100px]"
                                onClick={() => navigate("/aboutus")}>
                                About Us
                            </button>

                            {/* Ẩn Contact & Features nếu đang ở trang About Us */}
                            {location.pathname !== "/aboutus" && (
                                <>
                                    <button className="text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-lg text-base min-w-[100px]"
                                        onClick={onFeaturesClick}>
                                        Features
                                    </button>
                                    <button className="text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-lg text-base min-w-[100px]"
                                        onClick={onContactClick}>
                                        Contact
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </div>

                {/* Nút điều hướng */}
                <div className="flex items-center space-x-3">
                    {loggedInUsername ? (
                        <div className="flex items-center space-x-3">
                            <span className="text-indigo-700 font-medium text-lg">Hello, {loggedInUsername}</span>
                            <button
                                onClick={onLogout}
                                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg text-base font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg min-w-[120px]"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex space-x-3">
                            <button onClick={onLoginClick}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg text-base font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg min-w-[120px]">
                                Login
                            </button>
                            <button onClick={onRegisterClick}
                                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-3 rounded-lg text-base font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg min-w-[120px]">
                                Register
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;