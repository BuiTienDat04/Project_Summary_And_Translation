import React, { useEffect, useState } from "react";
import StatisticsChart from "../components/StatisticsChart";
import { API_BASE_URL } from "../api/api";
import { io } from "socket.io-client";

const Dashboard = () => {
  const [data, setData] = useState({ 
    totalUsers: 0, 
    translatedPosts: 0,
    total: 0 // Đổi tên thành total thay vì totalOnline
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Kết nối Socket.IO
    const socket = io("wss://api.pdfsmart.online", {
      path: "/socket.io",
      query: { userId: "dashboard" }
    });

    // Lắng nghe sự kiện cập nhật
    socket.on("updateTotalOnline", (count) => {
      setData(prev => ({ ...prev, total: count })); // Cập nhật total thay vì totalOnline
      console.log("Received visit count:", count);
    });

    // Xử lý lỗi kết nối
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    // 2. Fetch dữ liệu từ REST API
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard`);
        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();
        setData(prev => ({
          ...prev,
          totalUsers: result.totalUsers,
          translatedPosts: result.translatedPosts
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);

    // Cleanup
    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-4xl font-bold">{data.totalUsers}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-lg font-semibold">Translated Posts</h2>
          <p className="text-4xl font-bold">{data.translatedPosts}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-lg font-semibold">Total Visits</h2>
          <p className="text-4xl font-bold">{data.total}</p> {/* Sử dụng data.total */}
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-100 to-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
          📊 Statistics Overview
        </h2>
        <StatisticsChart
          data={[
            { name: "Total Users", value: data.totalUsers },
            { name: "Translated Posts", value: data.translatedPosts },
            { name: "Total Visits", value: data.total }, {/* Sử dụng data.total */}
          ]}
        />
      </div>
    </div>
  );
};

export default Dashboard;