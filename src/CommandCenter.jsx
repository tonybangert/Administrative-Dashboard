import { useState } from "react";
import { CheckCircle, Circle, TrendingUp, Users, FileText, Lightbulb, Link2, AlertTriangle, Calendar, PenTool, ChevronRight, Plus, Trash2, MessageSquare, ExternalLink, Globe, RefreshCw } from "lucide-react";

// Brand Tokens
const BRAND = {
  navy: "#102d50",
  navyLight: "#1a3d66",
  navyMuted: "#2a4a72",
  amber: "#faa840",
  amberLight: "#fbb960",
  amberBg: "#fef7ec",
  red: "#ef4537",
  redBg: "#fef2f1",
  surface: "#ffffff",
  bg: "#f5f7fa",
  bgAlt: "#edf0f5",
  text: "#102d50",
  textSecondary: "#5a6b80",
  textMuted: "#8d99a8",
  border: "#e2e8f0",
  borderLight: "#f0f3f7",
  cardBg: "#fafbfc",
  success: "#0d9668",
  successBg: "#ecfdf5",
};

const LOGO_URL = "https://dl.dropboxusercontent.com/scl/fi/jyd8wyhmo29yc6l4hfmi2/Icon_1x1.png?rlkey=tx9xsnkojuzqhmk12nqxskr1h&st=4nhdbpjs";

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
  { name: "Legal Notice Service", code: "LNS", contacts: ["Andrew Morys", "Ben Desnoyers", "Brandon Bressner"], status: "Active", lastActivity: "2026-03-27", color: BRAND.amber },
  { name: "Community Journalism Project", code: "CJP", contacts: ["Patrick Schless", "Ray Herrara"], status: "Active", lastActivity: "2026-03-27", color: BRAND.navyMuted },
  { name: "CK Marketing", code: "CK", contacts: ["Brad Moore", "Kevin Roselli"], status: "Active", lastActivity: "2026-03-26", color: BRAND.red },
];

const SEED_PROSPECTS = [
  { name: "Mid-Market Fintech Co.", stage: "Proposal Sent", value: "$5K/mo", nextStep: "Follow up Monday", lastActivity: "2026-03-27", color: BRAND.success },
  { name: "Marketing Services Firm", stage: "Discovery", value: "$8K/mo", nextStep: "Schedule FDE walkthrough", lastActivity: "2026-03-26", color: BRAND.amber },
];

const SEED_LINKEDIN = [
  { id: 1, title: "The SaaS Activation Gap", pillar: "SaaS Activation Gap", status: "draft", snippet: "Every year, businesses spend billions on software that forces them to change how they work...", created: "2026-03-27" },
  { id: 2, title: "What FDE Actually Means", pillar: "FDE as Category", status: "idea", snippet: "Forward-Deployed Execution isn't a methodology. It's a category.", created: "2026-03-26" },
  { id: 3, title: "3 Questions Every CRO Should Answer", pillar: "Revenue Intelligence", status: "idea", snippet: "Three questions every CRO should be able to answer from their own CRM data today.", created: "2026-03-25" },
];

const SEED_CALENDAR = [
  { day: "Mon", date: "Mar 31", events: [{ time: "9:00 AM", title: "LNS Weekly Sync", type: "client" }, { time: "2:00 PM", title: "New Business Pipeline Review", type: "internal" }] },
  { day: "Tue", date: "Apr 1", events: [{ time: "10:00 AM", title: "CJP Content Planning", type: "client" }, { time: "3:00 PM", title: "Aplora JV Strategy", type: "partner" }] },
  { day: "Wed", date: "Apr 2", events: [{ time: "9:30 AM", title: "CK Marketing Check-in", type: "client" }, { time: "1:00 PM", title: "Prospect Discovery Call", type: "prospect" }] },
  { day: "Thu", date: "Apr 3", events: [{ time: "11:00 AM", title: "Dora: BD Pipeline Sync", type: "internal" }, { time: "4:00 PM", title: "Build/Code Block", type: "focus" }] },
  { day: "Fri", date: "Apr 4", events: [{ time: "9:00 AM", title: "Week Wrap + Planning", type: "internal" }] },
];

const NOTE_CATEGORIES = [
  { name: "Client To-Dos", icon: CheckCircle, color: BRAND.navy },
  { name: "High Priority", icon: AlertTriangle, color: BRAND.red },
  { name: "Prospect Updates", icon: TrendingUp, color: BRAND.success },
  { name: "Client Meeting Notes", icon: FileText, color: BRAND.navyMuted },
  { name: "Random Thoughts", icon: Lightbulb, color: BRAND.amber },
  { name: "Links to Review", icon: Link2, color: BRAND.navyLight },
];

