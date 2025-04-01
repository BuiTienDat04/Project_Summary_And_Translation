import { io } from "socket.io-client";

const getUserId = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.id : null;
};

// Khởi tạo socket với cấu hình rõ ràng
const socket = io("https://api.pdfsmart.online", {
  path: "/socket.io", // Thêm path mặc định của Socket.IO
  transports: ["websocket", "polling"], // Ưu tiên websocket, fallback polling
  query: { userId: getUserId() }, // Truyền userId qua query
  autoConnect: false, // Không tự động kết nối
});

export const connectSocket = () => {
  socket.io.opts.query = { userId: getUserId() }; // Cập nhật query trước khi kết nối
  socket.connect();
};

export const disconnectSocket = () => {
  socket.emit("manualDisconnect");
  socket.disconnect();
};

const notifyOffline = () => {
  if (socket.connected) {
    socket.emit("manualDisconnect");
  }
};

window.addEventListener("beforeunload", notifyOffline);
window.addEventListener("offline", notifyOffline);

export { socket };
export default socket;