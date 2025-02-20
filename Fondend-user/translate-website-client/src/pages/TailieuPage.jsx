import React, { useState } from "react";
import { HelpCircle, Upload, Menu, X, Download } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation hook
import { FaFileAlt, FaUserPlus, FaEnvelope, FaLock, FaPhone, FaCalendarAlt, FaSignInAlt, FaUser, FaCheckCircle, FaSmile, FaSignOutAlt } from "react-icons/fa";

const TailieuPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to get location object
  const usernameFromTextpage = location.state?.username; // Access username from state, using optional chaining in case state is undefined

  const [file, setFile] = useState(null);
  const [summaryType, setSummaryType] = useState("short");
  const [dragActive, setDragActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [summaryContent, setSummaryContent] = useState("");
  const [summaryFile, setSummaryFile] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  // State variables cho form đăng ký
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegisterFormVisible, setIsRegisterFormVisible] = useState(false); // State variable cho form đăng ký
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State variable cho popup


  // State variables cho form đăng nhập
  const [loginEmail, setLoginEmail] = useState('') // Changed from loginUsername to loginEmail 
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false); // State variable cho form đăng nhập
  const [loginWelcomeMessageVisible, setLoginWelcomeMessageVisible] = useState(false); // State for welcome message popup
  const [loggedInUsername, setLoggedInUsername] = useState(null); // State to store logged-in username


  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    generateSummary(uploadedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    if (event.dataTransfer.files.length) {
      const droppedFile = event.dataTransfer.files[0];
      setFile(droppedFile);
      generateSummary(droppedFile);
    }
  };

  const generateSummary = (file) => {
    // Placeholder for actual summary generation logic - More detailed and structured placeholder summary
    const summary = `Tóm tắt tài liệu: ${file.name}\n\nChào mừng bạn đến với bản tóm tắt tài liệu được tạo bởi PDFSmart AI! Công cụ của chúng tôi đã phân tích tài liệu bạn cung cấp và tạo ra bản tóm tắt này để giúp bạn nắm bắt những thông tin chính một cách nhanh chóng.\n
    \nĐây là bản tóm tắt thử nghiệm.** Trong phiên bản thực tế, PDFSmart AI sẽ sử dụng các mô hình ngôn ngữ tự nhiên tiên tiến nhất để:\n
    \n**1. Phân tích Ngữ Nghĩa Chuyên Sâu:**
    \n    -   AI của PDFSmart không chỉ đơn thuần tìm kiếm từ khóa. Chúng tôi sử dụng các mô hình ngôn ngữ BERT, GPT-3 (hoặc các phiên bản tương đương) để thực sự *hiểu* ý nghĩa của văn bản, ngữ cảnh sử dụng từ, và mối quan hệ giữa các câu.\n
    \n**2. Xác Định Ý Chính và Luận Điểm:**\n    -   Công cụ sẽ tự động nhận diện các câu chủ đề, các luận điểm chính và các bằng chứng hỗ trợ trong tài liệu của bạn. Điều này giúp bản tóm tắt không chỉ ngắn gọn mà còn tập trung vào những phần quan trọng nhất.\n
    \n**3. Tóm Tắt Đa Chiều và Linh Hoạt:**\n    -   Bạn có thể tùy chọn kiểu tóm tắt (ngắn gọn hoặc ý chính) để phù hợp với mục đích sử dụng. \n    -   Bản tóm tắt có thể được trình bày dưới dạng gạch đầu dòng, đoạn văn ngắn, hoặc sơ đồ tư duy (tính năng đang phát triển).\n
    \n**4. Hỗ Trợ Đa Dạng Loại Tài Liệu:**\n    -   PDFSmart không giới hạn ở một loại văn bản nào. Chúng tôi hỗ trợ tóm tắt từ báo cáo, bài nghiên cứu, sách, email, bài báo, đến các loại tài liệu chuyên ngành khác.\n
    \n**Ví dụ về nội dung tóm tắt (placeholder):**\n
    \nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n
    \n**Lưu ý:** Bản tóm tắt này chỉ mang tính chất minh họa. Kết quả tóm tắt thực tế có thể khác biệt tùy thuộc vào loại tài liệu và tùy chọn tóm tắt bạn chọn.\n\nBạn có thể tải xuống bản tóm tắt này dưới dạng file .txt bằng nút Tải xuống bên dưới. Nếu bạn có bất kỳ câu hỏi hoặc phản hồi nào, vui lòng liên hệ với chúng tôi qua kênh hỗ trợ. Xin cảm ơn bạn đã sử dụng PDFSmart!`;
    setSummaryContent(summary);

    // Create a Blob and URL for download
    const blob = new Blob([summary], { type: "text/plain" });
    const fileUrl = URL.createObjectURL(blob);
    setSummaryFile(fileUrl);
  };


  const handleRegister = async () => {
    // Basic front-end validation
    if (!name || !email || !password || !phoneNumber || !dateOfBirth) {
      setErrorMessage('Please fill in all information.');
      return;
    }

    // In a real application, you would send this data to your backend for actual registration
    const userData = {
      name,
      email,
      password,
      phoneNumber,
      dateOfBirth,
      // role is removed from registration form
    };

    // Placeholder for backend registration logic - replace with actual API call
    console.log('Registration Data:', userData);
    setRegistrationSuccess(true);
    setErrorMessage('');
    setIsRegisterFormVisible(false);
    setIsPopupVisible(true);

    // Reset form fields after successful (placeholder) registration
    setName('');
    setEmail('');
    setPassword('');
    setPhoneNumber('');
    setDateOfBirth('');
  };

  const handleLogin = () => {
    // Basic front-end validation
    if (!loginEmail || !loginPassword) { // Changed to loginUsername
      setLoginErrorMessage('Please fill in your EmailEmail and Password.'); // Changed error message
      return;
    }

    // Placeholder for backend login logic - replace with actual API call
    console.log('Login Data:', { username: loginEmail , password: loginPassword }); // Log username
    setLoginSuccess(true);
    setLoginErrorMessage('');
    setIsLoginFormVisible(false);
    setLoginWelcomeMessageVisible(true); // Show welcome message popup
    setLoggedInUsername(loginEmail); // Store logged-in Email


    // Reset form fields after successful (placeholder) login
    setLoginEmail(''); 
    setLoginPassword('');

  };

  const handleLogout = () => {
    setLoginSuccess(false);
    setLoggedInUsername(null);
  };


  const closeLoginWelcomeMessage = () => {
    setLoginWelcomeMessageVisible(false);
    setIsLoginFormVisible(false); // Hide login form after closing welcome message
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 font-sans">
      {/* Sticky Navigation Bar */}
      <nav className="bg-white shadow-md py-4 fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="font-bold text-xl text-blue-700">PDFSmart</a>

          {/* Menu Options */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-500 transition-colors duration-200">Trang chủ</a>
            <a href="#" className="text-gray-700 hover:text-blue-500 transition-colors duration-200">Tính năng</a>
            <a href="#services-section" className="text-gray-700 hover:text-blue-500 focus:outline-none transition-colors duration-200">Dịch vụ</a>
            <a href="#" className="text-gray-700 hover:text-blue-500 transition-colors duration-200">Giá cả</a>
            <a href="#" className="text-gray-700 hover:text-blue-500 transition-colors duration-200">Hỗ trợ</a>
          </div>

           {/* Auth Buttons / User Display - Adjusted for consistent navigation bar height */}
           <div className="space-x-3 flex items-center">
            {loggedInUsername ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-700 font-semibold whitespace-nowrap" style={{ fontSize: '0.9rem' }}>Hi, {loggedInUsername}</span> {/* Reduced font size here */}
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 whitespace-nowrap"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-3">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 whitespace-nowrap"
                  onClick={() => setIsLoginFormVisible(true)}
                >
                  Login
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 whitespace-nowrap"
                  onClick={() => setIsRegisterFormVisible(true)}
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Navigation Bar Explanation Text */}
      <div className="bg-blue-100 py-2">
        <div className="container mx-auto px-6 text-center text-gray-600">
          Upload your document and let PDFSmart's AI help you summarize the key content quickly and efficiently.
        </div>
      </div>

      {/* Header Section */}
      <header className="container mx-auto mt-24 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          PDFSmart Document Summarizer <FaFileAlt className="inline-block ml-2 mb-1" />
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Easily summarize complex documents, from reports to books, with cutting-edge AI technology.
        </p>
      </header>

      {/* Features and Help Section */}
      <section className="container mx-auto mt-12 px-6 flex justify-center">
        <div className="flex items-center space-x-8">
          {/* Function Buttons */}
          <div className="flex space-x-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transform hover:scale-105 transition-transform duration-200"
              onClick={() => navigate("/", { state: { username: loggedInUsername || usernameFromTextpage } })}> {/* Pass username when navigating */}
              Text Summarize
            </button>
            {/* Nút Tóm tắt tài liệu kiểu outline, hover màu nhạt hơn */}
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transform hover:scale-105 transition-transform duration-200"
            >
              Document Summarize
            </button>
          </div>

          {/* Help Icon */}
          <div className="relative">
            <HelpCircle
              className="w-7 h-7 text-gray-500 cursor-pointer hover:text-blue-700 transition-colors duration-200"
              onMouseEnter={() => setShowHelp(true)}
              onMouseLeave={() => setShowHelp(false)}
            />
            {showHelp && (
              <div className="absolute left-full top-1/2 ml-3 w-72 transform -translate-y-1/2 bg-white shadow-md p-4 rounded-md border border-gray-200 text-gray-700 z-10">
                <h3 className="font-semibold text-gray-800 mb-2">Quick Guide:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><span className="font-semibold text-blue-600">1.</span> **Upload Document:** Drag and drop file or click to select from your device. Supported: .txt, .docx, .pdf.</li>
                  <li><span className="font-semibold text-blue-600">2.</span> **Select Summary Type:** "Short" for a quick summary, "Main Points" to focus on core information.</li>
                  <li><span className="font-semibold text-blue-600">3.</span> **Click "Summarize Document":** Wait a few seconds for AI to process and display the results.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Input and Output Sections */}
      <section className="container mx-auto mt-12 px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <label className="block text-lg font-semibold text-gray-700 mb-4">
            Upload Your Document
          </label>
          <div
            className={`bg-blue-50 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-colors duration-300 transform hover:scale-102 hover:shadow-lg ${dragActive ? "border-indigo-500 bg-indigo-100" : "border-gray-300 bg-blue-50"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input type="file" onChange={handleFileChange} className="hidden" id="fileInputDoc" />
            <label htmlFor="fileInputDoc" className="cursor-pointer flex flex-col items-center justify-center">
              <Upload className="w-16 h-16 text-indigo-400 mb-2 transform transition-transform duration-300 hover:scale-110" />
              <p className="text-gray-500 text-lg font-semibold mt-1 text-center">
                Drag & drop file here <br /> or <span className="text-indigo-600">click to select file</span><br />
                <span className="text-sm text-gray-400">(Supported: .txt, .docx, .pdf)</span>
              </p>
              {file && <p className="text-green-600 mt-3 text-lg">{file.name}</p>}
            </label>
          </div>
        </div>

        {/* Summary Output */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Document Summary Results
          </h3>
          <div className="bg-gray-50 p-4 rounded-md shadow-inner h-64 overflow-y-auto">
            {summaryContent ? (
              <pre className="text-gray-800 whitespace-pre-wrap">{summaryContent}</pre>
            ) : (
              <p className="text-gray-500 italic text-center">
                The document summary will appear here.<br />
                Please upload a document and click the <strong className="font-semibold text-indigo-600">Summarize Document</strong> button to begin.
              </p>
            )}
          </div>
          {summaryFile && (
            <a
              href={summaryFile}
              download="summary.txt"
              className="mt-4 inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Summary
            </a>
          )}
        </div>
      </section>

      {/* Options & Button */}
      <section className="container mx-auto mt-12 px-6 flex justify-center">
        <div className="flex space-x-4 w-full max-w-2xl">
          <select
            value={summaryType}
            onChange={(e) => setSummaryType(e.target.value)}
            className="w-1/2 border border-gray-300 rounded-lg p-3 text-lg shadow-sm transition-all focus:ring focus:ring-indigo-300"
          >
            <option value="short">✨ Short Summary</option>
            <option value="detailed">📌 Main Points Summary</option>
          </select>
          <button
            className="w-1/2 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
            onClick={() => file && generateSummary(file)}
          >
            Summarize Document ➝
          </button>
        </div>
      </section>
      {/* About Document Summarizer Section - Re-structured and visually improved text */}
      <section className="container mx-auto mt-20 px-6 py-10 bg-blue-50 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">
          Learn About PDFSmart Document Summarizer
        </h2>
        <p className="text-gray-700 text-lg mb-6 text-center">
          Welcome to **PDFSmart - Intelligent Document Summarization Tool**, the optimal solution to help you save time and improve information processing efficiency.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">
              How does the PDFSmart document summarization tool work?
            </h3>
            <p className="text-gray-700 mb-5">
              PDFSmart uses the power of **Artificial Intelligence (AI)**, specifically the most advanced natural language models available today, to analyze and summarize your documents. The tool's operation process includes:
            </p>
            <ul className="list-disc pl-5 text-gray-700 mb-5 space-y-2">
              <li><strong>Read and Analyze Text:</strong> PDFSmart's AI reads the entire content of your uploaded document, understanding the structure and semantics of the text.</li>
              <li><strong>Identify Important Information:</strong> The tool uses complex algorithms to identify the most important sentences, paragraphs, and main ideas.</li>
              <li><strong>Remove Redundant Information:</strong> PDFSmart removes redundant, unimportant, or repetitive information.</li>
              <li><strong>Synthesize and Restructure:</strong> AI synthesizes information, reinterprets it concisely, and restructures the summary coherently.</li>
              <li><strong>Create Summary:</strong> Finally, PDFSmart creates a concise summary of the main ideas, helping you grasp the content quickly.</li>
            </ul>
            <p className="text-gray-700 mb-5">
              AI technology allows PDFSmart to process various types of documents and create high-quality summaries, superior to manual methods.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">
              Why choose PDFSmart to summarize your documents?
            </h3>
            <p className="text-gray-700 mb-5">
              Among many summarization tools, PDFSmart stands out with superior advantages, providing the best experience.
            </p>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Key benefits of PDFSmart:</h4>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li><strong>Save Valuable Time:</strong> PDFSmart helps you save up to 80-90% of reading time, focusing on important tasks.</li>
              <li><strong>Accurate and Efficient Summarization:</strong> AI ensures accurate summarization of main ideas, without missing important information.</li>
              <li><strong>Support for Various File Formats:</strong> PDFSmart supports summarizing `.txt`, `.docx`, `.pdf` files, meeting diverse needs.</li>
              <li><strong>Friendly, Easy-to-Use Interface:</strong> Intuitive, simple interface, easy to operate for quality summaries.</li>
              <li><strong>Flexible Summary Type Options:</strong> Choose "short" for an overview, or "main points" to delve into core content.</li>
              <li><strong>Easy Download:</strong> Summaries are downloaded in `.txt` format, convenient for storage, sharing, and reuse.</li>
            </ul>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-blue-700 text-white py-6 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} PDFSmart. All rights reserved.</p>
        </div>
      </footer>

      {/* Popup thông báo đăng ký thành công - Đặt ở cuối component */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
            <FaCheckCircle className="text-green-500 h-10 w-10" />
            <h2 className="text-lg font-semibold">Registration successful</h2>
            <button
              onClick={() => {
                setIsPopupVisible(false);
                setRegistrationSuccess(false);
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Form đăng ký - Ẩn hiện theo state isRegisterFormVisible */}
      {isRegisterFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              <FaUserPlus className="mx-auto h-12 w-12 text-blue-500 mb-2" />
              <h1 className="text-2xl font-bold text-gray-800">Register Account</h1>
              <p className="text-gray-600">Create a new account to use PDFSmart</p>
            </div>

            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {errorMessage}</span>
              </div>
            )}

            {registrationSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Success!</strong>
                <span className="block sm:inline"> Account registration successful.</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><FaUser className="mr-2 text-gray-500" />Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your name "
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><FaEnvelope className="mr-2 text-gray-500" />Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><FaLock className="mr-2 text-gray-500" />Password</label>
                <input
                  type="password"
                  id="password"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><FaPhone className="mr-2 text-gray-500" />Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><FaCalendarAlt className="mr-2 text-gray-500" />Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
              {/* Role field removed */}
            </div>

            <div className="mt-6">
              <button
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center"
                onClick={handleRegister}
              >
                <FaUserPlus className="mr-2" /> Register
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-600 text-center">
              Already have an account? <button onClick={() => setIsRegisterFormVisible(false)} className="text-blue-500 hover:underline">Close registration</button>
            </div>
          </div>
        </div>
      )}

      {/* Form đăng nhập - Ẩn hiện theo state isLoginFormVisible */}
      {isLoginFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              <FaSignInAlt className="mx-auto h-12 w-12 text-blue-500 mb-2" />
              <h1 className="text-2xl font-bold text-gray-800">Login</h1>
              <p className="text-gray-600">Login to use PDFSmart</p>
            </div>

            {loginErrorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {loginErrorMessage}</span>
              </div>
            )}

            {loginSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Success!</strong>
                <span className="block sm:inline"> Login successful.</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><FaEnvelope className="mr-2 text-gray-500" />Email</label>
                <input
                  type="email"
                  id="loginEmail"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><FaLock className="mr-2 text-gray-500" />Password</label>
                <input
                  type="password"
                  id="loginPassword"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center"
                onClick={handleLogin}
              >
                <FaSignInAlt className="mr-2" /> Login
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-600 text-center">
              Don't have an account? <button onClick={() => setIsLoginFormVisible(false)} className="text-blue-500 hover:underline">Close login</button>
            </div>
          </div>
        </div>
      )}
      {/* Welcome Popup sau đăng nhập */}
      {loginWelcomeMessageVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
            <FaSmile className="text-green-500 h-10 w-10" /> {/* Welcome Icon */}
            <div>
              <h2 className="text-lg font-semibold mb-1">Welcome to PDFSmart!</h2> {/* Welcome message */}
              <p className="text-gray-700 text-sm">Enjoy your experience with our tool.</p>
            </div>
            <button
              onClick={closeLoginWelcomeMessage}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default TailieuPage;