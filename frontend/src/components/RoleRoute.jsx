import { Navigate, Outlet } from "react-router-dom";
import { getStoredUser } from "../utils/auth";

const RoleRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;