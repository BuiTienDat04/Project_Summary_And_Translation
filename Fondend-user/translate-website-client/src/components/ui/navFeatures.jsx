import React from "react";
import {
  DocumentTextIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  CameraIcon,
  UserCircleIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

const PDFSmartFeatures = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            PDFSmart
          </span> - Giải pháp Xử lý Văn bản Thông minh
        </h1>
        <p className="text-gray-600 mb-6">
        PDFSmart là nền tảng hỗ trợ người dùng xử lý văn bản nhanh chóng và chính xác thông qua các công cụ
        tóm tắt nội dung, trích xuất thông tin quan trọng và dịch thuật đa ngôn ngữ. Với các tính năng tiên tiến,
        PDFSmart giúp tiết kiệm thời gian đọc và hiểu tài liệu, phù hợp cho học tập, nghiên cứu và công việc văn phòng.
      </p>
      
      <h2 className="text-xl font-semibold text-gray-700 mb-3">Tính năng nổi bật của PDFSmart</h2>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={<DocumentTextIcon className="h-8 w-8 text-blue-600" />}
          title="Tóm tắt văn bản tự động"
          features={[
            "AI phân tích nội dung thông minh",
            "Hỗ trợ đa định dạng: DOCX, TXT, PDF",
            "Tùy chỉnh độ dài bản tóm tắt"
          ]}
          color="blue"
        />

        <FeatureCard
          icon={<AcademicCapIcon className="h-8 w-8 text-purple-600" />}
          title="Xử lý PDF chuyên sâu"
          features={[
            "Trích xuất thông tin từ PDF dài",
            "Hỗ trợ tài liệu đa trang phức tạp",
            "Bảo toàn bố cục gốc"
          ]}
          color="purple"
        />

        <FeatureCard
          icon={<GlobeAltIcon className="h-8 w-8 text-green-600" />}
          title="Dịch thuật đa ngôn ngữ"
          features={[
            "Hỗ trợ 50+ ngôn ngữ",
            "Giữ nguyên ngữ cảnh bản gốc",
            "Tốc độ dịch siêu nhanh"
          ]}
          color="green"
        />

        <FeatureCard
          icon={<CameraIcon className="h-8 w-8 text-orange-600" />}
          title="Nhận diện văn bản (OCR)"
          features={[
            "Chuyển ảnh thành văn bản",
            "Nhận diện chữ viết tay",
            "Hỗ trợ JPG, PNG, PDF"
          ]}
          color="orange"
        />

        <FeatureCard
          icon={<UserCircleIcon className="h-8 w-8 text-pink-600" />}
          title="Giao diện thông minh"
          features={[
            "Thiết kế trực quan dễ dùng",
            "Hỗ trợ đa nền tảng",
            "Bảo mật dữ liệu tuyệt đối"
          ]}
          color="pink"
        />
        <FeatureCard
          icon={<ShieldCheckIcon className="h-8 w-8 text-indigo-600" />}
          title="Bảo mật và quyền riêng tư"
          features={[
            "Mã hóa dữ liệu nâng cao",
            "Không lưu trữ tài liệu trên máy chủ",
            "Quyền riêng tư tối đa cho người dùng"
          ]}
          color="indigo"
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, features, color }) => {
  const colorVariants = {
    blue: 'bg-blue-50 hover:border-blue-300',
    purple: 'bg-purple-50 hover:border-purple-300',
    green: 'bg-green-50 hover:border-green-300',
    orange: 'bg-orange-50 hover:border-orange-300',
    pink: 'bg-pink-50 hover:border-pink-300',
    indigo: 'bg-indigo-50 hover:border-indigo-300',
  };

  return (
    <div className={`relative p-6 rounded-xl border-2 border-transparent transition-all duration-300 ${colorVariants[color]} hover:shadow-lg group`}>
      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
        {React.cloneElement(icon, { className: "h-16 w-16" })}
      </div>
      <div className="flex items-start mb-4">
        <div className={`p-3 rounded-lg bg-white shadow-sm border mr-4`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mt-2">{title}</h3>
      </div>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-gray-600">
            <svg
              className="flex-shrink-0 w-5 h-5 text-green-500 mt-1 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PDFSmartFeatures;