import React from 'react';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/solid';

const ContactInfo = ({ icon, title, content }) => (
    <div className="flex items-start md:items-center space-x-4 bg-gray-50 p-6 rounded-xl shadow-sm hover:scale-[1.02] transition-transform flex-1 min-w-[300px] w-full">
        <div className="p-3 bg-white rounded-xl shadow-md flex-shrink-0">{icon}</div>
        <div className="flex-1 overflow-hidden">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <div className="text-base md:text-lg text-gray-600 break-words whitespace-pre-line leading-relaxed">
                {content}
            </div>
        </div>
    </div>
);

const naContact = () => (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-100 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4 relative">
                    <span className="relative z-10 inline-block">
                        Kết nối cùng chúng tôi
                        <div className="absolute bottom-0 left-0 w-full h-2 bg-blue-200 transform translate-y-2 z-0"></div>
                    </span>
                </h2>
            </div>

            <div className="flex justify-center">
                <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-6xl">
                    <div className="mb-10 text-center">
                        <p className="text-xl text-gray-700 mb-6 leading-loose">
                            Chúng tôi luôn sẵn lòng lắng nghe và hỗ trợ bạn qua các kênh liên hệ sau:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ContactInfo
                            icon={<PhoneIcon className="h-8 w-8 text-blue-600" />}
                            title="Hotline 24/7"
                            content={<a href="tel:+84123456789" className="text-blue-600 hover:text-blue-700 font-medium transition-colors text-lg">+84 123 456 789</a>}
                        />
                        <ContactInfo
                            icon={<EnvelopeIcon className="h-8 w-8 text-green-600" />}
                            title="Email hỗ trợ"
                            content={<a href="mailto:support@pdfsmart.com" className="text-green-600 hover:text-green-700 font-medium transition-colors text-lg">support@pdfsmart.com</a>}
                        />
                        <ContactInfo
                            icon={<MapPinIcon className="h-8 w-8 text-purple-600" />}
                            title="Trụ sở chính"
                            content={<a href="https://goo.gl/maps/..." target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-purple-600 transition-colors text-lg">Tầng 12, Toà nhà Sunrise, Hà Nội</a>}
                        />
                        <ContactInfo
                            icon={<ClockIcon className="h-8 w-8 text-orange-600" />}
                            title="Giờ làm việc"
                            content={<div className="text-lg"><span className="text-gray-700 block">Thứ 2 - Thứ 6: 8:00 - 17:00</span><span className="text-gray-500">Thứ 7: 8:00 - 12:00</span></div>}
                        />
                    </div>

                    <div className="pt-10 border-t border-gray-200 mt-12">
                        <h3 className="text-2xl font-medium text-gray-900 mb-6 text-center">Kết nối với chúng tôi</h3>
                        <div className="flex justify-center gap-6">
                            {[
                                { href: "#", icon: "facebook", color: "text-blue-600" },
                                { href: "#", icon: "twitter", color: "text-sky-500" },
                                { href: "#", icon: "linkedin", color: "text-blue-700" },
                                { href: "#", icon: "youtube", color: "text-red-600" }
                            ].map((social, idx) => (
                                <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer"
                                    className={`${social.color} hover:opacity-75 transition-opacity p-3 rounded-full hover:bg-gray-100`}>
                                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        {/* Giữ nguyên các path icons */}
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default naContact;