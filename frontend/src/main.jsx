import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID || "";
const GITHUB_URL = "https://github.com/Bucksmon/GTAW-Image-Manager-Web";
const serverInstallUrl = DISCORD_CLIENT_ID
  ? `https://discord.com/oauth2/authorize?client_id=${encodeURIComponent(DISCORD_CLIENT_ID)}&scope=bot%20applications.commands&permissions=117760&integration_type=0`
  : "https://discord.com/developers/applications";

const installUrl = serverInstallUrl;

function Icon({ name, size = 20 }) {
  const paths = {
    discord: <><path d="M7 6.5a14 14 0 0 1 10 0c1.5 2.2 2.2 5 2 8.5-1.8 1.4-3.6 2.2-5.4 2.7l-1.1-1.5M7 6.5C5.5 8.7 4.8 11.5 5 15c1.8 1.4 3.6 2.2 5.4 2.7l1.1-1.5M8.5 13.5c2.1 1 4.9 1 7 0M9 10.5h.01M15 10.5h.01"/></>,
    upload: <><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 20h14"/></>,
    link: <><path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1"/></>,
    shield: <path d="M12 3 20 6v5c0 5-3.2 8.4-8 10-4.8-1.6-8-5-8-10V6z"/>,
    copy: <><rect x="8" y="8" width="11" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    external: <><path d="M14 5h5v5"/><path d="m19 5-8 8"/><path d="M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4"/></>,
    github: <><path d="M9 19c-4 1.3-4-2-5.5-2.5M14.5 21v-2.9a2.6 2.6 0 0 0-.7-2c2.4-.3 4.8-1.2 4.8-5.4a4.2 4.2 0 0 0-1.1-2.9 3.9 3.9 0 0 0-.1-2.9s-.9-.3-3 1.1a10.4 10.4 0 0 0-5.4 0c-2.1-1.4-3-1.1-3-1.1a3.9 3.9 0 0 0-.1 2.9 4.2 4.2 0 0 0-1.1 2.9c0 4.2 2.4 5.1 4.8 5.4a2.9 2.9 0 0 0-.8 2v2.9"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

function App() {
  const [copied, setCopied] = useState(false);
  const [faq, setFaq] = useState(0);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText("/upload");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  const faqItems = useMemo(() => [
    ["Do I need to open a website to upload?", "No. The bot is the main workflow. Add it to a Discord server and use /upload in a channel. The bot is designed for server channels. Add it to a server, then use <code>/upload</code> wherever members should be able to upload screenshots."],
    ["What do I get back?", "The bot uploads the image to the configured hosting providers and replies with direct image URLs plus forum-ready BBCode and Markdown."],
    ["Are my image-hosting credentials exposed?", "No. Provider credentials stay on the private backend deployment. The public site only contains client-safe information such as the Discord application ID."],
    ["Why is there still a website?", "The website is the product's public landing page: it explains the workflow, shows the benefits and gives you a quick way to add the bot."]
  ], []);

  return (
    <div className="site">
      <header className="nav">
        <a className="brand" href="#top" aria-label="GTAW Image Manager home">
          <span className="brand-mark">G</span>
          <span>
            <strong>GTAW Image Manager</strong>
            <small>Discord-first screenshot hosting</small>
          </span>
        </a>
        <nav className="nav-links">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer"><Icon name="github" size={16}/> GitHub</a>
        </nav>
        <a className="button button-primary nav-cta" href={serverInstallUrl} target="_blank" rel="noreferrer">
          <Icon name="discord" size={17}/> Add to Discord
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="eyebrow">BUILT FOR GTAW</div>
          <h1>Your screenshots.<br/><span>One Discord message away.</span></h1>
          <p className="hero-copy">Use <code>/upload</code> in a Discord channel with your GTAW screenshot. The bot handles hosting and gives you the links you need for GTAW forums, posts and chats — without making you open another dashboard.</p>
          <div className="hero-actions">
            <a className="button button-primary large" href={serverInstallUrl} target="_blank" rel="noreferrer"><Icon name="discord" size={19}/> Add to Server</a>
            <a className="button button-secondary large" href="#how">See how it works <Icon name="chevron" size={16}/></a>
          </div>
          <div className="trust-row">
            <span><Icon name="shield" size={15}/> Credentials stay server-side</span>
            <span><Icon name="link" size={15}/> Direct links + BBCode</span>
            <span><Icon name="check" size={15}/> PNG · JPG · WebP · GIF</span>
          </div>
        </section>

        <section id="how" className="how section">
          <div className="section-heading">
            <div className="eyebrow">HOW IT WORKS</div>
            <h2>Three steps. No dashboard.</h2>
            <p>The Discord bot is the workflow. The website is just here to explain it.</p>
          </div>
          <div className="steps">
            <article className="step">
              <div className="step-number">01</div>
              <div className="step-icon"><Icon name="discord" size={22}/></div>
              <h3>Send your screenshot</h3>
              <p>Add the bot to a Discord server and use <code>/upload</code> in a channel with an image attached.</p>
            </article>
            <article className="step">
              <div className="step-number">02</div>
              <div className="step-icon"><Icon name="upload" size={22}/></div>
              <h3>We handle the upload</h3>
              <p>The private backend receives the file and sends it to your configured image hosts.</p>
            </article>
            <article className="step">
              <div className="step-number">03</div>
              <div className="step-icon"><Icon name="link" size={22}/></div>
              <h3>Paste the result</h3>
              <p>You get direct URLs, forum-ready BBCode and Markdown right back in Discord.</p>
            </article>
          </div>
        </section>

        <section id="features" className="features section">
          <div className="section-heading">
            <div className="eyebrow">MADE FOR THE FLOW</div>
            <h2>Built around what you actually do.</h2>
          </div>
          <div className="feature-grid">
            <article><span className="feature-icon"><Icon name="discord" size={19}/></span><h3>Discord-first</h3><p>Upload from the Discord servers you already use. No separate account or dashboard required for the core workflow.</p></article>
            <article><span className="feature-icon"><Icon name="link" size={19}/></span><h3>Forum-ready links</h3><p>Copy a direct image URL, BBCode or Markdown without formatting the link yourself.</p></article>
            <article><span className="feature-icon"><Icon name="shield" size={19}/></span><h3>Server-side secrets</h3><p>Hosting credentials and database access stay in the private backend deployment, not in the public web app.</p></article>
            <article><span className="feature-icon"><Icon name="upload" size={19}/></span><h3>Provider failover</h3><p>Multiple image providers can be used behind one upload workflow, so a single provider problem does not have to stop you.</p></article>
          </div>
        </section>

        <section className="demo section">
          <div className="demo-panel">
            <div className="demo-copy">
              <div className="eyebrow">IN DISCORD</div>
              <h2>It can be this simple.</h2>
              <p>Use <code>/upload</code> with an image and get everything back in one reply.</p>
              <div className="command-row"><span>/upload</span><button onClick={copyText}>{copied ? "Copied" : "Copy"} <Icon name="copy" size={14}/></button></div>
            </div>
            <div className="discord-card">
              <div className="message-head"><span className="bot-avatar">G</span><div><strong>GTAW Image Manager</strong><small>APP</small></div></div>
              <div className="message-body">
                <strong>Upload complete</strong>
                <div className="result-line"><span>cloudinary</span><code>https://res.cloudinary.com/.../screenshot.png</code></div>
                <div className="result-line"><span>imgbb</span><code>https://i.ibb.co/.../screenshot.png</code></div>
                <div className="result-line"><span>BBCode</span><code>[img]https://...[/img]</code></div>
                <div className="result-line"><span>Markdown</span><code>![screenshot](https://...)</code></div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="faq section">
          <div className="section-heading">
            <div className="eyebrow">FAQ</div>
            <h2>Still wondering how it fits together?</h2>
          </div>
          <div className="faq-list">
            {faqItems.map(([question, answer], index) => (
              <button key={question} className={`faq-item ${faq === index ? "open" : ""}`} onClick={() => setFaq(faq === index ? -1 : index)}>
                <span><strong>{question}</strong>{faq === index && <small>{answer}</small>}</span>
                <span className="faq-icon"><Icon name="chevron" size={16}/></span>
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div><strong>GTAW Image Manager</strong><span>Discord-first screenshot hosting for GTAW players.</span></div>
        <div className="footer-links"><a href={GITHUB_URL} target="_blank" rel="noreferrer">Source</a><a href={serverInstallUrl} target="_blank" rel="noreferrer">Add bot</a></div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
