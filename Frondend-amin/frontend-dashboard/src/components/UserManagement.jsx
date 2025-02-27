import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁️ Import icon mắt

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [showPasswords, setShowPasswords] = useState({}); // State để toggle mật khẩu

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      if (!token) {
        setError("You are not logged in!");
        return;
      }

      const response = await fetch("http://localhost:5000/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users.");
    }
  };

  // 🎯 Toggle hiển thị mật khẩu
  const togglePassword = (userId) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId], // Đảo trạng thái hiện/ẩn
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">User Management</h1>

      {error && <p className="text-red-500">{error}</p>}

      {/* User Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3 text-left">User Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone Number</th>
              <th className="p-3 text-left">Date of Birth</th>
              <th className="p-3 text-left">Password</th> {/* ✅ Thêm cột Password */}
              <th className="p-3 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phoneNumber}</td>
                  <td className="p-3">{new Date(user.dateOfBirth).toLocaleDateString("vi-VN")}</td>
                  
                  {/* ✅ Cột Password kèm icon mắt */}
                  <td className="p-3 flex items-center space-x-2">
                    <span>
                      {showPasswords[user._id] ? user.password : "******"}
                    </span>
                    <button onClick={() => togglePassword(user._id)} className="focus:outline-none">
                      {showPasswords[user._id] ? <FaEyeSlash className="text-gray-600" /> : <FaEye className="text-gray-600" />}
                    </button>
                  </td>

                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${user.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
