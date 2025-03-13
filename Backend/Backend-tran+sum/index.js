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

const app = express();
const PORT = process.env.PORT || 5001;
const API_KEY = process.env.API_KEY;

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const summaryRoutes = require("./routes/summary");
const uploadRoutes = require("./routes/upload");
const userRoutes = require("./routes/userRoutes");

if (!API_KEY) {
    console.error("❌ API_KEY not provided in .env file");
    process.exit(1);
}

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
const cache = new NodeCache({ stdTTL: 600 });

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// ✅ Giới hạn số request để tránh spam
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: "Too many requests, please try again later.",
});
app.use(limiter);

// ✅ Kết nối MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};

// ✅ Cấu hình multer để upload PDF
const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") cb(null, true);
        else cb(new Error("Only PDF files are allowed!"), false);
    },
});

// ✅ Hàm lọc nội dung không cần thiết trong PDF
const filterIrrelevantContent = (text) => {
    const lines = text.split("\n");
    return lines
        .filter((line) => {
            const trimmedLine = line.trim();
            return (
                trimmedLine.length > 0 &&
                !trimmedLine.match(/^\d+$/) &&
                !trimmedLine.match(/^(http|www)/i) &&
                !trimmedLine.match(/^\s*[-–—]\s*$/)
            );
        })
        .join("\n")
        .trim();
};

// ✅ Hàm gọi API Gemini
const callGeminiAPI = async (prompt, type = "text") => {
    const requestId = Date.now();
    const cacheKey = `${type}_${requestId}_${prompt.slice(0, 50)}`;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.9,
                    maxOutputTokens: 1000,
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Error from Gemini API.");
        }

        const data = await response.json();
        const result = data.candidates[0]?.content?.parts[0]?.text;
        if (!result) throw new Error("No result received from Gemini API.");

        console.log(`API response for ${type}: ${result}`);
        cache.set(cacheKey, result);
        return result;
    } catch (error) {
        throw new Error(`Error calling Gemini API: ${error.message}`);
    }
};

// =================== 🔹 ROUTES 🔹 ===================
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.status(200).json({ message: "🚀 API is running!" });
});

// =================== 🔹 API UPLOAD PDF 🔹 ===================
app.post("/upload", upload.single("file"), async (req, res) => {
    let filePath;
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }
        filePath = req.file.path;

        const dataBuffer = await fs.readFile(filePath);
        const pdfResult = await pdfParse(dataBuffer);
        let rawText = pdfResult.text;

        const filteredText = filterIrrelevantContent(rawText);
        if (!filteredText) {
            return res.status(400).json({ error: "Cannot extract meaningful content from PDF." });
        }

        const maxTextLength = 10000;
        const truncatedContent =
            filteredText.length > maxTextLength
                ? filteredText.substring(0, maxTextLength) + "... [Content truncated]"
                : filteredText;

        res.json({ originalText: truncatedContent });

    } catch (error) {
        console.error("Error processing PDF file:", error.message);
        res.status(500).json({ error: `Error processing file: ${error.message}` });
    } finally {
        if (filePath) {
            try {
                await fs.unlink(filePath);
            } catch (err) {
                console.error("Error deleting temp file:", err.message);
            }
        }
    }
});

// =================== 🔹 API TÓM TẮT VĂN BẢN 🔹 ===================
app.post("/summarize", async (req, res) => {
    const { text, language } = req.body;
    if (!text || typeof text !== "string" || text.trim().length < 10) {
        return res.status(400).json({ error: "Invalid or too short text." });
    }

    try {
        const prompt = `Summarize the following text in ${language || "English"}:\n\n${text}`;
        const result = await callGeminiAPI(prompt, "text");
        res.json({ summary: result });
    } catch (error) {
        console.error("Error summarizing text:", error.message);
        res.status(500).json({ error: `Error summarizing text: ${error.message}` });
    }
});

// =================== 🔹 API DỊCH VĂN BẢN 🔹 ===================
app.post("/translate", async (req, res) => {
    const { text, targetLang } = req.body;
    if (!text || !targetLang) {
        return res.status(400).json({ error: "Missing text or targetLang." });
    }

    try {
        const prompt = `Translate the following text to ${targetLang}:\n\n${text}`;
        const result = await callGeminiAPI(prompt, "text");
        res.json({ translation: result });
    } catch (error) {
        console.error("Error translating text:", error.message);
        res.status(500).json({ error: `Error translating text: ${error.message}` });
    }
});

// =================== 🔹 GLOBAL ERROR HANDLING 🔹 ===================
app.use((err, req, res, next) => {
    console.error("💥 Server Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
});

// =================== 🔹 SERVER START 🔹 ===================
connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});
