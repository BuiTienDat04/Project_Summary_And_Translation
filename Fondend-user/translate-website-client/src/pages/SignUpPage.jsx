import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaPhone, FaCalendarAlt } from 'react-icons/fa';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Basic front-end validation
    if (!name || !email || !password || !phoneNumber || !dateOfBirth) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    // In a real application, you would send this data to your backend for actual registration
    const userData = {
      name,
      email,
      password,
      phoneNumber,
      dateOfBirth,
      // role is removed from registration form
    };

    // Placeholder for backend registration logic - replace with actual API call
    console.log('Registration Data:', userData);
    setRegistrationSuccess(true);
    setErrorMessage('');

    // In a real app, after successful registration, you might redirect to login or another page
    // For this example, just set a success state
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex flex-col justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <FaUserPlus className="mx-auto h-12 w-12 text-blue-500 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Đăng ký Tài khoản</h1>
          <p className="text-gray-600">Tạo tài khoản mới để sử dụng PDFSmart</p>
        </div>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Lỗi!</strong>
            <span className="block sm:inline"> {errorMessage}</span>
          </div>
        )}

        {registrationSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Thành công!</strong>
            <span className="block sm:inline"> Đăng ký tài khoản thành công.</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><FaUser className="mr-2 text-gray-500" />Tên người dùng</label>
            <input
              type="text"
              id="name"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Nhập tên của bạn"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><FaEnvelope className="mr-2 text-gray-500" />Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><FaLock className="mr-2 text-gray-500" />Mật khẩu</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><FaPhone className="mr-2 text-gray-500" />Số điện thoại</label>
            <input
              type="tel"
              id="phoneNumber"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Nhập số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><FaCalendarAlt className="mr-2 text-gray-500" />Ngày sinh</label>
            <input
              type="date"
              id="dateOfBirth"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>
          {/* Role field removed */}
        </div>

        <div className="mt-6">
          <button
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center"
            onClick={handleRegister}
          >
            <FaUserPlus className="mr-2" /> Đăng ký
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600 text-center">
          Đã có tài khoản? <button onClick={() => navigate('/login')} className="text-blue-500 hover:underline">Đăng nhập</button>
        </div>
      </div>
    </div>
  );
}