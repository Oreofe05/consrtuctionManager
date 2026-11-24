import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);
const SESSION_KEY = "construction_pmis_session";
const TOKEN_KEY = "buildcontrol_token";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    authAPI
      .getMe()
      .then((data) => {
        const session = {
          name: data.name,
          email: data.email,
          role: data.role,
          id: data._id,
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setUser(session);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    try {
      const data = await authAPI.login(email, password);

      localStorage.setItem(TOKEN_KEY, data.token);

      const session = {
        name: data.name,
        email: data.email,
        role: data.role,
        id: data._id,
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Invalid email or password",
      };
    }
  }

  async function register({ name, email, password, role }) {
    try {
      const data = await authAPI.register({ name, email, password, role });

      localStorage.setItem(TOKEN_KEY, data.token);

      const session = {
        name: data.name,
        email: data.email,
        role: data.role,
        id: data._id,
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Registration failed",
      };
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
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