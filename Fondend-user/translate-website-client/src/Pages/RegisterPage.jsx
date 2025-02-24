import React, { useState } from "react";
import axios from "axios";
import { FaUserPlus, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";

function RegisterPage({ onClose, onRegistrationSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
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
        if (onRegistrationSuccess) onRegistrationSuccess();
      }, 2000);
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto relative">
        {/* Nút đóng */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900">
          <FaTimes size={20} />
        </button>

        <div className="text-center mb-6">
          <FaUserPlus className="mx-auto h-12 w-12 text-blue-500 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Register</h1>
        </div>

        {errorMessage && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">{errorMessage}</div>}
        {registrationSuccess && <div className="bg-green-100 text-green-700 px-4 py-3 rounded mb-4">Registration successful!</div>}

        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded-lg mb-2" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded-lg mb-2" />

        {/* Input mật khẩu với nút hiển thị/ẩn */}
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <input type="tel" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-2 border rounded-lg mb-2" />
        <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="w-full p-2 border rounded-lg mb-2" />

        <button onClick={handleRegister} className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg">Register</button>
      </div>
    </div>
  );
}

export default RegisterPage;
