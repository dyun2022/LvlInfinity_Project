/**
 * Design System & Theme Configuration
 * 
 * Centralized color palette and design tokens for the entire application.
 * Two color modes: light (landing page) and dark (authenticated views).
 * 
 * All colors defined here to ensure consistency across components.
 */

export const THEME = {
  colors: {
    light: {
      // Primary palette for landing page
      background: "linear-gradient(135deg, #00f0ff 0%, #d863ff 25%, #9040e8 50%, #5020b8 75%, #2a1a6a 100%)",
      primary: "#00f0ff",    // bright cyan
      secondary: "#d863ff",  // bright magenta
      accent: "#9040e8",     // deep purple
      text: "#ffffff",
      skyGradient: [
        { stop: 0.0, color: "#00f0ff" },
        { stop: 0.15, color: "#d863ff" },
        { stop: 0.35, color: "#9040e8" },
        { stop: 0.55, color: "#5020b8" },
        { stop: 0.75, color: "#2a1a6a" },
        { stop: 0.92, color: "#0f0f3a" },
        { stop: 1.0, color: "#050520" },
      ],
    },
    dark: {
      // Primary palette for authenticated views (night city)
      background: "linear-gradient(135deg, #0a1f3f 0%, #1a2a5f 25%, #2a3a7f 50%, #1a2a5f 75%, #0f1a3a 100%)",
      primary: "#7ab0d6",     // muted teal
      secondary: "#7660a8",   // muted purple
      accent: "#d6b777",      // muted gold
      text: "#ffffff",
      skyGradient: [
        { stop: 0.0, color: "#0a1f3f" },
        { stop: 0.15, color: "#1a2a5f" },
        { stop: 0.35, color: "#2a3a7f" },
        { stop: 0.55, color: "#1a2a5f" },
        { stop: 0.75, color: "#0f1a3a" },
        { stop: 0.92, color: "#050f20" },
        { stop: 1.0, color: "#020508" },
      ],
      glass: "rgba(7, 13, 26, 0.62)",  // Glass morphism background
    },
  },
  
  typography: {
    fontFamily: {
      primary: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      display: "'Press Start 2P', cursive",
      mono: "'Orbitron', monospace",
    },
    sizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "2rem",
      "4xl": "2.5rem",
    },
  },
  
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
  
  shadows: {
    glow: "0 0 10px rgba(122, 176, 214, 0.5)",
    glowPrimary: "0 0 20px rgba(0, 240, 255, 0.6)",
    glowSecondary: "0 0 20px rgba(216, 99, 255, 0.5)",
  },
};

export default THEME;
