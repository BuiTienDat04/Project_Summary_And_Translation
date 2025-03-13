require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs").promises;
const path = require("path");
const pdfParse = require("pdf-parse");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 5001;
const API_KEY = process.env.API_KEY;

// Kiểm tra API_KEY
if (!API_KEY) {
    console.error("❌ API_KEY không được cung cấp trong file .env");
    process.exit(1);
}

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Khởi tạo cache
const cache = new NodeCache({ stdTTL: 600 }); // Cache 10 phút

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100, // Giới hạn 100 request mỗi IP
});
app.use(limiter);

// Cấu hình multer
const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Chỉ hỗ trợ file PDF!"), false);
        }
    },
});

// Middleware xử lý lỗi multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "File quá lớn hoặc lỗi upload." });
    } else if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
});

// Hàm làm sạch văn bản
const cleanText = (text) => {
    return text
        .replace(/[^\w\s.,!?]/g, " ") // Loại bỏ ký tự đặc biệt
        .replace(/\s+/g, " ") // Thay nhiều khoảng trắng bằng một
        .trim();
};

// Hàm lọc nội dung không liên quan từ PDF
const filterIrrelevantContent = (text) => {
    const lines = text.split("\n");
    const filteredLines = lines.filter((line) => {
        const trimmedLine = line.trim();
        return (
            trimmedLine.length > 0 &&
            !trimmedLine.match(/^\d+$/) && // Bỏ dòng chỉ có số
            !trimmedLine.match(/^(http|www)/i) && // Bỏ URL
            !trimmedLine.match(/^\s*[-–—]\s*$/) // Bỏ dòng chỉ có gạch ngang
        );
    });
    return filteredLines.join("\n").trim();
};

// Hàm gọi API Gemini với type để phân biệt document/text
const callGeminiAPI = async (prompt, type = "text") => {
    const requestId = Date.now(); // Thêm timestamp làm unique identifier
    const cacheKey = `${type}_${requestId}_${prompt}`; // Đảm bảo cacheKey luôn khác biệt
    console.log(`Cache key for ${type}: ${cacheKey}`);

    // Không dùng cache cho các request khác nhau
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
            throw new Error(errorData.error?.message || "Lỗi từ API Gemini.");
        }

        const data = await response.json();
        const result = data.candidates[0]?.content?.parts[0]?.text;
        if (!result) throw new Error("Không nhận được kết quả từ API Gemini.");

        console.log(`API response for ${type}: ${result}`);
        cache.set(cacheKey, result);
        return result;
    } catch (error) {
        throw new Error(`Lỗi khi gọi API Gemini: ${error.message}`);
    }
};

// Hàm tóm tắt văn bản
const summarizeText = async (text, lang = "tiếng Việt", type = "text") => {
    const cleanedText = cleanText(text);
    const prompt = `Summarize the following text in ${lang}, in 3-5 sentences:\n\n${cleanedText}`;
    const result = await callGeminiAPI(prompt, type);
    return result; // Trả về kết quả thuần túy, không thêm tiền tố
};

// Hàm dịch văn bản
const translateText = async (text, targetLang, type = "text") => {
    const cleanedText = cleanText(text);
    const prompt = `Translate the following text to ${targetLang}:\n\n${cleanedText}`;
    const result = await callGeminiAPI(prompt, type);
    return result; // Không thêm tiền tố cho dịch
};

// API tóm tắt văn bản
app.post("/summarize", async (req, res) => {
    const { text, language } = req.body;
    if (!text || typeof text !== "string" || text.trim().length < 10) {
        return res.status(400).json({ error: "Văn bản không hợp lệ hoặc quá ngắn." });
    }

    try {
        const summary = await summarizeText(text, language || "tiếng Việt", "text");
        res.json({ summary });
    } catch (error) {
        console.error("Lỗi khi tóm tắt (text):", error.message);
        res.status(500).json({ error: `Lỗi khi tóm tắt văn bản: ${error.message}` });
    }
});

// API dịch văn bản
app.post("/translate", async (req, res) => {
    const { text, targetLang } = req.body;
    if (!text || !targetLang || typeof text !== "string" || text.trim().length < 10) {
        return res.status(400).json({ error: "Thiếu hoặc không hợp lệ text/targetLang." });
    }

    try {
        const translation = await translateText(text, targetLang, "text");
        res.json({ translation });
    } catch (error) {
        console.error("Lỗi khi dịch:", error.message);
        res.status(500).json({ error: `Lỗi khi dịch văn bản: ${error.message}` });
    }
});

// API upload file PDF
app.post("/upload", upload.single("file"), async (req, res) => {
    let filePath;
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Không có file được tải lên." });
        }
        filePath = req.file.path;

        const dataBuffer = await fs.readFile(filePath);
        const pdfResult = await pdfParse(dataBuffer);
        let rawText = pdfResult.text;

        const filteredText = filterIrrelevantContent(rawText);
        if (!filteredText) {
            return res.status(400).json({ error: "Không thể trích xuất nội dung có ý nghĩa từ PDF." });
        }

        const maxTextLength = 10000;
        const truncatedContent = filteredText.length > maxTextLength
            ? filteredText.substring(0, maxTextLength) + "... [Đã cắt ngắn]"
            : filteredText;

        const summary = await summarizeText(truncatedContent, "tiếng Việt", "document");

        res.json({
            originalText: truncatedContent,
            summary,
        });
    } catch (error) {
        console.error("Lỗi khi xử lý file (document):", error.message);
        res.status(500).json({ error: `Lỗi khi xử lý file: ${error.message}` });
    } finally {
        if (filePath) {
            try {
                await fs.unlink(filePath);
            } catch (err) {
                console.error("Lỗi khi xóa file tạm:", err.message);
            }
        }
    }
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`✅ Server đang chạy trên http://localhost:${PORT}`);
});