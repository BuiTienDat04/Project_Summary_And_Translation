import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaEdit, FaTrash } from "react-icons/fa"; // Import icons

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [showPasswords, setShowPasswords] = useState({});
  const [newUser, setNewUser] = useState({ name: "", email: "", phoneNumber: "", dateOfBirth: "", password: "", role: "user" });
  const [editingUser, setEditingUser] = useState(null); // State để lưu user đang chỉnh sửa
  const [userToDelete, setUserToDelete] = useState(null);


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
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

  // Toggle hiển thị mật khẩu
  const togglePassword = (userId) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };

  // Xử lý thêm tài khoản mới
  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error("Failed to add user");
      fetchUsers();
      setNewUser({ name: "", email: "", phoneNumber: "", dateOfBirth: "", password: "", role: "user" });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Mở modal chỉnh sửa user
  const openEditModal = (user) => {
    setEditingUser(user);
  };

  // Xử lý chỉnh sửa user
  const handleEditUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/users/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingUser),
      });

      if (!response.ok) throw new Error("Failed to update user");
      fetchUsers();
      setEditingUser(null); // Đóng modal sau khi cập nhật
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Xử lý xóa tài khoản
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/users/${userToDelete._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete user");

      // Cập nhật danh sách users ngay lập tức
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userToDelete._id));

      setUserToDelete(null); // Đóng modal sau khi xóa
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const confirmDeleteUser = (user) => {
    setUserToDelete(user); // Lưu user cần xóa vào state
  };


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">User Management</h1>

      {error && <p className="text-red-500">{error}</p>}

      {/* ✅ Form thêm tài khoản */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Add New User</h2>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Name" className="p-2 border rounded" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
          <input type="email" placeholder="Email" className="p-2 border rounded" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
          <input type="text" placeholder="Phone Number" className="p-2 border rounded" value={newUser.phoneNumber} onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })} />
          <input type="date" className="p-2 border rounded" value={newUser.dateOfBirth} onChange={(e) => setNewUser({ ...newUser, dateOfBirth: e.target.value })} />
          <input type="password" placeholder="Password" className="p-2 border rounded" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
          <button onClick={handleAddUser} className="p-2 bg-blue-600 text-white rounded">Add User</button>
        </div>
      </div>

      {/* ✅ Danh sách tài khoản */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3 text-left">User Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone Number</th>
              <th className="p-3 text-left">Date of Birth</th> {/* 🔥 Thêm cột ngày sinh */}
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phoneNumber}</td>
                <td className="p-3">
                  {user.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN") // Hiển thị DD/MM/YYYY
                    : "N/A"}
                </td>
                <td className="p-3 flex space-x-2">
                  <button onClick={() => openEditModal(user)} className="text-blue-600"><FaEdit /></button>
                  <button onClick={() => confirmDeleteUser(user)} className="text-red-600">
                    <FaTrash />
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* ✅ Modal chỉnh sửa user */}
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <div className="space-y-3">
              <label className="block font-medium">Name</label>
              <input
                type="text"
                className="p-2 border rounded w-full"
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
              />

              <label className="block font-medium">Email</label>
              <input
                type="email"
                className="p-2 border rounded w-full"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              />

              <label className="block font-medium">Phone Number</label>
              <input
                type="text"
                className="p-2 border rounded w-full"
                value={editingUser.phoneNumber}
                onChange={(e) => setEditingUser({ ...editingUser, phoneNumber: e.target.value })}
              />

              <label className="block font-medium">Date of Birth</label>
              <input
                type="date"
                className="p-2 border rounded w-full"
                value={editingUser.dateOfBirth}
                onChange={(e) => setEditingUser({ ...editingUser, dateOfBirth: e.target.value })}
              />

              <label className="block font-medium">New Password</label>
              <input
                type="password"
                className="p-2 border rounded w-full"
                value={editingUser.password}
                onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={handleEditUser} className="p-2 bg-blue-600 text-white rounded">Save</button>
              <button onClick={() => setEditingUser(null)} className="p-2 bg-gray-400 text-white rounded">Close</button>
            </div>
          </div>
        </div>
      )}


      {/* ✅ Modal xác nhận xóa user */}
      {userToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete <b>{userToDelete.name}</b>?</p>
            <div className="flex justify-end space-x-3 mt-4">
              <button onClick={handleDeleteUser} className="p-2 bg-red-600 text-white rounded">
                Confirm
              </button>
              <button onClick={() => setUserToDelete(null)} className="p-2 bg-gray-400 text-white rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserManagement;
