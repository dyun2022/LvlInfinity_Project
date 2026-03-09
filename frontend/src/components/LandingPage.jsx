import { useState, useEffect } from "react";
import "./LandingPage.css";

export default function LandingPage() {
  const [phase, setPhase] = useState("off");
  // off → flicker → reveal → idle

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("flicker"), 600);
    const t2 = setTimeout(() => setPhase("reveal"), 2200);
    const t3 = setTimeout(() => setPhase("idle"), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className={`landing ${phase}`}>
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
        <div className="holo-projection">
          {/* Title */}
          <h1 className="title">
            <span className="title-text">Lvl</span>
            <span className="title-infinity">&#8734;</span>
            <span className="title-text">nity</span>
          </h1>

          {/* Subtitle tagline */}
          <p className="tagline">LEVEL&nbsp;UP&nbsp;YOUR&nbsp;WORLD</p>

          {/* Holographic divider */}
          <div className="holo-divider">
            <span className="divider-diamond">&#9670;</span>
          </div>

          {/* Buttons */}
          <div className="btn-row">
            <a href="login.html" className="holo-btn enter">
              <span className="btn-icon">&#9654;</span>
              <span className="btn-label">ENTER WORLD</span>
              <span className="btn-corner tl" />
              <span className="btn-corner tr" />
              <span className="btn-corner bl" />
              <span className="btn-corner br" />
            </a>

            <a href="register.html" className="holo-btn create">
              <span className="btn-icon">&#9733;</span>
              <span className="btn-label">CREATE CHARACTER</span>
              <span className="btn-corner tl" />
              <span className="btn-corner tr" />
              <span className="btn-corner bl" />
              <span className="btn-corner br" />
            </a>
          </div>
        </div>
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
    </div>
  );
}
