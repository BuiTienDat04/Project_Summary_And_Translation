import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { FiTrash2 } from "react-icons/fi";
import { API_BASE_URL } from "../api/api";

Modal.setAppElement("#root");

const AdminHistoryPage = () => {
  const [histories, setHistories] = useState([]);
  const [chatHistories, setChatHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedContent, setSelectedContent] = useState(null);

  const fetchAllHistories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Missing token");

      const [contentRes, chatRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/content-history`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/admin/chat-history`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const contentData = await contentRes.json();
      const chatData = await chatRes.json();

      if (!contentRes.ok) throw new Error(contentData.message || "Failed to fetch content history");
      if (!chatRes.ok) throw new Error(chatData.message || "Failed to fetch chat history");

      if (!Array.isArray(contentData) || !Array.isArray(chatData)) {
        throw new Error("Invalid data format");
      }

      setHistories(contentData);
      setChatHistories(chatData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllHistories();
    const interval = setInterval(fetchAllHistories, 3000);
    return () => clearInterval(interval);
  }, []);

  const deleteUserContent = async (userId, contentId, token) => {
    const res = await fetch(`${API_BASE_URL}/admin/delete-content/${userId}/${contentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete content");
    return data;
  };

  const deleteChatMessage = async (userId, chatId, token) => {
    console.log("Sending DELETE request:", { userId, chatId }); // Thêm log
    if (!token) throw new Error("No authentication token found");
    const res = await fetch(`${API_BASE_URL}/admin/delete-chat/${userId}/${chatId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    console.log("Delete response:", { status: res.status, data });
    if (!res.ok) throw new Error(data.message || "Failed to delete chat message");
    return data;
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (histories.length === 0 && chatHistories.length === 0) return <div className="p-6">No data available</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Content Summary History</h2>
      {/* Content Summary Table */}
      <div className="overflow-x-auto overflow-y-auto max-h-[500px] border rounded-lg mb-12">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr className="sticky top-0 bg-gray-200 z-10">
              <th className="border p-2">User Email</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Original Content</th>
              <th className="border p-2">Summary</th>
              <th className="border p-2">Timestamp</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {histories
              .slice()
              .reverse()
              .flatMap((history) =>
                history.contents
                  .slice()
                  .reverse()
                  .map((item, index) => (
                    <tr key={`${history.userId}-${index}`} className="border hover:bg-gray-100">
                      <td className="border p-2">{history.email || "Unknown"}</td>
                      <td className="border p-2">{item.type}</td>
                      <td className="border p-2 truncate max-w-xs cursor-pointer" onClick={() => setSelectedContent({ ...item, email: history.email })}>
                        {item.content?.slice(0, 50)}...
                      </td>
                      <td className="border p-2 truncate max-w-xs cursor-pointer" onClick={() => setSelectedContent({ ...item, email: history.email })}>
                        {item.summary?.slice(0, 50) || "Not available"}
                      </td>
                      <td className="border p-2">{new Date(item.timestamp).toLocaleString()}</td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={async () => {
                            const confirmDelete = window.confirm("Are you sure you want to delete this content?");
                            if (!confirmDelete) return;
                            try {
                              const token = localStorage.getItem("token");
                              await deleteUserContent(history.userId, item._id, token);
                              setHistories((prev) =>
                                prev.map((h) =>
                                  h.userId === history.userId
                                    ? { ...h, contents: h.contents.filter((c) => c._id !== item._id) }
                                    : h
                                )
                              );
                            } catch (err) {
                              alert("Delete failed: " + err.message);
                            }
                          }}
                          title="Delete"
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
              )}
          </tbody>
        </table>
      </div>

      {/* Chat History Table */}
      <h2 className="text-2xl font-bold mb-4">User Chat History</h2>
      <div className="overflow-x-auto overflow-y-auto max-h-[500px] border rounded-lg mb-12">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr className="sticky top-0 bg-gray-200 z-10">
              <th className="border p-2">User Email</th>
              <th className="border p-2">Question</th>
              <th className="border p-2">Answer</th>
              <th className="border p-2">Source</th>
              <th className="border p-2">Timestamp</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {chatHistories
              .slice()
              .reverse()
              .flatMap((chat) => {
                const chatId = chat._id; 

                return chat.messages
                  .slice()
                  .reverse()
                  .map((msg, index) => (
                    <tr key={`${chatId}-${msg.chat_id}`} className="border hover:bg-gray-100">
                      <td className="border p-2">{chat.email || "Unknown"}</td>
                      <td className="border p-2 truncate max-w-xs">{msg.question}</td>
                      <td className="border p-2 truncate max-w-xs">{msg.answer}</td>
                      <td className="border p-2">{msg.source}</td>
                      <td className="border p-2">{new Date(msg.timestamp).toLocaleString()}</td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={async () => {
                            const confirmDelete = window.confirm("Are you sure you want to delete this chat message?");
                            if (!confirmDelete) return;

                            try {
                              const token = localStorage.getItem("token");
                              await deleteChatMessage(chat._id, msg.chat_id, token);
                              setChatHistories((prev) =>
                                prev.map((c) =>
                                  c._id === chatId
                                    ? {
                                        ...c,
                                        messages: c.messages.filter((m) => m.chat_id !== msg.chat_id),
                                      }
                                    : c
                                )
                              );
                            } catch (err) {
                              alert("Delete failed: " + err.message);
                            }
                          }}
                          title="Delete"
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ));
              })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={!!selectedContent}
        onRequestClose={() => setSelectedContent(null)}
        contentLabel="Summary Details"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg max-w-2xl w-full shadow-lg max-h-[80vh] overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
      >
        {selectedContent && (
          <div>
            <h3 className="text-xl font-bold mb-2">Summary Details</h3>
            <p><strong>User:</strong> {selectedContent.email || "Unknown"}</p>
            <p><strong>Type:</strong> {selectedContent.type}</p>
            <p className="mt-3"><strong>Original Content:</strong></p>
            <div className="bg-gray-100 p-3 rounded mb-3 whitespace-pre-wrap">{selectedContent.content}</div>
            <p><strong>Summary:</strong></p>
            <div className="bg-green-100 p-3 rounded whitespace-pre-wrap">{selectedContent.summary || "Not available"}</div>
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
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminHistoryPage;
