/**
 * Storage Service
 * 
 * Abstraction layer for local storage operations.
 * Provides a consistent interface for saving and retrieving app data.
 * 
 * NOTE: This is a prototype implementation using localStorage.
 * For production, consider:
 * - Backend API integration
 * - IndexedDB for larger datasets
 * - Session storage alternatives
 * - Encryption for sensitive data
 */

const PREFIX = "lvlnity_";

/**
 * Get a stored value
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Stored value or defaultValue
 */
export function getStorageItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`[Storage] Error reading ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Set a stored value
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export function setStorageItem(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[Storage] Error writing ${key}:`, error);
    return false;
  }
}

/**
 * Remove a stored value
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export function removeStorageItem(key) {
  try {
    localStorage.removeItem(PREFIX + key);
    return true;
  } catch (error) {
    console.error(`[Storage] Error removing ${key}:`, error);
    return false;
  }
}

/**
 * Clear all app storage
 * @returns {boolean} Success status
 */
export function clearStorage() {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    console.error("[Storage] Error clearing storage:", error);
    return false;
  }
}

/**
 * Get all stored data
 * @returns {object} All stored key-value pairs
 */
export function getAllStorageItems() {
  try {
    const items = {};
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(PREFIX)) {
        const cleanKey = key.replace(PREFIX, "");
        items[cleanKey] = JSON.parse(localStorage.getItem(key));
      }
    });
    return items;
  } catch (error) {
    console.error("[Storage] Error getting all items:", error);
    return {};
  }
}

/**
 * Storage API for user data
 */
export const UserStorage = {
  getUser: () => getStorageItem("user"),
  setUser: (user) => setStorageItem("user", user),
  clearUser: () => removeStorageItem("user"),
};

/**
 * Storage API for profile data
 */
export const ProfileStorage = {
  getProfile: (userId) => getStorageItem(`profile_${userId}`),
  setProfile: (userId, profile) => setStorageItem(`profile_${userId}`, profile),
  clearProfile: (userId) => removeStorageItem(`profile_${userId}`),
};

/**
 * Storage API for avatar data
 */
export const AvatarStorage = {
  getAvatar: (userId) => getStorageItem(`avatar_${userId}`),
  setAvatar: (userId, avatar) => setStorageItem(`avatar_${userId}`, avatar),
  clearAvatar: (userId) => removeStorageItem(`avatar_${userId}`),
};
