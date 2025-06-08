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

  // Get user details by role and id
  async function getUserDetails(role, id, tokenArg) {
    const res = await fetch(`/api/auth/user/${role}/${id}`, {
      headers: tokenArg ? { Authorization: `Bearer ${tokenArg}` } : {},
    });
    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Server error: Invalid response");
    }
    return data;
  }

  // Update user details by role and id (only changed fields)
  async function updateUserDetails(role, id, updates, tokenArg) {
    // Only send changed fields
    const allowedFields = {
      admin: ['nic', 'first_name', 'last_name', 'address', 'admin_phone_number', 'admin_email'],
      government_officer: ['nic', 'first_name', 'last_name', 'government_officer_email', 'government_officer_phone_number', 'address', 'district_id', 'divisional_secretariat_id'],
      grama_sevaka: ['nic', 'first_name', 'last_name', 'grama_sevaka_phone_number', 'address', 'grama_sevaka_email', 'grama_niladhari_division_id', 'divisional_secretariat_id', 'district_id']
    };
    const filtered = {};
    for (const key of allowedFields[role] || []) {
      if (updates[key] !== undefined) filtered[key] = updates[key];
    }
    const res = await fetch(`/api/auth/user/${role}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(tokenArg ? { Authorization: `Bearer ${tokenArg}` } : {}),
      },
      body: JSON.stringify(filtered),
    });
    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Server error: Invalid response");
    }
    return data;
  }

  return { user, token, signIn, signUp, logout, getUserDetails, updateUserDetails };
}
