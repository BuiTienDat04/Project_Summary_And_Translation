import axios from "axios";

// Cấu hình base URL từ biến môi trường hoặc giá trị mặc định
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://api.pdfsmart.online";

// Tạo instance Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 giây timeout
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

// Interceptor cho request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    // Nếu có token, thêm vào header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Thêm timestamp cho mỗi request để tránh cache
    config.headers["X-Request-Timestamp"] = Date.now();
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho response
api.interceptors.response.use(
  (response) => {
    // Xử lý response thành công
    return response.data; // Trả về thẳng data để không cần .data ở mỗi lần gọi API
  },
  (error) => {
    // Xử lý lỗi
    if (error.response) {
      switch (error.response.status) {
        case 401: // Unauthorized
          handleUnauthorized();
          break;
        case 403: // Forbidden
          // Xử lý khi không có quyền truy cập
          break;
        case 404: // Not Found
          // Xử lý khi API không tồn tại
          break;
        case 500: // Server Error
          // Xử lý khi server bị lỗi
          break;
        default:
          break;
      }
    } else if (error.request) {
      // Request được gửi đi nhưng không nhận được response
      console.error("No response received:", error.request);
    } else {
      // Lỗi khi thiết lập request
      console.error("Request setup error:", error.message);
    }
    
    return Promise.reject(error.response?.data || error);
  }
);

// Hàm xử lý khi bị unauthorized
const handleUnauthorized = () => {
  // Xóa tất cả dữ liệu authentication
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("loggedInUser");
  
  // Redirect về trang login
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

// Export các giá trị cần thiết
export { API_BASE_URL };
export default api;