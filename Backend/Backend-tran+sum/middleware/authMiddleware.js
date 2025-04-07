const jwt = require("jsonwebtoken");

// ✅ Middleware to verify user token
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("Auth Header:", authHeader); // Debug: Kiểm tra token nhận được

  // Kiểm tra xem header Authorization có tồn tại và có đúng định dạng "Bearer <token>" hay không
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  const token = authHeader.split(" ")[1]; // Lấy token sau chữ "Bearer"

  try {
    // Xác thực token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra xem payload có chứa _id hay không
    if (!verified._id) {
      return res.status(400).json({ message: "Invalid token: User ID not found in token payload." });
    }

    // Debug: In ra payload để kiểm tra
    console.log("Verified payload:", verified);

    // Lưu thông tin user vào request
    req.user = verified;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token. Please log in again.", error: error.message });
  }
};

// ✅ Middleware to verify admin
const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin };