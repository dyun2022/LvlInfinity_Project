import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks";
import { NeonButton } from "../../components/ui";
import { containerVariants, itemVariants } from "../../animations/transitions.config";
import "./AuthPages.css";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      login(email, password);
      navigate("/world");
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <motion.div className="auth-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="auth-container" variants={containerVariants} initial="initial" animate="enter">
        <motion.h1 className="auth-title" variants={itemVariants}>
          <span className="title-text">Lvl</span>
          <span className="title-infinity">&#8734;</span>
          <span className="title-text">nity</span>
        </motion.h1>
        
        <motion.form className="auth-form" onSubmit={handleSubmit} variants={containerVariants}>
          <motion.div className="form-group" variants={itemVariants}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoFocus
            />
          </motion.div>

          <motion.div className="form-group" variants={itemVariants}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </motion.div>

          {error && <motion.div className="form-error" variants={itemVariants}>{error}</motion.div>}

          <motion.div variants={itemVariants}>
            <NeonButton
              type="submit"
              variant="primary"
              icon="&#9654;"
              style={{ width: "100%", marginTop: "24px" }}
            >
              Login
            </NeonButton>
          </motion.div>
        </motion.form>

        <motion.div className="auth-footer" variants={itemVariants}>
          <p>
            Don't have an account?{" "}
            <button
              className="auth-link"
              onClick={() => navigate("/register")}
            >
              Create one
            </button>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
