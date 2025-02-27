require("dotenv").config();
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
const userRoutes = require("./routes/userRoutes"); // Ensure correct import

const app = express();

// =================== 🔹 MIDDLEWARE 🔹 ===================
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// 🚀 Rate limit: Prevent DDoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// =================== 🔹 ROUTES 🔹 ===================
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/users", userRoutes);

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "🚀 API is running!" });
});

// ❌ 404 Not Found Middleware (Place after all routes)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// =================== 🔹 CONNECT TO DATABASE 🔹 ===================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

// =================== 🔹 START SERVER 🔹 ===================
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});

// =================== 🔹 GLOBAL ERROR HANDLING 🔹 ===================
app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});
