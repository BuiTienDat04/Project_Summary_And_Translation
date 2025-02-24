const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

// API chỉ Admin có quyền truy cập
router.get("/dashboard", verifyAdmin, (req, res) => {
  res.json({ message: "Welcome Admin, this is your dashboard!" });
});

module.exports = router;
