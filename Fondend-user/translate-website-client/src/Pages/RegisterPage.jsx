import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
    FaUserPlus, FaUser, FaEnvelope, FaLock,
    FaPhone, FaCalendarAlt, FaEye, FaEyeSlash,
    FaExclamationTriangle, FaCheckCircle,
    FaFilePdf, FaLanguage, FaRobot, FaMagic, FaRocket
} from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../api/api";
import { motion, AnimatePresence } from "framer-motion";

const RegisterPage = ({ onClose, onRegistrationSuccess }) => {
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
        const footer = document.querySelector("footer");
        const chatbox = document.querySelector(".chatbox");
        if (footer) footer.style.display = "none";
        if (chatbox) chatbox.style.display = "none";

        return () => {
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
                name, email, password, phoneNumber, dateOfBirth,
            });

            setRegistrationSuccess(true);
            setErrorMessage("");
            setTimeout(() => {
                setRegistrationSuccess(false);
                navigate("/login");
                if (onRegistrationSuccess) onRegistrationSuccess();
            }, 2000);
            resetForm();
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    const slideVariants = {
        hiddenLeft: { x: "-100%", opacity: 0 },
        hiddenRight: { x: "100%", opacity: 0 },
        visible: { x: 0, opacity: 1 },
    };

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-gradient-to-br from-blue-600 to-blue-800 overflow-y-auto">
            {/* Left Side - Registration Form */}
            <motion.div
                className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative"
                variants={slideVariants}
                initial="hiddenLeft"
                animate="visible"
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="w-full max-w-md space-y-6 rounded-xl shadow-2xl p-6 sm:p-8 bg-white/10 backdrop-blur-md border border-white/20">
                    <div className="text-center mb-6">
                        <motion.div
                            className="inline-block mb-4 p-3 bg-blue-400/20 rounded-full"
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <FaUserPlus className="h-8 w-8 text-blue-400" />
                        </motion.div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                            <span className="text-blue-400">Create</span> Account
                        </h2>
                        <p className="text-white/70 text-sm sm:text-base">
                            Join PDFSmart today!
                        </p>
                    </div>

                    <AnimatePresence>
                        {errorMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                className="bg-red-500/10 border-l-4 border-red-500 p-3 rounded-md flex items-center text-sm text-red-400"
                            >
                                <FaExclamationTriangle className="h-4 w-4 mr-2" />
                                <p>{errorMessage}</p>
                            </motion.div>
                        )}
                        {registrationSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                className="bg-green-500/10 border-l-4 border-green-500 p-3 rounded-md flex items-center text-sm text-green-400"
                            >
                                <FaCheckCircle className="h-4 w-4 mr-2 animate-bounce" />
                                <p>Account created successfully!</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                                <FaUser className="inline-block mr-2 text-gray-300" />Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full px-4 py-2 border rounded-md focus:ring-blue-400 focus:border-blue-400 text-base bg-white/90 backdrop-blur-sm"
                                placeholder="Your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                                <FaEnvelope className="inline-block mr-2 text-gray-300" />Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 border rounded-md focus:ring-blue-400 focus:border-blue-400 text-base bg-white/90 backdrop-blur-sm"
                                placeholder="Your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                                <FaLock className="inline-block mr-2 text-gray-300" />Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="w-full px-4 py-2 border rounded-md focus:ring-blue-400 focus:border-blue-400 text-base bg-white/90 backdrop-blur-sm"
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 translate-y-1/2 text-gray-400 hover:text-blue-400"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-white mb-1">
                                <FaPhone className="inline-block mr-2 text-gray-300" />Phone (Optional)
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                className="w-full px-4 py-2 border rounded-md focus:ring-blue-400 focus:border-blue-400 text-base bg-white/90 backdrop-blur-sm"
                                placeholder="Your phone number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-white mb-1">
                                <FaCalendarAlt className="inline-block mr-2 text-gray-300" />Date of Birth (Optional)
                            </label>
                            <input
                                type="date"
                                id="dateOfBirth"
                                className="w-full px-4 py-2 border rounded-md focus:ring-blue-400 focus:border-blue-400 text-base bg-white/90 backdrop-blur-sm"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                            />
                        </div>
                    </div>

                    <motion.button
                        className="w-full py-2.5 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all flex items-center justify-center text-base"
                        onClick={handleRegister}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <FaUserPlus className="mr-2" /> Sign Up
                    </motion.button>

                    <div className="text-center text-sm text-white/70">
                        Do you have an account?{' '}
                        <button
                            className="text-blue-300 hover:text-blue-200 font-medium focus:outline-none focus:underline transition-colors"
                            onClick={() => navigate("/login")}
                        >
                            Login here
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Right Side - Features */}
            <motion.div
                className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative"
                variants={slideVariants}
                initial="hiddenRight"
                animate="visible"
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
                <div className="text-center space-y-6 max-w-md">
                    <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                        Transform Your Text Experience
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { icon: FaFilePdf, title: "Smart Summarization", desc: "AI-powered document condensation", color: "text-blue-400" },
                            { icon: FaLanguage, title: "Multilingual Magic", desc: "20+ language translation", color: "text-emerald-400" },
                            { icon: FaRobot, title: "AI Analysis", desc: "Context-aware processing", color: "text-purple-400" },
                            { icon: FaMagic, title: "Smart Formatting", desc: "Auto-document optimization", color: "text-amber-400" }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <feature.icon className={`h-6 w-6 ${feature.color} mb-2 mx-auto`} />
                                <h3 className="text-lg font-semibold text-cyan-50">{feature.title}</h3>
                                <p className="text-sm text-cyan-100/70">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                    <motion.button
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full text-white font-semibold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/login")}
                    >
                        <FaRocket className="h-5 w-5" /> Start Your Journey
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;