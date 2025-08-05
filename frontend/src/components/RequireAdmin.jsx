import React from "react";
import { Navigate } from "react-router-dom";

const RequireAdmin = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("🧠 Parsed User from localStorage:", user);
  // 1. Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in but not admin
  if (!user.is_admin) {
    return <Navigate to="/dashboard" replace />;
    // or: return <Navigate to="/unauthorized" replace />;
  }

  // 3. Admin – allowed
  return children;
};

export default RequireAdmin;
