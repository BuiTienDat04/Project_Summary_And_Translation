const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const API_KEY = "AIzaSyCTwJTqJLjqYyltBf9HLWKV9M73srnsHv0";

// ✅ DÙNG MODEL ĐÚNG: gemini-2.5-pro
const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=AIzaSyCTwJTqJLjqYyltBf9HLWKV9M73srnsHv0";


async function testAPI() {
    console.log("Đang test Gemini 2.5 Pro (phiên bản ổn định 2025)...");
    console.log("API_URL:", API_URL);
    console.log("---");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: "Xin chào! Hôm nay bạn thế nào?" }]
                    }
                ]
            })
        });

        console.log("STATUS CODE:", response.status);

        if (response.ok) {
            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            console.log("THÀNH CÔNG 100%!");
            console.log("Gemini trả lời:");
            console.log(reply || "Không có nội dung");
        } else {
            const errorText = await response.text();
            console.log("LỖI:");
            console.log(errorText);
        }
    } catch (error) {
        console.log("LỖI MẠNG:");
        console.log(error.message);
    }
}

testAPI();
