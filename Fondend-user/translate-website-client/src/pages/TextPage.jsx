import React, { useState } from "react";
import { HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaChalkboardTeacher, FaRegNewspaper, FaUserEdit, FaBullhorn, FaUser, FaBook, FaUserTie, FaPenNib, FaBookOpen, FaBuilding, FaSitemap, FaUserPlus, FaEnvelope, FaLock, FaPhone, FaCalendarAlt, FaSignInAlt, FaCheckCircle, FaSmile } from "react-icons/fa"; // Import FaSmile icon

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

  const summarizeText = () => {
    if (text.trim() === "") {
      alert("Vui lòng nhập văn bản để tóm tắt.");
      return;
    }

    let result = "";
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

    setSummary(result);
  };

  const servicesList = [
    {
      title: "SINH VIÊN",
      description: "Với PDFSmart, tóm tắt các bài học và trang Wikipedia của bạn trong vài giây giúp tăng năng suất học tập của bạn.",
      icon: <FaUserGraduate />,
    },
    {
      title: "GIÁO SƯ",
      description: "Xác định các ý tưởng và lập luận quan trọng nhất của văn bản để bạn có thể chuẩn bị bài học của mình.",
      icon: <FaChalkboardTeacher />,
    },
    {
      title: "NHÀ BÁO",
      description: "Nếu bạn thích thông tin tóm tắt các sự kiện chính quan trọng, thì PDFSmart là dành cho bạn!",
      icon: <FaRegNewspaper />,
    },
    {
      title: "NGƯỜI HIỆU CHỈNH",
      description: "Xác định và hiểu rất nhanh các sự kiện và ý tưởng của các văn bản của bạn.",
      icon: <FaUserEdit />,
    },
    {
      title: "THÔNG CÁO BÁO CHÍ",
      description: "Với sự giúp đỡ của PDFSmart, đi đến ý tưởng chính của các bài viết của bạn để viết các lập luận và phê bình của bạn.",
      icon: <FaBullhorn />,
    },
    {
      title: "NGƯỜI ĐỌC",
      description: "Tiết kiệm thời gian để tóm tắt các tài liệu của bạn, nắm được thông tin liên quan nhanh chóng.",
      icon: <FaUser />,
    },
    {
      title: "THƯ VIỆN",
      description: "Cần tóm tắt các bài thuyết trình của cuốn sách của bạn? Xác định các đối số trong một vài giây.",
      icon: <FaBook />,
    },
    {
      title: "NGƯỜI LÀM VIỆC THƯ VIỆN",
      description: "Quá nhiều tài liệu? Đơn giản hóa bài đọc của bạn, làm cho bài đọc của bạn dễ dàng hơn với PDFSmart như một công cụ máy tính để bàn.",
      icon: <FaUserTie />,
    },
    {
      title: "NHÀ VĂN",
      description: "Cần tóm tắt các chương của bạn? Với PDFSmart, đi vào trung tâm của ý tưởng của bạn.",
      icon: <FaPenNib />,
    },
    {
      title: "NHÀ XUẤT BẢN",
      description: "Xác định nhanh chóng các cuốn sách của bạn hoặc ý tưởng của tác giả. Tóm tắt những điểm chính quan trọng nhất.",
      icon: <FaBookOpen />,
    },
    {
      title: "VIỆN BẢO TÀNG",
      description: "Từ bây giờ, hãy tạo bản tóm tắt nhanh chóng về bản trình bày của các nghệ sĩ của bạn và tác phẩm nghệ thuật của họ.",
      icon: <FaBuilding />,
    },
    {
      title: "TỔ CHỨC",
      description: "Xác định các đoạn quan trọng nhất trong các văn bản có chứa rất nhiều từ để phân tích chi tiết.",
      icon: <FaSitemap />,
    },
  ];

  const handleRegister = async () => {
    if (!name || !email || !password || !phoneNumber || !dateOfBirth) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin.');
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
      setLoginErrorMessage('Vui lòng điền đầy đủ UserName và mật khẩu.'); // Changed error message
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
                <span className="text-gray-700 font-semibold whitespace-nowrap" style={{ fontSize: '0.9rem' }}>Chào, {loggedInUsername}</span> {/* Reduced font size here */}
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 whitespace-nowrap"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="space-x-3">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 whitespace-nowrap"
                  onClick={() => setIsLoginFormVisible(true)}
                >
                  Đăng nhập
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 whitespace-nowrap"
                  onClick={() => setIsRegisterFormVisible(true)}
                >
                  Đăng ký
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
          Công cụ tóm tắt văn bản bằng AI
        </h1>
        <div className="container mx-auto px-6 text-center text-gray-600 text-xl mt-10">
          Khám phá sức mạnh của tóm tắt văn bản AI để đơn giản hóa việc đọc và học tập của bạn.
        </div>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center">
          Nhanh chóng nắm bắt ý chính từ mọi loại văn bản với công nghệ AI tiên tiến.
        </p>
      </header>

      {/* Features and Help Section */}
      <section className="container mx-auto mt-12 px-6 flex justify-center">
        <div className="flex items-center space-x-8">
          {/* Function Buttons */}
          <div className="flex space-x-4">
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transform hover:scale-105 transition-transform duration-200">
              Tóm tắt văn bản
            </button>
            {/* Outline Document Summarization Button */}
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transform hover:scale-105 transition-transform duration-200"
              onClick={() => navigate("/tailieu")}
            >
              Tóm tắt tài liệu
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
                <h3 className="font-semibold text-gray-800 mb-2">Hướng dẫn nhanh:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><span className="font-semibold text-blue-600">1.</span> Nhập văn bản vào khung bên trái.</li>
                  <li><span className="font-semibold text-blue-600">2.</span> Chọn loại tóm tắt mong muốn.</li>
                  <li><span className="font-semibold text-blue-600">3.</span> Nhấn nút "Tóm Tắt".</li>
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
            Nhập văn bản cần tóm tắt
          </label>
          <textarea
            id="text-input"
            className="shadow-sm focus:ring-blue-200 focus:border-blue-200 block w-full p-4 border-gray-200 rounded-md h-64 bg-blue-50"
            placeholder="Dán văn bản của bạn vào đây..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="mt-5 flex justify-between items-center">
            <select
              className="block appearance-none w-auto bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
              value={summaryType}
              onChange={(e) => setSummaryType(e.target.value)}
            >
              <option value="short">Tóm tắt ngắn</option>
              <option value="medium">Tóm tắt vừa phải</option>
              <option value="long">Tóm tắt dài</option>
            </select>
            <button
              onClick={summarizeText}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-300 transform hover:scale-105"
            >
              Tóm tắt
            </button>
          </div>
        </div>

        {/* Summary Output */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Kết quả tóm tắt
          </h3>
          <div className="bg-gray-50 p-4 rounded-md shadow-inner h-64 overflow-y-auto">
            {summary ? (
              <p className="text-gray-800">{summary}</p>
            ) : (
              <p className="text-gray-500 italic">
                Bản tóm tắt sẽ hiển thị ở đây sau khi bạn thực hiện tóm tắt.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* About Text Summarizer Section */}
      <section className="container mx-auto mt-20 px-6 py-10 bg-blue-50 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Về công cụ tóm tắt văn bản PDFSmart
        </h2>
        <p className="text-gray-700 text-lg mb-6">
          Công cụ tóm tắt văn bản PDFSmart sử dụng trí tuệ nhân tạo để giúp bạn dễ dàng tóm tắt bất kỳ loại văn bản nào. Dưới đây là một số thông tin chi tiết và lợi ích khi sử dụng công cụ của chúng tôi.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold text-blue-600 mb-3">
              Công cụ tóm tắt văn bản là gì?
            </h3>
            <p className="text-gray-700 mb-4">
              Công cụ tóm tắt văn bản giúp người dùng nhanh chóng nắm bắt nội dung chính của văn bản dài mà không cần đọc toàn bộ. Nó hoạt động bằng cách phân tích văn bản và trích xuất những phần quan trọng nhất, sau đó tổng hợp lại thành một bản tóm tắt ngắn gọn và dễ hiểu.
            </p>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Các tính năng chính:</h4>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Tóm tắt văn bản tự động và nhanh chóng.</li>
              <li>Tùy chọn độ dài tóm tắt (ngắn, vừa, dài).</li>
              <li>Hỗ trợ tóm tắt nhiều loại văn bản khác nhau.</li>
              <li>Giao diện thân thiện, dễ sử dụng.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-blue-600 mb-3">
              Tại sao nên sử dụng công cụ tóm tắt văn bản?
            </h3>
            <p className="text-gray-700 mb-4">
              Trong thời đại thông tin bùng nổ, việc xử lý và nắm bắt thông tin nhanh chóng là vô cùng quan trọng. Công cụ tóm tắt văn bản PDFSmart giúp bạn tiết kiệm thời gian, nâng cao hiệu quả học tập và làm việc.
            </p>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Lợi ích khi sử dụng:</h4>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Tiết kiệm thời gian đọc và nghiên cứu tài liệu.</li>
              <li>Nắm bắt thông tin cốt lõi một cách hiệu quả.</li>
              <li>Hỗ trợ học sinh, sinh viên và người làm nghiên cứu.</li>
              <li>Tăng năng suất làm việc và học tập.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Services Section as Card Grid */}
      <section id="services-section" className="container mx-auto mt-10 px-6 py-10 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 uppercase">
          AI LÀ NGƯỜI PDFSmart HƯỚNG ĐẾN?
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
      {/* Popup thông báo đăng ký thành công - Đặt ở cuối component */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
            <FaCheckCircle className="text-green-500 h-10 w-10" />
            <h2 className="text-lg font-semibold mb-0">Bạn đã đăng ký tài khoản thành công!</h2>
            <button
              onClick={() => {
                setIsPopupVisible(false);
                setRegistrationSuccess(false);
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
            >
              Đóng
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
              <h1 className="text-2xl font-bold text-gray-800">Đăng ký Tài khoản</h1>
              <p className="text-gray-600">Tạo tài khoản mới để sử dụng PDFSmart</p>
            </div>

            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Lỗi!</strong>
                <span className="block sm:inline"> {errorMessage}</span>
              </div>
            )}

            {registrationSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Thành công!</strong>
                <span className="block sm:inline"> Đăng ký tài khoản thành công.</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><FaUser className="mr-2 text-gray-500" />UserName</label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Nhập tên của bạn"
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
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><FaLock className="mr-2 text-gray-500" />Mật khẩu</label>
                <input
                  type="password"
                  id="password"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><FaPhone className="mr-2 text-gray-500" />Số điện thoại</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Nhập số điện thoại"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><FaCalendarAlt className="mr-2 text-gray-500" />Ngày sinh</label>
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
                <FaUserPlus className="mr-2" /> Đăng ký
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-600 text-center">
              Đã có tài khoản? <button onClick={() => setIsRegisterFormVisible(false)} className="text-blue-500 hover:underline">Đóng đăng ký</button>
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
              <h1 className="text-2xl font-bold text-gray-800">Đăng nhập</h1>
              <p className="text-gray-600">Đăng nhập để sử dụng PDFSmart</p>
            </div>

            {loginErrorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Lỗi!</strong>
                <span className="block sm:inline"> {loginErrorMessage}</span>
              </div>
            )}

            {loginSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Thành công!</strong>
                <span className="block sm:inline"> Đăng nhập thành công.</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="loginUsername" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><FaUser className="mr-2 text-gray-500" />UserName</label> {/* Changed to UserName */}
                <input
                  type="text"
                  id="loginUsername" // Changed to loginUsername
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Nhập UserName của bạn" // Changed placeholder
                  value={loginUsername} // Changed to loginUsername
                  onChange={(e) => setLoginUsername(e.target.value)} // Changed to setLoginUsername
                />
              </div>
              <div>
                <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><FaLock className="mr-2 text-gray-500" />Mật khẩu</label>
                <input
                  type="password"
                  id="loginPassword"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Nhập mật khẩu"
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
                <FaSignInAlt className="mr-2" /> Đăng nhập
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-600 text-center">
              Chưa có tài khoản? <button onClick={() => setIsLoginFormVisible(false)} className="text-blue-500 hover:underline">Đóng đăng nhập</button>
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
              <h2 className="text-lg font-semibold mb-1">Chào mừng đến với PDFSmart!</h2> {/* Welcome message */}
              <p className="text-gray-700 text-sm">Chúc bạn có những trải nghiệm tuyệt vời với công cụ của chúng tôi.</p>
            </div>
            <button
              onClick={closeLoginWelcomeMessage}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TextSummarizer;