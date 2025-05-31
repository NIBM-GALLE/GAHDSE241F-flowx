import { useState } from "react";

//user store for authentication state and actions
export function useUserStore() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  //sign in
  async function signIn({ email, password }, navigate) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
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

  //sign up
  async function signUp(payload, navigate) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Server error: Invalid response");
    }
    if (!res.ok) throw new Error(data?.message || "Sign up failed");
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    if (navigate) navigate("/signin");
    return data.user;
  }

  //logout
  function logout() {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  return { user, token, signIn, signUp, logout };
}