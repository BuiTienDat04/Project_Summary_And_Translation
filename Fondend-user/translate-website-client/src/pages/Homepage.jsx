import React, { useState } from "react";
import { FaUserCircle, FaInfoCircle, FaUpload, FaHistory } from "react-icons/fa";

const Homepage = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [uploadHistory, setUploadHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
    setSummary(""); // Reset summary for new file upload
  };

  const handleFileSubmit = () => {
    if (!file) {
      alert("Please upload a file first!");
      return;
    }
    setIsProcessing(true);

    // Simulate AI summary generation
    setTimeout(() => {
      const mockSummary = `This is a summary of the file "${file.name}". It demonstrates the power of AI in summarizing content.`;
      setSummary(mockSummary);

      // Update upload history
      setUploadHistory((prev) => [
        ...prev,
        { fileName: file.name, summary: mockSummary },
      ]);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">AI File Summarizer</h1>
        <div className="flex items-center space-x-6">
          <FaUserCircle className="text-3xl cursor-pointer" title="Login/Register" />
          <FaInfoCircle className="text-3xl cursor-pointer" title="Help" />
          <FaHistory className="text-3xl cursor-pointer" title="Upload History" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center bg-white shadow-lg rounded-lg p-8 mt-6 w-11/12 md:w-2/3 lg:w-1/2">
        <h2 className="text-xl font-bold mb-4">Upload Your File</h2>
        <p className="text-gray-600 mb-6 text-center">
          Upload a file (TXT, Word, PDF) and get an AI-generated summary instantly.
        </p>
        <div className="w-full flex flex-col items-center">
          <label className="bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 flex items-center">
            <FaUpload className="mr-2" />
            Choose File
            <input
              type="file"
              accept=".txt, .doc, .docx, .pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          {file && (
            <div className="text-sm text-gray-500 mt-4">
              <strong>Selected File:</strong> {file.name}
            </div>
          )}
          <button
            className={`bg-indigo-600 text-white px-6 py-3 rounded-lg mt-4 ${
              isProcessing ? "cursor-not-allowed bg-gray-400" : "hover:bg-indigo-700"
            }`}
            onClick={handleFileSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Upload and Summarize"}
          </button>
        </div>

        {/* AI Summary */}
        {summary && (
          <div className="mt-6 p-4 bg-gray-50 border-l-4 border-blue-500 rounded shadow-md w-full">
            <h3 className="font-bold text-lg">AI-Generated Summary:</h3>
            <p className="text-gray-700 mt-2">{summary}</p>
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
                <p className="text-sm text-gray-600">{entry.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default Homepage;
