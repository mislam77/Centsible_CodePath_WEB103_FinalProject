import React from "react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ element }: { element: React.ReactElement }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"; // Check authentication status

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />; // Redirect to sign-in page
  }

  return element; // Render the protected component
}