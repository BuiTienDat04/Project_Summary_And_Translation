import React, { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navigation = ({ loggedInUsername, onLoginClick, onRegisterClick, onLogout, onContactClick, onFeaturesClick }) => {
    const navigate = useNavigate();
    const location = useLocation(); // Lấy đường dẫn hiện tại

    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-md py-3 z-50 min-h-[64px]">
            <div className="container mx-auto flex justify-between items-center px-6">
                {/* Logo */}
                <div className="text-2xl font-bold text-indigo-700">PDFSmart</div>

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
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg text-base font-medium transition-all transform hover:scale-105 shadow-md hover:shadow-lg min-w-[120px]"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex space-x-3">
                            <button onClick={onLoginClick}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-base font-medium transition-all transform hover:scale-105 shadow-md hover:shadow-lg min-w-[120px]">
                                Login
                            </button>
                            <button onClick={onRegisterClick}
                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-base font-medium transition-all transform hover:scale-105 shadow-md hover:shadow-lg min-w-[120px]">
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
