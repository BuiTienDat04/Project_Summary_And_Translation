const jwt = require("jsonwebtoken");

// Middleware xác thực user
exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Bạn cần đăng nhập để sử dụng tính năng này." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Token không hợp lệ. Vui lòng đăng nhập lại." });
  }
};

// Middleware kiểm tra Admin (Sửa lại)
exports.verifyAdmin = (req, res, next) => {
  exports.verifyToken(req, res, () => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Access Denied: Admins only" });
    }
  });
};
