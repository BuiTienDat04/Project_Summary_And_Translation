require("dotenv").config(); // Load biến môi trường sớm nhất có thể
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const summaryRoutes = require("./routes/summary");
const uploadRoutes = require("./routes/upload");

const app = express();

// =================== 🔹 MIDDLEWARE 🔹 ===================
app.use(express.json()); // Xử lý dữ liệu JSON từ request
app.use(cors()); // Cho phép request từ frontend
app.use(helmet()); // Bảo vệ HTTP headers
app.use(morgan("dev")); // Ghi log request vào console
app.use("/api/summary", summaryRoutes);
app.use("/api/upload", uploadRoutes);

// Giới hạn request để tránh tấn công DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Tối đa 100 request mỗi IP
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// =================== 🔹 ROUTES 🔹 ===================
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Route kiểm tra API hoạt động
app.get("/", (req, res) => {
  res.status(200).json({ message: "🚀 API is running!" });
});

// Xử lý route không tồn tại
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// =================== 🔹 KẾT NỐI DATABASE 🔹 ===================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Dừng server nếu kết nối thất bại
  }
};

// =================== 🔹 CHẠY SERVER 🔹 ===================
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});

// =================== 🔹 XỬ LÝ LỖI TOÀN CỤC 🔹 ===================
app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});
