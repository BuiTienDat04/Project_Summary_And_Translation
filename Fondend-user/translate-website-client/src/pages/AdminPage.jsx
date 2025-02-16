import { useState } from "react";
import { FaUserPlus, FaTrash, FaEye, FaSignOutAlt, FaSearch, FaSort } from "react-icons/fa";

export default function AdminPage() {
  const [users, setUsers] = useState([
    { id: 1, userId: "user001", name: "Nguyen Van A", email: "a@example.com", password: "password123", role: "User", phoneNumber: "0901234567", dateOfBirth: "1990-01-01", files: ["file1.pdf", "file2.docx"] },
    { id: 2, userId: "admin001", name: "Tran Van B", email: "b@example.com", password: "password456", role: "Admin", phoneNumber: "0909876543", dateOfBirth: "1985-05-15", files: ["file3.xlsx"] },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "User", phoneNumber: "", dateOfBirth: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  // Xử lý tìm kiếm
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý sắp xếp
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Tạo ID người dùng tự động
  const generateUserId = () => {
    return `user${String(users.length + 1).padStart(3, '0')}`;
  };
    // Tạo ID nội bộ tự động tăng
    const generateInternalId = () => {
        return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    };

  // Thêm user mới
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.phoneNumber || !newUser.dateOfBirth) return;
    const newId = generateInternalId();
    const generatedUserId = generateUserId();
    setUsers([...users, {
      id: newId,
      userId: generatedUserId,
      ...newUser,
      files: [],
      status: "active", // Bạn có thể bỏ trường status nếu không cần
    }]);
    setIsAddUserOpen(false);
    setNewUser({ name: "", email: "", password: "", role: "User", phoneNumber: "", dateOfBirth: "" });
  };

  // Xử lý sắp xếp
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Xử lý chọn nhiều user
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Xóa nhiều user
  const handleBulkDelete = () => {
    setUsers(users.filter(user => !selectedUsers.includes(user.id)));
    setSelectedUsers([]);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <span className="bg-blue-500 text-white p-3 rounded-full mr-3">👑</span>
          Quản lý Người dùng
        </h1>
        <div className="flex gap-3">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center transition-all"
            onClick={() => { /* Xử lý đăng xuất */ }}
          >
            <FaSignOutAlt className="mr-2" /> Đăng xuất
          </button>
        </div>
      </div>

      {/* Thanh công cụ */}
      <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <input
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-all"
              onClick={() => setIsAddUserOpen(true)}
            >
              <FaUserPlus className="mr-2" /> Thêm mới
            </button>

            {selectedUsers.length > 0 && (
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center transition-all"
                onClick={handleBulkDelete}
              >
                <FaTrash className="mr-2" /> Xóa đã chọn
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bảng người dùng */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 w-12 text-center">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(users.map(u => u.id));
                    } else {
                      setSelectedUsers([]);
                    }
                  }}
                />
              </th>
              <th className="p-3 cursor-pointer" onClick={() => requestSort('userId')}>
                <div className="flex items-center justify-between">
                  ID
                  <FaSort className="text-gray-400" />
                </div>
              </th>
              <th className="p-3 cursor-pointer" onClick={() => requestSort('name')}>
                <div className="flex items-center justify-between">
                  Tên
                  <FaSort className="text-gray-400" />
                </div>
              </th>
              <th className="p-3">Email</th>
              <th className="p-3">Số điện thoại</th>
              <th className="p-3 cursor-pointer" onClick={() => requestSort('password')}>
                <div className="flex items-center justify-between">
                  Mật khẩu
                  <FaSort className="text-gray-400" />
                </div>
              </th>
              <th className="p-3 cursor-pointer" onClick={() => requestSort('role')}>
                <div className="flex items-center justify-between">
                  Vai trò
                  <FaSort className="text-gray-400" />
                </div>
              </th>
              <th className="p-3 cursor-pointer" onClick={() => requestSort('dateOfBirth')}>
                <div className="flex items-center justify-between">
                  Ngày sinh
                  <FaSort className="text-gray-400" />
                </div>
              </th>
              <th className="p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map(user => (
              <tr key={user.id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                  />
                </td>
                <td className="p-3 font-medium">{user.userId}</td>
                <td className="p-3 font-medium">{user.name}</td>
                <td className="p-3 text-gray-600">{user.email}</td>
                <td className="p-3 text-gray-600">{user.phoneNumber}</td>
                <td className="p-3 text-gray-500">********</td> {/* Ẩn mật khẩu */}
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-sm ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-3 text-gray-500">{user.dateOfBirth}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-all"
                      onClick={() => { setSelectedUser(user); setIsDialogOpen(true); }}
                    >
                      <FaEye />
                    </button>

                    <button
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal thêm user */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Thêm người dùng mới</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên</label>
                <input
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                <input
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                <input
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  type="tel"
                  value={newUser.phoneNumber}
                  onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ngày sinh</label>
                <input
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  type="date"
                  value={newUser.dateOfBirth}
                  onChange={(e) => setNewUser({ ...newUser, dateOfBirth: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vai trò</label>
                <select
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                onClick={() => setIsAddUserOpen(false)}
              >
                Hủy bỏ
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                onClick={handleAddUser}
              >
                Thêm người dùng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết user */}
      {isDialogOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Chi tiết người dùng</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">ID</p>
                <p className="font-medium">{selectedUser.userId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tên</p>
                <p className="font-medium">{selectedUser.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Số điện thoại</p>
                <p className="font-medium">{selectedUser.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mật khẩu</p>
                <p className="font-medium">********</p> {/* Ẩn mật khẩu */}
              </div>
              <div>
                <p className="text-sm text-gray-600">Vai trò</p>
                <p className="font-medium">{selectedUser.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ngày sinh</p>
                <p className="font-medium">{selectedUser.dateOfBirth}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Các tệp đã tải lên</p>
              <div className="border rounded-lg p-3">
                {selectedUser.files.length > 0 ? (
                  selectedUser.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50">
                      <span>{file}</span>
                      <button className="text-blue-500 hover:text-blue-700">
                        Tải xuống
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-2">Không có tệp nào</p>
                )}
              </div>
            </div>

            <button
              className="w-full mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
              onClick={() => setIsDialogOpen(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}