require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
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
const jwt = require('jsonwebtoken'); // Thêm dòng này ở phần imports

const User = require("./models/User");
const Visit = require("./models/Visit");
const ChatHistory = require("./models/ChatHistory");
const ContentHistory = require("./models/ContentHistory");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const dashboardRoutes = require("./routes/dashboard");
const summaryRoutes = require("./routes/summary");
const uploadRoutes = require("./routes/upload");
const userRoutes = require("./routes/userRoutes");
const { verifyToken, verifyAdmin } = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;
const API_KEY = process.env.API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Kiểm tra cấu hình
if (!API_KEY) {
    console.error("❌ API_KEY is missing in the .env file");
    process.exit(1);
}
if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is missing in the .env file");
    process.exit(1);
}
if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing in the .env file");
    process.exit(1);
}

// Initialize cache
const cache = new NodeCache({ stdTTL: 600 });

// Biến lưu trữ nội dung mới nhất
let latestContent = { type: null, content: null, timestamp: null };

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require("cors");
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:3001", "https://pdfsmart.online", "https://admin.pdfsmart.online", "https://api.pdfsmart.online"],
        credentials: true,  // 👈 Bắt buộc! Cho phép cookie
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Set-Cookie"],
    })
);
app.options("*", cors());

app.use(helmet());
app.use(morgan("combined"));
app.use(cookieParser());
app.use("/api/dashboard", verifyToken, dashboardRoutes);
app.use("/api/users", verifyToken, userRoutes);

// Rate limiting to prevent DDoS
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
});
app.use(limiter);

// Multer configuration for PDF uploads
const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") cb(null, true);
        else cb(new Error("Only PDF files are supported!"), false);
    },
});

// Middleware xử lý lỗi của Multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "File quá lớn! Kích thước tối đa là 10MB." });
        }
        return res.status(400).json({ error: "Lỗi khi tải file lên: " + err.message });
    } else if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
});

const cleanText = (text) => {
    return text.replace(/[^\w\s.,!?;:'"()-]/g, " ").replace(/\s+/g, " ").trim();
};

const filterIrrelevantContent = (text) => {
    const adKeywords = ["ad", "sponsored", "advertisement", "promotion", "brought to you by"];
    return text.split("\n")
        .filter(line => !/^\s*$/.test(line) && !adKeywords.some(keyword => line.toLowerCase().includes(keyword)) && line.length > 10)
        .join("\n").trim();
};

// Rate limit cho chat
const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { error: "Quá nhiều yêu cầu chat, vui lòng thử lại sau 1 phút." },
});

const callGeminiAPI = async (prompt, retries = 3, delay = 2000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.9,
                        topP: 0.95,
                        maxOutputTokens: 2000,
                    },
                }),
            });
            if (!response.ok) {
                if (response.status === 503 && attempt < retries) {
                    console.log(`Attempt ${attempt} failed with 503, retrying after ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                throw new Error(`HTTP Error: ${response.status}`);
            }
            const data = await response.json();
            const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!result) throw new Error("No valid response from Gemini API");
            return result;
        } catch (error) {
            if (error.message.includes("ECONNRESET") && attempt < retries) {
                console.log(`Attempt ${attempt} failed with ECONNRESET, retrying after ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            console.error("❌ Gemini API Error:", error.message);
            throw new Error(`Gemini API Error: ${error.message}`);
        }
    }
    throw new Error(`Failed to call Gemini API after ${retries} attempts.`);
};

const summarizeText = async (text, lang = "English") => {
    const prompt = `Summarize the following text in ${lang}. Provide a detailed summary that captures the main ideas, key points, and important details in at least 150-300 words, ensuring the summary is concise yet comprehensive:\n\n${cleanText(text)}`;
    return callGeminiAPI(prompt);
};

const translateText = async (text, targetLang) => {
    return callGeminiAPI(`Translate to ${targetLang}:\n\n${cleanText(text)}`);
};

// Biến toàn cục để theo dõi số lượng người dùng online
let visitCount = 0;

// API lấy số lượng người dùng online
app.get("/api/visitCount", (req, res) => res.status(200).json({ visitCount }));

app.use("/api/auth", authRoutes({ visitCount }));

// API to summarize text
app.post("/summarize", verifyToken, async (req, res) => {
    const { text, language = "English" } = req.body;
    const userId = req.user.userId;

    if (!text || text.trim().length < 10) {
        return res.status(400).json({ error: "Text quá ngắn hoặc không hợp lệ." });
    }

    try {
        const summary = await summarizeText(text, language);
        latestContent = { type: "text", content: text, timestamp: Date.now() };
        cache.set("lastTextSummarizerContent", summary, 600);

        await ContentHistory.findOneAndUpdate(
            { userId },
            { $push: { contents: { type: "text", content: text, summary } }, $set: { lastUpdated: Date.now() } },
            { upsert: true }
        );

        await Visit.findOneAndUpdate({}, { $inc: { translatedPosts: 1 } }, { upsert: true, new: true });
        res.json({ summary });
    } catch (error) {
        console.error("❌ Error summarizing text:", error.message);
        res.status(500).json({ error: `Error summarizing: ${error.message}` });
    }
});

