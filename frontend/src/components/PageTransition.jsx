import React from "react";
import { motion } from "framer-motion";
import { pageVariants, containerVariants } from "../animations/transitions.config";

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

// Animated container for staggering child elements
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

// Animated item for children within a container
export function AnimatedItem({ children, variants: customVariants }) {
  const { itemVariants } = require("../animations/transitions.config");
  const variants = customVariants || itemVariants;

  return (
    <motion.div variants={variants}>
      {children}
    </motion.div>
  );
}
