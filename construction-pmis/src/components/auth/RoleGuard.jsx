import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ROLE_MENUS = {
  "System Administrator": [
    "/",
    "/projects",
    "/tasks",
    "/schedule",
    "/resources",
    "/expenditure",
    "/progress",
    "/reports",
    "/notifications",
    "/users",
    "/settings",
    "/help",
  ],
  "Project Manager": [
    "/",
    "/projects",
    "/tasks",
    "/schedule",
    "/resources",
    "/expenditure",
    "/progress",
    "/reports",
    "/notifications",
    "/settings",
    "/help",
  ],
  "Site Engineer": [
    "/",
    "/projects",
    "/tasks",
    "/schedule",
    "/resources",
    "/progress",
    "/notifications",
    "/help",
  ],
  "Finance Officer": [
    "/",
    "/projects",
    "/expenditure",
    "/reports",
    "/notifications",
    "/help",
  ],
};

function canAccessPath(role, pathname) {
  const allowed = ROLE_MENUS[role] || [];

  return allowed.some((path) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(path + "/");
  });
}

function RoleGuard({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccessPath(user.role, location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleGuard;