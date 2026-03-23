import React from "react";
import "./NeonButton.css";

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
