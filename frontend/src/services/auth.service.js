/**
 * Authentication Service
 * 
 * Handles user authentication operations (login, register, logout).
 * Abstracts auth logic from React components.
 * 
 * NOTE: This is a prototype implementation using local storage.
 * For production, integrate with a real backend API:
 * - Send credentials securely (HTTPS only)
 * - Use JWT or session-based auth
 * - Implement proper password hashing (server-side)
 * - Add rate limiting and security headers
 */

import { UserStorage, ProfileStorage, AvatarStorage } from "./storage.service.js";

/**
 * Generate a unique user ID
 * @returns {string}
 */
function generateUserId() {
  return "user_" + Math.random().toString(36).substr(2, 9);
}

/**
 * Login a user with email and password
 * @param {string} email - User email
 * @param {string} password - User password (NEVER STORE IN PRODUCTION)
 * @returns {object} User object
 * 
 * SECURITY NOTE: In production, never transmit passwords to localStorage.
 * Use backend authentication with JWT tokens instead.
 */
export function login(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  
  // In a real app, this would call an API endpoint
  // For prototype: create user object and store
  const user = {
    id: generateUserId(),
    email,
    username: email.split("@")[0],
    createdAt: new Date().toISOString(),
  };
  
  UserStorage.setUser(user);
  return user;
}

/**
 * Register a new user
 * @param {string} email - User email
 * @param {string} password - User password (NEVER STORE IN PRODUCTION)
 * @param {string} username - Display username
 * @returns {object} User object
 * 
 * SECURITY NOTE: In production, never transmit passwords to localStorage.
 * Use backend authentication with password hashing.
 */
export function register(email, password, username) {
  if (!email || !password || !username) {
    throw new Error("Email, password, and username are required");
  }
  
  // In a real app, this would call an API endpoint
  // For prototype: create user object and store
  const user = {
    id: generateUserId(),
    email,
    username,
    createdAt: new Date().toISOString(),
  };
  
  UserStorage.setUser(user);
  return user;
}

/**
 * Logout the current user
 * Clears all user data from storage
 */
export function logout() {
  const user = UserStorage.getUser();
  if (user?.id) {
    ProfileStorage.clearProfile(user.id);
    AvatarStorage.clearAvatar(user.id);
  }
  UserStorage.clearUser();
}

/**
 * Get currently logged-in user
 * @returns {object|null} User object or null if not logged in
 */
export function getCurrentUser() {
  return UserStorage.getUser();
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  return !!getCurrentUser();
}

/**
 * Verify stored session (called on app load)
 * @returns {object|null} User object if session valid, null otherwise
 */
export function verifySession() {
  // In production, would validate JWT or backend session
  // For prototype, just return stored user if present
  const user = UserStorage.getUser();
  
  if (!user || !user.id) {
    return null;
  }
  
  // Could add additional validation here
  // e.g., check if session has expired
  
  return user;
}
