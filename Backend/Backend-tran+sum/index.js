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
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "https://pdfsmart.online", "https://admin.pdfsmart.online"],
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

    if (!text || text.trim().length < 10) {
        return res.status(400).json({ error: "Text quá ngắn hoặc không hợp lệ." });
    }

    try {
        const summary = await summarizeText(text, language);
        latestContent = { type: "text", content: text, timestamp: Date.now() };
        cache.set("lastTextSummarizerContent", summary, 600);

        const historyRecord = new ContentHistory({
            userId: _id,
            actionType: 'summarize',
            contentType: 'text',
            originalContent: text.substring(0, 200) + (text.length > 200 ? "..." : ""),
            resultContent: summary,
            language: language
        });
        await historyRecord.save();

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
    const userId = req.user._id;

    // Kiểm tra dữ liệu đầu vào
    if (!text || !targetLang || text.trim().length < 10) {
        return res.status(400).json({ error: "Missing or invalid text/targetLang." });
    }

    try {
        // Dịch văn bản trước
        const translation = await translateText(text, targetLang);

        // Tạo bản ghi lịch sử sau khi dịch thành công
        const historyRecord = new ContentHistory({
            userId: userId,
            actionType: "translate",
            contentType: "text",
            originalContent: text.substring(0, 200) + (text.length > 200 ? "..." : ""),
            resultContent: translation.substring(0, 200) + (translation.length > 200 ? "..." : ""), // Cắt ngắn nếu quá dài
            language: targetLang,
            createdAt: new Date(),
        });

        // Lưu lịch sử vào MongoDB
        await historyRecord.save();

        // Cập nhật số lượng bài dịch (nếu có model Visit)
        // Nếu không dùng Visit, bạn có thể bỏ đoạn này
        await Visit.findOneAndUpdate(
            {},
            { $inc: { translatedPosts: 1 } },
            { upsert: true, new: true }
        );

        // Trả kết quả về client
        res.json({ translation });
    } catch (error) {
        console.error("❌ Error in translate endpoint:", error.message);
        res.status(500).json({ error: `Error translating: ${error.message}` });
    }
});

// API to summarize a URL
app.post("/summarize-link", verifyToken, async (req, res) => {
    const { url, language = "English" } = req.body;
    const _id = req.user._id;
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

        const historyRecord = new ContentHistory({
            userId: _id,
            actionType: 'summarize',
            contentType: 'url',
            originalContent: content.substring(0, 200) + "...",
            resultContent: summary,
            url: url,
            language: language
        });
        await historyRecord.save();

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
        const _id = req.user._id;
        if (!req.file) return res.status(400).json({ error: "Không có file được tải lên." });

        filePath = req.file.path;
        const dataBuffer = await fs.readFile(filePath);
        const pdfResult = await pdfParse(dataBuffer);
        const filteredText = filterIrrelevantContent(pdfResult.text);
        if (!filteredText) return res.status(400).json({ error: "Không thể trích xuất nội dung." });

        const summary = await summarizeText(filteredText, "tiếng Việt");
        latestContent = { type: "pdf", content: filteredText, timestamp: Date.now() };
        cache.set("lastDocumentContent", filteredText, 600);

        const historyRecord = new ContentHistory({
            userId: _id,
            actionType: 'summarize',
            contentType: 'pdf',
            originalContent: filteredText.substring(0, 200) + "...",
            resultContent: summary,
            fileInfo: {
                name: req.file.originalname,
                size: req.file.size
            }
        });
        await historyRecord.save();

        res.json({ originalText: filteredText, summary });
    } catch (error) {
        console.error("❌ Error uploading PDF:", error.message);
        res.status(500).json({ error: `Error processing PDF: ${error.message}` });
    } finally {
        if (filePath) await fs.unlink(filePath).catch(err => console.error("Error deleting file:", err));
    }
});

