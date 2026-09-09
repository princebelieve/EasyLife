import { Navigate } from "react-router-dom";
import useAuth from "../context/AuthContext";

export default function RequireGuest({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null;

  return isLoggedIn ? <Navigate to="/dashboard" replace /> : children;
}
