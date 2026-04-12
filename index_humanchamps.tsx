import { useState, useRef, useEffect, useCallback } from "react";

// ── API Config ────────────────────────────────────────────────────────────────
const API_URL = "https://riship.app.n8n.cloud/webhook-test/f9705575-caac-41ec-a80e-4fe810dfc35b";

// ── Google Font import (injected once) ───────────────────────────────────────
const FONT_LINK = "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap";

// ── Study subjects / quick-start chips ───────────────────────────────────────
const SUBJECTS = [
  { emoji: "🧮", label: "Solve a math problem" },
  { emoji: "🔬", label: "Explain a science concept" },
  { emoji: "📜", label: "Summarise history" },
  { emoji: "✍️", label: "Help me write an essay" },
  { emoji: "💻", label: "Debug my code" },
  { emoji: "📖", label: "Quiz me on a topic" },
];

// ── Tiny SVG icons ────────────────────────────────────────────────────────────
const Icons = {
  Send: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  Moon: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  Sun: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  ),
  Copy: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  Check: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Settings: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
};

// ── Theme tokens ──────────────────────────────────────────────────────────────
const makeTheme = (dark) =>
  dark
    ? {
        "--bg":         "#141210",
        "--bg2":        "#1c1916",
        "--surface":    "#221f1b",
        "--surface2":   "#2c2823",
        "--border":     "#3a342e",
        "--border2":    "#4a433c",
        "--text":       "#f0ead8",
        "--text2":      "#a89880",
        "--text3":      "#6e6050",
        "--accent":     "#c8833a",
        "--accent2":    "#e8a855",
        "--accent-bg":  "rgba(200,131,58,.12)",
        "--ai-bubble":  "#1e1b17",
        "--user-bubble":"#3d2e1a",
        "--user-text":  "#f5ddb0",
        "--dot":        "#6e6050",
        "--tag-bg":     "#2c2520",
        "--tag-border": "#4a3d30",
      }
    : {
        "--bg":         "#faf7f0",
        "--bg2":        "#f3ede0",
        "--surface":    "#ffffff",
        "--surface2":   "#f7f2e8",
        "--border":     "#e2d9c8",
        "--border2":    "#cdc0a8",
        "--text":       "#2c1f0e",
        "--text2":      "#7a6348",
        "--text3":      "#b09878",
        "--accent":     "#b8631a",
        "--accent2":    "#d4843a",
        "--accent-bg":  "rgba(184,99,26,.08)",
        "--ai-bubble":  "#ffffff",
        "--user-bubble":"#4a2c0a",
        "--user-text":  "#fef3e2",
        "--dot":        "#b09878",
        "--tag-bg":     "#f3ede0",
        "--tag-border": "#ddd0b8",
      };

// ── CopyButton ────────────────────────────────────────────────────────────────
function CopyButton({ text }) {
  const [ok, setOk] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setOk(true);
      setTimeout(() => setOk(false), 1800);
    });
  };
  return (
    <button onClick={copy} title="Copy" style={{
      display: "flex", alignItems: "center", gap: 4,
      padding: "3px 9px", borderRadius: 6, cursor: "pointer",
      border: `1px solid ${ok ? "var(--accent)" : "var(--border)"}`,
      background: ok ? "var(--accent-bg)" : "transparent",
      color: ok ? "var(--accent)" : "var(--text3)",
      fontSize: 11, fontFamily: "var(--font-body)", transition: "all .2s",
    }}>
      {ok ? <Icons.Check /> : <Icons.Copy />}
      <span>{ok ? "Copied" : "Copy"}</span>
    </button>
  );
}

// ── TypingDots ────────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "6px 2px" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: "var(--dot)",
          animation: "srPulse 1.3s ease-in-out infinite",
          animationDelay: `${i * 0.18}s`,
        }} />
      ))}
    </div>
  );
}

