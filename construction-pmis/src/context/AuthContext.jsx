
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const SESSION_KEY = "construction_pmis_session";

// Demo accounts only. Replace these with server-side authentication later.
export const demoAccounts = [
  {
    name: "Tobias Williams",
    email: "admin@buildcontrol.demo",
    password: "Admin@123",
    role: "System Administrator",
  },
  {
    name: "Amina Yusuf",
    email: "manager@buildcontrol.demo",
    password: "Manager@123",
    role: "Project Manager",
  },
  {
    name: "Emmanuel Okafor",
    email: "engineer@buildcontrol.demo",
    password: "Engineer@123",
    role: "Site Engineer",
  },
  {
    name: "Grace Adeyemi",
    email: "finance@buildcontrol.demo",
    password: "Finance@123",
    role: "Finance Officer",
  },
];

function getStoredSession() {
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredSession);

  function login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();

    const account = demoAccounts.find(
      (item) =>
        item.email.toLowerCase() === normalizedEmail &&
        item.password === password
    );

    if (!account) {
      return {
        success: false,
        message: "Invalid email or password. Please try again.",
      };
    }

    const session = {
      name: account.name,
      email: account.email,
      role: account.role,
      loggedInAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);

      return { success: true };
    } catch {
      return {
        success: false,
        message: "Unable to save your session in this browser.",
      };
    }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}