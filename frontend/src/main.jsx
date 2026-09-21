import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <span className="eyebrow">GTAW IMAGE MANAGER</span>
        <h1>Your screenshots.<br />Organized.</h1>
        <p>
          Upload through Discord, keep your screenshots organized, and generate
          forum-ready links without jumping between image-hosting websites.
        </p>
        <div className="status-card">
          <span className="status-dot" />
          Project foundation ready
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
