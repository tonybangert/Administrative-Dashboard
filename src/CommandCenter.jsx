import { useState, useEffect } from "react";
import { CheckCircle, Circle, TrendingUp, Users, FileText, Lightbulb, Link2, AlertTriangle, Calendar, PenTool, ChevronRight, Plus, Trash2, MessageSquare, ExternalLink, Globe, RefreshCw, Zap, ArrowUpRight } from "lucide-react";

const B = {
  amber: "#faa840", amberDim: "rgba(250,168,64,0.15)", amberGlow: "rgba(250,168,64,0.25)",
  red: "#ef4537", redDim: "rgba(239,69,55,0.12)",
  green: "#34d399", greenDim: "rgba(52,211,153,0.12)",
  navy: "#102d50",
  bg: "#080f1e", bgCard: "rgba(255,255,255,0.035)", bgCardHover: "rgba(255,255,255,0.06)",
  bgInput: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.07)", borderHover: "rgba(250,168,64,0.25)",
  text: "#f1f5f9", textSec: "rgba(255,255,255,0.55)", textMute: "rgba(255,255,255,0.3)",
  glass: "rgba(12,20,40,0.6)",
};

const LOGO = "https://dl.dropboxusercontent.com/scl/fi/jyd8wyhmo29yc6l4hfmi2/Icon_1x1.png?rlkey=tx9xsnkojuzqhmk12nqxskr1h&st=4nhdbpjs";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { greeting: "Good morning", context: "Let's make today count." };
  if (h < 17) return { greeting: "Good afternoon", context: "Deep work hours. Stay locked in." };
  if (h < 21) return { greeting: "Good evening", context: "Wrap it up strong." };
  return { greeting: "Burning the midnight oil", context: "Don't forget to rest." };
}

function getMotivation() {
  const lines = [
    "Build something they can't ignore.",
    "Revenue doesn't wait. Neither do you.",
    "Forward-deployed. Always.",
    "The pipeline is a reflection of your effort.",
    "One more call. One more close.",
    "Ship it. Iterate later.",
    "Clients don't need vendors. They need operators.",
    "Execution is the only strategy that matters.",
    "Your competition is still in meetings about meetings.",
    "FDE is a category. You're defining it.",
  ];
  const day = new Date().getDate();
  return lines[day % lines.length];
}

const SEED_NOTES = {
  "Client To-Dos": [
    { id: 1, text: "Send LNS updated dashboard mockups to Andrew", client: "LNS", priority: "high", done: false, created: "2026-03-27T14:30:00" },
    { id: 2, text: "Follow up with Patrick on CJP newsletter schedule", client: "CJP", priority: "medium", done: false, created: "2026-03-27T10:15:00" },
    { id: 3, text: "Review CK Sales Summit segmentation updates with Brad", client: "CK", priority: "medium", done: false, created: "2026-03-26T16:00:00" },
  ],
  "High Priority": [
    { id: 4, text: "Finalize Aplora JV deliverable timeline with Paul and Eric", priority: "critical", done: false, created: "2026-03-28T08:00:00" },
    { id: 5, text: "Prep pipeline deck for new business meeting Monday", priority: "critical", done: false, created: "2026-03-27T09:00:00" },
  ],
  "Prospect Updates": [
    { id: 6, text: "Initial call with mid-market fintech prospect went well. Sending proposal Monday.", done: false, created: "2026-03-27T15:00:00", value: "$5K/mo" },
    { id: 7, text: "Marketing services company interested in FDE model. Needs follow-up.", done: false, created: "2026-03-26T11:30:00", value: "$8K/mo" },
  ],
  "Client Meeting Notes": [
    { id: 8, text: "LNS sync (3/27): Ben flagged data integration timeline. Brandon wants weekly status updates. Andrew aligned on Q2 roadmap.", client: "LNS", done: false, created: "2026-03-27T13:00:00" },
    { id: 9, text: "CK check-in (3/26): Kevin pushing for faster segmentation rollout. Brad supportive. Need to scope Phase 2.", client: "CK", done: false, created: "2026-03-26T14:00:00" },
  ],
  "Random Thoughts": [
    { id: 10, text: "Could we build a self-serve AI readiness assessment as a lead gen tool?", done: false, created: "2026-03-27T20:00:00" },
    { id: 11, text: "FDE model needs a one-pager that explains it in 60 seconds", done: false, created: "2026-03-26T18:30:00" },
  ],
  "Links to Review": [
    { id: 12, text: "Interesting thread on agentic AI in enterprise", url: "https://example.com/agentic-ai", domain: "example.com", done: false, created: "2026-03-27T21:00:00" },
    { id: 13, text: "Competitor doing embedded analytics for mid-market", url: "https://example.com/competitor", domain: "example.com", done: false, created: "2026-03-26T12:00:00" },
    { id: 14, text: "Good breakdown of forward-deployed engineering teams", url: "https://newsletter.pragmaticengineer.com/p/forward-deployed", domain: "newsletter.pragmaticengineer.com", done: false, created: "2026-03-25T09:00:00" },
  ],
};

