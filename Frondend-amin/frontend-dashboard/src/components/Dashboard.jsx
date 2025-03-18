import React, { useEffect, useState } from "react";
import StatisticsChart from "../components/StatisticsChart";

const Dashboard = () => {
  const [data, setData] = useState({ totalUsers: 0, translatedPosts: 0, totalVisits: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🟢 Fetch Dashboard Data (Cập nhật liên tục)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/dashboard");
        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Gọi API ngay khi component load

    // 🔄 Cập nhật dữ liệu mỗi 5 giây
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval); // Clear interval khi rời khỏi trang
  }, []);

  // 🔴 Loading State
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  // 🔴 Error State
  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

      {/* Stats Cards */}
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
          <p className="text-4xl font-bold">{data.totalVisits}</p>
        </div>
      </div>

      {/* Statistics Chart */}
      <div className="bg-gradient-to-br from-gray-100 to-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
          📊 Statistics Overview
        </h2>
        <StatisticsChart
          data={[
            { name: "Total Users", value: data.totalUsers },
            { name: "Translated Posts", value: data.translatedPosts },
            { name: "Total Visits", value: data.totalVisits },
          ]}
        />
      </div>

    </div>
  );
};

export default Dashboard;
