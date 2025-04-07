const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    let token = req.header("Authorization");
    if (!token && req.cookies.token) {
        token = `Bearer ${req.cookies.token}`; // Hỗ trợ token từ cookies
    }

    console.log("Auth Header or Cookie:", token); // Debug: Kiểm tra token nhận được

    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    token = token.split(" ")[1]; // Lấy token sau chữ "Bearer"

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Verified user:", verified); // Debug: Kiểm tra nội dung token
        if (!verified._id) {
            return res.status(400).json({ message: "Invalid token: user ID missing." });
        }
        req.user = verified;
        next();
    } catch (error) {
        console.error("Token verification error:", error.message);
        return res.status(400).json({ message: "Invalid token. Please log in again." });
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
