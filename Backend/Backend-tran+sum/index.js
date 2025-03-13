require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const fs = require("fs").promises;
const path = require("path");
const pdfParse = require("pdf-parse");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const NodeCache = require("node-cache");

// Import routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const summaryRoutes = require("./routes/summary");
const uploadRoutes = require("./routes/upload");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5001;
const API_KEY = process.env.API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// ✅ Kiểm tra API_KEY
if (!API_KEY) {
    console.error("❌ API_KEY không được cung cấp trong file .env");
    process.exit(1);
}

// ✅ Khởi tạo cache (10 phút)
const cache = new NodeCache({ stdTTL: 600 });

// =================== 🔹 MIDDLEWARE 🔹 ===================
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));

// 🚀 Rate limiting để ngăn DDoS
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
});
app.use(limiter);

// ✅ Cấu hình Multer để upload file PDF
const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") cb(null, true);
        else cb(new Error("Chỉ hỗ trợ file PDF!"), false);
    },
});

// ✅ Middleware xử lý lỗi Multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "File quá lớn hoặc lỗi upload." });
    } else if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
});

// =================== 🔹 HELPER FUNCTIONS 🔹 ===================

// 🔹 Hàm làm sạch văn bản
const cleanText = (text) => {
    return text
        .replace(/[^\w\s.,!?]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

// 🔹 Lọc nội dung không liên quan từ PDF
const filterIrrelevantContent = (text) => {
    const lines = text.split("\n");
    return lines.filter(line => !/^\s*$/.test(line)).join("\n").trim();
};

// 🔹 Gọi API Gemini
const callGeminiAPI = async (prompt, type = "text") => {
    const cacheKey = `${type}_${Date.now()}_${prompt}`;
    
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 1000 },
            }),
        });

        if (!response.ok) throw new Error("Lỗi từ API Gemini.");

        const data = await response.json();
        const result = data.candidates[0]?.content?.parts[0]?.text;
        if (!result) throw new Error("Không nhận được kết quả từ API Gemini.");

        cache.set(cacheKey, result);
        return result;
    } catch (error) {
        throw new Error(`Lỗi API Gemini: ${error.message}`);
    }
};

// 🔹 Tóm tắt văn bản
const summarizeText = async (text, lang = "tiếng Việt", type = "text") => {
    const cleanedText = cleanText(text);
    const prompt = `Summarize the following text in ${lang}, in 3-5 sentences:\n\n${cleanedText}`;
    return await callGeminiAPI(prompt, type);
};

// 🔹 Dịch văn bản
const translateText = async (text, targetLang, type = "text") => {
    const cleanedText = cleanText(text);
    const prompt = `Translate the following text to ${targetLang}:\n\n${cleanedText}`;
    return await callGeminiAPI(prompt, type);
};

// =================== 🔹 ROUTES 🔹 ===================
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/users", userRoutes);

// ✅ API tóm tắt văn bản
app.post("/summarize", async (req, res) => {
    const { text, language } = req.body;
    if (!text || text.trim().length < 10) {
        return res.status(400).json({ error: "Văn bản quá ngắn hoặc không hợp lệ." });
    }

    try {
        const summary = await summarizeText(text, language || "tiếng Việt", "text");
        res.json({ summary });
    } catch (error) {
        res.status(500).json({ error: `Lỗi khi tóm tắt: ${error.message}` });
    }
});

// ✅ API dịch văn bản
app.post("/translate", async (req, res) => {
    const { text, targetLang } = req.body;
    if (!text || !targetLang || text.trim().length < 10) {
        return res.status(400).json({ error: "Thiếu hoặc không hợp lệ text/targetLang." });
    }

    try {
        const translation = await translateText(text, targetLang, "text");
        res.json({ translation });
    } catch (error) {
        res.status(500).json({ error: `Lỗi khi dịch: ${error.message}` });
    }
});

// ✅ API upload file PDF
app.post("/upload", upload.single("file"), async (req, res) => {
    let filePath;
    try {
        if (!req.file) return res.status(400).json({ error: "Không có file được tải lên." });

        filePath = req.file.path;
        const dataBuffer = await fs.readFile(filePath);
        const pdfResult = await pdfParse(dataBuffer);
        const filteredText = filterIrrelevantContent(pdfResult.text);

        if (!filteredText) return res.status(400).json({ error: "Không thể trích xuất nội dung." });

        const summary = await summarizeText(filteredText, "tiếng Việt", "document");

        res.json({ originalText: filteredText, summary });
    } finally {
        if (filePath) await fs.unlink(filePath);
    }
});

// ✅ Health Check
app.get("/", (req, res) => {
    res.status(200).json({ message: "🚀 API is running!" });
});

// =================== 🔹 DATABASE CONNECTION 🔹 ===================
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};

// ✅ Start server
connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});
