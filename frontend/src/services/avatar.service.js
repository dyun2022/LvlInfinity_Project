/**
 * Avatar Service
 * 
 * Handles avatar creation, updates, and retrieval.
 * Manages avatar-profile relationship (one user can have avatars,
 * each avatar has a profile with display name and metadata).
 */

import { AvatarStorage, ProfileStorage } from "./storage.service.js";

/**
 * Generate a unique avatar ID
 * @returns {string}
 */
function generateAvatarId() {
  return "avatar_" + Math.random().toString(36).substr(2, 9);
}

/**
 * Generate a unique profile ID
 * @returns {string}
 */
function generateProfileId() {
  return "profile_" + Math.random().toString(36).substr(2, 9);
}

/**
 * Create a new avatar
 * @param {object} user - User object (must have id)
 * @param {object} avatarData - Avatar customization data
 *   @param {number} avatarData.base_id - Base type ID
 *   @param {number} avatarData.skin_id - Skin tone ID
 *   @param {number} avatarData.hair_id - Hair style ID
 *   @param {number} avatarData.outfit_id - Outfit ID
 *   @param {string} avatarData.displayName - Character display name
 * @returns {object} { avatar, profile }
 */
export function createAvatar(user, avatarData) {
  if (!user || !user.id) {
    throw new Error("User must be authenticated to create avatar");
  }
  
  if (!avatarData || !avatarData.displayName) {
    throw new Error("Avatar data and display name are required");
  }
  
  // Create Avatar record
  const avatar = {
    id: generateAvatarId(),
    user_id: user.id,
    base_id: avatarData.base_id || 1,
    skin_id: avatarData.skin_id || 1,
    hair_id: avatarData.hair_id || 1,
    outfit_id: avatarData.outfit_id || 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Create Profile record (links user to avatar with display name)
  const profile = {
    id: generateProfileId(),
    user_id: user.id,
    avatar_id: avatar.id,
    displayName: avatarData.displayName.trim(),
    bio: avatarData.bio || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Store both
  AvatarStorage.setAvatar(user.id, avatar);
  ProfileStorage.setProfile(user.id, profile);
  
  return { avatar, profile };
}

/**
 * Get user's avatar
 * @param {string} userId - User ID
 * @returns {object|null} Avatar object or null
 */
export function getAvatar(userId) {
  if (!userId) return null;
  return AvatarStorage.getAvatar(userId);
}

/**
 * Get user's profile
 * @param {string} userId - User ID
 * @returns {object|null} Profile object or null
 */
export function getProfile(userId) {
  if (!userId) return null;
  return ProfileStorage.getProfile(userId);
}

/**
 * Check if user has avatar
 * @param {string} userId - User ID
 * @returns {boolean}
 */
export function hasAvatar(userId) {
  return !!getAvatar(userId);
}

/**
 * Update avatar customization
 * @param {string} userId - User ID
 * @param {object} updates - Partial avatar update object
 * @returns {object|null} Updated avatar or null if not found
 */
export function updateAvatar(userId, updates) {
  const avatar = getAvatar(userId);
  if (!avatar) return null;
  
  const updated = {
    ...avatar,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  AvatarStorage.setAvatar(userId, updated);
  return updated;
}

/**
 * Update profile information
 * @param {string} userId - User ID
 * @param {object} updates - Partial profile update object
 * @returns {object|null} Updated profile or null if not found
 */
export function updateProfile(userId, updates) {
  const profile = getProfile(userId);
  if (!profile) return null;
  
  const updated = {
    ...profile,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  ProfileStorage.setProfile(userId, updated);
  return updated;
}

/**
 * Delete avatar
 * @param {string} userId - User ID
 * @returns {boolean} Success status
 */
export function deleteAvatar(userId) {
  AvatarStorage.clearAvatar(userId);
  ProfileStorage.clearProfile(userId);
  return true;
}
