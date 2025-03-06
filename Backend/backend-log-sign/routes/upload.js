const express = require("express");
const multer = require("multer");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Cấu hình Multer để lưu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// API Upload file - Chỉ cho user đã đăng nhập
router.post("/upload", verifyToken, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Vui lòng chọn một file để upload." });
  }

  res.json({ message: "Upload thành công!", filename: req.file.filename });
});

module.exports = router;
