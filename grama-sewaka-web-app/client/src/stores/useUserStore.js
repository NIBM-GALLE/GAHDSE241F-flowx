import { useState } from "react";

// User store for authentication state and actions
export function useUserStore() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  // Sign in
  async function signIn({ email, password, role }, navigate) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role })
    });
    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Server error: Invalid response");
    }
    if (!res.ok) throw new Error(data?.message || "Sign in failed");
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    if (navigate) navigate("/dashboard");
    return data.user;
  }

  // Sign up (updated: navigate to /signin after successful registration)
  async function signUp(userData, userType, navigate) {
    const res = await fetch(`/api/auth/register/${userType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });
    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Server error: Invalid response");
    }
    if (!res.ok) throw new Error(data?.message || "Sign up failed");
    // Do not set user/token or auto-login; just navigate to signin
    if (navigate) navigate("/signin");
    return data.user;
  }

  // Logout
  function logout() {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  return { user, token, signIn, signUp, logout };
}
