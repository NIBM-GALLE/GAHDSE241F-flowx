import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  //start with no user (null) for real authentication
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  //map roles to dashboard paths
  const roleToPath = {
    admin: "/admin/dashboard",
    government_officer: "/officer/dashboard",
    grama_sevaka: "/gs/dashboard",
  };

  const login = (userData) => {
    setUser(userData);
    const path = roleToPath[userData.role] || "/dashboard";
    navigate(path);
  };

  const logout = () => {
    setUser(null);
    navigate("/signin");
  };

  const clearNotifications = () => {
    setUser((prev) => (prev ? { ...prev, notifications: 0 } : prev));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, clearNotifications }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
