import React, { useState, useEffect } from 'react';
import { ListBulletIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { API_BASE_URL } from "../api/api";

const HistorySummary = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false); // Bắt đầu không loading
    const [selectedItem, setSelectedItem] = useState(null);
    const [error, setError] = useState(null);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (selectedItem) setSelectedItem(null);
    };

    // Hàm lấy dữ liệu lịch sử
    const fetchHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('_id');

            if (!userId || !token) {
                throw new Error('Authentication required');
            }

            const config = { 
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                } 
            };

            const response = await axios.get(`${API_BASE_URL}/api/content-history/${userId}`, config);

            if (response.data.status === 'success') {
                setHistory(response.data.data.history || []);
            } else {
                setError(response.data.message || 'Failed to load history');
            }
        } catch (error) {
            console.error('Fetch history error:', error);
            setError(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    // Lấy dữ liệu khi component mount
    useEffect(() => {
        fetchHistory();
    }, []);

    // Xóa một mục từ ContentHistory
    const handleDelete = async (itemId, source) => {
        if (source !== 'content') return;

        try {
            const token = localStorage.getItem('token');
            const _id = localStorage.getItem('_id');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.delete(`${API_BASE_URL}/content-history/${_id}/${itemId}`, config);
            setHistory(history.filter(item => item._id !== itemId));
            setSelectedItem(null);
        } catch (error) {
            console.error('Error deleting history item:', error);
            setError('Failed to delete history item. Please try again.');
        }
    };

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/50 z-40 backdrop-blur-sm" 
                    onClick={toggleOpen} 
                />
            )}
            <div
                className={`fixed top-20 left-6 shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 ease-in-out z-50 ${
                    isOpen ? 'w-96 h-[calc(100vh-8rem)]' : 'w-14 h-14'
                } bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700`}
            >
                {/* Nút mở/đóng */}
                <button
                    className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-2 bg-transparent hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-2xl"
                    onClick={toggleOpen}
                >
                    {!isOpen ? (
                        <ListBulletIcon className="w-7 h-7 text-white" />
                    ) : (
                        <XMarkIcon className="w-6 h-6 text-white" />
                    )}
                </button>

                {isOpen && (
                    <div className="bg-white/90 backdrop-blur-md p-6 h-full overflow-y-auto text-gray-800">
                        {/* Header với nút Refresh */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-indigo-800 tracking-tight">
                                Activity History
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={fetchHistory}
                                    className="p-2 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    title="Refresh history"
                                >
                                    <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                                </button>
                                <button
                                    onClick={toggleOpen}
                                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Mô tả */}
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                            Explore your past summaries and chat interactions.
                        </p>

                        {/* Trạng thái */}
                        {error && (
                            <p className="text-red-500 bg-red-50 p-2 rounded-md mb-4 text-sm">{error}</p>
                        )}
                        {loading && (
                            <div className="text-center text-gray-500">
                                <ArrowPathIcon className="w-6 h-6 animate-spin mx-auto mb-2" />
                                <p>Loading...</p>
                            </div>
                        )}

                        {!loading && history.length === 0 && (
                            <p className="text-gray-500 text-center italic">No history available yet.</p>
                        )}

                        {/* Chi tiết mục được chọn */}
                        {!loading && history.length > 0 && selectedItem && (
                            <div className="space-y-4 bg-gray-50 p-4 rounded-xl shadow-inner">
                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => setSelectedItem(null)}
                                        className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                                    >
                                        <span>←</span> Back
                                    </button>
                                    {selectedItem.source === 'content' && (
                                        <button
                                            onClick={() => handleDelete(selectedItem._id, selectedItem.source)}
                                            className="text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                                        >
                                            <TrashIcon className="w-4 h-4" /> Delete
                                        </button>
                                    )}
                                </div>
                                <h3 className="text-lg font-semibold text-indigo-700">Details</h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Type:</span> {selectedItem.type}</p>
                                    <p><span className="font-medium">Content:</span> {selectedItem.content}</p>
                                    {selectedItem.summary && (
                                        <p><span className="font-medium">{selectedItem.type === 'chat' ? 'Answer' : 'Summary'}:</span> {selectedItem.summary}</p>
                                    )}
                                    {selectedItem.url && (
                                        <p>
                                            <span className="font-medium">URL:</span>{' '}
                                            <a href={selectedItem.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {selectedItem.url}
                                            </a>
                                        </p>
                                    )}
                                    {selectedItem.source && (
                                        <p><span className="font-medium">Source:</span> {selectedItem.source}</p>
                                    )}
                                    <p><span className="font-medium">Time:</span> {new Date(selectedItem.timestamp).toLocaleString()}</p>
                                </div>
                            </div>
                        )}

                        {/* Danh sách lịch sử */}
                        {!loading && history.length > 0 && !selectedItem && (
                            <div className="space-y-6">
                                {Object.entries(
                                    history.reduce((acc, item) => {
                                        const date = new Date(item.timestamp).toLocaleDateString();
                                        if (!acc[date]) acc[date] = [];
                                        acc[date].push(item);
                                        return acc;
                                    }, {})
                                ).map(([date, items]) => (
                                    <div key={date} className="space-y-3">
                                        <h3 className="text-md font-semibold text-indigo-700 bg-indigo-50 p-2 rounded-md">
                                            {date}
                                        </h3>
                                        <ul className="space-y-2">
                                            {items.map((item, index) => (
                                                <li
                                                    key={index}
                                                    onClick={() => setSelectedItem(item)}
                                                    className="p-3 bg-white rounded-lg shadow-sm hover:bg-indigo-50 transition-all duration-200 cursor-pointer flex justify-between items-center border border-gray-100"
                                                >
                                                    <span className="text-sm truncate max-w-[70%]">
                                                        {item.type === 'text' && 'Text: ' + (item.content.slice(0, 30) + '...')}
                                                        {item.type === 'pdf' && 'PDF: ' + (item.content.slice(0, 30) + '...')}
                                                        {item.type === 'link' && 'Link: ' + (item.url || item.content.slice(0, 30) + '...')}
                                                        {item.type === 'chat' && 'Chat: ' + (item.content.slice(0, 30) + '...')}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(item.timestamp).toLocaleTimeString()}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className={`transition-all duration-500 ${isOpen ? 'ml-[26rem]' : 'ml-20'}`}>
                {/* Placeholder cho nội dung chính */}
            </div>
        </>
    );
};

export default HistorySummary;