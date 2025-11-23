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

const User = require("./models/User");
const Visit = require("./models/Visit");
const ChatHistory = require("./models/ChatHistory");
const ContentHistory = require("./models/ContentHistory");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const dashboardRoutes = require("./routes/dashboard");
const userRoutes = require("./routes/userRoutes");
const { verifyToken, verifyAdmin } = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;
const API_KEY = process.env.API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

// Validate environment variables
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
console.log("🔑 API_KEY loaded: ✅ OK");

// Initialize cache with longer TTL
const cache = new NodeCache({ stdTTL: 7200 }); // Cache for 2 hours

// Store latest content per user to avoid race conditions
const userLatestContent = new Map();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require("cors");
app.use(cors({
    origin: process.env.NODE_ENV === "production"
        ? ["https://pdfsmart.online", "https://admin.pdfsmart.online"]
        : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Set-Cookie"],
}));
app.options("*", cors());

app.use(helmet());
app.use(morgan("combined"));
app.use(cookieParser());
app.use("/api/dashboard", verifyToken, dashboardRoutes);
app.use("/api/users", verifyToken, userRoutes);
app.use("/admin", adminRoutes);

// Global rate limiter
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Quá nhiều yêu cầu, vui lòng thử lại sau.",
});
app.use(globalLimiter);

// Endpoint-specific rate limiter for Gemini API calls
const geminiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 2, // Stricter limit to avoid 429 errors
    message: { error: "Quá nhiều yêu cầu API Gemini, vui lòng thử lại sau 1 phút." },
});

// Multer configuration for PDF uploads
const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") cb(null, true);
        else cb(new Error("Chỉ hỗ trợ file PDF!"), false);
    },
});

// Multer error handling
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

