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
const axios = require("axios");
const cheerio = require("cheerio");

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
        origin: ["http://localhost:3000", "http://localhost:3001"],
        credentials: true,
    })
);
app.use(helmet());
app.use(morgan("combined"));
app.use(cookieParser());
app.use("/api/dashboard", dashboardRoutes);

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
const cleanText = (text) => {
    // Preserve more punctuation and special characters
    return text
        .replace(/[^\w\s.,!?;:'"()-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

const filterIrrelevantContent = (text) => {
    return text
        .split("\n")
        .filter((line) => !/^\s*$/.test(line))
        .join("\n")
        .trim();
};

const callGeminiAPI = async (prompt) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.9, // Increased for more detailed responses
                    topP: 0.95, // Adjusted for more diverse output
                    maxOutputTokens: 2000, // Increased to allow longer summaries
                },
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

const summarizeText = async (text, lang = "English") => {
    const prompt = `Summarize the following text in ${lang}. Provide a detailed summary that captures the main ideas, key points, and important details in at least 150-300 words, ensuring the summary is concise yet comprehensive:\n\n${cleanText(text)}`;
    return callGeminiAPI(prompt);
};

const translateText = async (text, targetLang) => {
    return callGeminiAPI(`Translate to ${targetLang}:\n\n${cleanText(text)}`);
};

// ✅ Biến toàn cục để theo dõi số lượng người dùng online
let visitCount = 0;

// ✅ API lấy số lượng người dùng online
app.get("/api/visitCount", (req, res) => res.status(200).json({ visitCount }));

app.use("/api/auth", authRoutes(visitCountObj));

// ✅ API to summarize text
app.post("/summarize", async (req, res) => {
    const { text, language } = req.body;
    if (!text || text.trim().length < 10) {
        return res.status(400).json({ error: "Text is too short or invalid." });
    }

    try {
        const summary = await summarizeText(text, language || "English");
        await Visit.findOneAndUpdate(
            {},
            { $inc: { translatedPosts: 1 } },
            { upsert: true, new: true }
        );
        res.json({ summary });
    } catch (error) {
        res.status(500).json({ error: `Error summarizing: ${error.message}` });
    }
});

// ✅ API to translate text
app.post("/translate", async (req, res) => {
    const { text, targetLang } = req.body;
    if (!text || !targetLang || text.trim().length < 10) {
        return res.status(400).json({ error: "Missing or invalid text/targetLang." });
    }

    try {
        const translation = await translateText(text, targetLang);
        await Visit.findOneAndUpdate(
            {},
            { $inc: { translatedPosts: 1 } },
            { upsert: true, new: true }
        );
        res.json({ translation });
    } catch (error) {
        res.status(500).json({ error: `Error translating: ${error.message}` });
    }
});

// ✅ API to summarize a URL
app.post("/summarize-link", async (req, res) => {
    const { url, language } = req.body;

    if (!url || !url.match(/^https?:\/\//)) {
        return res.status(400).json({
            error: "Invalid URL. Please provide a valid URL starting with http:// or https://.",
        });
    }

    try {
        const content = await fetchContent(url);
        console.log(`Extracted content (first 200 chars): ${content.slice(0, 200)}...`);
        if (!content || content.trim().length < 50) {
            return res.status(400).json({
                error: "The webpage content is too short or not suitable for summarization. Please try a different URL with more textual content.",
            });
        }

        const summary = await summarizeText(content, language || "English");
        console.log(`Generated summary (first 200 chars): ${summary.slice(0, 200)}...`);
        console.log(`Summary length: ${summary.length} characters`);

        lastContent = content;

        await Visit.findOneAndUpdate(
            {},
            { $inc: { translatedPosts: 1 } },
            { upsert: true, new: true }
        );

        res.json({
            originalText: content,
            summary,
            timestamp: new Date().toISOString(),
            status: "success",
        });
    } catch (error) {
        console.error("❌ Error summarizing URL:", error.message);
        res.status(500).json({
            error: `Error summarizing URL: ${error.message}`,
            timestamp: new Date().toISOString(),
        });
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
        const summary = await summarizeText(filteredText, "tiếng Việt");
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
    const server = app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});

let lastContent = "";
async function fetchContent(url) {
    try {
        if (!url || !url.match(/^https?:\/\//)) {
            throw new Error("URL không hợp lệ hoặc không bắt đầu bằng http/https");
        }

        console.log(`Đang tải nội dung từ: ${url}`);
        const { data: html } = await axios.get(url, {
            timeout: 15000,
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; WebSummarizer/1.0; +http://yoursite.com)",
            },
        });

        const $ = cheerio.load(html);
        let text = "";

        const contentElements = $(
            "p, h1, h2, h3, h4, h5, h6, article, div, section, span, li"
        ).filter((_, el) => {
            const content = $(el).text().trim();
            return (
                content &&
                content.length > 5 &&
                !$(el).hasClass("ad") &&
                !$(el).hasClass("advertisement") &&
                !$(el).hasClass("nav") &&
                !$(el).hasClass("footer") &&
                !$(el).is("script") &&
                !$(el).is("style") &&
                !$(el).is("header") &&
                !$(el).is("nav")
            );
        });

        contentElements.each((_, element) => {
            const content = $(element).text().trim();
            if (content) {
                text += content + "\n";
            }
        });

        if (!text) throw new Error("Không tìm thấy nội dung để tóm tắt trên trang web.");

        text = text.replace(/\n+/g, "\n").trim();
        console.log(`Extracted content length: ${text.length} characters`);
        return text;
    } catch (error) {
        console.error(`Lỗi khi tải nội dung từ ${url}:`, error.message);
        throw new Error(`Lỗi lấy nội dung: ${error.message}`);
    }
}

app.post("/chat", async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({
                error: "Thiếu câu hỏi trong yêu cầu",
                timestamp: new Date().toISOString(),
            });
        }

        let answer;
        const isContentRelated =
            question.toLowerCase().includes("nội dung") || question.toLowerCase().includes("web");

        if (isContentRelated && lastContent) {
            console.log(`💬 Xử lý câu hỏi liên quan đến nội dung: ${question}`);
            const context = `Dựa vào nội dung sau để trả lời chính xác và ngắn gọn: ${lastContent}`;
            answer = await callGeminiAPI(context + "\n\n" + question);
        } else if (!lastContent) {
            console.log(`💬 Chưa có nội dung để trả lời: ${question}`);
            answer = "Vui lòng nhập URL và tóm tắt trước để tôi có thể trả lời dựa trên nội dung.";
        } else {
            console.log(`💬 Xử lý câu hỏi chung: ${question}`);
            const prompt = `Trả lời câu hỏi sau một cách ngắn gọn và chính xác: ${question}`;
            answer = await callGeminiAPI(prompt);
        }

        res.json({
            question,
            answer,
            timestamp: new Date().toISOString(),
            status: "success",
        });
    } catch (error) {
        console.error("❌ Lỗi khi xử lý câu hỏi:", error.message);
        res.status(500).json({
            error: error.message || "Lỗi trong quá trình chat",
            question: req.body.question,
            timestamp: new Date().toISOString(),
        });
    }
});

app.get("/last-content", (req, res) => {
    res.json({
        lastContent: lastContent,
        timestamp: new Date().toISOString(),
        status: "success",
    });
});

app.use((req, res) => {
    res.status(404).json({ error: "Không tìm thấy endpoint", timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
    console.error("❌ Lỗi server:", err.stack);
    res.status(500).json({
        error: "Có lỗi xảy ra trên server",
        timestamp: new Date().toISOString(),
        details: err.message,
    });
});

process.on("SIGTERM", () => {
    console.log("👋 Đang tắt server...");
    server.close(() => {
        console.log("✅ Server đã tắt");
        process.exit(0);
    });
});

process.on("SIGINT", () => {
    console.log("👋 Nhận tín hiệu ngắt (Ctrl+C), đang tắt server...");
    server.close(() => {
        console.log("✅ Server đã tắt");
        process.exit(0);
    });
});