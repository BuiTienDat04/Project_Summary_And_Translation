import React from 'react';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/solid';

const ContactInfo = ({ icon, title, content }) => (
  <div className="group relative flex items-start space-x-5 bg-white/95 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-gray-100/90 hover:border-indigo-100 backdrop-blur-sm flex-1 min-w-[280px]">
    <div className="p-3 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl shadow-sm transform group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { className: icon.props.className + ' transform group-hover:rotate-12 transition-transform' })}
    </div>
    <div className="flex-1 space-y-2.5">
      <h3 className="text-xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
        {title}
      </h3>
      <div className="text-gray-600 leading-relaxed font-medium text-[15.5px]">
        {content}
      </div>
    </div>
    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-indigo-100/50 transition-all pointer-events-none" />
  </div>
);

const naContact = () => (
  <div className="bg-gradient-to-br from-[#f8faff] to-indigo-50/30 py-16 lg:py-24 relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-200/20 to-transparent blur-2xl" />
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          <span className="relative inline-block">
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              Kết nối cùng chúng tôi
            </span>
            <span className="absolute -bottom-2 left-0 w-full h-3 bg-indigo-100/80 rounded-full z-0" />
          </span>
        </h2>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
          Chúng tôi luôn sẵn sàng hỗ trợ 24/7 qua đa kênh kết nối
        </p>
      </div>

      <div className="flex justify-center transform transition-all duration-500 hover:scale-[0.99]">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl w-full max-w-6xl border border-gray-100/90 hover:shadow-2xl transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
            <ContactInfo
              icon={<PhoneIcon className="h-8 w-8 text-indigo-600" />}
              title="Hỗ trợ 24/7"
              content={
                <div className="space-y-1.5">
                  <a href="tel:+84123456789" className="inline-block text-lg font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                    +84 123 456 789
                  </a>
                  <p className="text-sm text-gray-500">Tư vấn kỹ thuật & Bảo hành</p>
                </div>
              }
            />

            <ContactInfo
              icon={<EnvelopeIcon className="h-8 w-8 text-blue-500" />}
              title="Liên hệ qua Email"
              content={
                <div className="space-y-1.5">
                  <a href="mailto:support@pdfsmart.com" className="inline-block text-lg font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    support@pdfsmart.com
                  </a>
                  <p className="text-sm text-gray-500">Phản hồi trong 1 giờ làm việc</p>
                </div>
              }
            />

            <ContactInfo
              icon={<MapPinIcon className="h-8 w-8 text-purple-500" />}
              title="Trụ sở toàn cầu"
              content={
                <div className="space-y-1.5">
                  <a href="https://goo.gl/maps/..." target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-purple-600 transition-colors text-lg font-medium">
                    Tầng 12, Toà nhà Sunrise, Hà Nội
                  </a>
                  <div className="flex gap-2 text-sm text-gray-500">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md">HQ Chính</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md">5 Chi nhánh</span>
                  </div>
                </div>
              }
            />

            <ContactInfo
              icon={<ClockIcon className="h-8 w-8 text-cyan-500" />}
              title="Giờ làm việc"
              content={
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="font-medium text-gray-700">Thứ 2 - Thứ 6: 8:00 - 17:00</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                    <span className="font-medium text-gray-500">Thứ 7: 8:00 - 12:00</span>
                  </div>
                </div>
              }
            />
          </div>

          <div className="pt-12 mt-12 border-t border-gray-200/80">
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                Kết nối mạng xã hội
              </h3>
              <div className="flex justify-center gap-4">
                {[
                  { 
                    href: "#", 
                    icon: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
                    color: "text-blue-600",
                    name: "Facebook"
                  },
                  {
                    href: "#",
                    icon: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
                    color: "text-sky-400",
                    name: "Twitter"
                  },
                  {
                    href: "#",
                    icon: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z",
                    color: "text-blue-700",
                    name: "LinkedIn"
                  },
                  {
                    href: "#",
                    icon: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z",
                    color: "text-red-600",
                    name: "YouTube"
                  }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-2xl ${social.color} hover:bg-gradient-to-br from-white to-gray-50 transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200/80 hover:border-indigo-200 group`}
                    aria-label={social.name}
                  >
                    <svg
                      className="h-7 w-7 transform group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default naContact;