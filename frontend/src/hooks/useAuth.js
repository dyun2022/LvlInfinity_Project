/**
 * useAuth Hook
 * 
 * Custom hook for accessing auth context.
 * Ensures auth is only used within AuthProvider.
 */

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
