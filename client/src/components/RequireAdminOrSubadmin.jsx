import { Navigate } from "react-router-dom";
import useAuth from "../context/AuthContext";

export default function RequireAdminOrSubadmin({ children }) {
  const { isLoggedIn, isAdminOrSubadmin, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdminOrSubadmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
