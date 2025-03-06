import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState({ name: "", email: "", phoneNumber: "", dateOfBirth: "", password: "", role: "user", status: "Active" });
  const [editingUser, setEditingUser] = useState(null);

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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users.");
    }
  };

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
      const addedUser = await response.json();

      setUsers((prevUsers) => [...prevUsers, addedUser.user]); // Cập nhật danh sách
      setNewUser({ name: "", email: "", phoneNumber: "", dateOfBirth: "", password: "", role: "user", status: "Active" });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/users/${editingUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editingUser),
      });

      if (!response.ok) throw new Error("Failed to update user");
      const updatedUser = await response.json();

      setUsers((prevUsers) => prevUsers.map((user) => (user._id === updatedUser.user._id ? updatedUser.user : user)));
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (user) => {
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.name}" không?`);
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete user");
      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== user._id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">User Management</h1>
      {error && <p className="text-red-500">{error}</p>}

      {/* ✅ Form thêm tài khoản */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Add New Account</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              className="p-2 border rounded w-full"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              className="p-2 border rounded w-full"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Phone Number</label>
            <input
              type="text"
              placeholder="Enter Phone Number"
              className="p-2 border rounded w-full"
              value={newUser.phoneNumber}
              onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Date of Birth</label>
            <input
              type="date"
              className="p-2 border rounded w-full"
              value={newUser.dateOfBirth}
              onChange={(e) => setNewUser({ ...newUser, dateOfBirth: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              className="p-2 border rounded w-full"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Role</label>
            <select
              className="p-2 border rounded w-full"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="col-span-2">
            <button
              onClick={handleAddUser}
              className={`p-2 w-full rounded text-white ${newUser.name && newUser.email && newUser.phoneNumber && newUser.dateOfBirth && newUser.password
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
                }`}
              disabled={
                !newUser.name || !newUser.email || !newUser.phoneNumber || !newUser.dateOfBirth || !newUser.password
              }
            >
              Add Account
            </button>
          </div>
        </div>
      </div>



      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit User</h2>

            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded mb-2"
              value={editingUser.name}
              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
            />

            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded mb-2"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            />

            <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
            <input
              type="text"
              className="w-full p-2 border rounded mb-2"
              value={editingUser.phoneNumber}
              onChange={(e) => setEditingUser({ ...editingUser, phoneNumber: e.target.value })}
            />

            <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              className="w-full p-2 border rounded mb-2"
              value={editingUser.dateOfBirth}
              onChange={(e) => setEditingUser({ ...editingUser, dateOfBirth: e.target.value })}
            />

            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded mb-2"
              placeholder="Enter new password"
              value={editingUser.password}
              onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
            />

            <label className="block text-gray-700 font-medium mb-1">Role</label>
            <select
              className="w-full p-2 border rounded mb-2"
              value={editingUser.role}
              onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleEditUser}
                className={`p-2 rounded text-white ${editingUser.name && editingUser.email && editingUser.phoneNumber && editingUser.dateOfBirth && editingUser.password
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                  }`}
                disabled={
                  !editingUser.name || !editingUser.email || !editingUser.phoneNumber || !editingUser.dateOfBirth || !editingUser.password
                }
              >
                Save
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="p-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}




      {/* Danh sách người dùng */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3 text-left">User Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone Number</th>
              <th className="p-3 text-left">Date of Birth</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phoneNumber}</td>
                <td className="p-3">{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN") : "N/A"}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">{user.status}</td>
                <td className="p-3 flex space-x-2">
                  <button onClick={() => setEditingUser(user)} className="text-blue-600"><FaEdit /></button>
                  <button onClick={() => handleDeleteUser(user)} className="text-red-600"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
