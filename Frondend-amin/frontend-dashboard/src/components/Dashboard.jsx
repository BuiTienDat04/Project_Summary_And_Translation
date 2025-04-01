import React, { useEffect, useState } from "react";
import StatisticsChart from "../components/StatisticsChart";
import { API_BASE_URL } from "../api/api";

const Dashboard = () => {
  // Chỉ giữ lại state cho dữ liệu lấy từ API
  const [data, setData] = useState({
    totalUsers: 0,
    translatedPosts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 2. Fetch dữ liệu từ REST API (Giữ nguyên)
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard`);
        if (!response.ok) {
          // Nếu lỗi fetch, không nên clear interval mà chỉ báo lỗi
           throw new Error(`Failed to fetch data (status: ${response.status})`);
        }

        const result = await response.json();
        // Chỉ cập nhật state với dữ liệu từ API
        setData({ 
          totalUsers: result.totalUsers,
          translatedPosts: result.translatedPosts
        });
        setError(null); // Xóa lỗi nếu fetch thành công
      } catch (err) {
         console.error("Fetch data error:", err.message); // Log lỗi ra console
         setError(err.message); // Hiển thị lỗi cho người dùng nếu cần
      } finally {
         // Chỉ set loading false lần đầu tiên
         if (loading) {
            setLoading(false);
         }
      }
    };

    // Fetch lần đầu ngay khi mount
    fetchData();
    // Thiết lập interval để fetch định kỳ
    const interval = setInterval(fetchData, 3000); // Giữ nguyên interval

    // Cleanup: Dọn dẹp interval khi component unmount
    return () => {
      clearInterval(interval);
    };
  }, [loading]); // Thêm loading vào dependency array để finally chỉ chạy setLoading(false) lần đầu

  // Hiển thị trạng thái loading
  if (loading) {
     return <div className="p-6 min-h-screen flex justify-center items-center">Loading dashboard data...</div>;
  }

  // Hiển thị lỗi nếu có
  if (error && !data.totalUsers && !data.translatedPosts) { // Chỉ hiển thị lỗi toàn màn hình nếu không có dữ liệu cũ
     return <div className="p-6 min-h-screen flex justify-center items-center text-red-500">Error loading data: {error}</div>;
  }


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

       {/* Hiển thị lỗi nhỏ nếu có lỗi fetch sau lần đầu */}
       {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">Could not refresh data: {error}</div>}


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card Total Users */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-4xl font-bold">{data.totalUsers}</p>
        </div>
        {/* Card Translated Posts */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-lg font-semibold">Translated Posts</h2>
          <p className="text-4xl font-bold">{data.translatedPosts}</p>
        </div>
        {/* Các card khác nếu có */}
      </div>

      {/* Biểu đồ thống kê */}
      <div className="bg-gradient-to-br from-gray-100 to-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
          📊 Statistics Overview
        </h2>
        {/* Chỉ hiển thị biểu đồ nếu có dữ liệu */}
        {data.totalUsers > 0 || data.translatedPosts > 0 ? (
          <StatisticsChart
            data={[
              { name: "Total Users", value: data.totalUsers },
              { name: "Translated Posts", value: data.translatedPosts },
            ]}
          />
        ) : (
          <p className="text-gray-500">No data available for chart.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;