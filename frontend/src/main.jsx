import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { api } from "./api.js";

const demoImages = [
  { id: "demo-1", name: "pursuit-night.png", collection: "Police RP", size: "2.4 MB", date: "Today", tone: "night", url: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80" },
  { id: "demo-2", name: "traffic-stop.png", collection: "Police RP", size: "1.8 MB", date: "Yesterday", tone: "street", url: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80" },
  { id: "demo-3", name: "gang-meet.png", collection: "Gang RP", size: "3.1 MB", date: "Sep 18", tone: "red", url: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80" },
  { id: "demo-4", name: "crash-scene.png", collection: "Crashes", size: "2.0 MB", date: "Sep 17", tone: "orange", url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80" },
  { id: "demo-5", name: "downtown.png", collection: "Screenshots", size: "1.5 MB", date: "Sep 16", tone: "blue", url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80" },
  { id: "demo-6", name: "night-patrol.png", collection: "Police RP", size: "2.7 MB", date: "Sep 14", tone: "purple", url: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80" }
];

const demoCollections = [["All Images", 24, "grid"], ["Police RP", 11, "shield"], ["Gang RP", 5, "users"], ["Crashes", 4, "car"], ["Screenshots", 4, "image"]];

function Icon({ name, size = 18 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m4 17 5-5 3.5 3 2.5-2.5 6 5"/></>,
    tag: <><path d="m3 12 9-9h5l4 4v5l-9 9z"/><circle cx="15.5" cy="8.5" r="1"/></>,
    upload: <><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 20h14"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    copy: <><rect x="8" y="8" width="11" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"/></>,
    shield: <path d="M12 3 20 6v5c0 5-3.2 8.4-8 10-4.8-1.6-8-5-8-10V6z"/>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3 20c.7-3.2 2.6-5 6-5s5.3 1.8 6 5"/><path d="M16 5.5a3 3 0 0 1 0 5.8M17 15c2.2.3 3.5 1.9 4 4"/></>,
    car: <><path d="m5 17 1.5-6h11L20 17"/><path d="M4 17h16v3H4z"/><circle cx="7.5" cy="17.5" r="1"/><circle cx="16.5" cy="17.5" r="1"/><path d="m7 11 2-4h6l2 4"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2.5V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.6-1H6v-2.5h.4A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h2.5V5a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.6 1h.2v2.5H21a1.7 1.7 0 0 0-1.6 1.5z"/></>,
    discord: <><path d="M7 6.5a14 14 0 0 1 10 0c1.5 2.2 2.2 5 2 8.5-1.8 1.4-3.6 2.2-5.4 2.7l-1.1-1.5M7 6.5C5.5 8.7 4.8 11.5 5 15c1.8 1.4 3.6 2.2 5.4 2.7l1.1-1.5M8.5 13.5c2.1 1 4.9 1 7 0M9 10.5h.01M15 10.5h.01"/></>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function normalizeImage(item, collections) {
  const collection = collections.find((c) => String(c._id) === String(item.collectionId));
  const host = item.hosts?.find((h) => h.status === "active") || item.hosts?.[0];
  return { ...item, collection: collection?.name || "Uncategorized", size: ((item.originalSize || 0) / 1024 / 1024).toFixed(1) + " MB", date: new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }), tone: "night", url: host?.url || "" };
}

function App() {
  const [active, setActive] = useState("All Images");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Newest");
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [images, setImages] = useState([]);
  const [user, setUser] = useState(null);
  const [realCollections, setRealCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const inputRef = useRef(null);

  const isDemo = !user;
  const collections = isDemo ? demoCollections : [["All Images", images.length, "grid"], ...realCollections.map((c) => [c.name, images.filter((i) => String(i.collectionId) === String(c._id)).length, "folder"])];
  const normalized = isDemo ? demoImages : images.map((item) => normalizeImage(item, realCollections));

  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("auth_error");
    if (error) { setNotice(error); window.history.replaceState({}, "", window.location.pathname); }
    api.me().then(setUser).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  const loadData = async () => {
    if (!user) return;
    try {
      const [imageData, collectionData] = await Promise.all([api.images({ search, sort: sort === "Name" ? "newest" : sort === "Newest" ? "newest" : "oldest" }), api.collections()]);
      setImages(imageData.items || []); setRealCollections(collectionData.items || []);
    } catch (error) { setNotice(error.message); }
  };

  useEffect(() => { loadData(); }, [user, search, sort]);

  const filtered = useMemo(() => {
    let list = normalized.filter((img) => active === "All Images" || img.collection === active);
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter((img) => img.name.toLowerCase().includes(q) || img.collection.toLowerCase().includes(q) || (img.tags || []).join(" ").includes(q)); }
    if (sort === "Name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [active, search, sort, normalized]);

  const copy = async (value, label) => { try { await navigator.clipboard.writeText(value); setCopied(label); setTimeout(() => setCopied(""), 1400); } catch {} };

  const handleFiles = async (files) => {
    const file = files?.[0]; if (!file) return;
    if (!user) { setNotice("Connect Discord first to upload real screenshots."); return; }
    if (file.size > 8 * 1024 * 1024) { setNotice("That image is larger than the 8 MB upload limit."); return; }
    setUploading(true); setNotice("");
    try { await api.upload(file); await loadData(); setNotice("Upload complete."); } catch (error) { setNotice(error.message); } finally { setUploading(false); }
  };

  const selectedUrl = selected?.url || "";
  const bbcode = selectedUrl ? "[img]" + selectedUrl + "[/img]" : "";
  const markdown = selectedUrl ? "![" + selected.name + "](" + selectedUrl + ")" : "";

  return (
    <div className="app">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)}>☰</button>
        <div className="brand"><span className="brand-mark">G</span><strong>GTAW Image Manager</strong></div>
        <div className="top-actions">
          <span className="connection"><i className={user ? "online" : ""}/>{loading ? "Connecting..." : user ? "Connected" : "Demo mode"}</span>
          {user ? <button className="discord-button" onClick={async () => { await api.logout(); setUser(null); setImages([]); }}>Logout</button> : <button className="discord-button" onClick={() => api.login()}><Icon name="discord" size={17}/> Connect Discord</button>}
          <div className="avatar">{user?.username?.[0]?.toUpperCase() || "G"}</div>
        </div>
      </header>

      <div className="layout">
        <aside className={mobileNav ? "sidebar open" : "sidebar"}>
          <div className="sidebar-label">LIBRARY</div>
          <nav>{collections.map(([name, count, icon]) => <button className={active === name ? "nav-item active" : "nav-item"} onClick={() => { setActive(name); setMobileNav(false); }} key={name}><Icon name={icon} size={17}/><span>{name}</span><b>{count}</b></button>)}</nav>
          <div className="sidebar-label collections-label">TOOLS</div>
          <button className="nav-item"><Icon name="tag" size={17}/><span>Tags</span></button>
          <button className="nav-item"><Icon name="settings" size={17}/><span>Settings</span></button>
          <div className="sidebar-bottom"><div className="storage-title"><span>{user ? "Library" : "Storage"}</span><span>{user ? images.length + " images" : "Demo"}</span></div><div className="storage-bar"><span style={{ width: user ? "100%" : "72%" }}/></div><small>{user ? "Your private screenshot library" : "Demo library · connect Discord to begin"}</small></div>
        </aside>

        <main className="content">
          {notice && <div className="notice" onClick={() => setNotice("")}>{notice}</div>}
          <div className="page-heading"><div><div className="breadcrumb">LIBRARY <span>/</span> {active.toUpperCase()}</div><h1>{active}</h1><p>Manage, organize and share your GTAW screenshots.</p></div><button className="upload-button" disabled={uploading} onClick={() => inputRef.current?.click()}><Icon name="upload" size={17}/> {uploading ? "Uploading..." : "Upload"}</button><input ref={inputRef} hidden type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => handleFiles(e.target.files)}/></div>
          <section className="upload-zone" onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}><div className="upload-icon"><Icon name="upload" size={22}/></div><div><strong>{user ? "Drop screenshots here" : "Connect Discord to start uploading"}</strong><span>{user ? "or click to browse · PNG, JPG, WebP or GIF up to 8 MB" : "Your dashboard is ready — authentication unlocks your private library."}</span></div><kbd>{user ? "Upload" : "Connect"}</kbd></section>

          <div className="toolbar"><div className="search"><Icon name="search" size={17}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search screenshots..."/><kbd>⌘ K</kbd></div><div className="toolbar-right"><span>{filtered.length} shown</span><select value={sort} onChange={(e) => setSort(e.target.value)}><option>Newest</option><option>Name</option><option>Oldest</option></select></div></div>

          <div className="grid">{filtered.map((img) => <article className="image-card" key={img.id || img._id} onClick={() => setSelected(img)}><div className={"thumbnail " + (img.tone || "night")} style={img.url ? { backgroundImage: "linear-gradient(180deg, rgba(5,8,12,.08), rgba(5,8,12,.76)), url(" + img.url + ")", backgroundSize: "cover", backgroundPosition: "center" } : undefined}><div className="scene-lines"/><span>{img.collection}</span></div><div className="card-info"><div><strong>{img.name || img.filename}</strong><small>{img.size} · {img.date}</small></div><button className="icon-button" onClick={(e) => { e.stopPropagation(); if (img.url) copy(img.url, "url"); }}><Icon name="more" size={18}/></button></div></article>)}</div>
          {filtered.length === 0 && <div className="empty-state"><Icon name="image" size={32}/><strong>No screenshots found</strong><span>Try another search or upload your first screenshot.</span></div>}
          <footer className="footer-note">{isDemo ? "Demo library · Connect Discord to use your real private library." : "Private library · Images are stored as metadata and hosted by your configured image provider."}</footer>
        </main>
      </div>

      {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><section className="modal" onClick={(e) => e.stopPropagation()}><div className={"modal-preview " + (selected.tone || "night")} style={selected.url ? { backgroundImage: "url(" + selected.url + ")", backgroundSize: "cover", backgroundPosition: "center" } : undefined}><div className="scene-lines"/></div><div className="modal-body"><div className="modal-title"><div><span className="eyebrow">SCREENSHOT</span><h2>{selected.name || selected.filename}</h2></div><button className="close" onClick={() => setSelected(null)}>×</button></div><p className="muted">{selected.collection} · {selected.size} · {selected.date}</p>{selectedUrl ? <><div className="link-box"><span>Direct image URL</span><code>{selectedUrl}</code><button onClick={() => copy(selectedUrl, "url")}><Icon name="copy" size={16}/>{copied === "url" ? "Copied" : "Copy"}</button></div><div className="link-box"><span>BBCode</span><code>{bbcode}</code><button onClick={() => copy(bbcode, "bbcode")}><Icon name="copy" size={16}/>{copied === "bbcode" ? "Copied" : "Copy"}</button></div><div className="link-box"><span>Markdown</span><code>{markdown}</code><button onClick={() => copy(markdown, "markdown")}><Icon name="copy" size={16}/>{copied === "markdown" ? "Copied" : "Copy"}</button></div></> : <div className="link-box"><span>Demo image</span><code>Connect Discord to access real links.</code><button onClick={() => api.login()}>Connect</button></div>}</div></section></div>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);