import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { NeonButton } from "../components/NeonButton";
import { containerVariants, itemVariants } from "../animations/transitions.config";
import "./WorldPage.css";

export function WorldPage() {
  const navigate = useNavigate();
  const { user, profile, avatar, logout, avatarOptions } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Helper to get avatar component details
  const getAvatarDetail = (type, id) => {
    const typeMap = {
      base: "bases",
      skin: "skins",
      hair: "hairs",
      outfit: "outfits",
    };
    return avatarOptions[typeMap[type]]?.find((item) => item.id === id);
  };

  return (
    <motion.div 
      className="world-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div 
        className="world-header"
        variants={itemVariants}
        initial="initial"
        animate="enter"
      >
        <h1 className="world-title">
          <span className="title-text">Lvl</span>
          <span className="title-infinity">&#8734;</span>
          <span className="title-text">nity</span>
        </h1>
        <button className="logout-btn" onClick={handleLogout}>
          LOGOUT
        </button>
      </motion.div>

      <motion.div 
        className="world-container"
        variants={containerVariants}
        initial="initial"
        animate="enter"
      >
        {/* Main Profile Card */}
        <motion.div className="world-card" variants={itemVariants}>
          <motion.h2 variants={itemVariants}>Welcome, {profile?.displayName || user?.username}!</motion.h2>
          
          {avatar && profile ? (
            <motion.div className="avatar-display-section" variants={containerVariants}>
              {/* Avatar Visual */}
              <motion.div className="avatar-large-preview" variants={itemVariants}>
                <div className="avatar-display-large">
                  <div className="avatar-body-large">
                    {getAvatarDetail("base", avatar.base_id)?.emoji || "👤"}
                  </div>
                  <div className="avatar-hair-large">
                    {getAvatarDetail("hair", avatar.hair_id)?.emoji || "✂️"}
                  </div>
                  <div className="avatar-outfit-large">
                    {getAvatarDetail("outfit", avatar.outfit_id)?.emoji || "👕"}
                  </div>
                </div>
                <p className="avatar-info-text">{profile.displayName}</p>
              </motion.div>

              {/* Avatar Details Table */}
              <motion.div className="avatar-details-table" variants={itemVariants}>
                <div className="details-row">
                  <span className="detail-label">Base:</span>
                  <span className="detail-value">{getAvatarDetail("base", avatar.base_id)?.name || "—"}</span>
                </div>
                <div className="details-row">
                  <span className="detail-label">Skin Tone:</span>
                  <span className="detail-value">
                    <span
                      className="detail-color"
                      style={{ backgroundColor: getAvatarDetail("skin", avatar.skin_id)?.color }}
                    />
                    {getAvatarDetail("skin", avatar.skin_id)?.name || "—"}
                  </span>
                </div>
                <div className="details-row">
                  <span className="detail-label">Hair:</span>
                  <span className="detail-value">{getAvatarDetail("hair", avatar.hair_id)?.name || "—"}</span>
                </div>
                <div className="details-row">
                  <span className="detail-label">Outfit:</span>
                  <span className="detail-value">{getAvatarDetail("outfit", avatar.outfit_id)?.name || "—"}</span>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div className="no-avatar" variants={itemVariants}>
              <p>You haven't customized your avatar yet.</p>
              <NeonButton
                onClick={() => navigate("/character-creation")}
                variant="primary"
                icon="✨"
              >
                Create Your Avatar
              </NeonButton>
            </motion.div>
          )}

          <motion.div className="world-actions" variants={itemVariants}>
            <NeonButton
              onClick={() => navigate("/character-creation")}
              variant="secondary"
              icon="🎨"
            >
              Customize Avatar
            </NeonButton>
          </motion.div>
        </motion.div>

        {/* Right Info Panel */}
        <motion.div className="world-info" variants={containerVariants}>
          <motion.div className="info-panel" variants={itemVariants}>
            <h3>Profile Stats</h3>
            <div className="stat-block">
              <p><span className="stat-label">User ID:</span> {user?.id.substring(0, 8)}...</p>
              <p><span className="stat-label">Joined:</span> {new Date(user?.createdAt).toLocaleDateString()}</p>
              {avatar && (
                <p><span className="stat-label">Avatar:</span> <span className="created-date">{new Date(avatar.createdAt).toLocaleDateString()}</span></p>
              )}
            </div>
          </motion.div>

          <motion.div className="info-panel" variants={itemVariants}>
            <h3>Status</h3>
            <p>The world is alive and ready for explorers.</p>
            <p className="status-online">● Online and Active</p>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="world-footer"
        variants={itemVariants}
        initial="initial"
        animate="enter"
      >
        <p>© 2026 Lvl∞nity. All worlds are yours to explore.</p>
      </motion.div>
    </motion.div>
  );
}