const SEED_CLIENTS = [
  { name: "Legal Notice Service", code: "LNS", contacts: ["Andrew Morys", "Ben Desnoyers", "Brandon Bressner"], status: "Active", lastActivity: "2026-03-27" },
  { name: "Community Journalism Project", code: "CJP", contacts: ["Patrick Schless", "Ray Herrara"], status: "Active", lastActivity: "2026-03-27" },
  { name: "CK Marketing", code: "CK", contacts: ["Brad Moore", "Kevin Roselli"], status: "Active", lastActivity: "2026-03-26" },
];

const SEED_PROSPECTS = [
  { name: "Mid-Market Fintech Co.", stage: "Proposal Sent", value: "$5K/mo", nextStep: "Follow up Monday", lastActivity: "2026-03-27" },
  { name: "Marketing Services Firm", stage: "Discovery", value: "$8K/mo", nextStep: "Schedule FDE walkthrough", lastActivity: "2026-03-26" },
];

const SEED_LINKEDIN = [
  { id: 1, title: "The SaaS Activation Gap", pillar: "SaaS Activation Gap", status: "draft", snippet: "Every year, businesses spend billions on software that forces them to change how they work...", created: "2026-03-27" },
  { id: 2, title: "What FDE Actually Means", pillar: "FDE as Category", status: "idea", snippet: "Forward-Deployed Execution isn't a methodology. It's a category.", created: "2026-03-26" },
  { id: 3, title: "3 Questions Every CRO Should Answer", pillar: "Revenue Intelligence", status: "idea", snippet: "Three questions every CRO should be able to answer from their own CRM data today.", created: "2026-03-25" },
];

const SEED_CALENDAR = [
  { day: "Mon", date: "Mar 31", events: [{ time: "9:00 AM", title: "LNS Weekly Sync", type: "client" }, { time: "2:00 PM", title: "Pipeline Review", type: "internal" }] },
  { day: "Tue", date: "Apr 1", events: [{ time: "10:00 AM", title: "CJP Content Planning", type: "client" }, { time: "3:00 PM", title: "Aplora JV Strategy", type: "partner" }] },
  { day: "Wed", date: "Apr 2", events: [{ time: "9:30 AM", title: "CK Check-in", type: "client" }, { time: "1:00 PM", title: "Prospect Discovery", type: "prospect" }] },
  { day: "Thu", date: "Apr 3", events: [{ time: "11:00 AM", title: "Dora: BD Sync", type: "internal" }, { time: "4:00 PM", title: "Build Block", type: "focus" }] },
  { day: "Fri", date: "Apr 4", events: [{ time: "9:00 AM", title: "Week Wrap", type: "internal" }] },
];

