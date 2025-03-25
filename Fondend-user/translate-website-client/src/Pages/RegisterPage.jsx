import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
    FaUserPlus, FaUser, FaEnvelope, FaLock,
    FaPhone, FaCalendarAlt, FaEye, FaEyeSlash,
    FaExclamationTriangle, FaCheckCircle,
    FaShareAlt, FaExchangeAlt, FaFileAlt,
    FaPencilAlt, FaGlobe, FaLanguage, FaLightbulb,
    FaFilePdf, FaRobot, FaRocket, FaMagic
} from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../api/api";

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
    const navigate = useNavigate();
    const resetForm = () => {
        setName("");
        setEmail("");
        setPassword("");
        setPhoneNumber("");
        setDateOfBirth("");
    };

    useEffect(() => {
        // Ẩn footer và chatbot khi mở form login
        const footer = document.querySelector("footer");
        const chatbox = document.querySelector(".chatbox");
        if (footer) footer.style.display = "none";
        if (chatbox) chatbox.style.display = "none";

        return () => {
            // Hiển thị lại footer và chatbot khi đóng form login
            if (footer) footer.style.display = "";
            if (chatbox) chatbox.style.display = "";
        };
    }, []);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
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
                // Redirect to login page after successful registration
                navigate("/login");
                if (onRegistrationSuccess) {
                    onRegistrationSuccess();
                }
            }, 2000); // Keep the success message for 2 seconds before redirecting

            resetForm();
        } catch (error) {
            console.error("Registration failed:", error);
            setErrorMessage(error.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="w-full h-screen bg-gradient-to-br from-blue-600 to-blue-800 overflow-hidden relative">
            {/* Animated Background Bubbles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-blue-400 opacity-20"
                        initial={{
                            scale: Math.random() * 0.3 + 0.2,
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                        }}
                        animate={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            scale: Math.random() * 0.3 + 0.2,
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            repeatType: 'loop',
                            ease: 'linear',
                            delay: Math.random() * 2,
                        }}
                        style={{
                            width: Math.random() * 100 + 50,
                            height: Math.random() * 100 + 50,
                        }}
                    />
                ))}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i + 5}
                        className="absolute rounded-full bg-blue-300 opacity-15"
                        initial={{
                            scale: Math.random() * 0.2 + 0.1,
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                        }}
                        animate={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            scale: Math.random() * 0.2 + 0.1,
                        }}
                        transition={{
                            duration: Math.random() * 7 + 7,
                            repeat: Infinity,
                            repeatType: 'loop',
                            ease: 'linear',
                            delay: Math.random() * 3,
                        }}
                        style={{
                            width: Math.random() * 80 + 30,
                            height: Math.random() * 80 + 30,
                        }}
                    />
                ))}
            </div>

            <div className="w-full h-full flex lg:flex-row flex-col">
                {/* Left Side - Registration Form */}
                <div className="relative flex-1 flex items-center justify-center p-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                        className="w-full max-w-xl space-y-6 rounded-xl shadow-2xl p-8 md:p-12 bg-white/10 backdrop-blur-md border border-white/20 relative z-10"
                    >
                        {/* Form Header */}
                        <div className="text-center mb-8">
                            <motion.div
                                className="inline-block mb-5 p-3 bg-blue-400/20 rounded-full"
                                animate={{ rotate: [0, -10, 10, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <FaUserPlus className="h-10 w-10 text-blue-400" />
                            </motion.div>
                            <h2 className="text-3xl font-bold text-white mb-3">
                                <span className="text-blue-400">Create</span> Account
                            </h2>
                            <p className="text-white/70 text-lg">
                                Join our community and unlock the full potential of PDFSmart.
                            </p>
                        </div>

                        {errorMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                className="bg-red-500/10 border-l-4 border-red-500 p-3 rounded-md mb-4 flex items-center text-sm text-red-400"
                            >
                                <FaExclamationTriangle className="h-5 w-5 mr-2" />
                                <p>{errorMessage}</p>
                            </motion.div>
                        )}

                        {registrationSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                className="bg-green-500/10 border-l-4 border-green-500 p-3 rounded-md mb-4 flex items-center text-sm text-green-400"
                            >
                                <FaCheckCircle className="h-5 w-5 mr-2 animate-bounce" />
                                <p>Account created successfully!</p>
                            </motion.div>
                        )}

                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <div className="relative">
                                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                                    <FaUser className="inline-block mr-2 text-gray-300" />Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full px-4 py-3 border rounded-md focus:ring-blue-400 focus:border-blue-400 text-gray-800 bg-white/90 backdrop-blur-sm shadow-sm"
                                    placeholder="Your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                    <FaEnvelope className="inline-block mr-2 text-gray-300" />Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-3 border rounded-md focus:ring-blue-400 focus:border-blue-400 text-gray-800 bg-white/90 backdrop-blur-sm shadow-sm"
                                    placeholder="Your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                                    Password
                                </label>
                                <div className="relative"> {/* Container for input and icon */}
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        className="w-full px-4 py-3 border rounded-md focus:ring-blue-400 focus:border-blue-400 text-gray-800 bg-white/90 backdrop-blur-sm shadow-sm"
                                        placeholder="Create a strong password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-blue-400 focus:outline-none text-sm"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <div className="relative">
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-white mb-2">
                                    <FaPhone className="inline-block mr-2 text-gray-300" />Phone (Optional)
                                </label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    className="w-full px-4 py-3 border rounded-md focus:ring-blue-400 focus:border-blue-400 text-gray-800 bg-white/90 backdrop-blur-sm shadow-sm"
                                    placeholder="Your phone number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                            <div className="col-span-2 relative">
                                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-white mb-2">
                                    <FaCalendarAlt className="inline-block mr-2 text-gray-300" />Date of Birth (Optional)
                                </label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    className="w-full px-4 py-3 border rounded-md focus:ring-blue-400 focus:border-blue-400 text-gray-800 bg-white/90 backdrop-blur-sm shadow-sm"
                                    value={dateOfBirth}
                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                />
                            </div>
                        </motion.div>

                        <motion.button
                            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all flex items-center justify-center text-sm mt-4"
                            onClick={handleRegister}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <FaUserPlus className="mr-2" /> Sign Up
                        </motion.button>

                        <motion.div
                            className="mt-4 text-center text-sm text-white/70"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            Do you have an account?{' '}
                            <motion.button
                                className="text-blue-300 hover:text-blue-200 font-medium focus:outline-none focus:underline transition-colors"
                                onClick={() => navigate("/login")}
                                whileHover={{ scale: 1.08, textShadow: "0 0 5px rgba(66, 153, 225, 0.8)" }}
                                transition={{ duration: 0.3 }}
                            >
                                Login here
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Right Side - Immersive Content */}
                <div className="relative flex-1 flex items-center justify-center p-8 lg:p-16 overflow-hidden group">
                    {/* Floating Background Elements */}
                    <motion.div
                        className="absolute inset-0 opacity-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.2 }}
                        transition={{ duration: 1.5 }}
                    >
                        <motion.div
                            className="absolute top-1/4 left-1/4 w-40 h-40 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl opacity-50"
                            animate={{
                                x: [-50, 50, -50],
                                y: [0, 40, 0],
                                scale: [1, 1.2, 1]
                            }}
                            transition={{
                                duration: 15,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <motion.div
                            className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full blur-2xl opacity-40"
                            animate={{
                                x: [30, -30, 30],
                                y: [-20, 20, -20],
                                rotate: [0, 180, 360]
                            }}
                            transition={{
                                duration: 12,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    </motion.div>

                    {/* Main Content Container */}
                    <motion.div
                        className="relative z-10 text-center space-y-9 max-w-2xl"
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
                    >
                        {/* Animated Header */}
                        <div className="relative inline-block">
                            <motion.h2
                                className="text-5xl font-bold bg-gradient-to-r from-cyan-300 to-emerald-400 bg-clip-text text-transparent cursor-grab active:cursor-grabbing"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{
                                    scale: 1.02,
                                    textShadow: "0 0 15px rgba(34, 211, 238, 0.4)"
                                }}
                                transition={{
                                    duration: 0.3,
                                    ease: 'easeInOut',
                                    scale: { type: 'spring', stiffness: 300 }
                                }}
                            >
                                Transform Your Text Experience
                                <motion.div
                                    className="absolute bottom-0 h-1 bg-gradient-to-r from-cyan-400 to-emerald-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                />
                            </motion.h2>
                        </div>

                        {/* Feature Showcase */}
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ staggerChildren: 0.15 }}
                        >
                            {[
                                {
                                    icon: FaFilePdf,
                                    title: "Smart Summarization",
                                    desc: "AI-powered document condensation",
                                    color: "from-blue-400 to-cyan-400",
                                    animate: { rotate: [0, 15, -15, 0] }
                                },
                                {
                                    icon: FaLanguage,
                                    title: "Multilingual Magic",
                                    desc: "50+ language translation",
                                    color: "from-emerald-400 to-teal-400",
                                    animate: { y: [0, -10, 0] }
                                },
                                {
                                    icon: FaRobot,
                                    title: "AI Analysis",
                                    desc: "Context-aware processing",
                                    color: "from-purple-400 to-indigo-400",
                                    animate: { scale: [1, 1.1, 1] }
                                },
                                {
                                    icon: FaMagic,
                                    title: "Smart Formatting",
                                    desc: "Auto-document optimization",
                                    color: "from-amber-400 to-orange-400",
                                    animate: { rotate: [0, 360] }
                                }
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all cursor-pointer group relative overflow-hidden"
                                    whileHover={{
                                        y: -5,
                                        boxShadow: "0 10px 30px rgba(34, 211, 238, 0.1)"
                                    }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity ${feature.color}" />

                                    <motion.div
                                        className="inline-block mb-4 p-3 rounded-lg bg-gradient-to-br ${feature.color}"
                                        animate={feature.animate}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <feature.icon className="h-8 w-8 text-white" />
                                    </motion.div>

                                    <h3 className="text-xl font-semibold text-cyan-50 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-cyan-100/70">
                                        {feature.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Dynamic CTA */}
                        <motion.div
                            className="mt-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            <motion.div
                                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full shadow-2xl hover:shadow-cyan-500/20 transition-all cursor-pointer group"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/login")}
                            >
                                <span className="font-bold text-white text-lg">
                                    Start Your Journey
                                </span>
                                <motion.div
                                    className="relative w-6 h-6"
                                    animate={{
                                        x: [0, 5, 0],
                                        transition: {
                                            repeat: Infinity,
                                            duration: 1.5
                                        }
                                    }}
                                >
                                    <FaRocket className="h-6 w-6 text-amber-300 absolute inset-0 group-hover:animate-blast" />
                                    <div className="absolute inset-0 blur-sm bg-amber-300 rounded-full opacity-0 group-hover:opacity-40 transition-opacity" />
                                </motion.div>
                            </motion.div>

                            <motion.p
                                className="mt-6 text-sm text-cyan-200/80 flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.02 }}
                            >
                                <FaLock className="h-4 w-4 text-emerald-300 animate-pulse" />
                                Secure & GDPR compliant document processing
                            </motion.p>
                        </motion.div>
                    </motion.div>

                    {/* Floating Particles */}
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                            initial={{
                                opacity: 0,
                                scale: 0,
                                x: Math.random() * 100 - 50 + "%",
                                y: Math.random() * 100 - 50 + "%"
                            }}
                            animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0],
                                rotate: [0, 360]
                            }}
                            transition={{
                                duration: 3 + Math.random() * 5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
