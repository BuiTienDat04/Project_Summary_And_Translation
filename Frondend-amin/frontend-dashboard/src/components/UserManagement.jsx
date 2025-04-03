import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { API_BASE_URL } from "../api/api";
import { Eye, EyeOff } from "lucide-react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import moment from "moment";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState({ name: "", email: "", phoneNumber: "", dateOfBirth: "", password: "", role: "user" });
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const DEFAULT_COUNTRY_CODE = "VN"; // Thay đổi theo quốc gia mặc định của bạn

  useEffect(() => {
    fetchUsers();
  }, []);
  // Các hàm fetchUsers, handleAddUser, handleEditUser, handleDeleteUser giữ nguyên logic API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in!");
        // Chuyển hướng về trang đăng nhập nếu chưa có token
        window.location.href = "/loginad"; // Hoặc sử dụng navigate nếu dùng react-router-dom v6
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "An unknown error occurred" })); // Xử lý trường hợp response không phải JSON
        if (response.status === 404) {
          setUsers([]); // Không tìm thấy user nào
          setError("No users found."); // Có thể set lỗi nhẹ nhàng hơn
          return;
        }
        if (response.status === 401 || response.status === 403) {
          setError(response.status === 401 ? "Unauthorized: Please log in again." : "Permission denied: Admin access required.");
          localStorage.removeItem("token"); // Xóa token cũ
          window.location.href = "/loginad"; // Chuyển hướng
          return;
        }
        throw new Error(errorData.message || `Failed to fetch users (status: ${response.status})`);
      }
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []); // Đảm bảo users luôn là mảng
    } catch (error) {
      console.error("Fetch users error:", error); // Log lỗi chi tiết hơn
      setError(error.message);
      setUsers([]); // Đặt lại users thành mảng rỗng khi có lỗi
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required.");

      let { name, email, password, phoneNumber, dateOfBirth, role } = newUser;

      // Validate Email
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format. Only Gmail accounts are allowed.");
      }

      // Validate Password
      if (!passwordRegex.test(password)) {
        throw new Error("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
      }

      // Validate Date of Birth
      if (!dateOfBirth || !moment(dateOfBirth, "YYYY-MM-DD", true).isValid()) {
        throw new Error("Invalid date of birth format. Use YYYY-MM-DD.");
      }
      const age = moment().diff(moment(dateOfBirth, "YYYY-MM-DD"), "years");
      if (age < 13) {
        throw new Error("You must be at least 13 years old to register.");
      }

      // Normalize and Validate Phone Number
      let parsedPhone = parsePhoneNumberFromString(phoneNumber, DEFAULT_COUNTRY_CODE);
      if (!parsedPhone || !parsedPhone.isValid()) {
        throw new Error("Invalid phone number format.");
      }
      phoneNumber = parsedPhone.formatInternational(); // Convert to standard format

      // Check if Email or Phone Number Exists
      const usersResponse = await fetch(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!usersResponse.ok) throw new Error("Failed to fetch users.");
      const users = await usersResponse.json();

      if (users.some((user) => user.email === email)) {
        throw new Error("Email already exists.");
      }
      if (users.some((user) => user.phoneNumber === phoneNumber)) {
        throw new Error("Phone number already in use.");
      }

      // Send API Request to Create User
      const response = await fetch(`${API_BASE_URL}/api/users/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email, password, phoneNumber, dateOfBirth, role: role || "user" }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to add user" }));
        throw new Error(errorData.message || `Failed to add user (status: ${response.status})`);
      }

      const addedUser = await response.json();
      if (addedUser && addedUser.user) {
        setUsers((prevUsers) => [...prevUsers, addedUser.user]);
        setNewUser({ name: "", email: "", phoneNumber: "", dateOfBirth: "", password: "", role: "user" });
      } else {
        fetchUsers();
      }

    } catch (error) {
      console.error("Add user error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!editingUser || !editingUser._id) return;

    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required.");

      let { name, email, phoneNumber, dateOfBirth, role } = editingUser;

      // Normalize Phone Number
      let parsedPhone = parsePhoneNumberFromString(phoneNumber, DEFAULT_COUNTRY_CODE);
      if (!parsedPhone || !parsedPhone.isValid()) {
        throw new Error("Invalid phone number format.");
      }
      phoneNumber = parsedPhone.formatInternational();

      // Fetch User List
      const usersResponse = await fetch(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!usersResponse.ok) throw new Error("Failed to fetch users.");

      const users = await usersResponse.json();

      // Check Email and Phone Duplication (excluding the current user)
      if (users.some((user) => user.email === email && user._id !== editingUser._id)) {
        throw new Error("Email is already in use by another account.");
      }
      if (users.some((user) => user.phoneNumber === phoneNumber && user._id !== editingUser._id)) {
        throw new Error("Phone number is already in use by another account.");
      }

      // Prepare Data for Update
      const updatedData = { name, email, phoneNumber, dateOfBirth, role };
      if (!editingUser.password) {
        delete updatedData.password; // Don't send password if not changed
      }

      // Send API Request to Update User
      const response = await fetch(`${API_BASE_URL}/api/users/${editingUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to update user" }));
        throw new Error(errorData.message || `Failed to update user (status: ${response.status})`);
      }

      const updatedUser = await response.json();
      if (updatedUser && updatedUser.user) {
        setUsers((prevUsers) => prevUsers.map((user) => (user._id === updatedUser.user._id ? updatedUser.user : user)));
        setEditingUser(null);
      } else {
        fetchUsers();
        setEditingUser(null);
      }

    } catch (error) {
      console.error("Edit user error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    // Xác nhận trước khi xóa
    const confirmDelete = window.confirm(`Are you sure you want to delete user "${user.name}" (${user.email})? This action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required.");

      const response = await fetch(`${API_BASE_URL}/api/users/${user._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        // Kiểm tra status 204 No Content cũng là thành công
        if (response.status === 204) {
          setUsers((prevUsers) => prevUsers.filter((u) => u._id !== user._id));
        } else {
          const errorData = await response.json().catch(() => ({ message: "Failed to delete user" }));
          throw new Error(errorData.message || `Failed to delete user (status: ${response.status})`);
        }
      } else {
        // Nếu status là 200 OK (có thể trả về user đã xóa)
        setUsers((prevUsers) => prevUsers.filter((u) => u._id !== user._id));
      }
    } catch (error) {
      console.error("Delete user error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  // Hàm format ngày tháng (ví dụ)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      // Chuyển đổi sang định dạng YYYY-MM-DD để input type="date" nhận diện
      const date = new Date(dateString);
      // Lấy ngày, tháng, năm và đảm bảo có số 0 đứng đầu nếu cần
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid Date";
    }
  };


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={fetchUsers}
          disabled={loading} // Vô hiệu hóa nút khi đang tải
          className={`p-2 px-4 rounded text-white transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {error && <p className="text-red-600 bg-red-100 p-3 rounded border border-red-300 mb-4">{error}</p>}

      {/* Form thêm tài khoản */}
      <form onSubmit={handleAddUser} className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Add New Account</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Các input fields giữ nguyên */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name *</label>
            <input
              type="text"
              required
              placeholder="Enter Name"
              className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email *</label>
            <input
              type="email"
              required
              placeholder="Enter Email"
              className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone Number *</label>
            <input
              type="tel" // Sử dụng type="tel" cho số điện thoại
              required
              placeholder="Enter Phone Number"
              className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
              value={newUser.phoneNumber}
              onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Date of Birth *</label>
            <input
              type="date"
              required
              className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
              value={newUser.dateOfBirth}
              onChange={(e) => setNewUser({ ...newUser, dateOfBirth: e.target.value })}
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">Password *</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter Password"
              className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 outline-none pr-10"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-9 right-3 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Role *</label>
            <select
              required
              className="p-2 border rounded w-full bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit" // Đổi thành type="submit"
              disabled={loading} // Vô hiệu hóa khi đang xử lý
              className={`p-2 w-full rounded text-white transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? 'Adding...' : 'Add Account'}
            </button>
          </div>
        </div>
      </form>

      {/* Modal chỉnh sửa người dùng */}
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <form onSubmit={handleEditUser} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit User: {editingUser.name}</h2>
            {/* Hiển thị lỗi cụ thể của modal */}
            {error && editingUser && <p className="text-red-600 bg-red-100 p-2 rounded border border-red-300 mb-3 text-sm">{error}</p>}

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2"> {/* Thêm scroll nếu nội dung dài */}
              <label className="block text-gray-700 font-medium mb-1">Name *</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
              />

              <label className="block text-gray-700 font-medium mb-1">Email *</label>
              <input
                type="email"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              />

              <label className="block text-gray-700 font-medium mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={editingUser.phoneNumber}
                onChange={(e) => setEditingUser({ ...editingUser, phoneNumber: e.target.value })}
              />

              <label className="block text-gray-700 font-medium mb-1">Date of Birth *</label>
              <input
                type="date"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={formatDate(editingUser.dateOfBirth)} // Sử dụng hàm formatDate
                onChange={(e) => setEditingUser({ ...editingUser, dateOfBirth: e.target.value })}
              />

              <label className="block text-gray-700 font-medium mb-1">New Password (optional)</label>
              <input
                type="password"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Leave blank to keep current password"
                onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
              />

              <label className="block text-gray-700 font-medium mb-1">Role *</label>
              <select
                required
                className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={editingUser.role}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 mt-5">
              <button
                type="submit" // Đổi thành type="submit"
                disabled={loading} // Vô hiệu hóa khi đang lưu
                className={`p-2 px-4 rounded text-white transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button" // Đổi thành type="button"
                onClick={() => setEditingUser(null)}
                disabled={loading} // Vô hiệu hóa khi đang lưu
                className="p-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Danh sách người dùng */}
      {loading && users.length === 0 ? ( // Chỉ hiển thị loading toàn màn hình khi chưa có user nào
        <div className="text-center p-10">
          <p className="text-gray-500 text-lg">Loading users...</p>
          {/* Có thể thêm spinner ở đây */}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto"> {/* Thêm overflow-x-auto */}
          <table className="min-w-full table-auto">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3 text-left text-sm font-semibold tracking-wide">User Name</th>
                <th className="p-3 text-left text-sm font-semibold tracking-wide">Email</th>
                <th className="p-3 text-left text-sm font-semibold tracking-wide">Phone Number</th>
                <th className="p-3 text-left text-sm font-semibold tracking-wide">Date of Birth</th>
                <th className="p-3 text-left text-sm font-semibold tracking-wide">Role</th>
                <th className="p-3 text-left text-sm font-semibold tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition group">
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{user.name}</td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{user.email}</td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{user.phoneNumber}</td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{formatDate(user.dateOfBirth)}</td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3 text-sm flex space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => { setEditingUser(user); setError(''); }} // Reset lỗi khi mở modal edit
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Edit User"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        disabled={loading} // Vô hiệu hóa khi đang có hành động khác
                        className={`text-red-600 hover:text-red-800 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Delete User"
                      >
                        <FaTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  {/* Cập nhật colSpan thành 6 sau khi bỏ cột Status */}
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    {error && users.length === 0 ? `Error: ${error}` : "No users found. Add a new user above."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;