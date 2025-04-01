import { io } from "socket.io-client";

const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.id : null;
};

const socket = io("https://admin.pdfsmart.online", {
    transports: ["websocket", "polling"],
    query: { userId: getUserId() },
    autoConnect: false,
});

// 🟢 Kết nối và thông báo online
export const connectSocket = () => {
    const userId = getUserId();
    if (!userId) return;

    socket.io.opts.query = { userId };
    socket.connect();

    // Gửi sự kiện khi kết nối thành công
    socket.once('connect', () => {
        socket.emit('userOnline', userId);
        console.log('Socket connected and online status sent');
    });
};

// 🔴 Ngắt kết nối và thông báo offline
export const disconnectSocket = () => {
    const userId = getUserId();
    if (!userId) return;

    if (socket.connected) {
        socket.emit('userOffline', userId);
        socket.disconnect();
        console.log('Socket disconnected and offline status sent');
    }
};

// 🛠️ Xử lý sự kiện mất kết nối
const notifyOffline = () => {
    if (socket.connected) {
        socket.emit('userOffline', getUserId());
    }
};

// 🎯 Lắng nghe các sự kiện quan trọng
socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err);
});

window.addEventListener("beforeunload", notifyOffline);
window.addEventListener("offline", notifyOffline);

export { socket };
export default socket;