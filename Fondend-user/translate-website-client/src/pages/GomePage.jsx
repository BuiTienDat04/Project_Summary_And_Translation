import { useState } from "react";
import Button from "../components/ui/Button";
import Textarea from "../components/ui/Textarea";
import { Upload, Trash } from "lucide-react";

export default function ResoomerClone() {
  const [text, setText] = useState(""); // Lưu nội dung văn bản
  const [uploadedFileName, setUploadedFileName] = useState(""); // Lưu tên file
  const [summary, setSummary] = useState(""); // Lưu kết quả tóm tắt

  // Xử lý khi tải file lên
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFileName(file.name); // Hiển thị tên file

    const reader = new FileReader();
    reader.onload = (e) => setText(e.target.result); // Lưu nội dung file vào text
    reader.readAsText(file);
  };

  // Xóa nội dung + file tải lên
  const handleClear = () => {
    setText("");
    setUploadedFileName("");
    setSummary("");
  };

  // Xử lý tóm tắt nội dung (chỉ lấy 100 ký tự làm demo)
  const handleSummarize = () => {
    if (text.trim() === "") return;
    setSummary(text.slice(0, 100) + (text.length > 100 ? "..." : ""));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-lg p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <span className="text-black">RES</span>
          <span className="text-red-500">OOMER</span>
        </h1>
      </header>

      {/* Nội dung chính */}
      <main className="container mx-auto p-8 text-center mt-10">
        <h2 className="text-4xl font-semibold">
          Kiến thức được đơn giản hóa và tóm lược, <span className="text-red-500">năng suất</span> được nâng cao
        </h2>

        <div className="flex flex-col md:flex-row gap-8 mt-10 justify-center">
          {/* Nhập văn bản + Upload */}
          <div className="bg-white p-8 shadow-lg rounded-lg w-full md:w-3/5">
            <div className="flex justify-between mb-4">
              <label className="cursor-pointer text-gray-500 hover:text-black flex items-center">
                <Upload size={24} />
                <input type="file" accept=".txt,.pdf,.docx" className="hidden" onChange={handleFileUpload} />
              </label>

              <button className="text-gray-500 hover:text-black" onClick={handleClear}>
                <Trash size={24} />
              </button>
            </div>

            {/* Hiển thị tên file tải lên */}
            {uploadedFileName && (
              <p className="text-sm text-gray-500 italic mb-2">📄 {uploadedFileName}</p>
            )}

            {/* Textarea nhập nội dung */}
            <Textarea
              className="w-full h-64 p-4 border border-gray-300 rounded-md resize-none text-lg"
              placeholder="Nhập văn bản hoặc tải file lên..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <Button 
              className="w-full mt-6 bg-red-500 text-white text-lg py-3 rounded-lg hover:bg-red-600 transition-all"
              onClick={handleSummarize}
            >
              Resoomer
            </Button>
          </div>

          {/* Kết quả tóm tắt */}
          <div className="bg-white p-8 shadow-lg rounded-lg w-full md:w-3/5 min-h-[250px]">
            {summary ? <p className="text-gray-700">{summary}</p> : <p className="text-gray-500 italic">Kết quả tóm tắt sẽ hiển thị tại đây...</p>}
          </div>
        </div>
      </main>
    </div>
  );
}
