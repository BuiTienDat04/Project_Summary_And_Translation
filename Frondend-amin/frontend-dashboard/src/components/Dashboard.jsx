import React, { useEffect, useState } from "react";
import StatisticsChart from "../components/StatisticsChart";
import { API_BASE_URL } from "../api/api";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    translatedPosts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy token từ localStorage
        const token = localStorage.getItem("token");

        // Kiểm tra nếu không có token, yêu cầu người dùng đăng nhập lại
        if (!token) {
          setError("No token found, please log in again.");
          return;
        }

        // Gửi yêu cầu với header Authorization chứa token
        const response = await axios.get(`${API_BASE_URL}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        });

        setData({
          totalUsers: response.data.totalUsers,
          translatedPosts: response.data.translatedPosts,
        });
        setError(null);
      } catch (err) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-6 min-h-screen flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{`Error: ${error}`}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-4xl font-bold">{data.totalUsers}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-lg font-semibold">Translated Posts</h2>
          <p className="text-4xl font-bold">{data.translatedPosts}</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-100 to-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">📊 Statistics Overview</h2>
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
