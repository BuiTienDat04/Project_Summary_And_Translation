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
const visitCountObj = { visitCount: 0 };

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

// ✅ Biến theo dõi nội dung mới nhất
let latestContent = {
    type: null, // "text", "pdf", hoặc "link"
    content: null,
    timestamp: null
};

// =================== 🔹 MIDDLEWARE 🔹 ===================
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

// Xử lý Preflight request (OPTIONS)
app.options("*", cors());

app.use(helmet());
app.use(morgan("combined"));
app.use(cookieParser());
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

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
    return text
        .replace(/[^\w\s.,!?;:'"()-]/g, " ") // Giữ lại ký tự cần thiết
        .replace(/\s+/g, " ") // Chuẩn hóa khoảng trắng
        .trim();
};

const filterIrrelevantContent = (text) => {
    const adKeywords = ["ad", "sponsored", "advertisement", "promotion", "brought to you by"];

    return text
        .split("\n")
        .filter((line) => {
            return (
                !/^\s*$/.test(line) && // Bỏ dòng trống
                !adKeywords.some((keyword) => line.toLowerCase().includes(keyword)) && // Loại quảng cáo
                line.length > 10 // Bỏ nội dung quá ngắn (thường là tiêu đề quảng cáo)
            );
        })
        .join("\n")
        .trim();
};

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
                    await new Promise((resolve) => setTimeout(resolve, delay));
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
                await new Promise((resolve) => setTimeout(resolve, delay));
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

// ✅ API lấy số lượng người dùng online
app.get("/api/visitCount", (req, res) => res.status(200).json({ visitCount: 0 }));

app.use("/auth", authRoutes);

// ✅ API to summarize text
app.post("/summarize", async (req, res) => {
    const { text, language } = req.body;
    if (!text || text.trim().length < 10) {
        return res.status(400).json({ error: "Text is too short or invalid." });
    }

    try {
        const summary = await summarizeText(text, language || "English");
        cache.set("lastTextSummarizerContent", summary, 600);
        latestContent = {
            type: "text",
            content: text, // Lưu nội dung gốc
            timestamp: Date.now()
        };
        await Visit.findOneAndUpdate(
            {},
            { $inc: { translatedPosts: 1 } },
            { upsert: true, new: true }
        );
        res.json({ summary });
    } catch (error) {
        console.error("❌ Error summarizing text:", error.message);
        res.status(500).json({ error: `Error summarizing: ${error.message}` });
    }
});

app.post("/translate", async (req, res) => {
    const { text, targetLang } = req.body;
    if (!text || !targetLang || text.trim().length < 10) {
        return res.status(400).json({ error: "Missing or invalid text/targetLang." });
    }

    try {
        const nameRegex = /\[(.*?)\]/g;
        const names = {};
        let processedText = text;
        let match;
        let index = 0;

        console.log("Received text:", text); // Kiểm tra văn bản nhận được

        while ((match = nameRegex.exec(text)) !== null) {
            const placeholder = `__NAME_${index++}__`;
            names[placeholder] = match[1];
            processedText = processedText.replace(match[0], placeholder);
        }
        console.log("Processed text (before translation):", processedText); // Văn bản sau khi thay thế
        console.log("Names to restore:", names); // Các tên sẽ khôi phục

        let translation = await translateText(processedText, targetLang);
        console.log("Translated text (before restoring):", translation); // Văn bản sau khi dịch

        for (const [placeholder, name] of Object.entries(names)) {
            translation = translation.replace(placeholder, name);
        }
        console.log("Final translation:", translation); // Văn bản cuối cùng

        res.json({ translation });
    } catch (error) {
        console.error("Translation error:", error);
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

    const cacheKey = `summarize-link:${url}:${language || "English"}`;
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
            summary = await summarizeText(content, language || "English");
            console.log(`Generated summary (first 200 chars): ${summary.slice(0, 200)}...`);
        }

        latestContent = {
            type: "link",
            content: content, // Lưu nội dung gốc
            timestamp: Date.now()
        };
        cache.set("lastLinkPageContent", summary, 600);

        await Visit.findOneAndUpdate(
            {},
            { $inc: { translatedPosts: 1 } },
            { upsert: true, new: true }
        );

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

// ✅ API to upload and summarize PDF
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
        cache.set("lastDocumentContent", filteredText, 600);
        latestContent = {
            type: "pdf",
            content: filteredText, // Lưu nội dung gốc
            timestamp: Date.now()
        };

        res.json({ originalText: filteredText, summary });
    } catch (error) {
        console.error("❌ Error uploading PDF:", error.message);
        res.status(500).json({ error: `Error processing PDF: ${error.message}` });
    } finally {
        if (filePath) await fs.unlink(filePath).catch((err) => console.error("Error deleting file:", err));
    }
});

// ✅ Health Check
app.get("/", (req, res) => res.status(200).json({ message: "🚀 API is running!" }));

