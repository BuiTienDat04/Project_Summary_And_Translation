import React, { useState } from "react";
import { HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaChalkboardTeacher, FaRegNewspaper, FaUserEdit, FaBullhorn, FaUser, FaBook, FaUserTie, FaPenNib, FaBookOpen, FaBuilding, FaSitemap, FaUserPlus, FaEnvelope, FaLock, FaPhone, FaCalendarAlt, FaSignInAlt, FaCheckCircle, FaSmile } from "react-icons/fa"; // Import FaSmile icon
import axios from 'axios';

export function TextSummarizer() {
  const [text, setText] = useState("");
  const [summaryType, setSummaryType] = useState("short");
  const [summary, setSummary] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [isServicesVisible, setIsServicesVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isRegisterFormVisible, setIsRegisterFormVisible] = useState(false);
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);

  // State variables for registration form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // State variables for login form
  const [loginUsername, setLoginUsername] = useState(''); // Changed from loginEmail to loginUsername
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginWelcomeMessageVisible, setLoginWelcomeMessageVisible] = useState(false); // State for welcome message popup

  // State to store logged-in username
  const [loggedInUsername, setLoggedInUsername] = useState(null);

  const navigate = useNavigate();
  const [translatedText, setTranslatedText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [availableLanguages, setAvailableLanguages] = useState([ // Add available languages
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'de', name: 'German' },
    // Add more languages here as needed
  ]); // Mặc định là tiếng Anh

  const summarizeText = async () => {
    if (text.trim() === "") {
      alert("Please enter text to summarize.");
      return;
    }
  
    let result = "";
  
    // Xử lý tóm tắt văn bản
    switch (summaryType) {
      case "short":
        result = text.slice(0, 150) + "...";
        break;
      case "medium":
        result = text.slice(0, 500) + "...";
        break;
      case "long":
        result = text.slice(0, 1000) + "...";
        break;
      default:
        result = text;
    }
  
    // Gọi API để tóm tắt văn bản
    try {
      const summarizeResponse = await fetch('http://localhost:3000/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: result }),
      });
  
      if (!summarizeResponse.ok) {
        throw new Error('Failed to summarize text');
      }
  
      const summarizedText = await summarizeResponse.json();
  
      // Gọi API để dịch văn bản đã tóm tắt
      const translateResponse = await fetch('http://localhost:3000/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: summarizedText.summary }), // Giả sử API trả về trường 'summary'
      });
  
      if (!translateResponse.ok) {
        throw new Error('Failed to translate text');
      }
  
      const translatedText = await translateResponse.json();
  
      // Cập nhật kết quả dịch vào state hoặc hiển thị lên giao diện
      setSummary(translatedText.translation); // Giả sử API trả về trường 'translation'
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the text.');
    }
  };



  const servicesList = [
    {
      title: "STUDENTS",
      description: "With PDFSmart, summarize your lessons and Wikipedia pages in seconds to boost your learning productivity.",
      icon: <FaUserGraduate />,
    },
    {
      title: "PROFESSORS",
      description: "Identify the most important ideas and arguments of a text so you can prepare your lessons.",
      icon: <FaChalkboardTeacher />,
    },
    {
      title: "JOURNALISTS",
      description: "If you like summarized information of the important main events, then PDFSmart is for you!",
      icon: <FaRegNewspaper />,
    },
    {
      title: "EDITORS",
      description: "Identify and understand very quickly the events and ideas of your texts.",
      icon: <FaUserEdit />,
    },
    {
      title: "PRESS RELEASE",
      description: "With the help of PDFSmart, get to the main idea of your articles to write your arguments and critiques.",
      icon: <FaBullhorn />,
    },
    {
      title: "READERS",
      description: "Save time to summarize your documents, grasp the relevant information quickly.",
      icon: <FaUser />,
    },
    {
      title: "LIBRARIES",
      description: "Need to summarize your book's presentations? Identify the arguments in a few seconds.",
      icon: <FaBook />,
    },
    {
      title: "LIBRARIANS",
      description: "Too much material? Simplify your reading, make your reading easier with PDFSmart as a desktop tool.",
      icon: <FaUserTie />,
    },
    {
      title: "WRITERS",
      description: "Need to summarize your chapters? With PDFSmart, get to the heart of your ideas.",
      icon: <FaPenNib />,
    },
    {
      title: "PUBLISHERS",
      description: "Quickly identify your books or author's ideas. Summarize the most important key points.",
      icon: <FaBookOpen />,
    },
    {
      title: "MUSEUMS",
      description: "From now on, create quick summaries of your artists' presentations and their artworks.",
      icon: <FaBuilding />,
    },
    {
      title: "ORGANIZATIONS",
      description: "Identify the most important passages in texts that contain a lot of words for detailed analysis.",
      icon: <FaSitemap />,
    },
  ];


  const translateSummary = async () => {
    if (!summary) {
      alert("Please summarize the text first.");
      return;
    }

    try {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=YOUR_API_KEY`, // Replace with your API key
        {
          q: summary,
          target: targetLanguage,
        }
      );

      setTranslatedText(response.data.data.translations[0].translatedText);
    } catch (error) {
      console.error("Translation error:", error);
      alert("An error occurred during translation.");
    }
  };




  
  const handleRegister = async () => {
    if (!name || !email || !password || !phoneNumber || !dateOfBirth) {
      setErrorMessage('Please fill in all information.');
      return;
    }

    const userData = {
      name,
      email,
      password,
      phoneNumber,
      dateOfBirth,
    };

    console.log('Registration Data:', userData);
    setRegistrationSuccess(true);
    setErrorMessage('');
    setIsRegisterFormVisible(false);
    setIsPopupVisible(true);

    setName('');
    setEmail('');
    setPassword('');
    setPhoneNumber('');
    setDateOfBirth('');
  };

  const handleLogin = () => {
    if (!loginUsername || !loginPassword) { // Changed to loginUsername
      setLoginErrorMessage('Please enter UserName and password. '); // Changed error message
      return;
    }

    // In a real application, you would authenticate with your backend here
    // For this placeholder, we'll just use the loginUsername as username
    const usernameToDisplay = loginUsername; // Use loginUsername for display

    console.log('Login Data:', { username: loginUsername, password: loginPassword }); // Log username
    setLoginSuccess(true);
    setLoginErrorMessage('');
    setLoginWelcomeMessageVisible(true); // Show welcome message popup

    setLoggedInUsername(usernameToDisplay); // Set username on login

    // Reset loginSuccess and hide login form after a short delay (optional, for better UX)
    setTimeout(() => {
      setLoginSuccess(false); // Hide success message (optional in this case as we show welcome popup)
      setIsLoginFormVisible(false); // Hide login form will be handled after closing welcome popup
    }, 100); // Short delay to ensure welcome message is displayed


    setLoginUsername(''); // Reset loginUsername
    setLoginPassword('');
  };

  const handleLogout = () => {
    setLoggedInUsername(null);
  };

  const closeLoginWelcomeMessage = () => {
    setLoginWelcomeMessageVisible(false);
    setIsLoginFormVisible(false); // Hide login form after closing welcome message
  };

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
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
        {/* You can add explanation text here if needed */}
      </div>

      {/* Header Section */}
      <header className="container mx-auto mt-24 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          AI-Powered Text Summarization Tool
        </h1>
        <div className="container mx-auto px-6 text-center text-gray-600 text-xl mt-10">
          Unlock the power of AI text summarization to simplify your reading and learning.
        </div>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center">
          Quickly grasp the main points from any type of text with advanced AI technology.
        </p>
      </header>

      {/* Features and Help Section */}
      <section className="container mx-auto mt-12 px-6 flex justify-center">
        <div className="flex items-center space-x-8 justify-center"> {/* justify-center added here for centering the whole group */}
          <div className="flex space-x-4">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transform hover:scale-105 transition-transform duration-200" // px-8 for more padding
              onClick={summarizeText}
            >
              Summarize Text
            </button>

            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transform hover:scale-105 transition-transform duration-200" // px-8 for more padding
              onClick={() => navigate("/tailieu")}
            >
              Summarize Document
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
              <div className="absolute left-full top-1/2 ml-3 w-64 transform -translate-y-1/2 bg-white shadow-md p-4 rounded-md border border-gray-200 text-gray-700 z-10">
                <h3 className="font-semibold text-gray-800 mb-2">Quick Guide:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><span className="font-semibold text-blue-600">1.</span> Enter text in the left panel.</li>
                  <li><span className="font-semibold text-blue-600">2.</span> Select the desired summary length.</li>
                  <li><span className="font-semibold text-blue-600">3.</span> Click the "Summarize" button.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Input and Output Sections */}
      <section className="container mx-auto mt-12 px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Text Input */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <label htmlFor="text-input" className="block text-lg font-semibold text-gray-700 mb-4">
            Enter Text to Summarize
          </label>
          <textarea
            id="text-input"
            className="shadow-sm focus:ring-blue-200 focus:border-blue-200 block w-full p-4 border-gray-200 rounded-md h-64 bg-blue-50"
            placeholder="Enter and paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="mt-5 flex justify-between items-center">
            <select
              className="block appearance-none w-auto bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
              value={summaryType}
              onChange={(e) => setSummaryType(e.target.value)}
            >
              <option value="short">Short Summary</option>
              <option value="medium">Medium Summary</option>
              <option value="long">Long Summary</option>
            </select>
            <button
              onClick={summarizeText}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-300 transform hover:scale-105"
            >
              Summarize
            </button>
          </div>
        </div>

        {/* Summary Output */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Summary Results
          </h3>
          <div className="bg-gray-50 p-4 rounded-md shadow-inner h-64 overflow-y-auto">
            {summary ? (
              <div>
                <p className="text-gray-800">{summary}</p>

                {/* Translation Options - Moved to the bottom */}
                <div className="mt-4">  {/* Add some margin top for spacing */}
                  <div className="flex flex-col"> {/* Use flex column to stack items */}


                    {/* Display translated text (if available) */}
                    {translatedText && (
                      <div className="mt-2">
                        <h4 className="text-lg font-semibold text-gray-700">
                          Translated Text:
                        </h4>
                        <p className="text-gray-800">{translatedText}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">
                The summary will appear here after you perform the summarization.
              </p>
            )}
          </div>
          <div> {/* Container for select and button */}
            <label htmlFor="languageSelect" className="block text-sm font-medium text-gray-700 mb-1">
              Translate to:
            </label>
            <div className="flex items-center"> {/* Align select and button */}
              <select
                id="languageSelect"
                className="block appearance-none w-auto bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
              >
                {availableLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <button
                onClick={translateSummary}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
              >
                Translate
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Text Summarizer Section */}
      <section className="container mx-auto mt-20 px-6 py-10 bg-blue-50 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          About PDFSmart Text Summarizer
        </h2>
        <p className="text-gray-700 text-lg mb-6">
          The PDFSmart Text Summarizer uses artificial intelligence to help you easily summarize any type of text. Below is some detailed information and benefits of using our tool.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold text-blue-600 mb-3">
              What is a Text Summarizer?
            </h3>
            <p className="text-gray-700 mb-4">
              A text summarizer helps users quickly grasp the main content of a long text without having to read the entire thing. It works by analyzing the text and extracting the most important parts, then synthesizing them into a concise and easy-to-understand summary.
            </p>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Key Features:</h4>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Automatic and fast text summarization.</li>
              <li>Summary length options (short, medium, long).</li>
              <li>Supports summarizing various types of text.</li>
              <li>Friendly and easy-to-use interface.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-blue-600 mb-3">
              Why Use a Text Summarizer?
            </h3>
            <p className="text-gray-700 mb-4">
              In the age of information explosion, processing and grasping information quickly is extremely important. The PDFSmart Text Summarizer helps you save time and improve learning and work efficiency.
            </p>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Benefits of Use:</h4>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Saves time reading and researching documents.</li>
              <li>Effectively grasps core information.</li>
              <li>Supports students, researchers.</li>
              <li>Increases work and study productivity.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Services Section as Card Grid */}
      <section id="services-section" className="container mx-auto mt-10 px-6 py-10 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 uppercase">
          Who is PDFSmart For?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-300"
            >
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                  <span className="text-2xl">{service.icon}</span>
                </div>
              </div>
              <h3 className="font-semibold text-lg text-gray-800 text-center mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600 text-center">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-700 text-white py-6 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} PDFSmart. All rights reserved.</p>
        </div>
      </footer>

      {/* Success Registration Popup - Placed at the end of the component */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
            <FaCheckCircle className="text-green-500 h-10 w-10" />
            <h2 className="text-lg font-semibold mb-0">You have successfully registered!</h2>
            <button
              onClick={() => {
                setIsPopupVisible(false);
                setRegistrationSuccess(false);
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Registration Form - Shown/Hidden based on isRegisterFormVisible state */}
      {isRegisterFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              <FaUserPlus className="mx-auto h-12 w-12 text-blue-500 mb-2" />
              <h1 className="text-2xl font-bold text-gray-800">Register</h1>
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaUser className="mr-2 text-gray-500" />Username
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaEnvelope className="mr-2 text-gray-500" />Email
                </label>
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaLock className="mr-2 text-gray-500" />Password
                </label>
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
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaPhone className="mr-2 text-gray-500" />Phone Number
                </label>
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
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-500" />Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
              {/* Role field removed from registration form */}
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
              Already have an account? <button onClick={() => setIsRegisterFormVisible(false)} className="text-blue-500 hover:underline">Close Registration</button>
            </div>
          </div>
        </div>
      )}

      {/* Login Form - Shown/Hidden based on isLoginFormVisible state */}
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
                <label htmlFor="loginUsername" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaUser className="mr-2 text-gray-500" />Username
                </label>
                <input
                  type="text"
                  id="loginUsername"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaLock className="mr-2 text-gray-500" />Password
                </label>
                <input
                  type="password"
                  id="loginPassword"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your password"
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
              Don't have an account? <button onClick={() => setIsLoginFormVisible(false)} className="text-blue-500 hover:underline">Close Login</button>
            </div>
          </div>
        </div>
      )}
      {/* Welcome Popup after login */}
      {loginWelcomeMessageVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
            <FaSmile className="text-green-500 h-10 w-10" /> {/* Welcome Icon */}
            <div>
              <h2 className="text-lg font-semibold mb-1">Welcome to PDFSmart!</h2> {/* Welcome message */}
              <p className="text-gray-700 text-sm">We hope you have a great experience with our tool.</p>
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
}

export default TextSummarizer;