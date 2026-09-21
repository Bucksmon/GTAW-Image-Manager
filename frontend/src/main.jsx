import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const features = [
  ["Discord-first", "Send a screenshot to the bot and get usable links back."],
  ["Organized library", "Keep GTAW screenshots searchable instead of scattered across hosts."],
  ["Forum-ready", "Copy BBCode, Markdown, HTML or direct links in one click."]
];

function App() {
  return (
    <main className="app-shell">
      <nav className="nav">
        <div className="brand">
          <span className="brand-mark">G</span>
          <span>GTAW Image Manager</span>
        </div>
        <button className="login-button">Connect Discord</button>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">OPEN SOURCE · GTAW COMMUNITY</span>
          <h1>Your screenshots.<br /><span>Organized.</span></h1>
          <p>
            Upload through Discord, keep your screenshots organized, and
            generate forum-ready links without jumping between image-hosting
            websites.
          </p>
          <div className="hero-actions">
            <button className="primary-button">Connect Discord</button>
            <a href="https://github.com/Bucksmon/GTAW-Image-Manager" target="_blank" rel="noreferrer">
              View on GitHub ↗
            </a>
          </div>
        </div>

        <div className="preview-card">
          <div className="preview-top">
            <span>Screenshot Library</span>
            <span className="live-dot">● Online</span>
          </div>
          <div className="mock-grid">
            {["01", "02", "03", "04"].map((item) => (
              <div className="mock-image" key={item}>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="preview-footer">
            <span>24 screenshots</span>
            <span>All collections</span>
          </div>
        </div>
      </section>

      <section className="features">
        {features.map(([title, description]) => (
          <article key={title}>
            <div className="feature-number">0{features.findIndex(([t]) => t === title) + 1}</div>
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
