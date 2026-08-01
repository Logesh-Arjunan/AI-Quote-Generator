import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("aqg_user")); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const saveAuth = (token, userData) => {
    localStorage.setItem("aqg_token", token);
    localStorage.setItem("aqg_user", JSON.stringify(userData));
    setUser(userData);
  };

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.register({ name, email, password });
      saveAuth(data.token, data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Registration failed." };
    } finally { setLoading(false); }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      saveAuth(data.token, data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed." };
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("aqg_token");
    localStorage.removeItem("aqg_user");
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await authAPI.getProfile();
      const updated = data.user;
      localStorage.setItem("aqg_user", JSON.stringify(updated));
      setUser(updated);
    } catch { /* noop */ }
  }, []);

  const isAuthenticated = !!user && !!localStorage.getItem("aqg_token");

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, register, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