const CATS = [
  { name: "Client To-Dos", icon: CheckCircle, color: B.amber },
  { name: "High Priority", icon: AlertTriangle, color: B.red },
  { name: "Prospect Updates", icon: TrendingUp, color: B.green },
  { name: "Client Meeting Notes", icon: FileText, color: "#818cf8" },
  { name: "Random Thoughts", icon: Lightbulb, color: "#f472b6" },
  { name: "Links to Review", icon: Link2, color: "#38bdf8" },
];

const EV_COL = { client: B.amber, internal: B.textSec, partner: "#818cf8", prospect: B.green, focus: "#f472b6" };

function timeAgo(d) {
  const hrs = Math.round((Date.now() - new Date(d).getTime()) / 3600000);
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? "yesterday" : `${days}d ago`;
}
function fmtDate(d) { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
function extractUrl(text) {
  const m = text.match(/(https?:\/\/[^\s<>]+)/gi);
  if (!m) return { url: null, domain: null, clean: text.trim() };
  const url = m[0];
  let domain = ""; try { domain = new URL(url).hostname.replace(/^www\./, ""); } catch { domain = url; }
  const clean = text.replace(url, "").trim();
  return { url, domain, clean: clean || domain };
}

const glass = {
  background: B.bgCard, borderRadius: 16, border: `1px solid ${B.border}`,
  backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", overflow: "hidden",
};
const anim = (i) => ({ animation: `fadeInUp 0.5s ease ${i * 0.08}s both` });

function HeroHeader() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 60000); return () => clearInterval(t); }, []);
  const { greeting, context } = getGreeting();
  const motivation = getMotivation();
  const dateStr = time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const timeStr = time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <div style={{
      position: "relative", padding: "40px 40px 32px", overflow: "hidden",
      background: "linear-gradient(135deg, #0c1a30 0%, #0f1b2d 40%, #131f33 100%)",
      borderBottom: `1px solid ${B.border}`,
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: "linear-gradient(90deg, transparent, #faa840, #ef4537, #faa840, transparent)",
        backgroundSize: "200% 100%", animation: "gradientShift 4s ease infinite",
      }} />
      <div style={{
        position: "absolute", top: -60, right: -40, width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(250,168,64,0.06) 0%, transparent 70%)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -80, left: 100, width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(239,69,55,0.04) 0%, transparent 70%)", pointerEvents: "none",
      }} />
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", maxWidth: 1320, margin: "0 auto" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <img src={LOGO} alt="" style={{ width: 38, height: 38, borderRadius: 10 }} onError={(e) => e.target.style.display = "none"} />
            <div style={{ fontSize: 11, fontWeight: 600, color: B.amber, textTransform: "uppercase", letterSpacing: "0.12em" }}>PerformanceLabs.AI</div>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: B.text, margin: 0, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            {greeting}, <span style={{ background: "linear-gradient(135deg, #faa840, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Tony</span>
          </h1>
          <p style={{ fontSize: 15, color: B.textSec, marginTop: 8, fontWeight: 450 }}>{context}</p>
          <p style={{ fontSize: 13, color: B.textMute, marginTop: 12, fontStyle: "italic", borderLeft: `2px solid ${B.amber}`, paddingLeft: 12 }}>"{motivation}"</p>
        </div>
        <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
          <div style={{ fontSize: 12, color: B.textMute }}>{dateStr}</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: B.text, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{timeStr}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: B.greenDim, padding: "5px 12px", borderRadius: 20, marginTop: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: B.green, animation: "pulseGlow 2s ease infinite" }} />
            <span style={{ fontSize: 11, color: B.green, fontWeight: 600 }}>Systems Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsBar({ notes }) {
  const total = Object.values(notes).flat().filter(n => !n.done).length;
  const critical = (notes["High Priority"] || []).filter(n => !n.done).length;
  const links = (notes["Links to Review"] || []).filter(n => !n.done).length;
  const stats = [
    { label: "Open Items", value: total, color: B.amber },
    { label: "Critical", value: critical, color: B.red },
    { label: "Active Clients", value: SEED_CLIENTS.length, color: B.green },
    { label: "Pipeline Prospects", value: SEED_PROSPECTS.length, color: "#818cf8" },
    { label: "Links Queued", value: links, color: "#38bdf8" },
    { label: "Posts in Queue", value: SEED_LINKEDIN.length, color: "#f472b6" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, ...anim(1) }}>
      {stats.map((s, i) => (
        <div key={i} style={{ ...glass, padding: "16px 18px", textAlign: "center", transition: "all 0.25s ease", cursor: "default" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = s.color + "40"; e.currentTarget.style.background = B.bgCardHover; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.background = B.bgCard; }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: s.color, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
          <div style={{ fontSize: 11, color: B.textMute, marginTop: 4, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function TopBar() {
  const [view, setView] = useState("clients");
  const tab = (active, col) => ({
    display: "flex", alignItems: "center", gap: 8, padding: "12px 18px", border: "none", background: "none",
    cursor: "pointer", fontSize: 13, fontWeight: active ? 600 : 450, color: active ? col : B.textMute,
    borderBottom: active ? `2px solid ${col}` : "2px solid transparent", transition: "all 0.2s ease",
  });
  return (
    <div style={{ ...glass, ...anim(2) }}>
      <div style={{ display: "flex", padding: "0 20px", borderBottom: `1px solid ${B.border}` }}>
        <button onClick={() => setView("clients")} style={tab(view === "clients", B.amber)}>
          <Users size={14} /> Active Clients
          <span style={{ fontSize: 10, fontWeight: 700, background: view === "clients" ? B.amber : "rgba(255,255,255,0.08)", color: view === "clients" ? "#000" : B.textMute, padding: "2px 7px", borderRadius: 8 }}>3</span>
        </button>
        <button onClick={() => setView("prospects")} style={tab(view === "prospects", B.green)}>
          <TrendingUp size={14} /> Prospects
          <span style={{ fontSize: 10, fontWeight: 700, background: view === "prospects" ? B.green : "rgba(255,255,255,0.08)", color: view === "prospects" ? "#000" : B.textMute, padding: "2px 7px", borderRadius: 8 }}>{SEED_PROSPECTS.length}</span>
        </button>
      </div>
      <div style={{ padding: 20 }}>
        {view === "clients" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {SEED_CLIENTS.map((c) => (
              <div key={c.code} style={{ padding: 16, background: "rgba(255,255,255,0.02)", borderRadius: 12, border: `1px solid ${B.border}`, cursor: "pointer", transition: "all 0.25s ease", position: "relative", overflow: "hidden" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = B.amber + "40"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(250,168,64,0.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(90deg, ${B.amber}, transparent)` }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 650, color: B.text }}>{c.name}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, background: B.greenDim, color: B.green, padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{c.status}</span>
                </div>
                <div style={{ fontSize: 12, color: B.textSec, marginBottom: 8 }}>{c.contacts.join(", ")}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: B.textMute }}>Last: {fmtDate(c.lastActivity)}</span>
                  <ArrowUpRight size={13} color={B.textMute} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {SEED_PROSPECTS.map((p, i) => (
              <div key={i} style={{ padding: 16, background: "rgba(255,255,255,0.02)", borderRadius: 12, border: `1px solid ${B.border}`, cursor: "pointer", transition: "all 0.25s ease", position: "relative", overflow: "hidden" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = B.green + "40"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.transform = "none"; }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(90deg, ${B.green}, transparent)` }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 650, color: B.text }}>{p.name}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, background: B.amberDim, color: B.amber, padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{p.stage}</span>
                </div>
                <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: B.green }}>{p.value}</span>
                  <span style={{ fontSize: 12, color: B.textMute, alignSelf: "center" }}>retainer</span>
                </div>
                <div style={{ fontSize: 12, color: B.textSec }}><b style={{ fontWeight: 600 }}>Next:</b> {p.nextStep}</div>
              </div>
            ))}
            <div style={{ padding: 16, borderRadius: 12, border: `1px dashed rgba(255,255,255,0.1)`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s ease" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = B.amber}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}>
              <Plus size={16} color={B.textMute} /><span style={{ fontSize: 12, color: B.textMute, marginLeft: 6, fontWeight: 500 }}>Add Prospect</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NotesPanel({ notes, setNotes }) {
  const [tab, setTab] = useState("Client To-Dos");
  const [input, setInput] = useState("");
  const toggle = (id) => setNotes(p => ({ ...p, [tab]: p[tab].map(n => n.id === id ? { ...n, done: !n.done } : n) }));
  const del = (id) => setNotes(p => ({ ...p, [tab]: p[tab].filter(n => n.id !== id) }));
  const add = () => {
    if (!input.trim()) return;
    const maxId = Object.values(notes).flat().reduce((mx, n) => Math.max(mx, n.id), 0);
    let obj = { id: maxId + 1, text: input, done: false, created: new Date().toISOString() };
    const { url, domain, clean } = extractUrl(input);
    if (url) { obj.url = url; obj.domain = domain; obj.text = clean; if (tab !== "Links to Review" && clean === domain) { setNotes(p => ({ ...p, "Links to Review": [obj, ...p["Links to Review"]] })); setInput(""); return; } }
    setNotes(p => ({ ...p, [tab]: [obj, ...p[tab]] }));
    setInput("");
  };
  const cat = CATS.find(c => c.name === tab);
  const items = notes[tab] || [];

  return (
    <div style={{ ...glass, ...anim(3) }}>
      <div style={{ padding: "14px 18px 0", borderBottom: `1px solid ${B.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: B.text, margin: 0 }}>Notes & Tasks</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: B.greenDim, padding: "3px 10px", borderRadius: 16 }}>
            <MessageSquare size={11} color={B.green} />
            <span style={{ fontSize: 10, color: B.green, fontWeight: 600 }}>Slack-synced</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {CATS.map(c => {
            const Icon = c.icon; const active = tab === c.name;
            const count = (notes[c.name] || []).filter(n => !n.done).length;
            return (
              <button key={c.name} onClick={() => setTab(c.name)} style={{
                display: "flex", alignItems: "center", gap: 4, padding: "7px 10px", border: "none", background: "none",
                cursor: "pointer", borderBottom: active ? `2px solid ${c.color}` : "2px solid transparent",
                color: active ? c.color : B.textMute, fontWeight: active ? 600 : 450, fontSize: 11, whiteSpace: "nowrap", transition: "all 0.2s ease",
              }}>
                <Icon size={12} />{c.name}
                {count > 0 && <span style={{ fontSize: 9, fontWeight: 700, background: active ? c.color : "rgba(255,255,255,0.08)", color: active ? "#000" : B.textMute, padding: "1px 5px", borderRadius: 6 }}>{count}</span>}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && add()}
            placeholder={tab === "Links to Review" ? "Paste a URL or add a note..." : `Add to ${tab}...`}
            style={{ flex: 1, padding: "10px 14px", background: B.bgInput, border: `1px solid ${B.border}`, borderRadius: 8, fontSize: 13, color: B.text, outline: "none", transition: "border-color 0.2s ease" }}
            onFocus={e => e.target.style.borderColor = cat.color + "60"} onBlur={e => e.target.style.borderColor = B.border} />
          <button onClick={add} style={{ display: "flex", alignItems: "center", gap: 5, padding: "10px 16px", background: cat.color, color: "#000", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12, transition: "opacity 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            <Plus size={14} /> Add
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 360, overflowY: "auto" }}>
          {items.length === 0 && <div style={{ padding: 24, textAlign: "center", color: B.textMute, fontSize: 12 }}>No items yet. Drop a note in Slack or add one here.</div>}
          {items.map(item => (
            <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "11px 12px", background: item.done ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.02)", borderRadius: 8, border: `1px solid ${item.done ? "transparent" : B.border}`, opacity: item.done ? 0.35 : 1, transition: "all 0.2s ease" }}>
              <button onClick={() => toggle(item.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 1 }}>
                {item.done ? <CheckCircle size={16} color={cat.color} /> : <Circle size={16} color="rgba(255,255,255,0.15)" />}
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                {item.url ? (
                  <>
                    <div style={{ fontSize: 13, color: item.done ? B.textMute : B.text, textDecoration: item.done ? "line-through" : "none", lineHeight: 1.5 }}>{item.text}</div>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
                      display: "inline-flex", alignItems: "center", gap: 5, marginTop: 5, padding: "4px 9px",
                      background: "rgba(56,189,248,0.08)", borderRadius: 5, fontSize: 11, color: "#38bdf8",
                      textDecoration: "none", border: "1px solid rgba(56,189,248,0.15)", transition: "all 0.2s ease", maxWidth: "100%", overflow: "hidden",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = B.amberDim; e.currentTarget.style.borderColor = B.amber + "30"; e.currentTarget.style.color = B.amber; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(56,189,248,0.08)"; e.currentTarget.style.borderColor = "rgba(56,189,248,0.15)"; e.currentTarget.style.color = "#38bdf8"; }}>
                      <Globe size={11} /><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.domain || item.url}</span><ExternalLink size={10} style={{ opacity: 0.5, flexShrink: 0 }} />
                    </a>
                  </>
                ) : (
                  <div style={{ fontSize: 13, color: item.done ? B.textMute : B.text, textDecoration: item.done ? "line-through" : "none", lineHeight: 1.5 }}>{item.text}</div>
                )}
                <div style={{ display: "flex", gap: 5, marginTop: 4, flexWrap: "wrap" }}>
                  {item.client && <span style={{ fontSize: 9, background: B.amberDim, color: B.amber, padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>{item.client}</span>}
                  {item.priority === "critical" && <span style={{ fontSize: 9, background: B.redDim, color: B.red, padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>CRITICAL</span>}
                  {item.value && <span style={{ fontSize: 9, background: B.greenDim, color: B.green, padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>{item.value}</span>}
                  <span style={{ fontSize: 9, color: B.textMute }}>{timeAgo(item.created)}</span>
                </div>
              </div>
              <button onClick={() => del(item.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "rgba(255,255,255,0.1)", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = B.red} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.1)"}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LinkedInQueue() {
  const sc = { draft: { bg: B.amberDim, text: B.amber }, idea: { bg: "rgba(244,114,182,0.1)", text: "#f472b6" }, scheduled: { bg: B.greenDim, text: B.green }, posted: { bg: "rgba(255,255,255,0.05)", text: B.textMute } };
  return (
    <div style={{ ...glass, padding: 20, ...anim(4) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: B.text, margin: 0 }}>LinkedIn Queue</h2>
        <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: B.amber, color: "#000", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700, transition: "opacity 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
          <PenTool size={11} /> New Post
        </button>
      </div>
      {SEED_LINKEDIN.map(p => {
        const s = sc[p.status] || sc.idea;
        return (
          <div key={p.id} style={{ padding: "12px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 10, border: `1px solid ${B.border}`, marginBottom: 8, cursor: "pointer", transition: "all 0.2s ease" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = B.amber + "30"} onMouseLeave={e => e.currentTarget.style.borderColor = B.border}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: B.text }}>{p.title}</span>
              <span style={{ fontSize: 9, fontWeight: 700, background: s.bg, color: s.text, padding: "2px 7px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{p.status}</span>
            </div>
            <div style={{ fontSize: 12, color: B.textSec, lineHeight: 1.6 }}>{p.snippet}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <span style={{ fontSize: 9, background: "rgba(255,255,255,0.05)", color: B.textSec, padding: "2px 7px", borderRadius: 4, fontWeight: 500 }}>{p.pillar}</span>
              <span style={{ fontSize: 9, color: B.textMute }}>{fmtDate(p.created)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WeeklyCalendar() {
  return (
    <div style={{ ...glass, padding: 20, ...anim(5) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: B.text, margin: 0 }}>This Week</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Calendar size={12} color={B.textMute} /><span style={{ fontSize: 11, color: B.textMute }}>Mar 31 - Apr 4</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
        {SEED_CALENDAR.map(day => (
          <div key={day.day} style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${B.border}` }}>
            <div style={{ background: "rgba(255,255,255,0.03)", padding: "7px 8px", textAlign: "center", borderBottom: `1px solid ${B.border}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: B.text }}>{day.day}</div>
              <div style={{ fontSize: 9, color: B.textMute }}>{day.date}</div>
            </div>
            <div style={{ padding: 5, display: "flex", flexDirection: "column", gap: 3, minHeight: 70 }}>
              {day.events.map((ev, i) => (
                <div key={i} style={{ padding: "4px 6px", borderRadius: 4, background: (EV_COL[ev.type] || B.textMute) + "0a", borderLeft: `2px solid ${EV_COL[ev.type] || B.textMute}` }}>
                  <div style={{ fontSize: 8, color: B.textMute }}>{ev.time}</div>
                  <div style={{ fontSize: 9, color: B.text, fontWeight: 500, lineHeight: 1.3 }}>{ev.title}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlackSync() {
  const pulls = [{ time: "7:00 AM", status: "completed" }, { time: "12:00 PM", status: "upcoming" }, { time: "6:00 PM", status: "upcoming" }];
  return (
    <div style={{ ...glass, padding: 20, display: "flex", flexDirection: "column", ...anim(3) }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: B.text, margin: 0, marginBottom: 4 }}>Slack Sync</h2>
      <div style={{ fontSize: 11, color: B.textMute, marginBottom: 14 }}>#cowork-daily-organizer</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {pulls.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: p.status === "completed" ? B.green : "rgba(255,255,255,0.1)", boxShadow: p.status === "completed" ? `0 0 8px ${B.green}40` : "none" }} />
            <span style={{ fontSize: 12, color: B.text, fontWeight: 500, width: 70 }}>{p.time}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: p.status === "completed" ? B.green : B.textMute }}>{p.status === "completed" ? "Synced" : "Upcoming"}</span>
          </div>
        ))}
      </div>
      <button style={{
        marginTop: 14, width: "100%", padding: "9px 12px", background: "rgba(250,168,64,0.1)",
        border: `1px solid rgba(250,168,64,0.18)`, borderRadius: 8, cursor: "pointer", fontSize: 11,
        color: B.amber, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s ease",
      }}
      onMouseEnter={e => e.currentTarget.style.background = B.amberDim} onMouseLeave={e => e.currentTarget.style.background = "rgba(250,168,64,0.1)"}>
        <RefreshCw size={12} /> Sync Now
      </button>
    </div>
  );
}

export default function CommandCenter() {
  const [notes, setNotes] = useState(SEED_NOTES);
  return (
    <div style={{ minHeight: "100vh", background: B.bg }}>
      <HeroHeader />
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "22px 40px 40px" }}>
        <StatsBar notes={notes} />
        <div style={{ marginTop: 18 }}><TopBar /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 18, marginTop: 18 }}>
          <NotesPanel notes={notes} setNotes={setNotes} />
          <SlackSync />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 18 }}>
          <LinkedInQueue />
          <WeeklyCalendar />
        </div>
        <div style={{ textAlign: "center", padding: "28px 0 8px", fontSize: 10, color: B.textMute, letterSpacing: "0.08em", textTransform: "uppercase" }}>PerformanceLabs.AI Command Center</div>
      </div>
    </div>
  );
}
