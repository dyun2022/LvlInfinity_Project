import React from "react";
import { motion } from "framer-motion";
import { pageVariants, containerVariants } from "../../animations/transitions.config";

/**
 * PageTransition Component
 * 
 * Wraps page content with smooth entry/exit animations.
 * Provides consistent page transition behavior across the app.
 */
export function PageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedContainer Component
 * 
 * Container that staggeranimation through child elements.
 * Used for animating lists or multiple elements together.
 */
export function AnimatedContainer({ children, variants = containerVariants }) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedItem Component
 * 
 * Individual animated item within a container.
 * Works in conjunction with AnimatedContainer for staggered effects.
 */
export function AnimatedItem({ children, variants: customVariants }) {
  const { itemVariants } = require("../../animations/transitions.config");
  const variants = customVariants || itemVariants;

  return (
    <motion.div variants={variants}>
      {children}
    </motion.div>
  );
}
