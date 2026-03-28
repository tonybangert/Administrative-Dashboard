import { useState } from "react";
import { CheckCircle, Circle, TrendingUp, Users, FileText, Lightbulb, Link2, AlertTriangle, Calendar, PenTool, ChevronRight, Plus, Trash2, MessageSquare } from "lucide-react";

// ─── Seed Data (will be replaced by Supabase) ─────────────────────────────
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
    { id: 12, text: "Interesting thread on agentic AI in enterprise", url: "https://example.com/agentic-ai", done: false, created: "2026-03-27T21:00:00" },
    { id: 13, text: "Competitor doing embedded analytics for mid-market", url: "https://example.com/competitor", done: false, created: "2026-03-26T12:00:00" },
  ],
};

const SEED_CLIENTS = [
  { name: "Legal Notice Service", code: "LNS", contacts: ["Andrew Morys", "Ben Desnoyers", "Brandon Bressner"], status: "Active", lastActivity: "2026-03-27", color: "#3b82f6" },
  { name: "Community Journalism Project", code: "CJP", contacts: ["Patrick Schless", "Ray Herrara"], status: "Active", lastActivity: "2026-03-27", color: "#8b5cf6" },
  { name: "CK Marketing", code: "CK", contacts: ["Brad Moore", "Kevin Roselli"], status: "Active", lastActivity: "2026-03-26", color: "#f59e0b" },
];

const SEED_PROSPECTS = [
  { name: "Mid-Market Fintech Co.", stage: "Proposal Sent", value: "$5K/mo", nextStep: "Follow up Monday", lastActivity: "2026-03-27", color: "#10b981" },
  { name: "Marketing Services Firm", stage: "Discovery", value: "$8K/mo", nextStep: "Schedule FDE walkthrough", lastActivity: "2026-03-26", color: "#f59e0b" },
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
  { name: "Client To-Dos", icon: CheckCircle, color: "#3b82f6" },
  { name: "High Priority", icon: AlertTriangle, color: "#ef4444" },
  { name: "Prospect Updates", icon: TrendingUp, color: "#10b981" },
  { name: "Client Meeting Notes", icon: FileText, color: "#8b5cf6" },
  { name: "Random Thoughts", icon: Lightbulb, color: "#f59e0b" },
  { name: "Links to Review", icon: Link2, color: "#6366f1" },
];

const EVENT_COLORS = {
  client: "#3b82f6",
  internal: "#6b7280",
  partner: "#8b5cf6",
  prospect: "#10b981",
  focus: "#f59e0b",
};

function timeAgo(dateStr) {
  const now = new Date();
  const then = new Date(dateStr);
  const hrs = Math.round((now - then) / 3600000);
  if (hrs < 1) return "just now";
  if (hrs < 24) return hrs + "h ago";
  const days = Math.round(hrs / 24);
  return days === 1 ? "yesterday" : days + "d ago";
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function TopBar() {
  const [activeView, setActiveView] = useState("clients");
  return (
    <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 0, padding: "0 20px", borderBottom: "1px solid #f3f4f6" }}>
        <button onClick={() => setActiveView("clients")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 16px", border: "none", background: "none", cursor: "pointer", fontSize: 14, fontWeight: activeView === "clients" ? 600 : 400, color: activeView === "clients" ? "#3b82f6" : "#6b7280", borderBottom: activeView === "clients" ? "2px solid #3b82f6" : "2px solid transparent" }}>
          <Users size={16} /> Active Clients
          <span style={{ background: activeView === "clients" ? "#3b82f6" : "#e5e7eb", color: activeView === "clients" ? "white" : "#6b7280", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10 }}>3</span>
        </button>
        <button onClick={() => setActiveView("prospects")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 16px", border: "none", background: "none", cursor: "pointer", fontSize: 14, fontWeight: activeView === "prospects" ? 600 : 400, color: activeView === "prospects" ? "#10b981" : "#6b7280", borderBottom: activeView === "prospects" ? "2px solid #10b981" : "2px solid transparent" }}>
          <TrendingUp size={16} /> Prospects
          <span style={{ background: activeView === "prospects" ? "#10b981" : "#e5e7eb", color: activeView === "prospects" ? "white" : "#6b7280", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10 }}>{SEED_PROSPECTS.length}</span>
        </button>
      </div>
      <div style={{ padding: 20 }}>
        {activeView === "clients" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {SEED_CLIENTS.map((client) => (
              <div key={client.code} style={{ padding: "16px 18px", background: "#fafafa", borderRadius: 10, borderLeft: "3px solid " + client.color, cursor: "pointer", transition: "all 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{client.name}</span>
                  <span style={{ fontSize: 11, background: "#f0fdf4", color: "#16a34a", padding: "2px 8px", borderRadius: 4, fontWeight: 500 }}>{client.status}</span>
                </div>
                <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>{client.contacts.join(", ")}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>Last activity: {formatDate(client.lastActivity)}</span>
                  <ChevronRight size={14} color="#d1d5db" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {SEED_PROSPECTS.map((prospect, i) => (
              <div key={i} style={{ padding: "16px 18px", background: "#fafafa", borderRadius: 10, borderLeft: "3px solid " + prospect.color, cursor: "pointer", transition: "all 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{prospect.name}</span>
                  <span style={{ fontSize: 11, background: "#eff6ff", color: "#3b82f6", padding: "2px 8px", borderRadius: 4, fontWeight: 500 }}>{prospect.stage}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>{prospect.value}</span>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>potential retainer</span>
                </div>
                <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}><span style={{ fontWeight: 500 }}>Next:</span> {prospect.nextStep}</div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>Last activity: {formatDate(prospect.lastActivity)}</div>
              </div>
            ))}
            <div style={{ padding: "16px 18px", background: "#fafafa", borderRadius: 10, border: "2px dashed #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#9ca3af" }}>
                <Plus size={18} /><span style={{ fontSize: 14, fontWeight: 500 }}>Add Prospect</span>
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
  const toggleDone = (id) => { setNotes((prev) => ({ ...prev, [activeTab]: prev[activeTab].map((n) => (n.id === id ? { ...n, done: !n.done } : n)) })); };
  const deleteNote = (id) => { setNotes((prev) => ({ ...prev, [activeTab]: prev[activeTab].filter((n) => n.id !== id) })); };
  const addNote = () => { if (!newNote.trim()) return; const maxId = Object.values(notes).flat().reduce((max, n) => Math.max(max, n.id), 0); setNotes((prev) => ({ ...prev, [activeTab]: [{ id: maxId + 1, text: newNote, done: false, created: new Date().toISOString() }, ...prev[activeTab]] })); setNewNote(""); };
  const activeCat = NOTE_CATEGORIES.find((c) => c.name === activeTab);
  const items = notes[activeTab] || [];
  return (
    <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px 0", borderBottom: "1px solid #f3f4f6" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: 0 }}>Notes & Tasks</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0fdf4", padding: "4px 10px", borderRadius: 20 }}>
            <MessageSquare size={13} color="#16a34a" />
            <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 500 }}>Slack-synced</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {NOTE_CATEGORIES.map((cat) => { const Icon = cat.icon; const isActive = activeTab === cat.name; const count = (notes[cat.name] || []).filter((n) => !n.done).length; return (
            <button key={cat.name} onClick={() => setActiveTab(cat.name)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "none", background: "none", cursor: "pointer", borderBottom: isActive ? "2px solid " + cat.color : "2px solid transparent", color: isActive ? cat.color : "#9ca3af", fontWeight: isActive ? 600 : 400, fontSize: 13, whiteSpace: "nowrap", transition: "all 0.15s" }}>
              <Icon size={14} />{cat.name}
              {count > 0 && <span style={{ background: isActive ? cat.color : "#e5e7eb", color: isActive ? "white" : "#6b7280", fontSize: 11, fontWeight: 600, padding: "1px 7px", borderRadius: 10, marginLeft: 2 }}>{count}</span>}
            </button>
          ); })}
        </div>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input type="text" value={newNote} onChange={(e) => setNewNote(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addNote()} placeholder={"Add to " + activeTab + "..."} style={{ flex: 1, padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", color: "#111827" }} />
          <button onClick={addNote} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", background: activeCat.color, color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 500, fontSize: 14 }}>
            <Plus size={16} /> Add
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {items.length === 0 && <div style={{ padding: 24, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>No items yet. Drop a note in #cowork-daily-organizer on Slack or add one here.</div>}
          {items.map((item) => (
            <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", background: item.done ? "#f9fafb" : "#fafafa", borderRadius: 8, border: "1px solid #f3f4f6", opacity: item.done ? 0.5 : 1, transition: "all 0.15s" }}>
              <button onClick={() => toggleDone(item.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 2 }}>
                {item.done ? <CheckCircle size={18} color={activeCat.color} /> : <Circle size={18} color="#d1d5db" />}
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: item.done ? "#9ca3af" : "#111827", textDecoration: item.done ? "line-through" : "none", lineHeight: 1.5 }}>{item.text}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                  {item.client && <span style={{ fontSize: 11, background: "#eff6ff", color: "#3b82f6", padding: "2px 8px", borderRadius: 4, fontWeight: 500 }}>{item.client}</span>}
                  {item.priority === "critical" && <span style={{ fontSize: 11, background: "#fef2f2", color: "#ef4444", padding: "2px 8px", borderRadius: 4, fontWeight: 500 }}>Critical</span>}
                  {item.value && <span style={{ fontSize: 11, background: "#f0fdf4", color: "#16a34a", padding: "2px 8px", borderRadius: 4, fontWeight: 500 }}>{item.value}</span>}
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>{timeAgo(item.created)}</span>
                </div>
              </div>
              <button onClick={() => deleteNote(item.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#d1d5db" }}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LinkedInQueue() {
  const statusColors = { draft: { bg: "#eff6ff", text: "#3b82f6" }, idea: { bg: "#faf5ff", text: "#8b5cf6" }, scheduled: { bg: "#f0fdf4", text: "#16a34a" }, posted: { bg: "#f9fafb", text: "#6b7280" } };
  return (
    <div style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: 0 }}>LinkedIn Content Queue</h2>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#f3f4f6", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, color: "#374151", fontWeight: 500 }}><PenTool size={13} /> New Post</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {SEED_LINKEDIN.map((post) => { const sc = statusColors[post.status]; return (
          <div key={post.id} style={{ padding: "14px 16px", background: "#fafafa", borderRadius: 8, border: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{post.title}</span>
              <span style={{ fontSize: 11, background: sc.bg, color: sc.text, padding: "2px 8px", borderRadius: 4, fontWeight: 500, textTransform: "capitalize" }}>{post.status}</span>
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{post.snippet}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: 11, background: "#f3f4f6", color: "#6b7280", padding: "2px 8px", borderRadius: 4 }}>{post.pillar}</span>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>{formatDate(post.created)}</span>
            </div>
          </div>
        ); })}
      </div>
    </div>
  );
}

function WeeklyCalendar() {
  return (
    <div style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: 0 }}>This Week</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={14} color="#6b7280" /><span style={{ fontSize: 13, color: "#6b7280" }}>Mar 31 - Apr 4, 2026</span></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
        {SEED_CALENDAR.map((day) => (
          <div key={day.day} style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #f3f4f6" }}>
            <div style={{ background: "#f9fafb", padding: "8px 12px", textAlign: "center", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{day.day}</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>{day.date}</div>
            </div>
            <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6, minHeight: 80 }}>
              {day.events.map((ev, i) => (
                <div key={i} style={{ padding: "6px 8px", borderRadius: 6, background: EVENT_COLORS[ev.type] + "10", borderLeft: "2px solid " + EVENT_COLORS[ev.type] }}>
                  <div style={{ fontSize: 10, color: "#9ca3af", marginBottom: 2 }}>{ev.time}</div>
                  <div style={{ fontSize: 11, color: "#374151", fontWeight: 500, lineHeight: 1.3 }}>{ev.title}</div>
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
  const pulls = [{ time: "7:00 AM", status: "completed", label: "Morning" }, { time: "12:00 PM", status: "upcoming", label: "Midday" }, { time: "6:00 PM", status: "upcoming", label: "Evening" }];
  return (
    <div style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: "0 0 12px" }}>Slack Sync</h2>
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>#cowork-daily-organizer</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {pulls.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.status === "completed" ? "#10b981" : "#e5e7eb" }} />
            <span style={{ fontSize: 13, color: "#374151", fontWeight: 500, width: 70 }}>{p.time}</span>
            <span style={{ fontSize: 12, color: p.status === "completed" ? "#10b981" : "#9ca3af", textTransform: "capitalize" }}>{p.status === "completed" ? "Synced" : "Upcoming"}</span>
          </div>
        ))}
      </div>
      <button style={{ marginTop: 14, width: "100%", padding: "8px 12px", background: "#f3f4f6", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, color: "#374151", fontWeight: 500 }}>Sync Now</button>
    </div>
  );
}

export default function CommandCenter() {
  const [notes, setNotes] = useState(SEED_NOTES);
  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fb", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Command Center</h1>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>PerformanceLabs.AI</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0fdf4", padding: "6px 14px", borderRadius: 20, border: "1px solid #dcfce7" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} />
            <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 500 }}>All systems active</span>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 600, fontSize: 14 }}>TB</div>
        </div>
      </div>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 32px" }}>
        <div style={{ marginBottom: 20 }}><TopBar /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, marginBottom: 20 }}>
          <NotesPanel notes={notes} setNotes={setNotes} />
          <SlackSyncStatus />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <LinkedInQueue />
          <WeeklyCalendar />
        </div>
      </div>
    </div>
  );
}