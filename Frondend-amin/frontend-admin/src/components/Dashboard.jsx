import React, { useState } from "react";

const UserManagement = () => {
  // State for managing users
  const [users, setUsers] = useState([
    {
      id: 1,
      userName: "Admin1",
      email: "admin1@example.com",
      password: "admin123",
      phoneNumber: "123-456-7890",
      dateOfBirth: "1990-01-01",
      role: "Admin", // Role field
    },
    {
      id: 2,
      userName: "User1",
      email: "user1@example.com",
      password: "user123",
      phoneNumber: "987-654-3210",
      dateOfBirth: "1985-05-15",
      role: "User", // Role field
    },
  ]);

  // State for the new user form
  const [newUser, setNewUser] = useState({
    userName: "",
    email: "",
    password: "",
    phoneNumber: "",
    dateOfBirth: "",
    role: "User", // Default role is "User"
  });

  // Handle input change for the new user form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  // Add a new user
  const addUser = () => {
    if (
      !newUser.userName ||
      !newUser.email ||
      !newUser.password ||
      !newUser.phoneNumber ||
      !newUser.dateOfBirth
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const user = {
      id: users.length + 1, // Generate a simple ID (replace with a proper ID in production)
      ...newUser,
    };

    setUsers([...users, user]); // Add the new user to the list
    setNewUser({
      userName: "",
      email: "",
      password: "",
      phoneNumber: "",
      dateOfBirth: "",
      role: "User", // Reset role to "User"
    }); // Reset the form
  };

  // Delete a user (only Admins can delete users)
  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id)); // Remove the user with the given ID
  };

  // Grant Admin role to a user
  const grantAdminRole = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, role: "Admin" } : user
      )
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">User Management</h1>

      {/* Add User Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New User</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            name="userName"
            placeholder="User Name"
            value={newUser.userName}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={newUser.phoneNumber}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            name="dateOfBirth"
            placeholder="Date of Birth"
            value={newUser.dateOfBirth}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button
          onClick={addUser}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Add User
        </button>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left text-white">User Name</th>
              <th className="p-3 text-left text-white">Email</th>
              <th className="p-3 text-left text-white">Password</th>
              <th className="p-3 text-left text-white">Phone Number</th>
              <th className="p-3 text-left text-white">Date of Birth</th>
              <th className="p-3 text-left text-white">Role</th>
              <th className="p-3 text-left text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t hover:bg-gray-50 transition duration-200"
              >
                <td className="p-3 text-gray-700">{user.userName}</td>
                <td className="p-3 text-gray-700">{user.email}</td>
                <td className="p-3 text-gray-700">{user.password}</td>
                <td className="p-3 text-gray-700">{user.phoneNumber}</td>
                <td className="p-3 text-gray-700">{user.dateOfBirth}</td>
                <td className="p-3 text-gray-700">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      user.role === "Admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-3">
                  {user.role === "User" && (
                    <button
                      onClick={() => grantAdminRole(user.id)}
                      className="text-green-500 hover:text-green-700 mr-2"
                    >
                      Grant Admin
                    </button>
                  )}
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
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