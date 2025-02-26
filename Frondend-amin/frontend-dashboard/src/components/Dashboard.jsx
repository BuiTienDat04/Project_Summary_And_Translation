import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate(); // Hook for navigation

  // Mock data for demonstration
  const usersCount = 120;
  const postsCount = 450;
  const translatedPostsCount = 300;
  const visitsCount = 1200;

  // Function to handle User Management button click
  const handleUserManagementClick = () => {
    navigate("/user-management"); // Navigate to the User Management page
  };

  // Function to handle Post Management button click
  const handlePostManagementClick = () => {
    navigate("/post-management"); // Navigate to the Post Management page
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-4xl font-bold">{usersCount}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-lg font-semibold">Total Posts</h2>
          <p className="text-4xl font-bold">{postsCount}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-lg font-semibold">Translated Posts</h2>
          <p className="text-4xl font-bold">{translatedPostsCount}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-lg font-semibold">Total Visits</h2>
          <p className="text-4xl font-bold">{visitsCount}</p>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistics Chart</h2>
        <div className="h-64 bg-gray-100 flex items-center justify-center rounded-lg">
          <p className="text-gray-500">Chart will be displayed here</p>
        </div>
      </div>

      {/* Quick Access Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleUserManagementClick}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          User Management
        </button>
      </div>
    </div>
  );
};

export default Dashboard;