// ── ChatBubble ────────────────────────────────────────────────────────────────
function ChatBubble({ role, text }) {
  const [hovered, setHovered] = useState(false);
  const isAI = role === "ai";

  return (
    <div
      style={{
        display: "flex", gap: 12,
        flexDirection: isAI ? "row" : "row-reverse",
        alignItems: "flex-start",
        animation: "srFadeUp .35s ease both",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar */}
      <div style={{
        width: 34, height: 34, borderRadius: isAI ? "10px 10px 10px 2px" : "10px 10px 2px 10px",
        flexShrink: 0,
        background: isAI
          ? "linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)"
          : "var(--surface2)",
        border: `1px solid ${isAI ? "transparent" : "var(--border)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: isAI ? 16 : 13, fontWeight: 500,
        color: isAI ? "#fff" : "var(--text2)",
        boxShadow: isAI ? "0 2px 12px rgba(200,131,58,.3)" : "none",
        marginTop: 2,
      }}>
        {isAI ? "🎓" : "U"}
      </div>

      {/* Bubble + actions */}
      <div style={{ maxWidth: "76%", display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: isAI ? "flex-start" : "flex-end" }}>
          <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: ".4px" }}>
            {isAI ? "SkillRankers AI" : "You"}
          </span>
        </div>
        <div style={{
          padding: "12px 16px",
          borderRadius: isAI ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
          background: isAI ? "var(--ai-bubble)" : "var(--user-bubble)",
          border: `1px solid ${isAI ? "var(--border)" : "transparent"}`,
          color: isAI ? "var(--text)" : "var(--user-text)",
          fontSize: 14, lineHeight: 1.75,
          fontFamily: isAI ? "var(--font-display)" : "var(--font-body)",
          fontStyle: isAI ? "normal" : "normal",
          whiteSpace: "pre-wrap", wordBreak: "break-word",
          boxShadow: isAI ? "0 1px 4px rgba(0,0,0,.06)" : "0 2px 12px rgba(74,44,10,.25)",
        }}>
          {text}
        </div>
        <div style={{
          display: "flex", gap: 6,
          justifyContent: isAI ? "flex-start" : "flex-end",
          opacity: hovered ? 1 : 0, transition: "opacity .2s",
        }}>
          <CopyButton text={text} />
        </div>
      </div>
    </div>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <label style={{ position: "relative", width: 38, height: 20, display: "inline-block", cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={onChange}
        style={{ opacity: 0, width: 0, height: 0, position: "absolute" }} />
      <span style={{
        position: "absolute", inset: 0, borderRadius: 10,
        background: checked ? "var(--accent)" : "var(--border2)",
        transition: "background .25s",
      }} />
      <span style={{
        position: "absolute", width: 14, height: 14,
        borderRadius: "50%", background: "#fff",
        top: 3, left: 3,
        transition: "transform .25s",
        transform: checked ? "translateX(18px)" : "translateX(0)",
        boxShadow: "0 1px 3px rgba(0,0,0,.2)",
      }} />
    </label>
  );
}

// ── Settings panel ────────────────────────────────────────────────────────────
function SettingsPanel({ isDark, setIsDark, model, setModel, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const row = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 };
  const label = { fontSize: 13, color: "var(--text2)", fontFamily: "var(--font-body)" };
  const sectionLabel = { fontSize: 10, fontWeight: 500, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--font-body)" };

  return (
    <div ref={ref} style={{
      position: "absolute", top: 50, left: 14, zIndex: 200,
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 14, padding: 18, width: 230,
      display: "flex", flexDirection: "column", gap: 14,
      boxShadow: "0 12px 40px rgba(0,0,0,.18)",
      animation: "srFadeUp .2s ease both",
    }}>
      <div style={sectionLabel}>Appearance</div>
      <div style={row}>
        <span style={label}>Dark mode</span>
        <Toggle checked={isDark} onChange={e => setIsDark(e.target.checked)} />
      </div>
      <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "0 -4px" }} />
      <div style={sectionLabel}>Study Model</div>
      {["General Tutor", "STEM Expert", "Humanities Guide", "Code Mentor"].map(m => (
        <div key={m} onClick={() => setModel(m)} style={{
          ...row, cursor: "pointer", padding: "7px 10px", borderRadius: 8,
          background: model === m ? "var(--accent-bg)" : "transparent",
          border: `1px solid ${model === m ? "var(--accent)" : "transparent"}`,
          transition: "all .15s",
        }}>
          <span style={{ ...label, color: model === m ? "var(--accent)" : "var(--text2)", fontWeight: model === m ? 500 : 400 }}>{m}</span>
          {model === m && <span style={{ color: "var(--accent)", fontSize: 12 }}>✓</span>}
        </div>
      ))}
      <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "0 -4px" }} />
      <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-body)", lineHeight: 1.6 }}>
        SkillRankers AI · Study Edition<br />
        API: api.example.com/v1/chat
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function SkillRankersAI() {
  const [isDark, setIsDark] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [model, setModel] = useState("General Tutor");
  const chatRef = useRef(null);
  const textareaRef = useRef(null);

  const theme = makeTheme(isDark);

  // Inject Google Fonts once
  useEffect(() => {
    if (!document.getElementById("sr-fonts")) {
      const link = document.createElement("link");
      link.id = "sr-fonts"; link.rel = "stylesheet"; link.href = FONT_LINK;
      document.head.appendChild(link);
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (ta) { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 140) + "px"; }
  };

  // ── API call ────────────────────────────────────────────────────────────────
  const send = useCallback(async (text) => {
    const msg = (text !== undefined ? text : input).trim();
    if (!msg || loading) return;

    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, model }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: "ai", text: data.reply ?? data.message ?? data.answer ?? JSON.stringify(data) },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: `⚠️ I couldn't connect to the server right now.\n\nError: ${err.message}\n\nPlease check your connection or try again shortly.` },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, model]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const iconBtn = {
    width: 36, height: 36, borderRadius: 9,
    border: "1px solid var(--border)", background: "var(--surface2)",
    color: "var(--text2)", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all .18s",
  };

  return (
    <>
      {/* ── Global styles ── */}
      <style>{`
        @keyframes srPulse {
          0%,100%{opacity:.25;transform:scale(.8)}
          50%{opacity:1;transform:scale(1)}
        }
        @keyframes srFadeUp {
          from{opacity:0;transform:translateY(10px)}
          to{opacity:1;transform:translateY(0)}
        }
        .sr-root *{box-sizing:border-box;margin:0;padding:0}
        .sr-root { --font-display:'Lora',Georgia,serif; --font-body:'DM Sans',sans-serif; }
        .sr-root textarea{font-family:var(--font-body)}
        .sr-root ::-webkit-scrollbar{width:5px}
        .sr-root ::-webkit-scrollbar-track{background:transparent}
        .sr-root ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:4px}
        .sr-iconbtn:hover{background:var(--surface) !important;color:var(--text) !important;border-color:var(--border2) !important}
        .sr-chip:hover{background:var(--accent-bg) !important;border-color:var(--accent) !important;color:var(--accent) !important}
        .sr-send:hover:not(:disabled){box-shadow:0 4px 16px rgba(200,131,58,.4) !important}
      `}</style>

      <div className="sr-root" style={{
        ...theme,
        display: "flex", flexDirection: "column",
        height: "100vh", maxWidth: 760, margin: "0 auto",
        background: "var(--bg)",
        fontFamily: "var(--font-body)",
        color: "var(--text)",
        transition: "background .35s, color .35s",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* ── Decorative top band ── */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: "linear-gradient(90deg, var(--accent) 0%, var(--accent2) 60%, transparent 100%)",
          zIndex: 10,
        }} />

        {/* ── Top bar ── */}
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px 12px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
          flexShrink: 0, position: "relative", zIndex: 5,
        }}>
          {/* Left: settings */}
          <div style={{ position: "relative" }}>
            <button
              className="sr-iconbtn"
              onClick={() => setSettingsOpen(v => !v)}
              style={iconBtn} title="Settings"
            >
              <Icons.Settings />
            </button>
            {settingsOpen && (
              <SettingsPanel
                isDark={isDark} setIsDark={setIsDark}
                model={model} setModel={setModel}
                onClose={() => setSettingsOpen(false)}
              />
            )}
          </div>

          {/* Centre: branding */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600,
              color: "var(--text)", letterSpacing: "-.3px", lineHeight: 1.2,
            }}>
              Skill<span style={{ color: "var(--accent)" }}>Rankers</span> <span style={{ fontStyle: "italic", fontWeight: 400 }}>AI</span>
            </div>
            <div style={{
              fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-body)",
              marginTop: 2, letterSpacing: ".5px",
            }}>
              {model} · Study Assistant
            </div>
          </div>

          {/* Right: clear + theme */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button className="sr-iconbtn" onClick={() => setMessages([])} style={iconBtn} title="Clear chat">
              <Icons.Trash />
            </button>
            <button className="sr-iconbtn" onClick={() => setIsDark(v => !v)} style={iconBtn} title="Toggle theme">
              {isDark ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </div>
        </header>

        {/* ── Chat area ── */}
        <div ref={chatRef} style={{
          flex: 1, overflowY: "auto",
          padding: "24px 20px",
          display: "flex", flexDirection: "column", gap: 20,
        }}>
          {/* Welcome screen */}
          {messages.length === 0 && !loading && (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 20, paddingTop: 28, animation: "srFadeUp .5s ease both",
            }}>
              {/* Hero badge */}
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 36, boxShadow: "0 8px 32px rgba(200,131,58,.35)",
              }}>🎓</div>

              <div style={{ textAlign: "center", maxWidth: 420 }}>
                <h1 style={{
                  fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600,
                  color: "var(--text)", lineHeight: 1.3, marginBottom: 10,
                }}>
                  Your personal study companion
                </h1>
                <p style={{
                  fontSize: 14, color: "var(--text2)", lineHeight: 1.75,
                  fontFamily: "var(--font-body)",
                }}>
                  Ask me anything — from complex equations to essay outlines, code bugs to history facts. I'm here to help you learn better and faster.
                </p>
              </div>

              {/* Subject chips */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10, width: "100%", maxWidth: 480,
              }}>
                {SUBJECTS.map(({ emoji, label }) => (
                  <button
                    key={label}
                    className="sr-chip"
                    onClick={() => send(label)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center",
                      gap: 6, padding: "12px 8px",
                      borderRadius: 12,
                      border: "1px solid var(--tag-border)",
                      background: "var(--tag-bg)",
                      color: "var(--text2)", cursor: "pointer",
                      fontFamily: "var(--font-body)", fontSize: 12,
                      transition: "all .2s", lineHeight: 1.3, textAlign: "center",
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{emoji}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* Decorative quote */}
              <p style={{
                fontFamily: "var(--font-display)", fontStyle: "italic",
                fontSize: 13, color: "var(--text3)", marginTop: 8,
              }}>
                "The beautiful thing about learning is that no one can take it away from you."
              </p>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <ChatBubble key={i} role={msg.role} text={msg.text} />
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", animation: "srFadeUp .3s ease both" }}>
              <div style={{
                width: 34, height: 34, borderRadius: "10px 10px 10px 2px", flexShrink: 0,
                background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, boxShadow: "0 2px 12px rgba(200,131,58,.3)", marginTop: 2,
              }}>🎓</div>
              <div style={{
                padding: "12px 16px", borderRadius: "4px 16px 16px 16px",
                background: "var(--ai-bubble)", border: "1px solid var(--border)",
                boxShadow: "0 1px 4px rgba(0,0,0,.06)",
              }}>
                <TypingDots />
              </div>
            </div>
          )}
        </div>

        {/* ── Input bar ── */}
        <div style={{
          padding: "14px 18px 18px",
          borderTop: "1px solid var(--border)",
          background: "var(--surface)",
          flexShrink: 0,
        }}>
          {/* Subject tag row */}
          <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
            {["Math", "Science", "Literature", "Code", "History"].map(tag => (
              <button
                key={tag}
                className="sr-chip"
                onClick={() => {
                  const prompt = `Help me with ${tag.toLowerCase()}: `;
                  setInput(prompt);
                  textareaRef.current?.focus();
                }}
                style={{
                  fontSize: 11, padding: "3px 10px", borderRadius: 20,
                  border: "1px solid var(--tag-border)", background: "var(--tag-bg)",
                  color: "var(--text3)", cursor: "pointer",
                  fontFamily: "var(--font-body)", transition: "all .18s",
                }}
              >{tag}</button>
            ))}
          </div>

          {/* Textarea + send */}
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{
              flex: 1, display: "flex", alignItems: "flex-end",
              background: "var(--bg2)",
              border: "1px solid var(--border2)",
              borderRadius: 14,
              transition: "border-color .2s",
            }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => { setInput(e.target.value); autoResize(); }}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything to study…  (Enter to send, Shift+Enter for new line)"
                maxLength={3000}
                rows={1}
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  resize: "none", color: "var(--text)", fontSize: 14,
                  padding: "12px 14px", minHeight: 46, maxHeight: 140,
                  lineHeight: 1.6, fontFamily: "var(--font-body)",
                }}
              />
              <span style={{
                fontSize: 10, color: "var(--text3)", padding: "0 12px 12px",
                alignSelf: "flex-end", whiteSpace: "nowrap", fontFamily: "var(--font-body)",
              }}>
                {input.length}/3000
              </span>
            </div>

            <button
              className="sr-send"
              onClick={() => send()}
              disabled={!input.trim() || loading}
              title="Send"
              style={{
                width: 46, height: 46, borderRadius: 12, border: "none",
                cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                background: input.trim() && !loading
                  ? "linear-gradient(135deg, var(--accent), var(--accent2))"
                  : "var(--surface2)",
                color: input.trim() && !loading ? "#fff" : "var(--text3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .2s", flexShrink: 0,
                opacity: input.trim() && !loading ? 1 : 0.5,
              }}
            >
              <Icons.Send />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
