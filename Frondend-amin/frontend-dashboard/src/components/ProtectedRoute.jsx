import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  console.log("Token trong ProtectedRoute:", token); // Debug

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}