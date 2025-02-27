import React, { useState, useEffect } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"); // Lấy token từ localStorage
      if (!token) {
        setError("Bạn chưa đăng nhập!");
        return;
      }

      const response = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Không thể lấy danh sách người dùng.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">User Management</h1>

      {error && <p className="text-red-500">{error}</p>}

      {/* User Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left text-white">User Name</th>
              <th className="p-3 text-left text-white">Email</th>
              <th className="p-3 text-left text-white">Phone Number</th>
              <th className="p-3 text-left text-white">Date of Birth</th>
              <th className="p-3 text-left text-white">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t hover:bg-gray-50 transition duration-200"
                >
                  <td className="p-3 text-gray-700">{user.name}</td> {/* Đổi từ userName thành name */}
                  <td className="p-3 text-gray-700">{user.email}</td>
                  <td className="p-3 text-gray-700">{user.phoneNumber}</td>
                  <td className="p-3 text-gray-700">{user.dateOfBirth}</td>
                  <td className="p-3 text-gray-700">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        user.role === "admin"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