// API to translate text
app.post("/translate", verifyToken, async (req, res) => {
    const { text, targetLang } = req.body;
    if (!text || !targetLang || text.trim().length < 10) {
        return res.status(400).json({ error: "Missing or invalid text/targetLang." });
    }

    try {
        const translation = await translateText(text, targetLang);
        await Visit.findOneAndUpdate({}, { $inc: { translatedPosts: 1 } }, { upsert: true, new: true });
        res.json({ translation });
    } catch (error) {
        res.status(500).json({ error: `Error translating: ${error.message}` });
    }
});

// API to summarize a URL
app.post("/summarize-link", verifyToken, async (req, res) => {
    const { url, language = "English" } = req.body;
    const userId = req.user.userId;

    if (!url || !url.match(/^https?:\/\//)) {
        return res.status(400).json({ error: "Invalid URL. Please provide a valid URL starting with http:// or https://." });
    }

    const cacheKey = `summarize-link:${url}:${language}`;
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
        console.log(`Returning cached result for ${url}`);
        return res.json(cachedResult);
    }

    try {
        const content = await fetchContent(url);
        console.log(`Extracted content (first 200 chars): ${content.slice(0, 200)}...`);

        let summary;
        if (content.trim().length < 50) {
            summary = "Không đủ nội dung để tóm tắt từ trang web này.";
        } else {
            summary = await summarizeText(content, language);
            console.log(`Generated summary (first 200 chars): ${summary.slice(0, 200)}...`);
        }

        latestContent = { type: "link", content, timestamp: Date.now() };
        cache.set("lastLinkPageContent", summary, 600);

        await ContentHistory.findOneAndUpdate(
            { userId },
            { $push: { contents: { type: "link", content, summary, url } }, $set: { lastUpdated: Date.now() } },
            { upsert: true }
        );

        await Visit.findOneAndUpdate({}, { $inc: { translatedPosts: 1 } }, { upsert: true, new: true });

        const result = {
            originalText: content,
            summary,
            timestamp: new Date().toISOString(),
            status: "success",
        };

        cache.set(cacheKey, result, 600);
        res.json(result);
    } catch (error) {
        console.error("❌ Error summarizing URL:", error.message);
        res.status(500).json({
            error: `Error summarizing URL: ${error.message}`,
            timestamp: new Date().toISOString(),
        });
    }
});

// API to upload and summarize PDF
app.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
    let filePath;
    try {
        const userId = req.user.userId;
        if (!req.file) return res.status(400).json({ error: "Không có file được tải lên." });

        filePath = req.file.path;
        const dataBuffer = await fs.readFile(filePath);
        const pdfResult = await pdfParse(dataBuffer);
        const filteredText = filterIrrelevantContent(pdfResult.text);
        if (!filteredText) return res.status(400).json({ error: "Không thể trích xuất nội dung." });

        const summary = await summarizeText(filteredText, "tiếng Việt");
        latestContent = { type: "pdf", content: filteredText, timestamp: Date.now() };
        cache.set("lastDocumentContent", filteredText, 600);

        await ContentHistory.findOneAndUpdate(
            { userId },
            { $push: { contents: { type: "pdf", content: filteredText, summary } }, $set: { lastUpdated: Date.now() } },
            { upsert: true }
        );

        res.json({ originalText: filteredText, summary });
    } catch (error) {
        console.error("❌ Error uploading PDF:", error.message);
        res.status(500).json({ error: `Error processing PDF: ${error.message}` });
    } finally {
        if (filePath) await fs.unlink(filePath).catch(err => console.error("Error deleting file:", err));
    }
});

