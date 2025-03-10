import React from "react";

const Navigation = ({ loggedInUsername, onLoginClick, onRegisterClick, onLogout }) => {

    
    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-md py-3 z-50 min-h-[64px]">
            <div className="container mx-auto flex justify-between items-center px-4">
                {/* Logo */}
                <div className="text-2xl font-bold text-indigo-700">PDFSmart</div>

                {/* Nút điều hướng */}
                <div className="flex items-center space-x-4">
                    {loggedInUsername ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-indigo-700 font-medium">Hello, {loggedInUsername}</span>
                            <button
                                onClick={onLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex space-x-4">
                            <button onClick={onLoginClick} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 shadow-md hover:shadow-lg">
                                Login
                            </button>
                            <button onClick={onRegisterClick} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 shadow-md hover:shadow-lg">
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
