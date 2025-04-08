import React, { useState, useEffect, useRef } from "react";
import { Send, X, Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import api from "../api/api";

const ChatBox = ({ textSummarizerContent, linkPageContent, documentSummaryContent, loggedInUser }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const chatContainerRef = useRef(null);

    const shouldHideChatbox =
        location.pathname === "/login" ||
        location.pathname === "/register" ||
        location.pathname === "/aboutus" ||
        (location.pathname === "/" && !loggedInUser);

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    role: "bot",
                    content: "Hello! How can I assist you today?",
                },
            ]);
        }
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    if (shouldHideChatbox) {
        return null;
    }

    const handleSendMessage = async () => {
        const token = localStorage.getItem("token");
        if (!userInput.trim()) return;
        if (userInput.length > 500) {
            setError("Message too long (max 500 characters)");
            return;
        }

        const newMessage = { role: "user", content: userInput };
        setMessages(prev => [...prev, newMessage]);
        setUserInput("");
        setError("");
        setIsLoading(true);

        try {
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const response = await api.post("/chat", { question: userInput }, config);

            setMessages(prev => [
                ...prev,
                { 
                    role: "bot", 
                    content: response.data.answer,
                    source: response.data.source 
                }
            ]);
        } catch (error) {
            setError(error.response?.data?.error || "Failed to send message");
            console.error("Chat error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const clearMessages = () => {
        setMessages([
            {
                role: "bot",
                content: "Hello! Summarize text, provide a URL, or upload a PDF so I can assist you.",
            },
        ]);
        setError("");
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Nút mở Chat */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                    <svg
                        className="w-7 h-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                    </svg>
                </button>
            )}

            {/* Chat Box */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-xl w-80 sm:w-[400px] h-[550px] flex flex-col overflow-hidden border border-gray-100 transition-all duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center shadow-md">
                        <h3 className="text-lg font-semibold tracking-tight">AI Assistant</h3>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={clearMessages}
                                className="text-sm text-indigo-100 hover:text-white transition-colors underline underline-offset-2"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-indigo-100 hover:text-white p-1 rounded-full hover:bg-indigo-700 transition-all duration-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Nội dung Chat */}
                    <div
                        ref={chatContainerRef}
                        className="flex-1 p-4 bg-gray-50 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                    >
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-xl shadow-sm transition-all duration-200 ${
                                        message.role === "user"
                                            ? "bg-indigo-500 text-white"
                                            : "bg-white text-gray-800 border border-gray-200"
                                    }`}
                                >
                                    <p className="text-sm leading-relaxed">{message.content}</p>
                                    {message.source && (
                                        <span className="text-xs block mt-1 opacity-70 italic">
                                            Source: {message.source}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-600 p-3 rounded-xl shadow-sm flex items-center">
                                    <Loader2 className="w-5 h-5 animate-spin text-indigo-500 mr-2" />
                                    <span className="text-sm">Thinking...</span>
                                </div>
                            </div>
                        )}
                        {error && (
                            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-xl border border-red-200">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-200">
                        <div className="flex items-center gap-2">
                            <textarea
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything..."
                                className="flex-1 p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none text-sm placeholder-gray-400 transition-all duration-200"
                                rows="2"
                                maxLength={500}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading}
                                className={`p-2.5 rounded-full shadow-md transition-all duration-200 ${
                                    isLoading
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-indigo-500 text-white hover:bg-indigo-600"
                                }`}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBox;