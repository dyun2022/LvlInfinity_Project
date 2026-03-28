import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks";
import { portalVariants } from "../../animations/transitions.config";
import "./LandingPage.css";

/**
 * LandingPage Component
 * 
 * Main entry point with holographic UI, character options,
 * and authentication navigation.
 */
export default function LandingPage() {
  const [phase, setPhase] = useState("off");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("flicker"), 600);
    const t2 = setTimeout(() => setPhase("reveal"), 2200);
    const t3 = setTimeout(() => setPhase("idle"), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const handleEnterWorld = () => {
    setIsTransitioning(true);
    if (isAuthenticated) {
      navigate("/world");
    } else {
      navigate("/login");
    }
  };

  const handleCreateCharacter = () => {
    setIsTransitioning(true);
    if (isAuthenticated) {
      navigate("/character-creation");
    } else {
      navigate("/register");
    }
  };

  return (
    <motion.div
      className={`landing ${phase}`}
      animate={isTransitioning ? "zoom" : "initial"}
      variants={portalVariants}
    >
      {/* Scanline overlay */}
      <div className="holo-scanlines" />

      {/* Hologram container */}
      <div className="holo-container">
        {/* Hologram base plate glow */}
        <div className="holo-base">
          <div className="holo-base-ring" />
          <div className="holo-base-ring ring2" />
        </div>

        {/* Hologram projection beam */}
        <div className="holo-beam" />

        {/* Main content that "projects" out of the hologram */}
        <motion.div
          className="holo-projection"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Title */}
          <h1 className="title">
            <span className="title-text">Lvl</span>
            <span className="title-infinity">&#8734;</span>
            <span className="title-text">nity</span>
          </h1>

          {/* Subtitle tagline (hidden) */}
          <p className="tagline" aria-hidden="true"></p>

          {/* Holographic divider */}
          <div className="holo-divider">
            <span className="divider-diamond">&#9670;</span>
          </div>

          {/* Buttons */}
          <div className="btn-row">
            <motion.button
              className="holo-btn enter"
              onClick={handleEnterWorld}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Enter the world or login"
            >
              <span className="btn-icon">&#9654;</span>
              <span className="btn-label">ENTER WORLD</span>
              <span className="btn-corner tl" />
              <span className="btn-corner tr" />
              <span className="btn-corner bl" />
              <span className="btn-corner br" />
            </motion.button>

            <motion.button
              className="holo-btn create"
              onClick={handleCreateCharacter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Create character or sign up"
            >
              <span className="btn-icon">&#9733;</span>
              <span className="btn-label">CREATE CHARACTER</span>
              <span className="btn-corner tl" />
              <span className="btn-corner tr" />
              <span className="btn-corner bl" />
              <span className="btn-corner br" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Floating particle emitters */}
      <div className="particles">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              "--x": `${Math.random() * 100}%`,
              "--delay": `${Math.random() * 6}s`,
              "--dur": `${3 + Math.random() * 5}s`,
              "--size": `${1 + Math.random() * 3}px`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
