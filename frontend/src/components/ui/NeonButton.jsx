import React from "react";
import "./NeonButton.css";

/**
 * NeonButton Component
 * 
 * Reusable UI button component with synthwave neon styling.
 * Supports variants, icons, and disabled states.
 * 
 * Props:
 *   - children: Button text/content
 *   - onClick: Click handler
 *   - variant: 'primary' or 'secondary' styling
 *   - icon: Optional icon element/string
 *   - disabled: Disabled state
 *   - className: Additional CSS classes
 *   - ...rest: Other HTML button attributes
 */
export function NeonButton({
  children,
  onClick,
  variant = "primary",
  icon = null,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      className={`neon-btn neon-btn--${variant} ${disabled ? "neon-btn--disabled" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="neon-btn__icon">{icon}</span>}
      <span className="neon-btn__label">{children}</span>
      <span className="neon-btn__corner neon-btn__corner--tl" />
      <span className="neon-btn__corner neon-btn__corner--tr" />
      <span className="neon-btn__corner neon-btn__corner--bl" />
      <span className="neon-btn__corner neon-btn__corner--br" />
    </button>
  );
}

export default NeonButton;
