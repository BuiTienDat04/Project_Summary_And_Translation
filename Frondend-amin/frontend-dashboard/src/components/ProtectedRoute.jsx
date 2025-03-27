import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  console.log("ProtectedRoute - Token:", token, "Path:", window.location.pathname);

  if (!token) {
    console.log("ProtectedRoute - Redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  return children;
}