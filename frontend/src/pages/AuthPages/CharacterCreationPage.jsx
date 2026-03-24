import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks";
import { NeonButton } from "../../components/ui";
import { containerVariants, itemVariants } from "../../animations/transitions.config";
import "./AuthPages.css";
import "./CharacterCreationPage.css";

export function CharacterCreationPage() {
  const [displayName, setDisplayName] = useState("");
  const [selectedBase, setSelectedBase] = useState(1);
  const [selectedSkin, setSelectedSkin] = useState(1);
  const [selectedHair, setSelectedHair] = useState(1);
  const [selectedOutfit, setSelectedOutfit] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, createAvatar, avatarOptions } = useAuth();

  if (!user) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!displayName || displayName.trim() === "") {
      setError("Please enter a display name");
      return;
    }

    try {
      createAvatar({
        displayName: displayName.trim(),
        base_id: selectedBase,
        skin_id: selectedSkin,
        hair_id: selectedHair,
        outfit_id: selectedOutfit,
      });
      navigate("/world");
    } catch (err) {
      setError("Avatar creation failed. Please try again.");
    }
  };

  // Helper function to get selected item
  const getSelected = (type) => {
    const typeMap = {
      base: selectedBase,
      skin: selectedSkin,
      hair: selectedHair,
      outfit: selectedOutfit,
    };
    const id = typeMap[type];
    return avatarOptions[type + "s"]?.find((item) => item.id === id);
  };

  return (
    <motion.div className="auth-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="auth-container avatar-container" variants={containerVariants} initial="initial" animate="enter">
        
        {/* Header */}
        <motion.h1 className="auth-title" variants={itemVariants}>
          <span className="title-text">Lvl</span>
          <span className="title-infinity">&#8734;</span>
          <span className="title-text">nity</span>
        </motion.h1>

        <motion.p className="auth-subtitle" variants={itemVariants}>
          CUSTOMIZE YOUR AVATAR
        </motion.p>

        {/* Two-column layout: Customization on left, preview on right */}
        <motion.div className="avatar-content" variants={containerVariants}>
          
          {/* Left: Avatar Preview */}
          <motion.div className="avatar-preview-section" variants={itemVariants}>
            <div className="preview-card">
              <h3 className="preview-title">Preview</h3>
              <div className="avatar-preview">
                <div className="avatar-display">
                  <div className="avatar-body">
                    {getSelected("base")?.emoji || "👤"}
                  </div>
                  <div className="avatar-hair">
                    {getSelected("hair")?.emoji || "✂️"}
                  </div>
                  <div className="avatar-outfit">
                    {getSelected("outfit")?.emoji || "👕"}
                  </div>
                </div>
              </div>
              <div className="preview-stats">
                <div className="stat-line">
                  <span>Base:</span>
                  <span className="stat-value">{getSelected("base")?.name || "—"}</span>
                </div>
                <div className="stat-line">
                  <span>Skin:</span>
                  <span>
                    <span
                      className="stat-color"
                      style={{ backgroundColor: getSelected("skin")?.color }}
                    />
                    {getSelected("skin")?.name || "—"}
                  </span>
                </div>
                <div className="stat-line">
                  <span>Hair:</span>
                  <span className="stat-value">{getSelected("hair")?.name || "—"}</span>
                </div>
                <div className="stat-line">
                  <span>Outfit:</span>
                  <span className="stat-value">{getSelected("outfit")?.name || "—"}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Customization Form */}
          <motion.form className="avatar-form-section" onSubmit={handleSubmit} variants={containerVariants}>
            
            {/* Display Name */}
            <motion.div className="form-group" variants={itemVariants}>
              <label className="form-label">Display Name</label>
              <input
                type="text"
                className="form-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                autoFocus
              />
            </motion.div>

            {/* Base Selector */}
            <motion.div className="form-group" variants={itemVariants}>
              <label className="form-label">Base Type</label>
              <div className="option-grid base-grid">
                {avatarOptions.bases.map((base) => (
                  <button
                    key={base.id}
                    type="button"
                    className={`option-button ${selectedBase === base.id ? "selected" : ""}`}
                    onClick={() => setSelectedBase(base.id)}
                  >
                    <span className="option-emoji">{base.emoji}</span>
                    <span className="option-label">{base.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Skin Selector */}
            <motion.div className="form-group" variants={itemVariants}>
              <label className="form-label">Skin Tone</label>
              <div className="option-grid skin-grid">
                {avatarOptions.skins.map((skin) => (
                  <button
                    key={skin.id}
                    type="button"
                    className={`option-button color-option ${selectedSkin === skin.id ? "selected" : ""}`}
                    onClick={() => setSelectedSkin(skin.id)}
                    style={{ "--skin-color": skin.color }}
                  >
                    <span
                      className="color-swatch"
                      style={{ backgroundColor: skin.color }}
                    />
                    <span className="option-label">{skin.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Hair Selector */}
            <motion.div className="form-group" variants={itemVariants}>
              <label className="form-label">Hair Style</label>
              <div className="option-grid hair-grid">
                {avatarOptions.hairs.map((hair) => (
                  <button
                    key={hair.id}
                    type="button"
                    className={`option-button ${selectedHair === hair.id ? "selected" : ""}`}
                    onClick={() => setSelectedHair(hair.id)}
                  >
                    <span className="option-emoji">{hair.emoji}</span>
                    <span className="option-label">{hair.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Outfit Selector */}
            <motion.div className="form-group" variants={itemVariants}>
              <label className="form-label">Outfit</label>
              <div className="option-grid outfit-grid">
                {avatarOptions.outfits.map((outfit) => (
                  <button
                    key={outfit.id}
                    type="button"
                    className={`option-button ${selectedOutfit === outfit.id ? "selected" : ""}`}
                    onClick={() => setSelectedOutfit(outfit.id)}
                  >
                    <span className="option-emoji">{outfit.emoji}</span>
                    <span className="option-label">{outfit.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {error && (
              <motion.div className="form-error" variants={itemVariants}>
                {error}
              </motion.div>
            )}

            <motion.div variants={itemVariants} style={{ marginTop: "24px" }}>
              <NeonButton
                type="submit"
                variant="primary"
                icon="✨"
                style={{ width: "100%" }}
              >
                Enter the World
              </NeonButton>
            </motion.div>
          </motion.form>
        </motion.div>

        {/* Footer */}
        <motion.div className="auth-footer" variants={itemVariants}>
          <p className="char-info">
            Your avatar can be customized further later. For now, let's get you into Lvl∞nity!
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