// Utility functions
const cleanText = (text) => {
    return text.replace(/[^\w\s.,!?;:'"()-]/g, " ").replace(/\s+/g, " ").trim();
};

const filterIrrelevantContent = (text) => {
    const adKeywords = ["ad", "sponsored", "advertisement", "promotion", "brought to you by"];
    return text
        .split("\n")
        .filter(line => !/^\s*$/.test(line) && !adKeywords.some(keyword => line.toLowerCase().includes(keyword)) && line.length > 10)
        .join("\n")
        .trim();
};

// Enhanced Gemini API call with better error handling
const callGeminiAPI = async (prompt, userId, retries = 3, baseDelay = 4000) => {
    const cacheKey = `gemini:${userId}:${prompt.hashCode()}`;
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
        console.log(`Trả về kết quả cache cho người dùng ${userId}`);
        return cachedResult;
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 1, // Match model default
                        topP: 0.95,
                        topK: 64,
                        maxOutputTokens: 65536, // Match model limit
                    },
                }),
            });

            if (!response.ok) {
                if (response.status === 429) {
                    const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
                    console.log(`Thử ${attempt} thất bại với 429, thử lại sau ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                if (response.status === 404) {
                    throw new Error("API endpoint hoặc mô hình không tồn tại. Kiểm tra API_URL và tên mô hình.");
                }
                if (response.status === 503 && attempt < retries) {
                    const delay = baseDelay * Math.pow(2, attempt - 1);
                    console.log(`Thử ${attempt} thất bại với 503, thử lại sau ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }

            const data = await response.json();
            const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!result) throw new Error("Không nhận được phản hồi hợp lệ từ Gemini API");

            cache.set(cacheKey, result, 7200); // Cache for 2 hours
            return result;

        } catch (error) {
            if (error.message.includes("ECONNRESET") && attempt < retries) {
                const delay = baseDelay * Math.pow(2, attempt - 1);
                console.log(`Thử ${attempt} thất bại với ECONNRESET, thử lại sau ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            console.error("❌ Lỗi Gemini API:", error.message);
            throw error;
        }
    }

    throw new Error(`Không thể gọi Gemini API sau ${retries} lần thử.`);
};

// Helper to generate hash code for strings
String.prototype.hashCode = function () {
    let hash = 0;
    for (let i = 0; i < this.length; i++) {
        const char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
};

const summarizeText = async (text, lang = "English", userId) => {
    const prompt = `Tóm tắt văn bản sau bằng ${lang}. Cung cấp bản tóm tắt chi tiết, bao gồm các ý chính, điểm nổi bật và chi tiết quan trọng trong 150-300 từ, đảm bảo ngắn gọn nhưng đầy đủ:\n\n${cleanText(text)}`;
    return callGeminiAPI(prompt, userId);
};

const translateText = async (text, targetLang, userId) => {
    return callGeminiAPI(`Dịch sang ${targetLang}:\n\n${cleanText(text)}`, userId);
};

// Track online users
let visitCount = 0;
app.get("/api/visitCount", (req, res) => res.status(200).json({ visitCount }));
app.use("/api/auth", authRoutes({ visitCount }));

// Summarize text
app.post("/summarize", verifyToken, geminiLimiter, async (req, res) => {
    const { text, language = "English", translateTo = "Vietnamese" } = req.body;
    const _id = req.user._id;

    if (!text || text.trim().length < 10) {
        return res.status(400).json({ error: "Văn bản quá ngắn hoặc không hợp lệ." });
    }

    try {
        const cacheKey = `summarize:${_id}:${text.hashCode()}:${language}`;
        const cachedResult = cache.get(cacheKey);
        if (cachedResult) {
            console.log(`Trả về bản tóm tắt từ cache cho người dùng ${_id}`);
            return res.json(cachedResult);
        }

        const summary = await summarizeText(text, language, _id);
        let translatedSummary = null;
        if (translateTo) {
            translatedSummary = await translateText(summary, translateTo, _id);
        }

        userLatestContent.set(_id, { type: "text", content: text, timestamp: Date.now() });
        cache.set(`lastTextSummarizerContent:${_id}`, summary, 7200);

        await ContentHistory.findOneAndUpdate(
            { _id },
            {
                $push: { contents: { type: "text", content: text, summary, translatedSummary } },
                $set: { lastUpdated: Date.now() },
            },
            { upsert: true }
        );

        await Visit.findOneAndUpdate({}, { $inc: { translatedPosts: 1 } }, { upsert: true, new: true });

        const result = {
            summary,
            translatedSummary,
            message: `Bản tóm tắt được tạo bằng ${language} và dịch sang ${translateTo}`,
        };

        cache.set(cacheKey, result, 7200);
        res.json(result);
    } catch (error) {
        console.error("❌ Lỗi khi tóm tắt văn bản:", error.message);
        res.status(500).json({ error: `Lỗi tóm tắt: ${error.message}` });
    }
});

// Translate text
app.post("/translate", verifyToken, geminiLimiter, async (req, res) => {
    const { text, targetLang, properNouns = [], translationMap = {}, isSummary = false } = req.body;
    const _id = req.user._id;

    if (!text || !targetLang || text.trim().length < 10) {
        return res.status(400).json({ error: "Thiếu hoặc văn bản/ngôn ngữ không hợp lệ." });
    }

    try {
        const cacheKey = `translate:${_id}:${text.hashCode()}:${targetLang}`;
        const cachedResult = cache.get(cacheKey);
        if (cachedResult) {
            console.log(`Trả về bản dịch từ cache cho người dùng ${_id}`);
            return res.json(cachedResult);
        }

        let isValidSummary = false;
        if (isSummary) {
            const history = await ContentHistory.findOne({ _id });
            if (history && history.contents.length > 0) {
                const latestContent = history.contents[history.contents.length - 1];
                if (latestContent.summary === text) {
                    isValidSummary = true;
                }
            }
        }

        const sanitizedProperNouns = properNouns
            .map(noun => noun.replace(/[*|":<>[\]{}`\\();'~^]/g, "").trim())
            .filter(noun => noun.length > 0);

        let translation = await translateText(text, targetLang, _id);

        if (sanitizedProperNouns.length > 0) {
            for (const noun of sanitizedProperNouns) {
                const mapped = translationMap[noun] || noun;
                try {
                    const escapedNoun = mapped.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                    translation = translation.replace(new RegExp(`\\b${escapedNoun}\\b`, "g"), noun);
                } catch (err) {
                    console.warn(`Bỏ qua danh từ riêng không hợp lệ: ${mapped}`, err.message);
                }
            }
        }

        const newEntry = {
            type: "translate",
            content: text,
            summary: translation,
            targetLang,
            isSummary: isValidSummary,
            timestamp: new Date(),
        };

        const history = await ContentHistory.findById(_id);
        if (history) {
            history.contents.push(newEntry);
            if (history.contents.length > 50) {
                history.contents = history.contents.slice(-50);
            }
            history.lastUpdated = new Date();
            await history.save();
        } else {
            await ContentHistory.create({ _id, contents: [newEntry], lastUpdated: new Date() });
        }

        await Visit.findOneAndUpdate({}, { $inc: { translatedPosts: 1 } }, { upsert: true, new: true });

        const result = { translation, isSummary: isValidSummary };
        cache.set(cacheKey, result, 7200);
        res.json(result);
    } catch (error) {
        console.error("Lỗi dịch:", error);
        res.status(500).json({ error: `Lỗi dịch: ${error.message}` });
    }
});

