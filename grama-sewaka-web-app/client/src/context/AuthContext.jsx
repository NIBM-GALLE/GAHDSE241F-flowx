import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    name: "Grama Sewaka",
    email: "grama@example.com",
    role: "admin",
    avatar: "/avatars/grama.jpg",
    notifications: 3,
  });

  const navigate = useNavigate();

  const login = (userData) => {
    setUser(userData);
    navigate(userData.role === "admin" ? "/admin/dashboard" : "/dashboard");
  };

  const logout = () => {
    setUser(null);
    navigate("/signin");
  };

  const clearNotifications = () => {
    setUser(prev => ({ ...prev, notifications: 0 }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, clearNotifications }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
