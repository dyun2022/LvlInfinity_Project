// Framer Motion animation presets for synthwave transitions

export const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    y: 50,
  },
  enter: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.33, 0.66, 0.66, 1], // smooth custom easing
    },
  },
  exit: {
    opacity: 0,
    scale: 1.1,
    y: -50,
    transition: {
      duration: 0.4,
      ease: [0.33, 0, 0.66, 1],
    },
  },
};

// Portal zoom effect for landing page buttons
export const portalVariants = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  zoom: {
    scale: 1.3,
    opacity: 0.7,
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
};

// Background container animation - subtle shift deeper into scene
export const backgroundVariants = {
  initial: {
    opacity: 1,
  },
  transition: {
    opacity: 0.95,
    transition: {
      duration: 0.4,
    },
  },
};

// Container for staggering child animations
export const containerVariants = {
  enter: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

// Individual form field / element animation
export const itemVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

// Button click animation - glow and push forward
export const buttonClickVariants = {
  tap: {
    scale: 0.95,
    boxShadow: "0 0 40px rgba(0, 240, 255, 0.8)",
    transition: {
      duration: 0.2,
    },
  },
};