// Summarize URL
app.post("/summarize-link", verifyToken, geminiLimiter, async (req, res) => {
    const { url, language = "English" } = req.body;
    const _id = req.user._id;

    if (!url || !url.match(/^https?:\/\//)) {
        return res.status(400).json({ error: "URL không hợp lệ. Vui lòng cung cấp URL bắt đầu bằng http:// hoặc https://." });
    }

    const cacheKey = `summarize-link:${_id}:${url}:${language}`;
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
        console.log(`Trả về kết quả cache cho ${url}`);
        return res.json(cachedResult);
    }

    try {
        const content = await fetchContent(url);
        let summary;
        if (content.trim().length < 50) {
            summary = "Không đủ nội dung để tóm tắt từ trang web này.";
        } else {
            summary = await summarizeText(content, language, _id);
        }

        userLatestContent.set(_id, { type: "link", content, timestamp: Date.now() });
        cache.set(`lastLinkPageContent:${_id}`, summary, 7200);

        await ContentHistory.findOneAndUpdate(
            { _id },
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

        cache.set(cacheKey, result, 7200);
        res.json(result);
    } catch (error) {
        console.error("❌ Lỗi khi tóm tắt URL:", error.message);
        res.status(500).json({
            error: `Lỗi tóm tắt URL: ${error.message}`,
            timestamp: new Date().toISOString(),
        });
    }
});

// Upload and summarize PDF
app.post("/upload", verifyToken, geminiLimiter, upload.single("file"), async (req, res) => {
    let filePath;
    try {
        const _id = req.user._id;
        if (!req.file) return res.status(400).json({ error: "Không có file được tải lên." });

        filePath = req.file.path;
        const dataBuffer = await fs.readFile(filePath);
        const pdfResult = await pdfParse(dataBuffer);
        const filteredText = filterIrrelevantContent(pdfResult.text);
        if (!filteredText) return res.status(400).json({ error: "Không thể trích xuất nội dung." });

        const summary = await summarizeText(filteredText, "tiếng Việt", _id);
        userLatestContent.set(_id, { type: "pdf", content: filteredText, timestamp: Date.now() });
        cache.set(`lastDocumentContent:${_id}`, filteredText, 7200);

        await ContentHistory.findOneAndUpdate(
            { _id },
            { $push: { contents: { type: "pdf", content: filteredText, summary } }, $set: { lastUpdated: Date.now() } },
            { upsert: true }
        );

        await Visit.findOneAndUpdate({}, { $inc: { translatedPosts: 1 } }, { upsert: true, new: true });

        res.json({ originalText: filteredText, summary });
    } catch (error) {
        console.error("❌ Lỗi khi xử lý PDF:", error.message);
        res.status(500).json({ error: `Lỗi xử lý PDF: ${error.message}` });
    } finally {
        if (filePath) {
            try {
                await fs.unlink(filePath);
            } catch (err) {
                console.error("Lỗi khi xóa file:", err);
            }
        }
    }
});

// Chat endpoint
app.post("/chat", verifyToken, geminiLimiter, async (req, res) => {
    try {
        const { question, language = "English", detailLevel = "normal" } = req.body;
        const _id = req.user._id;

        if (!question || question.trim().length < 3) {
            return res.status(400).json({
                error: "Câu hỏi quá ngắn hoặc không hợp lệ",
                timestamp: new Date().toISOString(),
            });
        }

        const latestContent = userLatestContent.get(_id);
        if (!latestContent?.content || !latestContent?.timestamp) {
            return res.status(400).json({
                error: "Vui lòng tải lên nội dung (text, PDF, hoặc link) trước khi đặt câu hỏi.",
                timestamp: new Date().toISOString(),
            });
        }

        const lowerQuestion = question.toLowerCase();
        const createPrompt = async () => {
            let prompt = `Bạn là trợ lý AI thông minh. Trả lời chi tiết bằng ${language}, độ chi tiết: ${detailLevel === "high" ? "rất cao" : "bình thường"}.\n\n`;
            const chatHistory = await ChatHistory.findOne({ _id });
            if (chatHistory && chatHistory.messages.length > 0) {
                prompt += "Lịch sử chat:\n";
                chatHistory.messages.slice(-5).forEach(msg => {
                    prompt += `Hỏi: ${msg.question}\nTrả lời: ${msg.answer}\n\n`;
                });
            }
            prompt += `Nội dung: ${latestContent.content}\n\n`;
            if (lowerQuestion.includes("tóm tắt") || lowerQuestion.includes("summary")) {
                prompt += "Tóm tắt nội dung trên một cách chi tiết, bao gồm các ý chính và chi tiết quan trọng.";
            } else if (lowerQuestion.includes("dịch") || lowerQuestion.includes("translate")) {
                const targetLang = lowerQuestion.match(/dịch sang (.+)$/i)?.[1] || language;
                prompt += `Dịch nội dung sang ${targetLang}.`;
            } else {
                prompt += `Câu hỏi: ${question}\nHãy trả lời dựa trên nội dung trên, giải thích rõ ràng.`;
            }
            return prompt;
        };

        const prompt = await createPrompt();
        const answer = await callGeminiAPI(prompt, _id);
        const source = `${latestContent.type} vừa tải lên lúc ${new Date(latestContent.timestamp).toLocaleString()}`;

        await ChatHistory.findOneAndUpdate(
            { _id },
            { $push: { messages: { question, answer, source } }, $set: { lastUpdated: Date.now() } },
            { upsert: true }
        );

        const updatedHistory = await ChatHistory.findOne({ _id }).select("messages");
        cache.set(`chat:${_id}:${Date.now()}`, { question, answer }, 7200);

        res.json({
            question,
            answer,
            source,
            history: updatedHistory.messages,
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

// Health check
app.get("/", (req, res) => res.status(200).json({ message: "🚀 API đang chạy!" }));

// Get last content
app.get("/last-content", verifyToken, (req, res) => {
    const _id = req.user._id;
    const latestContent = userLatestContent.get(_id) || {};
    res.json({
        lastContent: latestContent.content,
        type: latestContent.type,
        timestamp: latestContent.timestamp ? new Date(latestContent.timestamp).toISOString() : null,
        status: "success",
    });
});

// Content history
app.get("/api/content-history/:userId", verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        if (req.user._id !== userId && req.user.role !== "admin") {
            return res.status(403).json({ status: "error", message: "Truy cập không được phép" });
        }

        const history = await ContentHistory.findOne({ _id: userId });
        res.json({
            status: "success",
            data: {
                history: history ? history.contents : [],
                lastUpdated: history ? history.lastUpdated : null,
            },
        });
    } catch (error) {
        console.error("Lỗi khi lấy lịch sử nội dung:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

// Chat history
app.get("/api/chat-history/:userId", verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        if (req.user._id !== userId && req.user.role !== "admin") {
            return res.status(403).json({ status: "error", message: "Truy cập không được phép" });
        }

        const history = await ChatHistory.findOne({ _id: userId });
        res.json({
            status: "success",
            data: {
                history: history ? history.messages : [],
                lastUpdated: history ? history.lastUpdated : null,
            },
        });
    } catch (error) {
        console.error("Lỗi khi lấy lịch sử chat:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

// Fetch content from URL
async function fetchContent(url) {
    try {
        if (!url || !url.match(/^https?:\/\//)) throw new Error("URL không hợp lệ");
        const { data: html } = await axios.get(url, {
            timeout: 10000,
            headers: { "User-Agent": "Mozilla/5.0 (compatible; WebSummarizer/1.0)" },
        });
        const $ = cheerio.load(html);
        let text = "";
        const irrelevantKeywords = ["ad", "advertisement", "sponsored", "promo", "promotion", "banner", "popup", "widget", "sidebar", "footer", "nav", "newsletter", "subscribe", "login", "signup"];
        const contentElements = $("p, h1, h2, h3, article").filter((_, el) => {
            const $el = $(el);
            const content = $el.text().trim();
            const tagName = el.tagName.toLowerCase();
            const className = ($el.attr("class") || "").toLowerCase();
            const idName = ($el.attr("id") || "").toLowerCase();
            if (
                !content ||
                content.length < 10 ||
                ["script", "style"].includes(tagName) ||
                irrelevantKeywords.some(keyword => className.includes(keyword) || idName.includes(keyword) || content.toLowerCase().includes(keyword)) ||
                $el.parents("header, nav, footer, aside").length > 0
            ) {
                return false;
            }
            return content.length > 20 || ["h1", "h2", "h3", "article"].includes(tagName);
        });
        contentElements.each((_, element) => {
            const content = $(element).text().trim();
            if (content) text += content + "\n";
        });
        if (!text.trim()) {
            text = $("body")
                .contents()
                .filter((_, el) => {
                    const $el = $(el);
                    const content = $el.text().trim();
                    const className = ($el.attr("class") || "").toLowerCase();
                    const idName = ($el.attr("id") || "").toLowerCase();
                    return (
                        content &&
                        content.length > 20 &&
                        !irrelevantKeywords.some(keyword => className.includes(keyword) || idName.includes(keyword) || content.toLowerCase().includes(keyword)) &&
                        !$el.is("script, style, header, nav, footer, aside")
                    );
                })
                .text()
                .trim();
        }
        if (!text.trim()) text = "Trang web này không chứa nội dung text có thể tóm tắt.";
        text = filterIrrelevantContent(text).replace(/\n+/g, "\n").trim();
        const MAX_CONTENT_LENGTH = 30000;
        if (text.length > MAX_CONTENT_LENGTH) text = text.substring(0, MAX_CONTENT_LENGTH);
        return text;
    } catch (error) {
        console.error(`Lỗi khi tải nội dung từ ${url}:`, error.message);
        throw new Error(`Lỗi lấy nội dung: ${error.message}`);
    }
}

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Kết nối với MongoDB thành công");
    } catch (error) {
        console.error("❌ Lỗi kết nối MongoDB:", error);
        process.exit(1);
    }
};

// Start server
let server;
connectDB().then(() => {
    server = app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
});

// Handle 404 and errors
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