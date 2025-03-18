require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const fs = require("fs").promises;
const pdfParse = require("pdf-parse");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const NodeCache = require("node-cache");
const cookieParser = require("cookie-parser");


// Import models
const User = require("./models/User");
const Visit = require("./models/Visit");
const visitCountObj = { visitCount: 0 }; 

// Import routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const dashboardRoutes = require("./routes/dashboard");
const summaryRoutes = require("./routes/summary");
const uploadRoutes = require("./routes/upload");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;
const API_KEY = process.env.API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// ✅ Kiểm tra cấu hình quan trọng
if (!API_KEY) {
    console.error("❌ API_KEY is missing in the .env file");
    process.exit(1);
}
if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is missing in the .env file");
    process.exit(1);
}

// ✅ Initialize cache (10 minutes)
const cache = new NodeCache({ stdTTL: 600 });

// =================== 🔹 MIDDLEWARE 🔹 ===================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:3001"], // Chỉ định frontend được phép truy cập
      credentials: true, // Cho phép gửi cookie và authentication headers
    })
  );
app.use(helmet());
app.use(morgan("combined"));
app.use("/api/dashboard", dashboardRoutes);
app.use(cookieParser());  // Thêm middleware này

// 🚀 Rate limiting to prevent DDoS
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
});
app.use(limiter);

// ✅ Multer configuration for PDF uploads
const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") cb(null, true);
        else cb(new Error("Only PDF files are supported!"), false);
    },
});

// ✅ Middleware để xử lý lỗi của Multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "File is too large or upload error." });
    } else if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
});

// =================== 🔹 UTILITY FUNCTIONS 🔹 ===================
const cleanText = (text) => text.replace(/[^\w\s.,!?]/g, " ").replace(/\s+/g, " ").trim();
const filterIrrelevantContent = (text) => text.split("\n").filter(line => !/^\s*$/.test(line)).join("\n").trim();

const callGeminiAPI = async (prompt) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 1000 },
            }),
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!result) throw new Error("No valid response from Gemini API");

        return result;
    } catch (error) {
        console.error("❌ Gemini API Error:", error.message);
        throw new Error(`Gemini API Error: ${error.message}`);
    }
};

const summarizeText = async (text, lang = "English") => callGeminiAPI(`Summarize in ${lang}:\n\n${cleanText(text)}`);
const translateText = async (text, targetLang) => callGeminiAPI(`Translate to ${targetLang}:\n\n${cleanText(text)}`);

// ✅ Biến toàn cục để theo dõi số lượng người dùng online
let visitCount = 0;

// ✅ API lấy số lượng người dùng online
app.get("/api/visitCount", (req, res) => res.status(200).json({ visitCount }));

app.use("/api/auth", authRoutes(visitCountObj));

// ✅ API to summarize text
app.post("/summarize", async (req, res) => {
    const { text, language } = req.body;
    if (!text || text.trim().length < 10) return res.status(400).json({ error: "Text is too short or invalid." });

    try {
        const summary = await summarizeText(text, language || "English");
        await Visit.findOneAndUpdate({}, { $inc: { summarizedPosts: 1 } }, { upsert: true, new: true });
        res.json({ summary });
    } catch (error) {
        res.status(500).json({ error: `Error summarizing: ${error.message}` });
    }
});

// ✅ API to translate text
app.post("/translate", async (req, res) => {
    const { text, targetLang } = req.body;
    if (!text || !targetLang || text.trim().length < 10) return res.status(400).json({ error: "Missing or invalid text/targetLang." });

    try {
        const translation = await translateText(text, targetLang);
        await Visit.findOneAndUpdate({}, { $inc: { translatedPosts: 1 } }, { upsert: true, new: true });
        res.json({ translation });
    } catch (error) {
        res.status(500).json({ error: `Error translating: ${error.message}` });
    }
});

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
app.get("/", (req, res) => res.status(200).json({ message: "🚀 API is running!" }));

// ✅ Kết nối MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
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
