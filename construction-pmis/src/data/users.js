
const STORAGE_KEY = "construction_pmis_users";

export const defaultUsers = [
  {
    id: "USR-001",
    name: "Tobias Williams",
    email: "tobias.williams@ui.edu.ng",
    department: "Directorate of Physical Planning",
    role: "System Administrator",
    status: "Active",
    joinedAt: "2026-06-01",
  },
  {
    id: "USR-002",
    name: "Amina Yusuf",
    email: "amina.yusuf@ui.edu.ng",
    department: "Project Management",
    role: "Project Manager",
    status: "Active",
    joinedAt: "2026-06-05",
  },
  {
    id: "USR-003",
    name: "Emmanuel Okafor",
    email: "emmanuel.okafor@ui.edu.ng",
    department: "Civil Engineering",
    role: "Site Engineer",
    status: "Active",
    joinedAt: "2026-06-10",
  },
  {
    id: "USR-004",
    name: "Grace Adeyemi",
    email: "grace.adeyemi@ui.edu.ng",
    department: "Finance Department",
    role: "Finance Officer",
    status: "Active",
    joinedAt: "2026-06-15",
  },
  {
    id: "USR-005",
    name: "David Johnson",
    email: "david.johnson@ui.edu.ng",
    department: "Project Management",
    role: "Project Manager",
    status: "Inactive",
    joinedAt: "2026-06-20",
  },
];

function initializeUsers() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      return JSON.parse(saved);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  } catch (error) {
    console.error("Unable to initialize users:", error);
    return defaultUsers;
  }
}

export function getUsers() {
  return initializeUsers();
}

export function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function addUser(user) {
  const users = getUsers();

  const newUser = {
    ...user,
    id: crypto.randomUUID(),
    joinedAt: new Date().toISOString().slice(0, 10),
  };

  saveUsers([newUser, ...users]);
  return newUser;
}

export function updateUser(id, changes) {
  const updated = getUsers().map((user) =>
    user.id === id ? { ...user, ...changes } : user
  );

  saveUsers(updated);
  return updated;
}

export function deleteUser(id) {
  const updated = getUsers().filter((user) => user.id !== id);

  saveUsers(updated);
  return updated;
}

