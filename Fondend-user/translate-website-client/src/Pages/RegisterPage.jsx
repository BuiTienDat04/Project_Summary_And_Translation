import React, { useState } from 'react';
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaPhone, FaCalendarAlt } from 'react-icons/fa';

function RegisterPage({ onClose, onRegistrationSuccess }) { // Thêm prop onRegistrationSuccess
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const resetForm = () => {
      setName('');
      setEmail('');
      setPassword('');
      setPhoneNumber('');
      setDateOfBirth('');
  };

  const handleRegister = () => {
      console.log('Registering with:', { name, email, password, phoneNumber, dateOfBirth });

      if (!name || !email || !password) {
          setErrorMessage('Please fill in all required fields.');
          return;
      }

      setRegistrationSuccess(true);
      setErrorMessage('');
      setTimeout(() => {
          setRegistrationSuccess(false);
          if (onRegistrationSuccess) { // Gọi hàm callback khi đăng ký thành công
              onRegistrationSuccess();
          }
      }, 2000);

      resetForm();
  };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
                <div className="text-center mb-6">
                    <FaUserPlus className="mx-auto h-12 w-12 text-blue-500 mb-2" />
                    <h1 className="text-2xl font-bold text-gray-800">Register</h1>
                    <p className="text-gray-600">Create a new account to use PDFSmart</p>
                </div>

                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {errorMessage}</span>
                    </div>
                )}

                {registrationSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Success!</strong>
                        <span className="block sm:inline"> Account registration successful.</span>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <FaUser className="mr-2 text-gray-500" />Name
                        </label>
                        <input type="text" id="name" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <FaEnvelope className="mr-2 text-gray-500" />Email
                        </label>
                        <input type="email" id="email" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <FaLock className="mr-2 text-gray-500" />Password
                        </label>
                        <input type="password" id="password" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <FaPhone className="mr-2 text-gray-500" />Phone Number
                        </label>
                        <input type="tel" id="phoneNumber" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <FaCalendarAlt className="mr-2 text-gray-500" />Date of Birth
                        </label>
                        <input type="date" id="dateOfBirth" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                    </div>
                </div>

                <div className="mt-6">
                    <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center" onClick={handleRegister}>
                        <FaUserPlus className="mr-2" /> Register
                    </button>
                </div>

                <div className="mt-4 text-sm text-gray-600 text-center">
                    Already have an account ? <button onClick={onClose} className="text-blue-500 hover:underline"> Close Register</button>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;