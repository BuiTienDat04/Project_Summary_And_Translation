
const { Server } = require("socket.io");
const getUserId = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.id : null;
};

// Khởi tạo socket với cấu hình rõ ràng
const io = new Server({
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://pdfsmart.online",
      "https://admin.pdfsmart.online",
      "https://api.pdfsmart.online"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  }
});

io.on("connection", (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  socket.on("manualDisconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
    socket.disconnect();
  });

  socket.on("disconnect", () => {
    console.log(`🔹 Socket ${socket.id} disconnected`);
  });
});

module.exports = { io };