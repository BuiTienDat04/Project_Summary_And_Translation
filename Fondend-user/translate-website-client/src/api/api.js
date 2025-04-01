// api.js
import axios from "axios";

const api = axios.create({
    baseURL: "https://api.pdfsmart.online", // API_BASE_URL của bạn
});

// Interceptor để tự động thêm token vào header Authorization
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor để xử lý lỗi 401 (token hết hạn hoặc không hợp lệ)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("loggedInUser");
            window.location.href = "/login"; // Chuyển hướng đến trang đăng nhập
        }
        return Promise.reject(error);
    }
);

export default api;