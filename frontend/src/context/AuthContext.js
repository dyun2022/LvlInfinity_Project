/**
 * Auth Context & Provider
 * 
 * Manages application-wide authentication and user state.
 * Provides user, profile, avatar, and auth operations to the app.
 * 
 * Uses centralized services for auth and avatar operations.
 */

import React, { createContext, useState, useEffect } from "react";
import * as authService from "../services/auth.service.js";
import * as avatarService from "../services/avatar.service.js";
import { AVATAR_OPTIONS } from "../config/avatar.config.js";

export const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize from stored session on mount
  useEffect(() => {
    try {
      const currentUser = authService.verifySession();
      setUser(currentUser);
      
      if (currentUser?.id) {
        const userProfile = avatarService.getProfile(currentUser.id);
        const userAvatar = avatarService.getAvatar(currentUser.id);
        
        setProfile(userProfile);
        setAvatar(userAvatar);
      }
    } catch (err) {
      console.error("[AuthProvider] Session verification error:", err);
      setError("Session verification failed");
    } finally {
      setLoading(false);
    }
  }, []);

  // Login with email and password
  const login = (email, password) => {
    try {
      setError(null);
      const newUser = authService.login(email, password);
      setUser(newUser);
      
      // Try to load existing profile and avatar
      const userProfile = avatarService.getProfile(newUser.id);
      const userAvatar = avatarService.getAvatar(newUser.id);
      setProfile(userProfile);
      setAvatar(userAvatar);
      
      return newUser;
    } catch (err) {
      const errorMsg = err.message || "Login failed";
      setError(errorMsg);
      throw err;
    }
  };

  // Register new user
  const register = (email, password, username) => {
    try {
      setError(null);
      const newUser = authService.register(email, password, username);
      setUser(newUser);
      return newUser;
    } catch (err) {
      const errorMsg = err.message || "Registration failed";
      setError(errorMsg);
      throw err;
    }
  };

  // Create new avatar for user
  const createAvatar = (avatarData) => {
    try {
      if (!user) {
        throw new Error("User must be authenticated to create avatar");
      }
      
      setError(null);
      const { avatar: newAvatar, profile: newProfile } = avatarService.createAvatar(
        user,
        avatarData
      );
      
      setAvatar(newAvatar);
      setProfile(newProfile);
      
      return { avatar: newAvatar, profile: newProfile };
    } catch (err) {
      const errorMsg = err.message || "Avatar creation failed";
      setError(errorMsg);
      throw err;
    }
  };

  // Update existing avatar
  const updateAvatar = (updates) => {
    try {
      if (!user?.id) {
        throw new Error("No user authenticated");
      }
      
      setError(null);
      const updated = avatarService.updateAvatar(user.id, updates);
      setAvatar(updated);
      return updated;
    } catch (err) {
      const errorMsg = err.message || "Avatar update failed";
      setError(errorMsg);
      throw err;
    }
  };

  // Update profile information
  const updateProfile = (updates) => {
    try {
      if (!user?.id) {
        throw new Error("No user authenticated");
      }
      
      setError(null);
      const updated = avatarService.updateProfile(user.id, updates);
      setProfile(updated);
      return updated;
    } catch (err) {
      const errorMsg = err.message || "Profile update failed";
      setError(errorMsg);
      throw err;
    }
  };

  // Logout and clear all data
  const logout = () => {
    try {
      authService.logout();
      setUser(null);
      setProfile(null);
      setAvatar(null);
      setError(null);
    } catch (err) {
      console.error("[AuthProvider] Logout error:", err);
      // Clear state anyway
      setUser(null);
      setProfile(null);
      setAvatar(null);
    }
  };

  // Clear error
  const clearError = () => setError(null);

  const value = {
    // State
    user,
    profile,
    avatar,
    loading,
    error,
    
    // Auth status
    isAuthenticated: !!user,
    hasAvatar: !!avatar,
    
    // Operations
    login,
    register,
    logout,
    createAvatar,
    updateAvatar,
    updateProfile,
    clearError,
    
    // Config
    avatarOptions: AVATAR_OPTIONS,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
