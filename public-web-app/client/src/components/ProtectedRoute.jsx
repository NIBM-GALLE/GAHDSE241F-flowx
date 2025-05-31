import React from "react";
import { Navigate, useLocation } from "react-router";
import { useUserStore } from "../stores/useUserStore";

export default function ProtectedRoute({ children }) {
  const { user } = useUserStore();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  return children;
}
