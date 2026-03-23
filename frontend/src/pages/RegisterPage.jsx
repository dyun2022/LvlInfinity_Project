import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { NeonButton } from "../components/NeonButton";
import { containerVariants, itemVariants } from "../animations/transitions.config";
import "./AuthPages.css";

export function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !username || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      register(email, password, username);
      navigate("/character-creation");
    } catch (err) {
      setError("Registration failed. Please try again.");
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
        
        <motion.p className="auth-subtitle" variants={itemVariants}>CREATE YOUR ACCOUNT</motion.p>
        
        <motion.form className="auth-form" onSubmit={handleSubmit} variants={containerVariants}>
          <motion.div className="form-group" variants={itemVariants}>
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose your handle"
              autoFocus
            />
          </motion.div>

          <motion.div className="form-group" variants={itemVariants}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
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

          <motion.div className="form-group" variants={itemVariants}>
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </motion.div>

          {error && <motion.div className="form-error" variants={itemVariants}>{error}</motion.div>}

          <motion.div variants={itemVariants}>
            <NeonButton
              type="submit"
              variant="primary"
              icon="&#9733;"
              style={{ width: "100%", marginTop: "24px" }}
            >
              Create Account
            </NeonButton>
          </motion.div>
        </motion.form>

        <motion.div className="auth-footer" variants={itemVariants}>
          <p>
            Already have an account?{" "}
            <button
              className="auth-link"
              onClick={() => navigate("/")}
            >
              Log in
            </button>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
