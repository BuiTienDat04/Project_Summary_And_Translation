import React, { useState } from "react";
import { 
    FaUserPlus, FaUser, FaEnvelope, FaLock, 
    FaPhone, FaCalendarAlt, FaEye, FaEyeSlash 
} from "react-icons/fa";
import axios from "axios";
import { motion } from "framer-motion";
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
            const response = await axios.post("https://api.pdfsmart.online/api/auth/register", {
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
        <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
>
    <motion.div
        initial={{ scale: 0.9, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl p-12 max-w-2xl mx-auto"
    >
        <div className="text-center mb-10">
            <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="inline-block"
            >
                <FaUserPlus className="h-16 w-16 text-blue-500 mb-4" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                <span className="bg-gradient-to-r from-blue-600 to-green-500 text-transparent bg-clip-text bg-[length:200%_auto] animate-gradient">
                    Register
                </span>
            </h1>
            <p className="text-lg text-gray-600">Create a new account to use PDFSmart</p>
        </div>

        {errorMessage && (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            >
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {errorMessage}</span>
            </motion.div>
        )}

        {registrationSuccess && (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6"
            >
                <strong className="font-bold">Success!</strong>
                <span className="block sm:inline"> Account registration successful.</span>
            </motion.div>
        )}

        <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
                <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                    <FaUser className="mr-2 text-gray-500" />Name
                </label>
                <motion.input
                    type="text"
                    id="name"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg transition-all duration-200 hover:border-blue-500"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.02 }}
                />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
                <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                    <FaEnvelope className="mr-2 text-gray-500" />Email
                </label>
                <motion.input
                    type="email"
                    id="email"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg transition-all duration-200 hover:border-blue-500"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.02 }}
                />
            </div>

            {/* Ô nhập mật khẩu có nút hiển thị/mất mật khẩu */}
            <div className="w-full md:w-1/2 px-2 mb-4 relative">
                <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                    <FaLock className="mr-2 text-gray-500" />Password
                </label>
                <div className="relative">
                    <motion.input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg transition-all duration-200 hover:border-blue-500"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        whileHover={{ scale: 1.02 }}
                        whileFocus={{ scale: 1.02 }}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-500 transition-colors duration-200"
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
                <motion.input
                    type="tel"
                    id="phoneNumber"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg transition-all duration-200 hover:border-blue-500"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.02 }}
                />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
                <label htmlFor="dateOfBirth" className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                    <FaCalendarAlt className="mr-2 text-gray-500" />Date of Birth
                </label>
                <motion.input
                    type="date"
                    id="dateOfBirth"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg transition-all duration-200 hover:border-blue-500"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.02 }}
                />
            </div>
        </div>

        <div className="mt-8">
            <motion.button
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center text-lg shadow-lg hover:shadow-blue-200"
                onClick={handleRegister}
            >
                <motion.span
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-center"
                >
                    <FaUserPlus className="mr-2" /> Register
                </motion.span>
            </motion.button>
        </div>

        <div className="mt-6 text-lg text-gray-600 text-center">
            Already have an account?{" "}
            <button onClick={onClose} className="text-blue-500 hover:underline">
                Close Register
            </button>
        </div>
    </motion.div>
</motion.div>
    );
}

export default RegisterPage;
