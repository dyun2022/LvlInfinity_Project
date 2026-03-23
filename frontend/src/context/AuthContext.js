import React, { createContext, useState, useContext, useEffect } from "react";

// Create Auth Context
const AuthContext = createContext();

// Mock data for avatar customization options
// These represent lookup tables: Bases, Skins, Hairs, Outfits
const AVATAR_OPTIONS = {
  bases: [
    { id: 1, name: "Human", emoji: "👤" },
    { id: 2, name: "Android", emoji: "🤖" },
    { id: 3, name: "Cybernetic", emoji: "🔮" },
  ],
  skins: [
    { id: 1, name: "Fair", color: "#fdbcb4" },
    { id: 2, name: "Medium", color: "#d4a574" },
    { id: 3, name: "Deep", color: "#8b6f47" },
    { id: 4, name: "Neon", color: "#00f0ff" },
  ],
  hairs: [
    { id: 1, name: "Short", emoji: "✂️" },
    { id: 2, name: "Long", emoji: "💇" },
    { id: 3, name: "Wavy", emoji: "〜" },
    { id: 4, name: "Cybernetic", emoji: "⚡" },
  ],
  outfits: [
    { id: 1, name: "Casual", emoji: "👕" },
    { id: 2, name: "Corporate", emoji: "🧥" },
    { id: 3, name: "Tactical", emoji: "👖" },
    { id: 4, name: "Neon", emoji: "✨" },
  ],
};

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate loading from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("lvlonity_user");
    const savedProfile = localStorage.getItem("lvlonity_profile");
    const savedAvatar = localStorage.getItem("lvlonity_avatar");
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    if (savedAvatar) {
      setAvatar(JSON.parse(savedAvatar));
    }
    
    setLoading(false);
  }, []);

  // Login function (simple email/password simulation)
  const login = (email, password) => {
    // In production, this would call an API
    const newUser = {
      id: "user_" + Math.random().toString(36).substr(2, 9),
      email,
      username: email.split("@")[0],
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem("lvlonity_user", JSON.stringify(newUser));
    
    // Try to load existing profile and avatar for this user
    const savedProfile = localStorage.getItem(`lvlonity_profile_${newUser.id}`);
    const savedAvatar = localStorage.getItem(`lvlonity_avatar_${newUser.id}`);
    
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    if (savedAvatar) {
      setAvatar(JSON.parse(savedAvatar));
    }
    
    return newUser;
  };

  // Register function (simple signup simulation)
  const register = (email, password, username) => {
    // In production, this would call an API
    const newUser = {
      id: "user_" + Math.random().toString(36).substr(2, 9),
      email,
      username,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem("lvlonity_user", JSON.stringify(newUser));
    return newUser;
  };

  // Create or update avatar (maps to Avatar table)
  // This also creates/updates the Profile record with avatar_id
  const createAvatar = (avatarData) => {
    if (!user) {
      throw new Error("User must be authenticated to create avatar");
    }

    // Create Avatar record
    const newAvatar = {
      id: "avatar_" + Math.random().toString(36).substr(2, 9),
      user_id: user.id, // Connect to user
      base_id: avatarData.base_id,
      skin_id: avatarData.skin_id,
      hair_id: avatarData.hair_id,
      outfit_id: avatarData.outfit_id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Create or update Profile record
    // Profile record includes user-facing info and avatar_id
    const newProfile = {
      id: "profile_" + Math.random().toString(36).substr(2, 9),
      user_id: user.id,
      avatar_id: newAvatar.id, // Link to avatar
      displayName: avatarData.displayName || user.username,
      bio: "",
      title_class: null, // Not used for class system
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAvatar(newAvatar);
    setProfile(newProfile);

    // Store with user ID to support multiple profiles per user later
    localStorage.setItem(`lvlonity_avatar_${user.id}`, JSON.stringify(newAvatar));
    localStorage.setItem(`lvlonity_profile_${user.id}`, JSON.stringify(newProfile));

    return { avatar: newAvatar, profile: newProfile };
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setProfile(null);
    setAvatar(null);
    localStorage.removeItem("lvlonity_user");
    localStorage.removeItem("lvlonity_profile");
    localStorage.removeItem("lvlonity_avatar");
  };

  const value = {
    user,
    profile,
    avatar,
    loading,
    login,
    register,
    createAvatar,
    logout,
    isAuthenticated: !!user,
    hasAvatar: !!avatar,
    avatarOptions: AVATAR_OPTIONS,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
