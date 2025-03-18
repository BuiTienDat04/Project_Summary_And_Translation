import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navigation = ({ loggedInUsername, onLoginClick, onRegisterClick, onLogout, onContactClick, onFeaturesClick }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/auth/logout", {
                method: "POST",
                credentials: "include", // Cần thiết để gửi cookie
            });

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            const data = await response.json();
            console.log("✅ Logout successful:", data);

            // Xóa token trên frontend (nếu có dùng localStorage)
            localStorage.removeItem("token");

            // Chuyển hướng về trang login
            window.location.href = "/";
        } catch (error) {
            console.error("❌ Logout error:", error);
        }
    };


    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-md py-3 z-50 min-h-[64px]">
            <div className="container mx-auto flex justify-between items-center px-6">

                {/* Logo */}
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-green-400 to-blue-500 animate-[rgb_6s_linear_infinite] bg-[length:400%_100%]">
                    <a href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-green-400 to-blue-500 animate-[rgb_6s_linear_infinite] bg-[length:400%_100%]">
                        PDFSmart
                    </a>
                </div>

                {/* Menu */}
                <div className="flex gap-6 sm:gap-3"> {/* Giảm khoảng cách trên màn hình nhỏ */}
                    {!loggedInUsername && (
                        <>
                            <a href="/" className="text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-lg text-base min-w-[100px] text-center">
                                Home
                            </a>
                            <button
                                className="text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-lg text-base min-w-[100px]"
                                onClick={() => navigate("/aboutus")}>
                                About Us
                            </button>

                            {location.pathname !== "/aboutus" && (
                                <>
                                    <button
                                        className="text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-lg text-base min-w-[100px]"
                                        onClick={onFeaturesClick}>
                                        Features
                                    </button>
                                    <button
                                        className="text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-lg text-base min-w-[100px]"
                                        onClick={onContactClick}>
                                        Contact
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </div>

                {/* Nút điều hướng */}
                <div className="flex items-center space-x-3 sm:space-x-1"> {/* Giảm khoảng cách trên màn hình nhỏ */}
                    {loggedInUsername ? (
                        <div className="flex items-center space-x-3">
                            <span className="text-indigo-700 font-medium text-lg">Hello, {loggedInUsername}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg min-w-[100px] sm:px-3 sm:py-2 sm:text-base"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex space-x-3 sm:space-x-1"> {/* Giảm khoảng cách trên màn hình nhỏ */}
                            <button
                                onClick={onLoginClick}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg min-w-[100px] sm:px-3 sm:py-2 sm:text-base"> {/* Giảm padding và font size trên màn hình nhỏ */}
                                Login
                            </button>
                            <button
                                onClick={onRegisterClick}
                                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg min-w-[100px] sm:px-3 sm:py-2 sm:text-base"> {/* Giảm padding và font size trên màn hình nhỏ */}
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
