import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication.
 * Redirects to home if user is not logged in.
 * Shows loading state while session is being verified.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#0a0e17",
        color: "#00f0ff",
        fontFamily: "'Orbitron', sans-serif",
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
