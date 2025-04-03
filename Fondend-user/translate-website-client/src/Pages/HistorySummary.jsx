import React, { useState, useEffect } from 'react';
import { ListBulletIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { API_BASE_URL } from "../api/api";

const HistorySummary = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState([]); // Store history from API
    const [loading, setLoading] = useState(true); // Loading state
    const [selectedItem, setSelectedItem] = useState(null); // Track selected history item for details
    const [error, setError] = useState(null); // Error state for API calls

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (selectedItem) setSelectedItem(null); // Close details when closing the panel
    };

    // Fetch history from API when component mounts
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem('token'); // Get token from localStorage
                const response = await axios.get(`${API_BASE_URL}/api/user/history`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setHistory(response.data.contents || []); // Store the contents array
                setLoading(false);
            } catch (error) {
                console.error('Error fetching history:', error);
                setError('Failed to load history. Please try again later.');
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // Handle deletion of a history item
    const handleDelete = async (contentId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/user/history/${contentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setHistory(history.filter((item) => item._id !== contentId)); // Remove deleted item from state
            setSelectedItem(null); // Close the details view
        } catch (error) {
            console.error('Error deleting history item:', error);
            setError('Failed to delete history item. Please try again.');
        }
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
                className={`fixed top-20 left-6 shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'w-96 h-[calc(100vh-8rem)]' : 'w-16 h-16'
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

                        {error && (
                            <p className="text-red-600 mb-4">{error}</p>
                        )}

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
                                    <button
                                        className="text-red-600 font-medium"
                                        onClick={() => handleDelete(selectedItem._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                                <h3 className="text-xl font-semibold text-indigo-900">Details</h3>
                                <p><strong>Type:</strong> {selectedItem.type}</p>
                                <p><strong>Content:</strong> {selectedItem.content}</p>
                                {selectedItem.summary && (
                                    <p><strong>Summary:</strong> {selectedItem.summary}</p>
                                )}
                                {selectedItem.url && (
                                    <p>
                                        <strong>URL:</strong>{' '}
                                        <a href={selectedItem.url} target="_blank" rel="noopener noreferrer">
                                            {selectedItem.url}
                                        </a>
                                    </p>
                                )}
                                <p>
                                    <strong>Time:</strong>{' '}
                                    {new Date(selectedItem.timestamp).toLocaleString()}
                                </p>
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
                                                        {item.type === 'text' &&
                                                            'Text: ' + (item.content.slice(0, 20) + '...')}
                                                        {item.type === 'pdf' &&
                                                            'PDF: ' + (item.content.slice(0, 20) + '...')}
                                                        {item.type === 'link' &&
                                                            'Link: ' + (item.url || item.content.slice(0, 20) + '...')}
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

            {/* Main content shift */}
            <div
                className={`transition-all duration-500 ${isOpen ? 'ml-[26rem]' : 'ml-20'}`}
            >
                {/* Placeholder for main content */}
            </div>
        </>
    );
};

export default HistorySummary;