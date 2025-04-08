import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { API_BASE_URL } from "../api/api";

Modal.setAppElement("#root");

const AdminHistoryPage = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    const fetchHistories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/content-history`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format: expected array");
        }

        setHistories(data);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistories(); // Gọi ban đầu
    const interval = setInterval(fetchHistories, 3000); // Cập nhật mỗi 3 giây

    return () => clearInterval(interval); // Cleanup khi unmount
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (histories.length === 0) return <div className="p-6">No history data available</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Content Summary History</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">User Email</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Original Content</th>
            <th className="border p-2">Summary</th>
            <th className="border p-2">Timestamp</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {histories.flatMap((history) =>
            history.contents.map((item, index) => (
              <tr key={`${history.userId}-${index}`} className="border hover:bg-gray-100">
                <td className="border p-2">{history.email || "Unknown"}</td>
                <td className="border p-2">{item.type}</td>
                <td
                  className="border p-2 truncate max-w-xs cursor-pointer"
                  onClick={() => setSelectedContent({ ...item, email: history.email })}
                >
                  {item.content?.slice(0, 50)}...
                </td>
                <td className="border p-2 truncate max-w-xs">
                  {item.summary?.slice(0, 50) || "Not available"}
                </td>
                <td className="border p-2">
                  {new Date(item.timestamp).toLocaleString()}
                </td>
                <td className="border p-2">
                  <button
                    disabled
                    className="bg-gray-400 text-white px-3 py-1 rounded text-sm cursor-not-allowed"
                  >
                    N/A
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal xem chi tiết */}
      <Modal
        isOpen={!!selectedContent}
        onRequestClose={() => setSelectedContent(null)}
        contentLabel="Summary Details"
        className="bg-white p-6 rounded-lg max-w-2xl mx-auto mt-24 shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        {selectedContent && (
          <div>
            <h3 className="text-xl font-bold mb-2">Summary Details</h3>
            <p><strong>User:</strong> {selectedContent.email || "Unknown"}</p>
            <p><strong>Type:</strong> {selectedContent.type}</p>
            <p><strong>Original Content:</strong></p>
            <div className="bg-gray-100 p-3 rounded mb-3 whitespace-pre-wrap">
              {selectedContent.content}
            </div>
            <p><strong>Summary:</strong></p>
            <div className="bg-green-100 p-3 rounded whitespace-pre-wrap">
              {selectedContent.summary || "Not available"}
            </div>
            {selectedContent.url && (
              <p className="mt-3">
                <strong>URL:</strong>{" "}
                <a
                  href={selectedContent.url}
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {selectedContent.url}
                </a>
              </p>
            )}
            <button
              onClick={() => setSelectedContent(null)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminHistoryPage;