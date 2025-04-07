import React, { useState, useEffect } from 'react';
import { ListBulletIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { API_BASE_URL } from "../api/api";

const HistorySummary = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState([]); // Lưu trữ cả ContentHistory và ChatHistory
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null); // Chi tiết mục được chọn
    const [error, setError] = useState(null);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (selectedItem) setSelectedItem(null);
    };

    // Lấy dữ liệu từ API
    useEffect(() => {
        // Sửa lại frontend API call
        const fetchHistory = async () => {
            try {
              setLoading(true);
              const token = localStorage.getItem('token');
              const userId = localStorage.getItem('_id');
              
              // Đảm bảo có đủ thông tin xác thực
              if (!userId || !token) {
                throw new Error('Authentication required');
              }
          
              const config = { 
                headers: { 
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                } 
              };
          
              // Sử dụng đúng endpoint với prefix /api
              const response = await axios.get(
                `${API_BASE_URL}/api/content-history/${userId}`, 
                config
              );
          
              // Xử lý response data
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
        fetchHistory();
    }, []);

    // Xóa một mục từ ContentHistory
    const handleDelete = async (itemId, source) => {
        if (source !== 'content') return; // Chỉ xóa được từ ContentHistory

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
            {isOpen && <div className="fixed inset-0 bg-gray-900/40 z-40" onClick={toggleOpen} />}
            <div
                className={`fixed top-20 left-6 shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'w-96 h-[calc(100vh-8rem)]' : 'w-16 h-16'
                } bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800`}
                style={{ zIndex: 50 }}
            >
                <button
                    className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-2 bg-transparent hover:bg-white/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/60"
                    onClick={toggleOpen}
                >
                    {!isOpen ? (
                        <ListBulletIcon className="w-8 h-8 text-white" />
                    ) : (
                        <XMarkIcon className="w-6 h-6 text-white" />
                    )}
                </button>
                {isOpen && (
                    <div className="bg-white/95 backdrop-blur-xl p-8 h-full overflow-y-auto transition-opacity duration-300 relative">
                        <button
                            className="absolute top-6 right-6 p-2 rounded-full bg-indigo-700 hover:bg-indigo-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={toggleOpen}
                        >
                            <XMarkIcon className="w-5 h-5 text-white" />
                        </button>
                        <h2 className="text-3xl font-bold mb-6 text-indigo-900 tracking-tight">
                            Your Activity History
                        </h2>
                        <p className="text-base text-gray-700 mb-8 leading-relaxed font-medium">
                            View and manage your content summaries and chat interactions.
                        </p>
                        {error && <p className="text-red-600 mb-4">{error}</p>}
                        {loading ? (
                            <p className="text-gray-600">Loading...</p>
                        ) : history.length === 0 ? (
                            <p className="text-gray-600">No history to display.</p>
                        ) : selectedItem ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <button
                                        className="text-indigo-700 font-medium"
                                        onClick={() => setSelectedItem(null)}
                                    >
                                        ← Back
                                    </button>
                                    {selectedItem.source === 'content' && (
                                        <button
                                            className="text-red-600 font-medium"
                                            onClick={() => handleDelete(selectedItem._id, selectedItem.source)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold text-indigo-900">Details</h3>
                                <p><strong>Type:</strong> {selectedItem.type}</p>
                                <p><strong>Content:</strong> {selectedItem.content}</p>
                                {selectedItem.summary && (
                                    <p><strong>{selectedItem.type === 'chat' ? 'Answer' : 'Summary'}:</strong> {selectedItem.summary}</p>
                                )}
                                {selectedItem.url && (
                                    <p>
                                        <strong>URL:</strong>{' '}
                                        <a href={selectedItem.url} target="_blank" rel="noopener noreferrer">
                                            {selectedItem.url}
                                        </a>
                                    </p>
                                )}
                                {selectedItem.source === 'chat' && selectedItem.source && (
                                    <p><strong>Source:</strong> {selectedItem.source}</p>
                                )}
                                <p><strong>Time:</strong> {new Date(selectedItem.timestamp).toLocaleString()}</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {Object.entries(
                                    history.reduce((acc, item) => {
                                        const date = new Date(item.timestamp).toLocaleDateString();
                                        if (!acc[date]) acc[date] = [];
                                        acc[date].push(item);
                                        return acc;
                                    }, {})
                                ).map(([date, items]) => (
                                    <div key={date}>
                                        <h3 className="text-lg font-semibold text-indigo-900 mb-3">{date}</h3>
                                        <ul className="space-y-3">
                                            {items.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-gray-800 flex justify-between items-center cursor-pointer"
                                                    onClick={() => setSelectedItem(item)}
                                                >
                                                    <span>
                                                        {item.type === 'text' && 'Text: ' + (item.content.slice(0, 20) + '...')}
                                                        {item.type === 'pdf' && 'PDF: ' + (item.content.slice(0, 20) + '...')}
                                                        {item.type === 'link' && 'Link: ' + (item.url || item.content.slice(0, 20) + '...')}
                                                        {item.type === 'chat' && 'Chat: ' + (item.content.slice(0, 20) + '...')}
                                                    </span>
                                                    <span className="text-indigo-700 text-sm font-medium">
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