// ✅ API to handle chat
app.post("/chat", async (req, res) => {
    try {
        const { question } = req.body;
        console.log("Câu hỏi nhận được:", question);

        if (!question || question.trim().length < 3) {
            return res.status(400).json({
                error: "Câu hỏi quá ngắn hoặc không hợp lệ",
                timestamp: new Date().toISOString(),
            });
        }

        const lowerQuestion = question.toLowerCase();

        // Kiểm tra xem có nội dung mới nhất không
        if (!latestContent.content || !latestContent.timestamp) {
            return res.status(400).json({
                error: "Vui lòng tải lên nội dung (text, PDF, hoặc link) trước khi đặt câu hỏi.",
                timestamp: new Date().toISOString(),
            });
        }

        // Hàm tạo prompt
        const createPrompt = (content, question) => {
            if (lowerQuestion.includes("tóm tắt") || lowerQuestion.includes("summary")) {
                return `Tóm tắt nội dung sau một cách ngắn gọn và chính xác:\n\n${content}`;
            } else if (lowerQuestion.includes("dịch") || lowerQuestion.includes("translate")) {
                const targetLang = lowerQuestion.match(/dịch sang (.+)$/i)?.[1] || "English";
                return `Dịch nội dung sau sang ${targetLang}:\n\n${content}`;
            }
            return `Dựa vào nội dung sau để trả lời câu hỏi một cách ngắn gọn và chính xác:\n\n${content}\n\nCâu hỏi: ${question}`;
        };

        // Trả lời dựa trên nội dung mới nhất
        const answer = await callGeminiAPI(createPrompt(latestContent.content, question));
        const source = `${latestContent.type} vừa tải lên lúc ${new Date(latestContent.timestamp).toLocaleString()}`;

        // Lưu vào cache
        cache.set(`chat:${Date.now()}`, { question, answer }, 3600);

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

app.get("/last-content", (req, res) => {
    res.json({
        lastContent: latestContent.content,
        type: latestContent.type,
        timestamp: latestContent.timestamp ? new Date(latestContent.timestamp).toISOString() : null,
        status: "success",
    });
});

// ✅ Kết nối MongoDB
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

// ✅ Start server
connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});

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

        // Các từ khóa và class thường liên quan đến quảng cáo hoặc nội dung không cần thiết
        const irrelevantKeywords = [
            "ad", "advertisement", "sponsored", "promo", "promotion",
            "banner", "popup", "widget", "sidebar", "footer", "nav",
            "newsletter", "subscribe", "login", "signup"
        ];

        // Lọc các thẻ có khả năng chứa nội dung chính
        const contentElements = $(
            "p, h1, h2, h3, h4, h5, h6, article, section, div"
        ).filter((_, el) => {
            const $el = $(el);
            const content = $el.text().trim();
            const tagName = el.tagName.toLowerCase();
            const className = ($el.attr("class") || "").toLowerCase();
            const idName = ($el.attr("id") || "").toLowerCase();

            // Loại bỏ nếu:
            // 1. Nội dung quá ngắn (< 10 ký tự)
            // 2. Là thẻ script/style
            // 3. Có class/id liên quan đến quảng cáo hoặc nội dung không mong muốn
            // 4. Là menu, footer, header
            if (
                !content || content.length < 10 ||
                ["script", "style"].includes(tagName) ||
                irrelevantKeywords.some(keyword =>
                    className.includes(keyword) || idName.includes(keyword) || content.toLowerCase().includes(keyword)
                ) ||
                $el.parents("header, nav, footer, aside").length > 0
            ) {
                return false;
            }

            // Ưu tiên các đoạn văn dài hoặc tiêu đề
            return content.length > 20 || ["h1", "h2", "h3", "article"].includes(tagName);
        });

        // Trích xuất nội dung từ các phần tử đã lọc
        contentElements.each((_, element) => {
            const content = $(element).text().trim();
            if (content) {
                text += content + "\n";
            }
        });

        // Nếu không tìm thấy nội dung chính, thử lấy từ body nhưng vẫn lọc
        if (!text.trim()) {
            console.warn(`Không tìm thấy nội dung cụ thể trên ${url}, lấy toàn bộ text từ body với bộ lọc.`);
            text = $("body").contents()
                .filter((_, el) => {
                    const $el = $(el);
                    const content = $el.text().trim();
                    const className = ($el.attr("class") || "").toLowerCase();
                    const idName = ($el.attr("id") || "").toLowerCase();

                    return (
                        content && content.length > 20 &&
                        !irrelevantKeywords.some(keyword =>
                            className.includes(keyword) || idName.includes(keyword) || content.toLowerCase().includes(keyword)
                        ) &&
                        !$el.is("script, style, header, nav, footer, aside")
                    );
                })
                .text()
                .trim();
        }

        // Nếu vẫn không có nội dung
        if (!text.trim()) {
            console.warn(`Không có nội dung text nào trên ${url}.`);
            text = "Trang web này không chứa nội dung text có thể tóm tắt (có thể chủ yếu là hình ảnh hoặc video).";
        }

        // Chuẩn hóa văn bản
        text = filterIrrelevantContent(text); // Áp dụng hàm lọc đã có
        text = text.replace(/\n+/g, "\n").trim();
        console.log(`Extracted content length: ${text.length} characters`);

        // Giới hạn độ dài để tránh vượt quá khả năng xử lý của API
        const MAX_CONTENT_LENGTH = 50000;
        if (text.length > MAX_CONTENT_LENGTH) {
            text = text.substring(0, MAX_CONTENT_LENGTH);
            console.log(`Content truncated to ${MAX_CONTENT_LENGTH} characters for Gemini API.`);
        }

        return text;
    } catch (error) {
        console.error(`Lỗi khi tải nội dung từ ${url}:`, error.message);
        throw new Error(`Lỗi lấy nội dung: ${error.message}`);
    }
}

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