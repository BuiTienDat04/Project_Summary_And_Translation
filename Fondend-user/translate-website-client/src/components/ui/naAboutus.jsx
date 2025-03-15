import { FaBookOpen, FaLanguage, FaFileAlt, FaGlobe, FaClock, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useRef } from "react";
import { useNavigate } from 'react-router-dom';
import LoginPage from '../../Pages/LoginPage';
import RegisterPage from '../../Pages/RegisterPage';
import Navigation from '../../Pages/Navigation';
import Footer from '../../Pages/Footer';
import homeLogo from '../../Pages/images/logo.png';
import BtecLogo from '../../Pages/images/btec.png'
import AboutusLogo from '../../Pages/images/aboutus.png'
import LogoPower from '../../Pages/images/logo2.png'
import LogoPower1 from '../../Pages/images/logo3.png'
import LogoPower2 from '../../Pages/images/logo3.png'
import LogoPower3 from '../../Pages/images/logo5.png'


const NaAboutus = () => {  // ✅ Renamed to start with an uppercase letter

    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [loggedInUsername, setLoggedInUsername] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const handleCloseLogin = () => setShowLogin(false);
    const handleCloseRegister = () => setShowRegister(false);
    const navigate = useNavigate();

    const handleLoginClick = () => setShowLogin(true);
    const handleRegisterClick = () => setShowRegister(true);

    const handleOpenRegister = () => {
        setShowLogin(false); // Ẩn modal đăng nhập
        setShowRegister(true); // Hiển thị form đăng ký
    };


    const handleRegistrationSuccess = () => {
        setIsPopupVisible(true);
        setShowRegister(false);
    };


    const handleLoginSuccess = (user) => {
        setLoggedInUser(user);
        setLoggedInUsername(user.email);
        setShowLogin(false);
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        navigate('/text');
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            setLoggedInUser(JSON.parse(storedUser));
            setLoggedInUsername(JSON.parse(storedUser).email);
        }
    }, []);


    return (

        <div className="min-h-screen bg-indigo-200 font-sans"> {/* Thêm padding-top để tránh navigation */}
            {/* Navigation Bar */}
            <nav className="bg-indigo-200 font-sans shadow-md fixed w-full z-50 top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <span className="text-2xl font-bold text-blue-600">PDFSmart</span>
                        </div>
                        <div className="bg-indigo-100 py-2 rounded-lg">
                            <Navigation
                                onLoginClick={handleLoginClick}
                                onRegisterClick={handleRegisterClick}
                            />
                        </div>
                        {/* Popups for Login and Register */}
                        {showLogin && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
                                <LoginPage onClose={handleCloseLogin}
                                    onLoginSuccess={handleLoginSuccess}
                                    onOpenRegister={handleOpenRegister} />
                            </div>
                        )}

                        {showRegister && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
                                <RegisterPage
                                    onClose={handleCloseRegister}
                                    onRegistrationSuccess={handleRegistrationSuccess}
                                />
                            </div>
                        )}

                    </div>
                </div>
            </nav>

            <div className="bg-indigo-200 font-sans p-6 shadow-lg rounded-lg px-8 md:px-24"> {/* Removed max-w, added horizontal padding */}

                {/* Section 1 - Giới thiệu với ảnh */}
                <section className="group mb-24 mt-20"> {/* Increased section margin */}
                    <div className="grid md:grid-cols-2 gap-16 items-center"> {/* Increased gap */}
                        <div className="order-1 md:order-none">
                            <h1 className="text-5xl font-bold text-blue-700 mb-8 leading-tight"> {/* Increased heading size and color */}
                                Chào mừng bạn đến với PDFSmart - Mở khóa sức mạnh tài liệu của bạn!
                            </h1>
                            <div className="text-lg text-gray-800 mb-8 leading-relaxed"> {/* Increased text size and color */}
                                PDFSmart không chỉ là một công cụ xử lý PDF thông thường, mà là một giải pháp toàn diện được thiết kế để tối ưu hóa quy trình làm việc với tài liệu của bạn.
                                Chúng tôi hiểu rằng trong kỷ nguyên số, tài liệu đóng vai trò trung tâm trong mọi hoạt động, từ học tập, nghiên cứu đến kinh doanh và quản lý.
                                PDFSmart ra đời để giúp bạn khai thác tối đa giá trị từ tài liệu, biến chúng thành nguồn lực mạnh mẽ phục vụ cho thành công của bạn.
                                Với giao diện thân thiện, dễ sử dụng và tích hợp nhiều tính năng thông minh, PDFSmart sẽ là người bạn đồng hành lý tưởng, giúp bạn tiết kiệm thời gian, nâng cao hiệu quả và tự tin chinh phục mọi thử thách tài liệu.
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-3xl shadow-xl transform transition-all duration-300 group-hover:-rotate-2"> {/* Increased rounded corners and rotation */}
                            <img
                                src={LogoPower3}
                                alt="Translation & Summary Demo"
                                className=" w-full h-full object-cover rounded-3xl shadow-2xl border-8 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500" // Increased rounded corners, smoother transition
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" /> {/* Slightly darker gradient */}
                        </div>
                    </div>
                </section>

                {/* Section 2 - Câu chuyện PDFSmart */}
                <section className="group mb-24"> {/* Increased section margin */}
                    <div className="grid md:grid-cols-2 gap-16 items-center md:flex-row-reverse"> {/* Increased gap */}
                        <div className="md:order-2">
                            <h2 className="text-4xl font-semibold text-gray-900 mb-8"> {/* Increased heading size and color */}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700"> {/* Darker gradient */}
                                    📖 Câu chuyện về PDFSmart - Từ ý tưởng đến hiện thực
                                </span>
                            </h2>
                            <div className="text-lg text-gray-800 mb-8 leading-relaxed"> {/* Increased text size and color */}
                                Câu chuyện về PDFSmart bắt nguồn từ những trăn trở của chính những sinh viên - những người hàng ngày phải đối mặt với việc xử lý lượng lớn tài liệu học tập.
                                Nhận thấy sự thiếu hụt của một công cụ thực sự hiệu quả, đa năng và dễ tiếp cận, chúng tôi - một nhóm sinh viên đầy nhiệt huyết tại Cao đẳng Anh Quốc BTEC FPT - đã quyết tâm thay đổi điều đó.
                                PDFSmart không chỉ là sản phẩm của một đồ án tốt nghiệp, mà còn là kết tinh của niềm đam mê, sự sáng tạo và nỗ lực không ngừng nghỉ.
                                Từ những dòng code đầu tiên đến khi trở thành nền tảng được hàng nghìn người dùng tin tưởng, PDFSmart luôn đặt trải nghiệm người dùng lên hàng đầu và không ngừng hoàn thiện để mang đến giá trị tốt nhất.
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-3xl shadow-xl transform transition-all duration-300 group-hover:rotate-2"> {/* Increased rounded corners and rotation */}
                            <img
                                src={BtecLogo}
                                alt="BTEC FPT Graduation Project"
                                className=" w-full h-full object-cover rounded-3xl shadow-2xl border-8 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500" // Increased rounded corners, smoother transition
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/60 text-white rounded-b-3xl"> {/* Slightly darker gradient and rounded bottom */}
                                <p className="text-lg font-semibold">Đồ án tốt nghiệp BTEC FPT 2025</p> {/* Larger and bolder text */}
                                <p className="text-sm">Nền tảng PDFSmart được xây dựng từ dự án này.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3 - Sức mạnh PDFSmart */}
                <section className="group mb-24"> {/* Increased section margin */}
                    <div className="grid md:grid-cols-2 gap-16 items-center"> {/* Increased gap */}
                        <div>
                            <h2 className="text-4xl font-semibold text-gray-900 mb-8"> {/* Increased heading size and color */}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-blue-700"> {/* Darker gradient */}
                                    ⚡ Sức mạnh vượt trội của PDFSmart - Công cụ "All-in-One" cho tài liệu
                                </span>
                            </h2>
                            <div className="text-lg text-gray-800 mb-8 leading-relaxed"> {/* Increased text size and color */}
                                PDFSmart không chỉ đơn thuần là tập hợp các tính năng, mà là sự kết hợp sức mạnh của công nghệ AI tiên tiến và giao diện người dùng thân thiện.
                                Chúng tôi mang đến cho bạn một bộ công cụ toàn diện, giúp bạn dễ dàng xử lý mọi tác vụ liên quan đến tài liệu, từ những công việc đơn giản đến phức tạp nhất.
                                Khám phá sức mạnh của PDFSmart và trải nghiệm sự khác biệt:
                            </div>
                            <ul className="space-y-8"> {/* Increased list item spacing */}
                                <li className="flex items-start"> {/* items-start for better alignment */}
                                    <FaBookOpen className="text-blue-600 mr-4 h-7 w-7 flex-shrink-0" /> {/* Larger icon */}
                                    <div>
                                        <b className="text-lg text-gray-800">Tóm tắt văn bản thông minh:</b>
                                        <p className="text-gray-700 leading-relaxed">
                                            Nhanh chóng nắm bắt nội dung cốt lõi của tài liệu dày đặc chỉ trong vài phút.
                                            Thuật toán AI tiên tiến của chúng tôi sẽ giúp bạn lọc ra những thông tin quan trọng nhất,
                                            tiết kiệm thời gian đọc và tăng cường hiệu quả học tập, làm việc.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start"> {/* items-start for better alignment */}
                                    <FaLanguage className="text-green-600 mr-4 h-7 w-7 flex-shrink-0" /> {/* Larger icon */}
                                    <div>
                                        <b className="text-lg text-gray-800">Dịch thuật tài liệu chính xác:</b>
                                        <p className="text-gray-700 leading-relaxed">
                                            Phá bỏ mọi rào cản ngôn ngữ với khả năng dịch thuật chuyên nghiệp, hỗ trợ hơn 50 ngôn ngữ phổ biến trên thế giới.
                                            PDFSmart giúp bạn tiếp cận nguồn tri thức toàn cầu một cách dễ dàng và tự tin, mở rộng cơ hội học tập và hợp tác quốc tế.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start"> {/* items-start for better alignment */}
                                    <FaFileAlt className="text-orange-600 mr-4 h-7 w-7 flex-shrink-0" /> {/* Larger icon */}
                                    <div>
                                        <b className="text-lg text-gray-800">Hỗ trợ đa dạng định dạng:</b>
                                        <p className="text-gray-700 leading-relaxed">
                                            Không còn lo lắng về vấn đề tương thích định dạng! PDFSmart hỗ trợ hơn 50+ định dạng tài liệu khác nhau,
                                            từ PDF, DOCX, PPT đến các định dạng hình ảnh và văn bản thông thường.
                                            Bạn có thể dễ dàng làm việc với mọi loại tài liệu mà không gặp bất kỳ trở ngại nào.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start"> {/* items-start for better alignment */}
                                    <FaGlobe className="text-purple-600 mr-4 h-7 w-7 flex-shrink-0" /> {/* Larger icon */}
                                    <div>
                                        <b className="text-lg text-gray-800">Giao diện đa ngôn ngữ:</b>
                                        <p className="text-gray-700 leading-relaxed">
                                            PDFSmart mang đến trải nghiệm người dùng toàn cầu với giao diện hỗ trợ hơn 20 ngôn ngữ.
                                            Bạn có thể tùy chỉnh ngôn ngữ hiển thị theo sở thích cá nhân,
                                            tạo cảm giác thân thuộc và thoải mái khi sử dụng nền tảng.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="relative overflow-hidden rounded-3xl shadow-xl transform transition-all duration-300 group-hover:-rotate-2"> {/* Increased rounded corners and rotation */}
                            <img
                                src={LogoPower1} // Replace with your image URL
                                alt="PDFSmart Power Features"
                                className=" w-full h-full object-cover rounded-3xl shadow-2xl border-8 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500" // Increased rounded corners, smoother transition
                            />
                        </div>
                    </div>
                </section>

                {/* Section 4 - Lý do chọn PDFSmart */}
                <section className="group mb-24"> {/* Increased section margin */}
                    <div className="grid md:grid-cols-2 gap-16 items-center md:flex-row-reverse"> {/* Increased gap */}
                        <div className="md:order-2">
                            <h2 className="text-4xl font-semibold text-gray-900 mb-8"> {/* Increased heading size and color */}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-700"> {/* Darker gradient */}
                                    🔹 Tại sao PDFSmart là lựa chọn số 1 của bạn?
                                </span>
                            </h2>
                            <ul className="space-y-8"> {/* Increased list item spacing */}
                                <li className="flex items-start"> {/* items-start for better alignment */}
                                    <FaClock className="text-red-600 mr-4 h-7 w-7 flex-shrink-0" /> {/* Larger icon */}
                                    <div>
                                        <b className="text-lg text-gray-800">Tiết kiệm thời gian tối đa:</b>
                                        <p className="text-gray-700 leading-relaxed">
                                            PDFSmart giúp bạn loại bỏ hoàn toàn những công việc thủ công nhàm chán và tốn thời gian trong quá trình xử lý tài liệu.
                                            Thay vào đó, bạn có thể tập trung vào những công việc quan trọng hơn, mang tính chiến lược và sáng tạo hơn.
                                            Thời gian là tài sản vô giá, và PDFSmart sẽ giúp bạn sử dụng nó một cách hiệu quả nhất.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start"> {/* items-start for better alignment */}
                                    <FaCheckCircle className="text-blue-600 mr-4 h-7 w-7 flex-shrink-0" /> {/* Larger icon */}
                                    <div>
                                        <b className="text-lg text-gray-800">Nâng cao khả năng tiếp thu và giao tiếp:</b>
                                        <p className="text-gray-700 leading-relaxed">
                                            Với PDFSmart, việc tiếp cận và nắm bắt thông tin từ tài liệu phức tạp trở nên dễ dàng hơn bao giờ hết.
                                            Bạn có thể nhanh chóng hiểu rõ các khái niệm, ý tưởng và dữ liệu quan trọng,
                                            từ đó nâng cao khả năng học tập, nghiên cứu và giao tiếp một cách hiệu quả.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start"> {/* items-start for better alignment */}
                                    <FaShieldAlt className="text-gray-700 mr-4 h-7 w-7 flex-shrink-0" /> {/* Larger icon */}
                                    <div>
                                        <b className="text-lg text-gray-800">An toàn và bảo mật tuyệt đối:</b>
                                        <p className="text-gray-700 leading-relaxed">
                                            Chúng tôi hiểu rằng bảo mật dữ liệu là ưu tiên hàng đầu của bạn.
                                            PDFSmart cam kết bảo vệ thông tin cá nhân và tài liệu của bạn một cách tuyệt đối.
                                            Chúng tôi không lưu trữ tài liệu của bạn sau khi xử lý và áp dụng các biện pháp bảo mật tiên tiến nhất để đảm bảo an toàn cho dữ liệu của bạn.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="relative overflow-hidden rounded-3xl shadow-xl transform transition-all duration-300 group-hover:-rotate-2"> {/* Increased rounded corners and rotation */}
                            <img
                                src={LogoPower2} // Replace with your image URL
                                alt="Why Choose PDFSmart"
                                className=" w-full h-full object-cover rounded-3xl shadow-2xl border-8 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500" // Increased rounded corners, smoother transition
                            />
                        </div>
                    </div>
                </section>

                {/* Kết luận */}
                <section className="mt-32 mb-16 text-center"> {/* Increased margin and centered text */}
                    <div className="text-xl text-gray-700 bg-blue-50 p-12 rounded-3xl border border-blue-200 shadow-lg"> {/* Increased padding, rounded corners, shadow, larger text */}
                        Hãy để PDFSmart trở thành người bạn đồng hành tin cậy trên hành trình chinh phục tri thức và thành công trong công việc.
                        <br />
                        <b className="text-blue-600 font-semibold">Trải nghiệm PDFSmart ngay hôm nay</b> và khám phá sức mạnh của công nghệ xử lý tài liệu thông minh!
                    </div>
                </section>

            </div>
            <div className="w-full">
                <Footer />
            </div>

        </div>
    );
};

export default NaAboutus;
