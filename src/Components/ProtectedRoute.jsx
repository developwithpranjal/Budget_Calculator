import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, children }) => {
  // ⏳ loading state
  if (user === undefined) {
    return <h2>Loading...</h2>;
  }

  // ❌ not logged in
  if (user === null) {
    return <Navigate to="/" replace />;
  }

  // ✅ logged in
  return children;
};

export default ProtectedRoute;