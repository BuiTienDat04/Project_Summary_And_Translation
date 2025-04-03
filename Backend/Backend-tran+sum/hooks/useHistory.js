import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from "../api/api";

const useHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            if (!userId || !token) throw new Error('Authentication credentials missing');

            const config = { headers: { Authorization: `Bearer ${token}` } };
            const [contentResponse, chatResponse] = await Promise.all([
                axios.get(`${API_BASE_URL}/content-history/${userId}`, config),
                axios.get(`${API_BASE_URL}/chat-history/${userId}`, config),
            ]);

            const contentHistory = (contentResponse.data.history || []).map(item => ({
                ...item,
                source: 'content',
            }));
            const chatHistory = (chatResponse.data.history || []).map(item => ({
                type: 'chat',
                content: item.question,
                summary: item.answer,
                source: item.source || 'chat',
                timestamp: item.timestamp || Date.now(),
                _id: item._id,
            }));

            const combinedHistory = [...contentHistory, ...chatHistory].sort(
                (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
            );
            setHistory(combinedHistory);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to load history');
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return { history, loading, error, refetch: fetchHistory };
};

export default useHistory;