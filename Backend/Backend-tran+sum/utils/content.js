const cleanText = (text) => text.replace(/[^\w\s.,!?;:'"()-]/g, " ").replace(/\s+/g, " ").trim();

const filterIrrelevantContent = (text) => {
    const adKeywords = ["ad", "sponsored", "advertisement", "promotion", "brought to you by"];
    return text.split("\n")
        .filter(line => !/^\s*$/.test(line) && !adKeywords.some(keyword => line.toLowerCase().includes(keyword)) && line.length > 10)
        .join("\n").trim();
};

const summarizeText = async (text, lang = "English", callGeminiAPI) => {
    const prompt = `Summarize the following text in ${lang}. Provide a detailed summary that captures the main ideas, key points, and important details in at least 150-300 words, ensuring the summary is concise yet comprehensive:\n\n${cleanText(text)}`;
    return callGeminiAPI(prompt);
};

const translateText = async (text, targetLang, callGeminiAPI) => {
    return callGeminiAPI(`Translate to ${targetLang}:\n\n${cleanText(text)}`);
};

module.exports = { cleanText, filterIrrelevantContent, summarizeText, translateText };