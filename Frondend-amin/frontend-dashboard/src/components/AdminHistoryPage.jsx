import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { FiTrash2 } from "react-icons/fi";
import { API_BASE_URL } from "../api/api";

Modal.setAppElement("#root");

const AdminHistoryPage = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);

  const deleteUserContent = async (userId, contentId, token) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/delete-content/${userId}/${contentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete content");
      }

      return data;
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  };

  useEffect(() => {
    let interval;

    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in again.");
        }

        const contentRes = await fetch(`${API_BASE_URL}/admin/content-history/500`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!contentRes.ok) {
          const errorData = await contentRes.json();
          throw new Error(errorData.message || "Failed to fetch content history");
        }

        const contentData = await contentRes.json();

        if (!Array.isArray(contentData)) {
          throw new Error("Invalid data format");
        }

        setHistories(contentData);
        // Khởi động lại interval nếu gọi API thành công
        if (!interval) {
          interval = setInterval(fetchAll, 10000);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        // Dừng interval nếu có lỗi
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (error) {
    return (
      <div className="p-6 text-red-500">
        <p>Lỗi: {error}</p>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchAll();
          }}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Thử lại
        </button>
      </div>
    );
  }
  if (histories.length === 0) return <div className="p-6 text-gray-500">Không có dữ liệu lịch sử nào để hiển thị.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lịch sử tóm tắt nội dung người dùng</h2>

      <div className="overflow-y-auto max-h-[500px] border rounded-lg mb-12">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr className="sticky top-0 bg-gray-200 z-10">
              <th className="border p-2">Email người dùng</th>
              <th className="border p-2">Loại</th>
              <th className="border p-2">Nội dung gốc</th>
              <th className="border p-2">Tóm tắt</th>
              <th className="border p-2">Thời gian</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {[]
              .concat(
                ...histories.map((history) =>
                  history.contents.map((item) => ({
                    ...item,
                    email: history.email,
                    userId: history.userId,
                  }))
                )
              )
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((item, index) => (
                <tr key={`${item.userId}-${item._id}-${index}`} className="border hover:bg-gray-100">
                  <td className="border p-2">{item.email || "Không xác định"}</td>
                  <td className="border p-2">{item.type}</td>
                  <td
                    className="border p-2 truncate max-w-xs cursor-pointer"
                    onClick={() => setSelectedContent(item)}
                  >
                    {item.content?.slice(0, 50)}...
                  </td>
                  <td
                    className="border p-2 truncate max-w-xs cursor-pointer"
                    onClick={() => setSelectedContent(item)}
                  >
                    {item.summary?.slice(0, 50) || "Không có"}
                  </td>
                  <td className="border p-2">{new Date(item.timestamp).toLocaleString()}</td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={async () => {
                        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa nội dung này?");
                        if (!confirmDelete) return;
                        try {
                          const token = localStorage.getItem("token");
                          await deleteUserContent(item.userId, item._id, token);
                          setHistories((prev) =>
                            prev.map((h) =>
                              h.userId === item.userId
                                ? { ...h, contents: h.contents.filter((c) => c._id !== item._id) }
                                : h
                            )
                          );
                        } catch (err) {
                          alert("Xóa thất bại: " + err.message);
                        }
                      }}
                      title="Xóa"
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!selectedContent}
        onRequestClose={() => setSelectedContent(null)}
        contentLabel="Chi tiết tóm tắt"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg max-w-2xl w-full shadow-lg max-h-[80vh] overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
      >
        {selectedContent && (
          <div>
            <h3 className="text-xl font-bold mb-2">Chi tiết tóm tắt</h3>
            <p><strong>Người dùng:</strong> {selectedContent.email || "Không xác định"}</p>
            <p><strong>Loại:</strong> {selectedContent.type}</p>
            <p className="mt-3"><strong>Nội dung gốc:</strong></p>
            <div className="bg-gray-100 p-3 rounded mb-3 whitespace-pre-wrap">
              {selectedContent.content}
            </div>
            <p><strong>Tóm tắt:</strong></p>
            <div className="bg-green-100 p-3 rounded whitespace-pre-wrap">
              {selectedContent.summary || "Không có"}
            </div>
            {selectedContent.url && (
              <p className="mt-3">
                <strong>URL:</strong>{" "}
                <a href={selectedContent.url} className="text-blue-500 underline" target="_blank" rel="noreferrer">
                  {selectedContent.url}
                </a>
              </p>
            )}
            <button
              onClick={() => setSelectedContent(null)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Đóng
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminHistoryPage;