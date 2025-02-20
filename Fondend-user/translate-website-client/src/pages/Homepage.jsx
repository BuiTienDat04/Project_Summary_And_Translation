import React, { useState } from "react";
import { FaUserCircle, FaInfoCircle, FaUpload, FaHistory } from "react-icons/fa";

const Homepage = () => {
  const [file, setFile] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [summary, setSummary] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [uploadHistory, setUploadHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Xử lý tải file lên
  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
    setSummary("");
    setTranslatedText("");
    setErrorMessage("");
  };

  // Xử lý nhập văn bản
  const handleTextInputChange = (e) => {
    setTextInput(e.target.value);
    setSummary("");
    setTranslatedText("");
    setErrorMessage("");
  };

  // Xử lý gửi nội dung để tóm tắt & dịch
  const handleSubmit = async () => {
    if (!file && !textInput.trim()) {
      setErrorMessage("Vui lòng tải lên một file hoặc nhập văn bản!");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const inputText = textInput.trim() || file.name;

      // 🚀 Gửi yêu cầu tóm tắt
      const summarizeResponse = await fetch("http://localhost:3000/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!summarizeResponse.ok) {
        throw new Error("Lỗi khi tóm tắt nội dung!");
      }

      const summarizeData = await summarizeResponse.json();
      const summaryText = summarizeData.summary || "Không thể tóm tắt nội dung.";

      // 🚀 Gửi nội dung đã tóm tắt để dịch
      const translateResponse = await fetch("http://localhost:3000/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: summaryText, targetLang: "EnglishEnglish" }),
      });

      if (!translateResponse.ok) {
        throw new Error("Lỗi khi dịch nội dung!");
      }

      const translateData = await translateResponse.json();
      const translatedText = translateData.translation || "Không thể dịch nội dung.";

      // Cập nhật giao diện
      setSummary(summaryText);
      setTranslatedText(translatedText);

      // Cập nhật lịch sử
      setUploadHistory((prev) => [
        ...prev,
        { fileName: file ? file.name : "Nhập văn bản", summary: summaryText, translation: translatedText },
      ]);
    } catch (error) {
      setErrorMessage(error.message || "Lỗi không xác định xảy ra!");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">AI File Summarizer & Translator</h1>
        <div className="flex items-center space-x-6">
          <FaUserCircle className="text-3xl cursor-pointer" title="Login/Register" />
          <FaInfoCircle className="text-3xl cursor-pointer" title="Help" />
          <FaHistory className="text-3xl cursor-pointer" title="Upload History" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center bg-white shadow-lg rounded-lg p-8 mt-6 w-11/12 md:w-2/3 lg:w-1/2">
        <h2 className="text-xl font-bold mb-4">Upload or Enter Text</h2>
        <p className="text-gray-600 mb-6 text-center">
          Upload a file (TXT, Word, PDF) or enter text manually to get an AI-generated summary and translation.
        </p>

        {/* Text Input */}
        <textarea
          className="w-full border p-3 rounded-lg focus:ring focus:ring-blue-300"
          placeholder="Nhập văn bản vào đây..."
          rows="4"
          value={textInput}
          onChange={handleTextInputChange}
        ></textarea>

        {/* File Upload */}
        <div className="w-full flex flex-col items-center mt-4">
          <label className="bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600 flex items-center">
            <FaUpload className="mr-2" />
            Choose File
            <input type="file" accept=".txt, .doc, .docx, .pdf" className="hidden" onChange={handleFileUpload} />
          </label>
          {file && <div className="text-sm text-gray-500 mt-2"><strong>Selected File:</strong> {file.name}</div>}
        </div>

        {/* Submit Button */}
        <button
          className={`bg-indigo-600 text-white px-6 py-3 rounded-lg mt-4 ${isProcessing ? "cursor-not-allowed bg-gray-400" : "hover:bg-indigo-700"}`}
          onClick={handleSubmit}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Summarize & Translate"}
        </button>

        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-600 mt-4">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}

        {/* AI Summary */}
        {summary && (
          <div className="mt-6 p-4 bg-gray-50 border-l-4 border-blue-500 rounded shadow-md w-full">
            <h3 className="font-bold text-lg">AI-Generated Summary:</h3>
            <p className="text-gray-700 mt-2">{summary}</p>
          </div>
        )}

        {/* Translated Text */}
        {translatedText && (
          <div className="mt-4 p-4 bg-gray-50 border-l-4 border-green-500 rounded shadow-md w-full">
            <h3 className="font-bold text-lg">Translated Summary:</h3>
            <p className="text-gray-700 mt-2">{translatedText}</p>
          </div>
        )}
      </main>

      {/* Upload History */}
      {uploadHistory.length > 0 && (
        <section className="mt-8 w-11/12 md:w-2/3 lg:w-1/2 bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Upload History</h3>
          <ul className="space-y-4">
            {uploadHistory.map((entry, index) => (
              <li key={index} className="border-b pb-2">
                <p className="font-semibold">{entry.fileName}</p>
                <p className="text-sm text-gray-600"><strong>Summary:</strong> {entry.summary}</p>
                <p className="text-sm text-gray-600"><strong>Translation:</strong> {entry.translation}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default Homepage;
