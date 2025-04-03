const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.API_KEY}`;

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
            throw new Error(`Gemini API Error: ${error.message}`);
        }
    }
    throw new Error(`Failed to call Gemini API after ${retries} attempts`);
};

module.exports = { callGeminiAPI };