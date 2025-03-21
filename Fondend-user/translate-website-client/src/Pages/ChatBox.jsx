import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, X } from "lucide-react";

const ChatBox = ({ textSummarizerContent, linkPageContent, documentSummaryContent, loggedInUser }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const chatContainerRef = useRef(null);

    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

    useEffect(() => {
        if (
            !textSummarizerContent &&
            !linkPageContent &&
            !documentSummaryContent &&
            messages.length === 0
        ) {
            setMessages([
                {
                    role: "bot",
                    content:
                        "Chào bạn! Hãy tóm tắt văn bản, URL hoặc tải lên PDF trước để tôi có thể trả lời câu hỏi của bạn.",
                },
            ]);
        }
    }, [textSummarizerContent, linkPageContent, documentSummaryContent]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;
        if (userInput.length > 500) {
            setError("Câu hỏi quá dài, vui lòng giữ dưới 500 ký tự.");
            return;
        }

        const newMessage = { role: "user", content: userInput };
        setMessages((prev) => [...prev, newMessage]);
        setUserInput("");
        setError("");
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/chat`, {
                question: userInput,
                context: {
                    textSummarizerContent,
                    linkPageContent,
                    documentSummaryContent,
                },
            });

            const { answer, source } = response.data;
            setMessages((prev) => [...prev, { role: "bot", content: answer, source }]);
        } catch (error) {
            setError(error.response?.data?.error || "Error sending message. Please try again.");
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
        setMessages([]);
        setError("");
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
                >
                    <svg
                        className="w-6 h-6"
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

            {isOpen && (
                <div className="bg-white rounded-lg shadow-xl w-80 sm:w-96 h-[500px] flex flex-col">
                    <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Chat with AI</h3>
                        <div>
                            <button
                                onClick={clearMessages}
                                className="text-white hover:text-gray-200 mr-2"
                            >
                                Clear
                            </button>
                            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto bg-gray-50">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`mb-3 flex ${
                                    message.role === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg ${
                                        message.role === "user"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                    {message.content}
                                    {message.source && (
                                        <span className="text-xs text-gray-500 block mt-1">
                                            (Nguồn: {message.source})
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start mb-3">
                                <div className="bg-gray-200 text-gray-800 p-3 rounded-lg">
                                    <svg
                                        className="animate-spin h-5 w-5 text-gray-600 inline-block"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                    </svg>
                                    <span className="ml-2">Thinking...</span>
                                </div>
                            </div>
                        )}
                        {error && <div className="text-red-500 text-center mb-3">{error}</div>}
                    </div>

                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                            <textarea
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your question..."
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                rows="2"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading}
                                className={`p-2 rounded-full ${
                                    isLoading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                } text-white transition-all duration-300`}
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