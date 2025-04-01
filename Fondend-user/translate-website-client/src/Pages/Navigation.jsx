import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../api/api";
import axios from "axios";

const Navigation = ({ loggedInUsername, onLoginClick, onRegisterClick, onLogout, onContactClick, onFeaturesClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Hide navigation on login/register pages
    if (location.pathname === "/login" || location.pathname === "/register") {
        return null;
    }

    const handleLogout = () => {
        console.log("Logout button clicked"); // Kiểm tra sự kiện
        console.log("Calling logout API at:", `${API_BASE_URL}/api/auth/logout`); // Kiểm tra URL

        axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true })
            .then((response) => {
                console.log("Logout successful:", response.data); // Kiểm tra phản hồi
                localStorage.removeItem("token");
                console.log("Token removed, navigating to login");
                setTimeout(() => {
                    navigate("/"); 
                }, 1000); 
            })
            .catch(err => {
                console.error("❌ Logout error:", err.response ? err.response.data : err.message); // Log lỗi chi tiết
            });
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-md py-3 z-50 min-h-[64px]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="text-2xl font-bold">
                        <a href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-green-400 to-blue-500 animate-[rgb_6s_linear_infinite] bg-[length:400%_100%]">
                            PDFSmart
                        </a>
                    </div>

                    {/* Hamburger Menu Button (visible on mobile) */}
                    <button
                        className="md:hidden p-2 focus:outline-none"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                            />
                        </svg>
                    </button>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        {!loggedInUsername && (
                            <>
                                <a href="/" className="text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-lg text-base">
                                    Home
                                </a>
                                <button
                                    className="text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-lg text-base"
                                    onClick={() => navigate("/aboutus")}>
                                    About Us
                                </button>
                                {location.pathname !== "/aboutus" && (
                                    <>
                                        <button
                                            className="text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-lg text-base"
                                            onClick={onFeaturesClick}>
                                            Features
                                        </button>
                                        <button
                                            className="text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-lg text-base"
                                            onClick={onContactClick}>
                                            Contact
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                        {/* Auth Buttons */}
                        <div className="flex items-center space-x-4">
                            {loggedInUsername ? (
                                <>
                                    <span className="text-indigo-700 font-medium">Hello, {loggedInUsername}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                                        onClick={() => navigate("/login")}>
                                        Login
                                    </button>
                                    <button
                                        className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                                        onClick={() => navigate("/register")}>
                                        Register
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4">
                        {!loggedInUsername && (
                            <div className="flex flex-col space-y-2">
                                <a href="/" className="text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-lg text-base">
                                    Home
                                </a>
                                <button
                                    className="text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-lg text-base text-left"
                                    onClick={() => {
                                        navigate("/aboutus");
                                        setIsMobileMenuOpen(false);
                                    }}>
                                    About Us
                                </button>
                                {location.pathname !== "/aboutus" && (
                                    <>
                                        <button
                                            className="text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-lg text-base text-left"
                                            onClick={() => {
                                                onFeaturesClick();
                                                setIsMobileMenuOpen(false);
                                            }}>
                                            Features
                                        </button>
                                        <button
                                            className="text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-lg text-base text-left"
                                            onClick={() => {
                                                onContactClick();
                                                setIsMobileMenuOpen(false);
                                            }}>
                                            Contact
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                        <div className="flex flex-col space-y-2 mt-4">
                            {loggedInUsername ? (
                                <>
                                    <span className="text-indigo-700 font-medium py-2 px-4">Hello, {loggedInUsername}</span>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                                        onClick={() => {
                                            navigate("/login");
                                            setIsMobileMenuOpen(false);
                                        }}>
                                        Login
                                    </button>
                                    <button
                                        className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                                        onClick={() => {
                                            navigate("/register");
                                            setIsMobileMenuOpen(false);
                                        }}>
                                        Register
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;