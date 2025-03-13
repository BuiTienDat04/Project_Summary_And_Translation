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
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 5001;
const API_KEY = process.env.API_KEY;

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const summaryRoutes = require("./routes/summary");
const uploadRoutes = require("./routes/upload");
const userRoutes = require("./routes/userRoutes"); // Ensure correct import

const app = express();

// =================== 🔹 MIDDLEWARE 🔹 ===================
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Rate limiting for the general API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests, please try again later.",
});
app.use(limiter);

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

// =================== 🔹 FILE UPLOAD & API CONFIGURATION 🔹 ===================

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    console.error("❌ API_KEY not provided in .env file");
    process.exit(1);
}

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

// Multer Configuration for PDF file uploads
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"), false);
    }
  },
});

// Error handler for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: "File too large or upload error." });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

// Clean text function (remove special characters)
const cleanText = (text) => {

    return text
        .replace(/[^\w\s.,!?]/g, " ") // Loại bỏ ký tự đặc biệt
        .replace(/\s+/g, " ") // Thay nhiều khoảng trắng bằng một
        .trim();
};

// Filter irrelevant content in PDF
const filterIrrelevantContent = (text) => {
  const lines = text.split("\n");
  const filteredLines = lines.filter((line) => {
    const trimmedLine = line.trim();
    return (
        trimmedLine.length > 0 &&
      !trimmedLine.match(/^\d+$/) && // Remove lines with only numbers
      !trimmedLine.match(/^(http|www)/i) && // Remove URLs
      !trimmedLine.match(/^\s*[-–—]\s*$/) // Remove lines with just hyphens
    );
  });
  return filteredLines.join("\n").trim();
};

// Call Gemini API (summarization/translation)
const callGeminiAPI = async (prompt, type = "text") => {
  const requestId = Date.now(); // Unique identifier
  const cacheKey = `${type}_${requestId}_${prompt}`; // Ensure cacheKey is unique
  console.log(`Cache key for ${type}: ${cacheKey}`);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }], // Content for API request
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

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "🚀 API is running!" });
});

// =================== 🔹 POST API ENDPOINTS 🔹 ===================

// Summarize Text API
app.post("/summarize", async (req, res) => {
  const { text, language } = req.body;
  if (!text || typeof text !== "string" || text.trim().length < 10) {
    return res.status(400).json({ error: "Invalid or too short text." });
  }

  try {
    const cleanedText = cleanText(text);
    const prompt = `Summarize the following text in ${language || "English"}:\n\n${cleanedText}`;
    const result = await callGeminiAPI(prompt, "text");
    res.json({ summary: result });
  } catch (error) {
    console.error("Error in summarizing text:", error.message);
    res.status(500).json({ error: `Error summarizing text: ${error.message}` });
  }
});

// Translate Text API
app.post("/translate", async (req, res) => {
  const { text, targetLang } = req.body;
  if (!text || !targetLang || typeof text !== "string" || text.trim().length < 10) {
    return res.status(400).json({ error: "Missing or invalid text/targetLang." });
  }

  try {
    const cleanedText = cleanText(text);
    const prompt = `Translate the following text to ${targetLang}:\n\n${cleanedText}`;
    const result = await callGeminiAPI(prompt, "text");
    res.json({ translation: result });
  } catch (error) {
    console.error("Error in translating text:", error.message);
    res.status(500).json({ error: `Error translating text: ${error.message}` });
  }
});
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

// PDF Upload API
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
    try {
        const summary = await summarizeText(text, language || "tiếng Việt", "text");
        res.json({ summary });
    } catch (error) {
        console.error("Lỗi khi tóm tắt (text):", error.message);
        res.status(500).json({ error: `Lỗi khi tóm tắt văn bản: ${error.message}` });
    }
});

    const filteredText = filterIrrelevantContent(rawText);
    if (!filteredText) {
      return res.status(400).json({ error: "Cannot extract meaningful content from PDF." });
    }

    const maxTextLength = 10000;
    const truncatedContent = filteredText.length > maxTextLength
      ? filteredText.substring(0, maxTextLength) + "... [Content truncated]"
      : filteredText;

    const summary = await callGeminiAPI(truncatedContent, "document");

    res.json({
      originalText: truncatedContent,
      summary,
    });
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
    try {
        const translation = await translateText(text, targetLang, "text");
        res.json({ translation });
    } catch (error) {
        console.error("Lỗi khi dịch:", error.message);
        res.status(500).json({ error: `Lỗi khi dịch văn bản: ${error.message}` });
    }
  }
});

// =================== 🔹 GLOBAL ERROR HANDLING 🔹 ===================
app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
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

// =================== 🔹 SERVER START 🔹 ===================
connectDB().then(() => {
  const PORT = process.env.PORT || 5001; // Port 5001
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});