// API to handle chat
app.post("/chat", verifyToken, chatLimiter, async (req, res) => {
    try {
        const { question, language = "English", detailLevel = "normal" } = req.body;
        const userId = req.user._id;

        // Kiểm tra câu hỏi
        if (!question || question.trim().length < 3) {
            return res.status(400).json({
                error: "Câu hỏi quá ngắn hoặc không hợp lệ",
                timestamp: new Date().toISOString(),
            });
        }

        // Kiểm tra nội dung gần nhất
        if (!latestContent || !latestContent.content || !latestContent.timestamp || !latestContent.type) {
            return res.status(400).json({
                error: "Vui lòng tải lên nội dung (text, PDF, hoặc link) trước khi đặt câu hỏi.",
                timestamp: new Date().toISOString(),
            });
        }

        // Tạo prompt dựa trên nội dung
        const lowerQuestion = question.toLowerCase();
        const createPrompt = () => {
            let prompt = `Bạn là trợ lý AI thông minh. Trả lời chi tiết bằng ${language}, độ chi tiết: ${detailLevel === "high" ? "rất cao" : "bình thường"}.\n\n`;
            prompt += `Nội dung: ${latestContent.content}\n\n`;
            if (lowerQuestion.includes("tóm tắt") || lowerQuestion.includes("summary")) {
                prompt += "Tóm tắt nội dung trên một cách chi tiết, bao gồm các ý chính và chi tiết quan trọng.";
            } else if (lowerQuestion.includes("dịch") || lowerQuestion.includes("translate")) {
                const targetLang = lowerQuestion.match(/dịch sang (.+)$/i)?.[1] || language;
                prompt += `Dịch nội dung sang ${targetLang}.`;
            } else {
                promptcloth += `Câu hỏi: ${question}\nHãy trả lời dựa trên nội dung trên, giải thích rõ ràng.`;
            }
            return prompt;
        };

        const prompt = createPrompt();
        const answer = await callGeminiAPI(prompt);
        const source = `${latestContent.type} vừa tải lên lúc ${new Date(latestContent.timestamp).toLocaleString()}`;

        // Lưu vào ContentHistory
        const historyRecord = new ContentHistory({
            userId,
            actionType: "chat",
            contentType: latestContent.type,
            originalContent: question.substring(0, 200) + (question.length > 200 ? "..." : ""),
            resultContent: answer.substring(0, 200) + (answer.length > 200 ? "..." : ""),
            source,
            language,
            createdAt: new Date(),
        });
        await historyRecord.save();

        // Lưu vào cache
        cache.set(`chat:${userId}:${Date.now()}`, { question, answer }, 3600);

        // Trả về response (không bao gồm lịch sử chat từ ChatHistory)
        res.json({
            question,
            answer,
            source,
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
app.delete("/api/content-history/:userId", verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const { timestamp } = req.body;

        if (req.user._id.toString() !== userId && req.user.role !== "admin") {
            return res.status(403).json({ status: "error", message: "Unauthorized access" });
        }

        if (!timestamp) {
            return res.status(400).json({ status: "error", message: "Timestamp is required" });
        }

        const result = await ContentHistory.updateOne(
            { userId },
            { $pull: { contents: { timestamp: new Date(timestamp) } } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ status: "error", message: "Item not found" });
        }


app.get("/api/history", verifyToken, async (req, res) => {
    try {
        const { page = 1, limit = 10, type } = req.query;
        const skip = (page - 1) * limit;
        
        const query = { userId: req.user._id };
        if (type) query.actionType = type;
        
        const history = await ContentHistory.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const total = await ContentHistory.countDocuments(query);
        
        res.json({
            success: true,
            data: history,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 

        res.json({ status: "success", message: "Item deleted successfully" });
    } catch (error) {
        console.error("Error deleting content history item:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
});
// API to get content history
// Sửa lại server routes (trong file server chính)
// Thêm prefix '/api' cho tất cả các routes API
app.get("/api/content-history/:userId", verifyToken, async (req, res) => {
    try {
        console.log(`Fetching content history for user: ${req.params.userId}`);

        // Kiểm tra quyền truy cập: Chỉ cho phép người dùng xem lịch sử của chính họ
        if (req.user._id !== req.params.userId) {
            return res.status(403).json({
                status: 'error',
                message: 'Unauthorized access'
            });
        }

        const history = await ContentHistory.findOne({ _id: req.params.userId });

        if (!history) {
            return res.status(200).json({
                status: 'success',
                message: 'No content history found',
                data: {
                    contents: [],
                    lastUpdated: null
                }
            });
        }

        res.json({
            status: 'success',
            data: {
                contents: history.contents, // Trả về trực tiếp contents
                lastUpdated: history.lastUpdated
            }
        });
    } catch (error) {
        console.error('Error fetching content history:', error);
        res.status(500).json({
            status: 'error',
            message: error.message

        });
    }
});

// API LẤY CHI TIẾT LỊCH SỬ
app.get("/api/history/:id", verifyToken, async (req, res) => {
    try {
        const record = await ContentHistory.findOne({
            _id: req.params.id,
            userId: req.user._id
        });
        

        if (!record) {
            return res.status(404).json({
                success: false,
                error: "Không tìm thấy bản ghi lịch sử"

        // Kiểm tra quyền truy cập: Chỉ cho phép người dùng xem lịch sử của chính họ
        if (req.user._id !== req.params.userId) {
            return res.status(403).json({ 
                status: 'error',
                message: 'Unauthorized access' 

            });
        }
        
        if (!history) {
            return res.status(200).json({
                status: 'success',
                message: 'No chat history found',
                data: {
                    messages: [],
                    lastUpdated: null
                }
            });
        }

        res.json({

            success: true,
            data: record

            status: 'success',
            data: {
                messages: history.messages, // Trả về trực tiếp messages
                lastUpdated: history.lastUpdated
            }

        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
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

