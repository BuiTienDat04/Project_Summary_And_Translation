import React, { useState } from "react";
import { FaSignInAlt } from "react-icons/fa";

const TextSummarizer = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginPromptVisible, setLoginPromptVisible] = useState(false);

  const handleSummarize = async () => {
    if (!isLoggedIn) {
      setLoginPromptVisible(true);
      return;
    }

    if (!text) {
      alert("Vui lòng nhập văn bản để tóm tắt.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Lỗi khi tóm tắt văn bản:", error);
    }
  };

  // 🔹 Hàm xử lý khi bấm nút "Log In"
  const handleLoginClick = () => {
    window.location.href = "/login"; // Chuyển hướng đến trang đăng nhập
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Tóm Tắt Văn Bản</h2>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="5"
        placeholder="Nhập văn bản cần tóm tắt..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <button
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        onClick={handleSummarize}
      >
        Tóm Tắt
      </button>
      {summary && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Tóm tắt:</h3>
          <p className="text-gray-600">{summary}</p>
        </div>
      )}

      {/* Thông báo đăng nhập ở giữa trang */}
      {loginPromptVisible && (
        <div className="fixed inset-0 bg-indigo-200 bg-opacity-80 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto border-2 border-gray-100">
            <div className="text-center mb-6">
              <FaSignInAlt className="mx-auto h-12 w-12 text-blue-500 mb-2" />
              <h1 className="text-2xl font-bold text-gray-800">Please Log In</h1>
              <p className="text-gray-600">You need to log in to use this feature.</p>
            </div>
            <div className="mt-6">
              <button
                className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all"
                onClick={handleLoginClick}
              >
                Log In
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-600 text-center">
              Don't have an account?{" "}
              <button onClick={() => setLoginPromptVisible(false)} className="text-blue-500 hover:underline">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextSummarizer;