// API to handle chat
// Thêm rate limiter mới cho public chat
app.post("/chat", verifyToken, chatLimiter, async (req, res) => {
    try {
        const { question, language = "Vietnamese", detailLevel = "normal" } = req.body;
        const userId = req.user.userId;


// Sửa đổi endpoint chat hiện có
app.post("/chat", publicChatLimiter, async (req, res) => {
    try {
        const { question, language = "English" } = req.body;
        let userId = "guest"; // Mặc định cho user chưa đăng nhập

        // Nếu có token, lấy userId từ token
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.userId;
        }

        if (!question || question.trim().length < 3) {
            return res.status(400).json({ error: "Question too short (min 3 characters)" });
        }

        // Tạo prompt cơ bản cho guest, chi tiết hơn cho user đã đăng nhập
        let prompt;
        if (userId === "guest") {
            prompt = `Answer the following question in ${language}:\n\n${question}\n\n`;
            if (latestContent.content) {
                prompt += `Context:\n${latestContent.content.substring(0, 1000)}`;
            }
        } else {
            // Giữ logic cũ cho user đã đăng nhập
            const chatHistory = await ChatHistory.findOne({ userId });
            prompt = `You are an AI assistant. Answer in ${language}.\n\n`;
            if (chatHistory) {
                prompt += "Chat history:\n";
                chatHistory.messages.slice(-3).forEach(msg => {
                    prompt += `Q: ${msg.question}\nA: ${msg.answer}\n\n`;
                });
            }
            if (latestContent.content) {
                prompt += `Context:\n${latestContent.content}\n\n`;
            }
            prompt += `Question: ${question}`;
        }

        const answer = await callGeminiAPI(prompt);
        const source = latestContent.content 
            ? `From ${latestContent.type} content` 
            : "General knowledge";

        // Chỉ lưu lịch sử cho user đã đăng nhập
        if (userId !== "guest") {
            await ChatHistory.findOneAndUpdate(
                { userId },
                { $push: { messages: { question, answer } } },
                { upsert: true }
            );
        }

        res.json({
            answer,
            source,
            status: "success",
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Chat error:", error);
        res.status(500).json({ 
            error: "Error processing your request",
            details: error.message 
        });
    }
});

// Health Check
app.get("/", (req, res) => res.status(200).json({ message: "🚀 API is running!" }));

// API to get last content
app.get("/last-content", verifyToken, (req, res) => {
    res.json({
        lastContent: latestContent.content,
        type: latestContent.type,
        timestamp: latestContent.timestamp ? new Date(latestContent.timestamp).toISOString() : null,
        status: "success",
    });
});

// API to get content history
app.get("/content-history/:userId", verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "User ID không hợp lệ" });
        }
        if (req.user.userId !== userId && req.user.role !== "admin") {
            return res.status(403).json({ error: "Bạn không có quyền truy cập lịch sử của user này." });
        }
        const history = await ContentHistory.findOne({ userId }).select("contents");
        res.json({
            userId,
            history: history ? history.contents : [],
            timestamp: new Date().toISOString(),
            status: "success",
        });
    } catch (error) {
        res.status(500).json({ error: `Lỗi lấy lịch sử nội dung: ${error.message}` });
    }
});

// API to get chat history
app.get("/chat-history/:userId", verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "User ID không hợp lệ" });
        }
        if (req.user.userId !== userId && req.user.role !== "admin") {
            return res.status(403).json({ error: "Bạn không có quyền truy cập lịch sử chat của user này." });
        }
        const history = await ChatHistory.findOne({ userId }).select("messages");
        res.json({
            userId,
            history: history ? history.messages : [],
            timestamp: new Date().toISOString(),
            status: "success",
        });
    } catch (error) {
        res.status(500).json({ error: `Lỗi lấy lịch sử chat: ${error.message}` });
    }
});

async function fetchContent(url) {
    try {
        if (!url || !url.match(/^https?:\/\//)) throw new Error("URL không hợp lệ");
        const { data: html } = await axios.get(url, {
            timeout: 15000,
            headers: { "User-Agent": "Mozilla/5.0 (compatible; WebSummarizer/1.0; +http://yoursite.com)" },
        });
        const $ = cheerio.load(html);
        let text = "";
        const irrelevantKeywords = ["ad", "advertisement", "sponsored", "promo", "promotion", "banner", "popup", "widget", "sidebar", "footer", "nav", "newsletter", "subscribe", "login", "signup"];
        const contentElements = $("p, h1, h2, h3, h4, h5, h6, article, section, div").filter((_, el) => {
            const $el = $(el);
            const content = $el.text().trim();
            const tagName = el.tagName.toLowerCase();
            const className = ($el.attr("class") || "").toLowerCase();
            const idName = ($el.attr("id") || "").toLowerCase();
            if (!content || content.length < 10 || ["script", "style"].includes(tagName) || irrelevantKeywords.some(keyword => className.includes(keyword) || idName.includes(keyword) || content.toLowerCase().includes(keyword)) || $el.parents("header, nav, footer, aside").length > 0) {
                return false;
            }
            return content.length > 20 || ["h1", "h2", "h3", "article"].includes(tagName);
        });
        contentElements.each((_, element) => {
            const content = $(element).text().trim();
            if (content) text += content + "\n";
        });
        if (!text.trim()) {
            text = $("body").contents().filter((_, el) => {
                const $el = $(el);
                const content = $el.text().trim();
                const className = ($el.attr("class") || "").toLowerCase();
                const idName = ($el.attr("id") || "").toLowerCase();
                return content && content.length > 20 && !irrelevantKeywords.some(keyword => className.includes(keyword) || idName.includes(keyword) || content.toLowerCase().includes(keyword)) && !$el.is("script, style, header, nav, footer, aside");
            }).text().trim();
        }
        if (!text.trim()) text = "Trang web này không chứa nội dung text có thể tóm tắt.";
        text = filterIrrelevantContent(text).replace(/\n+/g, "\n").trim();
        const MAX_CONTENT_LENGTH = 50000;
        if (text.length > MAX_CONTENT_LENGTH) text = text.substring(0, MAX_CONTENT_LENGTH);
        return text;
    } catch (error) {
        console.error(`Lỗi khi tải nội dung từ ${url}:`, error.message);
        throw new Error(`Lỗi lấy nội dung: ${error.message}`);
    }
}

// Kết nối MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};



// Start server
let server;
connectDB().then(() => {
    server = app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
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

