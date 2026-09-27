import { Navigate, Outlet } from "react-router-dom";
import { getStoredUser } from "../utils/auth";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;