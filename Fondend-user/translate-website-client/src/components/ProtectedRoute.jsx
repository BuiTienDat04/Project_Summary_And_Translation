import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        console.log("🚫 Không có token! Chuyển hướng về /login");
        return <Navigate to="/login" replace />;
    }

    return children;
}
