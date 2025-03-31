import { io } from "socket.io-client";

// 🟢 Lấy userId từ localStorage
const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.id : null;
};

// Khởi tạo Socket.IO
const socket = io("https://admin.pdfsmart.online", {
    transports: ["websocket", "polling"],
    query: { userId: getUserId() },
    autoConnect: false, // Chỉ kết nối khi cần
});

// 🟢 Kết nối WebSocket khi user đăng nhập
export const connectSocket = () => {
    socket.io.opts.query = { userId: getUserId() }; // Cập nhật userId
    socket.connect();
};

// 🔴 Ngắt kết nối WebSocket khi user logout
export const disconnectSocket = () => {
    socket.emit("manualDisconnect"); // Thông báo offline tới server
    socket.disconnect();
};

// 🟡 Lắng nghe sự kiện đóng tab, mất kết nối mạng, và thông báo offline
const notifyOffline = () => {
    if (socket.connected) {
        socket.emit("manualDisconnect");
    }
};

// Lắng nghe sự kiện đóng tab hoặc chuyển trang
window.addEventListener("beforeunload", notifyOffline);

// Lắng nghe sự kiện mất kết nối mạng
window.addEventListener("offline", notifyOffline);

export { socket }; // Xuất socket để có thể sử dụng ở nơi khác
export default socket; // Giữ lại export mặc định để thuận tiện trong việc import