const EVENT_COLORS = {
  client: BRAND.navy,
  internal: BRAND.textSecondary,
  partner: BRAND.navyMuted,
  prospect: BRAND.success,
  focus: BRAND.amber,
};

function timeAgo(dateStr) {
  const now = new Date();
  const then = new Date(dateStr);
  const hrs = Math.round((now - then) / 3600000);
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? "yesterday" : `${days}d ago`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function extractUrl(text) {
  const urlRegex = /(https?:\/\/[^\s<>]+)/gi;
  const match = text.match(urlRegex);
  if (!match) return { url: null, domain: null, cleanText: text.trim() };
  const url = match[0];
  let domain = "";
  try { domain = new URL(url).hostname.replace(/^www\./, ""); } catch { domain = url; }
  const cleanText = text.replace(url, "").trim();
  return { url, domain, cleanText: cleanText || domain };
}

function todayString() {
  const d = new Date();
  const opts = { weekday: "long", month: "long", day: "numeric", year: "numeric" };
  return d.toLocaleDateString("en-US", opts);
}

const card = {
  background: BRAND.surface,
  borderRadius: 14,
  border: `1px solid ${BRAND.border}`,
  overflow: "hidden",
};

const sectionTitle = {
  fontSize: 15,
  fontWeight: 650,
  color: BRAND.text,
  margin: 0,
  letterSpacing: "-0.01em",
};

function TopBar() {
  const [activeView, setActiveView] = useState("clients");

  const tabStyle = (active, accentColor) => ({
    display: "flex", alignItems: "center", gap: 8, padding: "13px 18px",
    border: "none", background: "none", cursor: "pointer",
    fontSize: 13, fontWeight: active ? 600 : 450, letterSpacing: "-0.01em",
    color: active ? accentColor : BRAND.textMuted,
    borderBottom: active ? `2px solid ${accentColor}` : "2px solid transparent",
    transition: "all 0.2s ease",
  });

  const badge = (active, accentColor) => ({
    background: active ? accentColor : BRAND.bgAlt,
    color: active ? "white" : BRAND.textMuted,
    fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10,
    transition: "all 0.2s ease",
  });

  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", gap: 0, padding: "0 20px", borderBottom: `1px solid ${BRAND.borderLight}` }}>
        <button onClick={() => setActiveView("clients")} style={tabStyle(activeView === "clients", BRAND.navy)}>
          <Users size={15} />
          Active Clients
          <span style={badge(activeView === "clients", BRAND.navy)}>3</span>
        </button>
        <button onClick={() => setActiveView("prospects")} style={tabStyle(activeView === "prospects", BRAND.success)}>
          <TrendingUp size={15} />
          Prospects
          <span style={badge(activeView === "prospects", BRAND.success)}>{SEED_PROSPECTS.length}</span>
        </button>
      </div>

      <div style={{ padding: 20 }}>
        {activeView === "clients" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {SEED_CLIENTS.map((client) => (
              <div key={client.code} style={{
                padding: "16px 18px", background: BRAND.cardBg, borderRadius: 10,
                borderLeft: `3px solid ${client.color}`, cursor: "pointer",
                transition: "all 0.2s ease", border: `1px solid ${BRAND.borderLight}`,
                borderLeftWidth: 3, borderLeftColor: client.color,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(16,45,80,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: BRAND.text }}>{client.name}</span>
                  <span style={{ fontSize: 10, background: BRAND.successBg, color: BRAND.success, padding: "3px 8px", borderRadius: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{client.status}</span>
                </div>
                <div style={{ fontSize: 13, color: BRAND.textSecondary, marginBottom: 8 }}>
                  {client.contacts.join(", ")}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: BRAND.textMuted }}>Last: {formatDate(client.lastActivity)}</span>
                  <ChevronRight size={14} color={BRAND.textMuted} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {SEED_PROSPECTS.map((prospect, i) => (
              <div key={i} style={{
                padding: "16px 18px", background: BRAND.cardBg, borderRadius: 10,
                borderLeft: `3px solid ${prospect.color}`, cursor: "pointer",
                transition: "all 0.2s ease", border: `1px solid ${BRAND.borderLight}`,
                borderLeftWidth: 3, borderLeftColor: prospect.color,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(16,45,80,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: BRAND.text }}>{prospect.name}</span>
                  <span style={{ fontSize: 10, background: BRAND.amberBg, color: BRAND.amber, padding: "3px 8px", borderRadius: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{prospect.stage}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <span style={{ fontSize: 14, color: BRAND.text, fontWeight: 600 }}>{prospect.value}</span>
                  <span style={{ fontSize: 12, color: BRAND.textMuted }}>potential retainer</span>
                </div>
                <div style={{ fontSize: 13, color: BRAND.textSecondary, marginBottom: 4 }}>
                  <span style={{ fontWeight: 500 }}>Next:</span> {prospect.nextStep}
                </div>
                <div style={{ fontSize: 12, color: BRAND.textMuted }}>Last: {formatDate(prospect.lastActivity)}</div>
              </div>
            ))}
            <div style={{
              padding: "16px 18px", background: BRAND.cardBg, borderRadius: 10, border: `2px dashed ${BRAND.border}`,
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = BRAND.amber; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = BRAND.border; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: BRAND.textMuted }}>
                <Plus size={18} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>Add Prospect</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NotesPanel({ notes, setNotes }) {
  const [activeTab, setActiveTab] = useState("Client To-Dos");
  const [newNote, setNewNote] = useState("");

  const toggleDone = (id) => {
    setNotes((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((n) => (n.id === id ? { ...n, done: !n.done } : n)),
    }));
  };

  const deleteNote = (id) => {
    setNotes((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((n) => n.id !== id),
    }));
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    const maxId = Object.values(notes).flat().reduce((max, n) => Math.max(max, n.id), 0);
    let noteObj = { id: maxId + 1, text: newNote, done: false, created: new Date().toISOString() };

    const { url, domain, cleanText } = extractUrl(newNote);
    if (url) {
      noteObj.url = url;
      noteObj.domain = domain;
      noteObj.text = cleanText;
      if (activeTab !== "Links to Review" && cleanText === domain) {
        setNotes((prev) => ({
          ...prev,
          "Links to Review": [noteObj, ...prev["Links to Review"]],
        }));
        setNewNote("");
        return;
      }
    }

    setNotes((prev) => ({
      ...prev,
      [activeTab]: [noteObj, ...prev[activeTab]],
    }));
    setNewNote("");
  };

  const activeCat = NOTE_CATEGORIES.find((c) => c.name === activeTab);
  const items = notes[activeTab] || [];

  return (
    <div style={card}>
      <div style={{ padding: "16px 20px 0", borderBottom: `1px solid ${BRAND.borderLight}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={sectionTitle}>Notes & Tasks</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: BRAND.successBg, padding: "4px 10px", borderRadius: 20 }}>
            <MessageSquare size={12} color={BRAND.success} />
            <span style={{ fontSize: 11, color: BRAND.success, fontWeight: 600 }}>Slack-synced</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {NOTE_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.name;
            const count = (notes[cat.name] || []).filter((n) => !n.done).length;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveTab(cat.name)}
                style={{
                  display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", border: "none",
                  background: "none", cursor: "pointer",
                  borderBottom: isActive ? `2px solid ${cat.color}` : "2px solid transparent",
                  color: isActive ? cat.color : BRAND.textMuted,
                  fontWeight: isActive ? 600 : 450, fontSize: 12, whiteSpace: "nowrap",
                  transition: "all 0.2s ease", letterSpacing: "-0.01em",
                }}
              >
                <Icon size={13} />
                {cat.name}
                {count > 0 && (
                  <span style={{
                    background: isActive ? cat.color : BRAND.bgAlt, color: isActive ? "white" : BRAND.textMuted,
                    fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 8, marginLeft: 1,
                  }}>{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNote()}
            placeholder={activeTab === "Links to Review" ? "Paste a URL or add a note..." : `Add to ${activeTab}...`}
            style={{
              flex: 1, padding: "10px 14px", border: `1px solid ${BRAND.border}`, borderRadius: 8,
              fontSize: 13, outline: "none", color: BRAND.text, background: BRAND.cardBg,
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => e.target.style.borderColor = BRAND.navy}
            onBlur={(e) => e.target.style.borderColor = BRAND.border}
          />
          <button
            onClick={addNote}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", background: activeCat.color,
              color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13,
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            <Plus size={15} /> Add
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {items.length === 0 && (
            <div style={{ padding: 28, textAlign: "center", color: BRAND.textMuted, fontSize: 13 }}>
              No items yet. Drop a note in #cowork-daily-organizer on Slack or add one here.
            </div>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px",
                background: item.done ? BRAND.bg : BRAND.cardBg, borderRadius: 8, border: `1px solid ${BRAND.borderLight}`,
                opacity: item.done ? 0.45 : 1, transition: "all 0.2s ease",
              }}
            >
              <button onClick={() => toggleDone(item.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 2 }}>
                {item.done ? <CheckCircle size={17} color={activeCat.color} /> : <Circle size={17} color={BRAND.border} />}
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                {item.url ? (
                  <>
                    <div style={{ fontSize: 13, color: item.done ? BRAND.textMuted : BRAND.text, textDecoration: item.done ? "line-through" : "none", lineHeight: 1.5, fontWeight: 450 }}>
                      {item.text}
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 6, marginTop: 6,
                        padding: "5px 10px", background: "#edf1f7", borderRadius: 6,
                        fontSize: 12, color: BRAND.navyLight, textDecoration: "none",
                        border: `1px solid ${BRAND.border}`, maxWidth: "100%", overflow: "hidden",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = BRAND.amberBg; e.currentTarget.style.borderColor = BRAND.amber; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#edf1f7"; e.currentTarget.style.borderColor = BRAND.border; }}
                    >
                      <Globe size={12} style={{ flexShrink: 0 }} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.domain || item.url}
                      </span>
                      <ExternalLink size={11} style={{ flexShrink: 0, opacity: 0.5 }} />
                    </a>
                  </>
                ) : (
                  <div style={{ fontSize: 13, color: item.done ? BRAND.textMuted : BRAND.text, textDecoration: item.done ? "line-through" : "none", lineHeight: 1.5, fontWeight: 450 }}>
                    {item.text}
                  </div>
                )}
                <div style={{ display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
                  {item.client && (
                    <span style={{ fontSize: 10, background: "#edf1f7", color: BRAND.navy, padding: "2px 7px", borderRadius: 4, fontWeight: 600 }}>
                      {item.client}
                    </span>
                  )}
                  {item.priority === "critical" && (
                    <span style={{ fontSize: 10, background: BRAND.redBg, color: BRAND.red, padding: "2px 7px", borderRadius: 4, fontWeight: 600 }}>
                      Critical
                    </span>
                  )}
                  {item.value && (
                    <span style={{ fontSize: 10, background: BRAND.successBg, color: BRAND.success, padding: "2px 7px", borderRadius: 4, fontWeight: 600 }}>
                      {item.value}
                    </span>
                  )}
                  <span style={{ fontSize: 10, color: BRAND.textMuted }}>{timeAgo(item.created)}</span>
                </div>
              </div>
              <button onClick={() => deleteNote(item.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: BRAND.border, transition: "color 0.2s ease" }}
                onMouseEnter={(e) => e.currentTarget.style.color = BRAND.red}
                onMouseLeave={(e) => e.currentTarget.style.color = BRAND.border}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LinkedInQueue() {
  const statusColors = {
    draft: { bg: "#edf1f7", text: BRAND.navy },
    idea: { bg: BRAND.amberBg, text: BRAND.amber },
    scheduled: { bg: BRAND.successBg, text: BRAND.success },
    posted: { bg: BRAND.bg, text: BRAND.textMuted },
  };

  return (
    <div style={{ ...card, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={sectionTitle}>LinkedIn Content Queue</h2>
        <button style={{
          display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: BRAND.amber,
          border: "none", borderRadius: 7, cursor: "pointer", fontSize: 12, color: "white", fontWeight: 600,
          transition: "opacity 0.2s ease",
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
        onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
        >
          <PenTool size={12} /> New Post
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {SEED_LINKEDIN.map((post) => {
          const sc = statusColors[post.status];
          return (
            <div key={post.id} style={{
              padding: "14px 16px", background: BRAND.cardBg, borderRadius: 8,
              border: `1px solid ${BRAND.borderLight}`, cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = BRAND.border; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = BRAND.borderLight; }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: BRAND.text }}>{post.title}</span>
                <span style={{ fontSize: 10, background: sc.bg, color: sc.text, padding: "3px 8px", borderRadius: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {post.status}
                </span>
              </div>
              <div style={{ fontSize: 12, color: BRAND.textSecondary, lineHeight: 1.6 }}>{post.snippet}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <span style={{ fontSize: 10, background: BRAND.bgAlt, color: BRAND.textSecondary, padding: "2px 8px", borderRadius: 4, fontWeight: 500 }}>
                  {post.pillar}
                </span>
                <span style={{ fontSize: 10, color: BRAND.textMuted }}>{formatDate(post.created)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeeklyCalendar() {
  return (
    <div style={{ ...card, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={sectionTitle}>This Week</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Calendar size={13} color={BRAND.textMuted} />
          <span style={{ fontSize: 12, color: BRAND.textMuted }}>Mar 31 - Apr 4, 2026</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
        {SEED_CALENDAR.map((day) => (
          <div key={day.day} style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${BRAND.borderLight}` }}>
            <div style={{ background: BRAND.bg, padding: "8px 10px", textAlign: "center", borderBottom: `1px solid ${BRAND.borderLight}` }}>
              <div style={{ fontSize: 11, fontWeight: 650, color: BRAND.text, letterSpacing: "0.02em" }}>{day.day}</div>
              <div style={{ fontSize: 10, color: BRAND.textMuted }}>{day.date}</div>
            </div>
            <div style={{ padding: 6, display: "flex", flexDirection: "column", gap: 4, minHeight: 80 }}>
              {day.events.map((ev, i) => (
                <div key={i} style={{
                  padding: "5px 7px", borderRadius: 5, background: `${EVENT_COLORS[ev.type]}0a`,
                  borderLeft: `2px solid ${EVENT_COLORS[ev.type]}`,
                }}>
                  <div style={{ fontSize: 9, color: BRAND.textMuted, marginBottom: 1 }}>{ev.time}</div>
                  <div style={{ fontSize: 10, color: BRAND.text, fontWeight: 500, lineHeight: 1.3 }}>{ev.title}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlackSyncStatus() {
  const pulls = [
    { time: "7:00 AM", status: "completed", label: "Morning" },
    { time: "12:00 PM", status: "upcoming", label: "Midday" },
    { time: "6:00 PM", status: "upcoming", label: "Evening" },
  ];

  return (
    <div style={{ ...card, padding: 20, display: "flex", flexDirection: "column" }}>
      <h2 style={{ ...sectionTitle, marginBottom: 4 }}>Slack Sync</h2>
      <div style={{ fontSize: 12, color: BRAND.textMuted, marginBottom: 16 }}>#cowork-daily-organizer</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {pulls.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: p.status === "completed" ? BRAND.success : BRAND.border,
              boxShadow: p.status === "completed" ? `0 0 6px ${BRAND.success}40` : "none",
            }} />
            <span style={{ fontSize: 13, color: BRAND.text, fontWeight: 500, width: 70 }}>{p.time}</span>
            <span style={{
              fontSize: 11, fontWeight: 500,
              color: p.status === "completed" ? BRAND.success : BRAND.textMuted,
            }}>
              {p.status === "completed" ? "Synced" : "Upcoming"}
            </span>
          </div>
        ))}
      </div>
      <button style={{
        marginTop: 16, width: "100%", padding: "9px 12px", background: BRAND.navy,
        border: "none", borderRadius: 7, cursor: "pointer", fontSize: 12,
        color: "white", fontWeight: 600, display: "flex", alignItems: "center",
        justifyContent: "center", gap: 6, transition: "opacity 0.2s ease",
      }}
      onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
      onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
      >
        <RefreshCw size={13} /> Sync Now
      </button>
    </div>
  );
}

export default function CommandCenter() {
  const [notes, setNotes] = useState(SEED_NOTES);

  return (
    <div style={{
      minHeight: "100vh", background: BRAND.bg,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600;700&display=swap" rel="stylesheet" />

      <div style={{
        background: BRAND.navy, padding: "0 32px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img
            src={LOGO_URL}
            alt="PerformanceLabs.AI"
            style={{ width: 34, height: 34, borderRadius: 8, objectFit: "contain" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 700, color: "white", margin: 0, letterSpacing: "-0.02em" }}>Command Center</h1>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>{todayString()}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(13,150,104,0.15)", padding: "5px 12px", borderRadius: 20,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399" }} />
            <span style={{ fontSize: 12, color: "#34d399", fontWeight: 500 }}>All systems active</span>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: BRAND.amber,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 700, fontSize: 12,
          }}>TB</div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "22px 32px" }}>
        <div style={{ marginBottom: 18 }}>
          <TopBar />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 18, marginBottom: 18 }}>
          <NotesPanel notes={notes} setNotes={setNotes} />
          <SlackSyncStatus />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <LinkedInQueue />
          <WeeklyCalendar />
        </div>
      </div>
    </div>
  );
}
