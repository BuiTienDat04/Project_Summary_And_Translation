import React, { useState } from 'react';
import { ListBulletIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';

const HistorySummary = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/40 z-40"
                    onClick={toggleOpen}
                />
            )}

            <div
                className={`fixed top-20 left-6 shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'w-96 h-[calc(100vh-8rem)]' : 'w-16 h-16'
                    } bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800`}
                style={{ zIndex: 50 }}
            >
                {/* Toggle Button */}
                <button
                    className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-2 bg-transparent hover:bg-white/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/60"
                    onClick={toggleOpen}
                >
                    {!isOpen ? (
                        <ListBulletIcon className="w-8 h-8 text-white" />
                    ) : (
                        <div className="w-8 h-8 flex items-center justify-center">
                            <XMarkIcon className="w-6 h-6 text-white" />
                        </div>
                    )}
                </button>

                {/* Content when open */}
                {isOpen && (
                    <div className="bg-white/95 backdrop-blur-xl p-8 h-full overflow-y-auto transition-opacity duration-300 relative">
                        {/* Close Button */}
                        <button
                            className="absolute top-6 right-6 p-2 rounded-full bg-indigo-700 hover:bg-indigo-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={toggleOpen}
                        >
                            <XMarkIcon className="w-5 h-5 text-white" />
                        </button>

                        <h2 className="text-3xl font-bold mb-6 text-indigo-900 tracking-tight">
                            Your Translation & Summarization Log
                        </h2>
                        <p className="text-base text-gray-700 mb-8 leading-relaxed font-medium">
                            Easily access and manage your history of translated texts and summarized documents.
                        </p>

                        <div className="space-y-8">
                            {/* Activity Group 1 */}
                            <ul className="space-y-3">
                                <li className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-gray-800 flex justify-between items-center">
                                    <span>Action 1</span>
                                    <span className="text-indigo-700 text-sm font-medium">10:30 AM</span>
                                </li>
                                <li className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-gray-800 flex justify-between items-center">
                                    <span>Action 2</span>
                                    <span className="text-indigo-700 text-sm font-medium">12:15 PM</span>
                                </li>
                                <li className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-gray-800 flex justify-between items-center">
                                    <span>Action 3</span>
                                    <span className="text-indigo-700 text-sm font-medium">3:45 PM</span>
                                </li>
                            </ul>

                            {/* Activity Group 2 */}
                            <ul className="space-y-3">
                                <li className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-gray-800 flex justify-between items-center">
                                    <span>Action 4</span>
                                    <span className="text-indigo-700 text-sm font-medium">10:30 AM</span>
                                </li>
                                <li className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-gray-800 flex justify-between items-center">
                                    <span>Action 5</span>
                                    <span className="text-indigo-700 text-sm font-medium">12:15 PM</span>
                                </li>
                                <li className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-gray-800 flex justify-between items-center">
                                    <span>Action 6</span>
                                    <span className="text-indigo-700 text-sm font-medium">3:45 PM</span>
                                </li>
                            </ul>

                            {/* Activity Group 3 */}
                            <ul className="space-y-3">
                                <li className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-gray-800 flex justify-between items-center">
                                    <span>Action 7</span>
                                    <span className="text-indigo-700 text-sm font-medium">10:30 AM</span>
                                </li>
                                <li className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-gray-800 flex justify-between items-center">
                                    <span>Action 8</span>
                                    <span className="text-indigo-700 text-sm font-medium">12:15 PM</span>
                                </li>
                                <li className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-gray-800 flex justify-between items-center">
                                    <span>Action 9</span>
                                    <span className="text-indigo-700 text-sm font-medium">3:45 PM</span>
                                </li>
                            </ul>

                            {/* Activity Group 4 */}
                            <ul className="space-y-3">
                                <li className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-gray-800 flex justify-between items-center">
                                    <span>Action 10</span>
                                    <span className="text-indigo-700 text-sm font-medium">10:30 AM</span>
                                </li>
                                <li className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-gray-800 flex justify-between items-center">
                                    <span>Action 11</span>
                                    <span className="text-indigo-700 text-sm font-medium">12:15 PM</span>
                                </li>
                                <li className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-gray-800 flex justify-between items-center">
                                    <span>Action 12</span>
                                    <span className="text-indigo-700 text-sm font-medium">3:45 PM</span>
                                </li>
                            </ul>
                        </div>

                    </div>
                )}
            </div>

            {/* Main content shift */}
            <div
                className={`transition-all duration-500 ${isOpen ? 'ml-[26rem]' : 'ml-20'
                    }`}
            >
                {/* Placeholder for main content */}
            </div>
        </>
    );
};

export default HistorySummary;