require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Cho phép frontend kết nối
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

app.use(cors()); // CORS để frontend gọi API
app.use(express.json());

const upload = multer({ dest: "uploads/" }); // Lưu file tạm thời

// API tóm tắt văn bản
app.post("/summarize", async (req, res) => {
  const { text, language } = req.body;
  if (!text) return res.status(400).json({ error: "Missing text parameter" });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `Tóm tắt văn bản sau bằng tiếng Việt: ${text}` 
          }] 
        }],
      }),
    });

    const data = await response.json();
    const summary = data.candidates[0]?.content?.parts[0]?.text || "Không thể tóm tắt.";
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tóm tắt văn bản" });
  }
}); 


// API dịch văn bản
app.post("/translate", async (req, res) => {
  const { text, targetLang } = req.body;
  if (!text || !targetLang)
    return res.status(400).json({ error: "Missing text or targetLang parameter" });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Dịch văn bản sau sang ${targetLang}: ${text}` }] }],
      }),
    });

    const data = await response.json();
    const translation = data.candidates[0]?.content?.parts[0]?.text || "Không thể dịch.";
    res.json({ translation });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi dịch văn bản" });
  }
});

// API upload file và tóm tắt
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const filePath = req.file.path;
  const fileContent = fs.readFileSync(filePath, "utf8");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Summarize this: ${fileContent}` }] }],
      }),
    });

    const data = await response.json();
    fs.unlinkSync(filePath); // Xóa file sau khi xử lý

    const summary = data.candidates[0]?.content?.parts[0]?.text || "Summary not available.";
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: "Error summarizing file" });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
app.post("/suggest-language-by-keyword", async (req, res) => {
  const { keyword } = req.body;

  if (!keyword) {
    return res.status(400).json({ error: "Missing keyword parameter" });
  }

  try {
    // Gọi Gemini API để gợi ý ngôn ngữ dựa trên từ khóa
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Gợi ý ngôn ngữ trên thế giới dựa trên từ khóa "${keyword}". Chỉ trả về tên ngôn ngữ.`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    const suggestedLanguage = data.candidates[0]?.content?.parts[0]?.text || "Không tìm thấy ngôn ngữ phù hợp.";

    // Trả về kết quả
    res.json({ suggestedLanguage });
  } catch (error) {
    console.error("Lỗi khi gọi Gemini API:", error);
    res.status(500).json({ error: "Lỗi khi gợi ý ngôn ngữ" });
  }
});

