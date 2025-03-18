import React, { useState } from "react";
import { 
    FaUserPlus, FaUser, FaEnvelope, FaLock, 
    FaPhone, FaCalendarAlt, FaEye, FaEyeSlash 
} from "react-icons/fa";
import axios from "axios";

function RegisterPage({ onClose, onRegistrationSuccess }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const resetForm = () => {
        setName("");
        setEmail("");
        setPassword("");
        setPhoneNumber("");
        setDateOfBirth("");
    };

    const handleRegister = async () => {
        if (!name || !email || !password) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5001/api/auth/register", {
                name,
                email,
                password,
                phoneNumber,
                dateOfBirth,
            });

            console.log("Registration successful:", response.data);
            setRegistrationSuccess(true);
            setErrorMessage("");

            setTimeout(() => {
                setRegistrationSuccess(false);
                if (onRegistrationSuccess) {
                    onRegistrationSuccess();
                }
            }, 2000);

            resetForm();
        } catch (error) {
            console.error("Registration failed:", error);
            setErrorMessage(error.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white rounded-xl shadow-lg p-12 max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <FaUserPlus className="mx-auto h-16 w-16 text-blue-500 mb-4" />
                    <h1 className="text-4xl font-bold text-gray-800">Register</h1>
                    <p className="text-lg text-gray-600">Create a new account to use PDFSmart</p>
                </div>

                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {errorMessage}</span>
                    </div>
                )}

                {registrationSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
                        <strong className="font-bold">Success!</strong>
                        <span className="block sm:inline"> Account registration successful.</span>
                    </div>
                )}

                <div className="flex flex-wrap -mx-2">
                    <div className="w-full md:w-1/2 px-2 mb-4">
                        <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                            <FaUser className="mr-2 text-gray-500" />Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-1/2 px-2 mb-4">
                        <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                            <FaEnvelope className="mr-2 text-gray-500" />Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Ô nhập mật khẩu có nút hiển thị/mất mật khẩu */}
                    <div className="w-full md:w-1/2 px-2 mb-4 relative">
                        <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                            <FaLock className="mr-2 text-gray-500" />Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 px-2 mb-4">
                        <label htmlFor="phoneNumber" className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                            <FaPhone className="mr-2 text-gray-500" />Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg"
                            placeholder="Enter phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-1/2 px-2 mb-4">
                        <label htmlFor="dateOfBirth" className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                            <FaCalendarAlt className="mr-2 text-gray-500" />Date of Birth
                        </label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center text-lg"
                        onClick={handleRegister}
                    >
                        <FaUserPlus className="mr-2" /> Register
                    </button>
                </div>

                <div className="mt-6 text-lg text-gray-600 text-center">
                    Already have an account?{" "}
                    <button onClick={onClose} className="text-blue-500 hover:underline">
                        Close Register
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
