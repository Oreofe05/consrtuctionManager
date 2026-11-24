export const ROLES = {
  ADMIN: "System Administrator",
  MANAGER: "Project Manager",
  ENGINEER: "Site Engineer",
  FINANCE: "Finance Officer",
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
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
  [ROLES.MANAGER]: [
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
  [ROLES.ENGINEER]: [
    "/",
    "/projects",
    "/tasks",
    "/schedule",
    "/resources",
    "/progress",
    "/notifications",
    "/help",
  ],
  [ROLES.FINANCE]: [
    "/",
    "/projects",
    "/expenditure",
    "/reports",
    "/notifications",
    "/help",
  ],
};

export function canAccess(role, path) {
  if (!role || !path) return false;

  const allowed = ROLE_PERMISSIONS[role];
  if (!allowed) return false;

  // Normalize path (remove trailing slash except root)
  const cleanPath = path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;

  return allowed.some((allowedPath) => {
    if (allowedPath === "/") {
      return cleanPath === "/";
    }
    return (
      cleanPath === allowedPath ||
      cleanPath.startsWith(allowedPath + "/")
    );
  });
}

export function canManageUsers(role) {
  return role === ROLES.ADMIN;
}

export function canCreateProject(role) {
  return role === ROLES.ADMIN || role === ROLES.MANAGER;
}

export function canManageFinance(role) {
  return (
    role === ROLES.ADMIN ||
    role === ROLES.MANAGER ||
    role === ROLES.FINANCE
  );
}