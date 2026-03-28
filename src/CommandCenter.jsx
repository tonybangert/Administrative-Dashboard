import { useState, useEffect } from "react";
import { CheckCircle, TrendingUp, Users, FileText, Lightbulb, Link2, AlertTriangle, Calendar, Plus, MessageSquare, ExternalLink, RefreshCw, ArrowUpRight } from "lucide-react";

const B = {
  amber: "#faa840", amberDim: "rgba(250,168,64,0.15)", amberGlow: "rgba(250,168,64,0.25)",
  red: "#ef4537", redDim: "rgba(239,69,55,0.12)",
  green: "#34d399", greenDim: "rgba(52,211,153,0.12)",
  navy: "#102d50",
  bg: "#080f1e", bgCard: "rgba(255,255,255,0.035)", bgCardHover: "rgba(255,255,255,0.06)",
  bgInput: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.07)", borderHover: "rgba(250,168,64,0.25)",
  text: "#f1f5f9", textSec: "rgba(255,255,255,0.55)", textMute: "rgba(255,255,255,0.3)",
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
  return lines[new Date().getDate() % lines.length];
}

const SEED_CLIENTS = [
  { name: "Legal Notice Service", code: "LNS", contacts: ["Andrew Morys", "Ben Desnoyers", "Brandon Bressner"], status: "Active", lastActivity: "2026-03-27" },
  { name: "Community Journalism Project", code: "CJP", contacts: ["Patrick Schless", "Ray Herrara"], status: "Active", lastActivity: "2026-03-27" },
  { name: "CK Marketing", code: "CK", contacts: ["Brad Moore", "Kevin Roselli"], status: "Active", lastActivity: "2026-03-26" },
];

const SEED_PROSPECTS = [
  { name: "Mid-Market Fintech Co.", stage: "Proposal Sent", value: "$5K/mo", nextStep: "Follow up Monday", lastActivity: "2026-03-27" },
  { name: "Marketing Services Firm", stage: "Discovery", value: "$8K/mo", nextStep: "Schedule FDE walkthrough", lastActivity: "2026-03-26" },
];

const SEED_CALENDAR = [
  { day: "Mon", date: "Mar 31", events: [{ time: "9:00 AM", title: "LNS Weekly Sync", type: "client" }, { time: "2:00 PM", title: "Pipeline Review", type: "internal" }] },
  { day: "Tue", date: "Apr 1", events: [{ time: "10:00 AM", title: "CJP Content Planning", type: "client" }, { time: "3:00 PM", title: "Aplora JV Strategy", type: "partner" }] },
  { day: "Wed", date: "Apr 2", events: [{ time: "9:30 AM", title: "CK Check-in", type: "client" }, { time: "1:00 PM", title: "Prospect Discovery", type: "prospect" }] },
  { day: "Thu", date: "Apr 3", events: [{ time: "11:00 AM", title: "Dora: BD Sync", type: "internal" }, { time: "4:00 PM", title: "Build Block", type: "focus" }] },
  { day: "Fri", date: "Apr 4", events: [{ time: "9:00 AM", title: "Week Wrap", type: "internal" }] },
];

const QUICK_ACTIONS = [
  { label: "Client To-Dos", icon: CheckCircle, color: B.amber, count: 3 },
  { label: "High Priority", icon: AlertTriangle, color: B.red, count: 2 },
  { label: "Prospect Updates", icon: TrendingUp, color: B.green, count: 2 },
  { label: "Meeting Notes", icon: FileText, color: "#818cf8", count: 2 },
  { label: "Ideas", icon: Lightbulb, color: "#f472b6", count: 2 },
  { label: "Links to Review", icon: Link2, color: "#38bdf8", count: 3 },
];

const EV_COL = { client: B.amber, internal: B.textSec, partner: "#818cf8", prospect: B.green, focus: "#f472b6" };

function fmtDate(d) { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }

const glass = {
  background: B.bgCard, borderRadius: 18, border: `1px solid ${B.border}`,
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
      position: "relative", padding: "48px 48px 40px", overflow: "hidden",
      background: "linear-gradient(135deg, #0c1a30 0%, #0f1b2d 40%, #131f33 100%)",
      borderBottom: `1px solid ${B.border}`,
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: "linear-gradient(90deg, transparent, #faa840, #ef4537, #faa840, transparent)",
        backgroundSize: "200% 100%", animation: "gradientShift 4s ease infinite",
      }} />
      <div style={{
        position: "absolute", top: -60, right: -40, width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(250,168,64,0.06) 0%, transparent 70%)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -80, left: 100, width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(239,69,55,0.04) 0%, transparent 70%)", pointerEvents: "none",
      }} />
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", maxWidth: 1400, margin: "0 auto" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <img src={LOGO} alt="" style={{ width: 44, height: 44, borderRadius: 12 }} onError={(e) => e.target.style.display = "none"} />
            <div style={{ fontSize: 13, fontWeight: 700, color: B.amber, textTransform: "uppercase", letterSpacing: "0.14em" }}>PerformanceLabs.AI</div>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: B.text, margin: 0, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            {greeting}, <span style={{ background: "linear-gradient(135deg, #faa840, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Tony</span>
          </h1>
          <p style={{ fontSize: 18, color: B.textSec, marginTop: 10, fontWeight: 450 }}>{context}</p>
          <p style={{ fontSize: 15, color: B.textMute, marginTop: 16, fontStyle: "italic", borderLeft: `2px solid ${B.amber}`, paddingLeft: 14, lineHeight: 1.5 }}>"{motivation}"</p>
        </div>
        <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
          <div style={{ fontSize: 14, color: B.textMute }}>{dateStr}</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: B.text, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{timeStr}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: B.greenDim, padding: "7px 16px", borderRadius: 24, marginTop: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: B.green, animation: "pulseGlow 2s ease infinite" }} />
            <span style={{ fontSize: 13, color: B.green, fontWeight: 600 }}>Systems Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopBar() {
  const [view, setView] = useState("clients");
  const tab = (active, col) => ({
    display: "flex", alignItems: "center", gap: 10, padding: "16px 22px", border: "none", background: "none",
    cursor: "pointer", fontSize: 15, fontWeight: active ? 600 : 450, color: active ? col : B.textMute,
    borderBottom: active ? `2px solid ${col}` : "2px solid transparent", transition: "all 0.2s ease",
  });
  return (
    <div style={{ ...glass, ...anim(1) }}>
      <div style={{ display: "flex", padding: "0 24px", borderBottom: `1px solid ${B.border}` }}>
        <button onClick={() => setView("clients")} style={tab(view === "clients", B.amber)}>
          <Users size={18} /> Active Clients
          <span style={{ fontSize: 12, fontWeight: 700, background: view === "clients" ? B.amber : "rgba(255,255,255,0.08)", color: view === "clients" ? "#000" : B.textMute, padding: "3px 10px", borderRadius: 10 }}>3</span>
        </button>
        <button onClick={() => setView("prospects")} style={tab(view === "prospects", B.green)}>
          <TrendingUp size={18} /> Prospects
          <span style={{ fontSize: 12, fontWeight: 700, background: view === "prospects" ? B.green : "rgba(255,255,255,0.08)", color: view === "prospects" ? "#000" : B.textMute, padding: "3px 10px", borderRadius: 10 }}>{SEED_PROSPECTS.length}</span>
        </button>
      </div>
      <div style={{ padding: 24 }}>
        {view === "clients" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {SEED_CLIENTS.map((c) => (
              <div key={c.code} style={{ padding: 20, background: "rgba(255,255,255,0.02)", borderRadius: 14, border: `1px solid ${B.border}`, cursor: "pointer", transition: "all 0.25s ease", position: "relative", overflow: "hidden" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = B.amber + "40"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(250,168,64,0.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(90deg, ${B.amber}, transparent)` }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 17, fontWeight: 650, color: B.text }}>{c.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, background: B.greenDim, color: B.green, padding: "4px 10px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{c.status}</span>
                </div>
                <div style={{ fontSize: 14, color: B.textSec, marginBottom: 10, lineHeight: 1.5 }}>{c.contacts.join(", ")}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: B.textMute }}>Last: {fmtDate(c.lastActivity)}</span>
                  <ArrowUpRight size={16} color={B.textMute} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {SEED_PROSPECTS.map((p, i) => (
              <div key={i} style={{ padding: 20, background: "rgba(255,255,255,0.02)", borderRadius: 14, border: `1px solid ${B.border}`, cursor: "pointer", transition: "all 0.25s ease", position: "relative", overflow: "hidden" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = B.green + "40"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.transform = "none"; }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(90deg, ${B.green}, transparent)` }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 17, fontWeight: 650, color: B.text }}>{p.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, background: B.amberDim, color: B.amber, padding: "4px 10px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{p.stage}</span>
                </div>
                <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: B.green }}>{p.value}</span>
                  <span style={{ fontSize: 14, color: B.textMute, alignSelf: "center" }}>retainer</span>
                </div>
                <div style={{ fontSize: 14, color: B.textSec }}><b style={{ fontWeight: 600 }}>Next:</b> {p.nextStep}</div>
              </div>
            ))}
            <div style={{ padding: 20, borderRadius: 14, border: `1px dashed rgba(255,255,255,0.1)`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s ease" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = B.amber}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}>
              <Plus size={20} color={B.textMute} /><span style={{ fontSize: 15, color: B.textMute, marginLeft: 8, fontWeight: 500 }}>Add Prospect</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickActions() {
  return (
    <div style={{ ...glass, padding: 24, ...anim(2) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: B.text, margin: 0 }}>Quick Actions</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: B.greenDim, padding: "5px 14px", borderRadius: 20 }}>
          <MessageSquare size={13} color={B.green} />
          <span style={{ fontSize: 12, color: B.green, fontWeight: 600 }}>Slack-synced</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {QUICK_ACTIONS.map(a => {
          const Icon = a.icon;
          return (
            <button key={a.label} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "16px 18px",
              background: "rgba(255,255,255,0.02)", borderRadius: 12,
              border: `1px solid ${B.border}`, cursor: "pointer", transition: "all 0.2s ease",
              textAlign: "left", position: "relative", overflow: "hidden",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = a.color + "40"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 4px 16px ${a.color}10`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: a.color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={18} color={a.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: B.text }}>{a.label}</div>
                <div style={{ fontSize: 12, color: B.textMute }}>{a.count} items</div>
              </div>
              <ArrowUpRight size={14} color={B.textMute} style={{ flexShrink: 0 }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

const REL_STYLE = { high: { bg: B.amberDim, text: B.amber }, medium: { bg: "rgba(56,189,248,0.1)", text: "#38bdf8" }, low: { bg: "rgba(255,255,255,0.05)", text: B.textMute } };
const SRC_COLORS = {
  "MIT Tech Review": "#ef4444", "The Verge AI": "#a855f7", "VentureBeat AI": "#22c55e",
  "TechCrunch AI": "#10b981", "Ars Technica AI": "#f97316",
};

function AINewsFeed({ syncTrigger }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const doFetch = async (force = false) => {
    try {
      const opts = force ? { method: "POST" } : {};
      const resp = await fetch("/api/ai-news", opts);
      const data = await resp.json();
      if (data.error) setError(data.error);
      else { setArticles(data.articles || []); setError(null); }
    } catch (e) { setError(e.message); }
  };

  useEffect(() => { doFetch().finally(() => setLoading(false)); }, []);
  useEffect(() => { if (syncTrigger > 0) { setRefreshing(true); doFetch(true).finally(() => setRefreshing(false)); } }, [syncTrigger]);

  const handleRefresh = async () => { setRefreshing(true); await doFetch(true); setRefreshing(false); };

  return (
    <div style={{ ...glass, padding: 24, ...anim(4) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: B.text, margin: 0 }}>Top AI News</h2>
        <button onClick={handleRefresh} disabled={refreshing} style={{
          display: "flex", alignItems: "center", gap: 7, padding: "8px 16px",
          background: "rgba(250,168,64,0.1)", border: `1px solid rgba(250,168,64,0.18)`,
          borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700, color: B.amber,
          transition: "all 0.2s ease", opacity: refreshing ? 0.6 : 1,
        }}
        onMouseEnter={e => e.currentTarget.style.background = B.amberDim}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(250,168,64,0.1)"}>
          <RefreshCw size={14} style={refreshing ? { animation: "spin 1s linear infinite" } : {}} /> Refresh
        </button>
      </div>

      {loading && articles.length === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ padding: "16px 18px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: `1px solid ${B.border}` }}>
              <div style={{ height: 14, width: "60%", background: "rgba(255,255,255,0.05)", borderRadius: 4, marginBottom: 8, animation: "pulse 1.5s ease infinite" }} />
              <div style={{ height: 12, width: "90%", background: "rgba(255,255,255,0.03)", borderRadius: 4, animation: "pulse 1.5s ease infinite" }} />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: B.redDim, borderRadius: 10, border: `1px solid ${B.red}20`, marginBottom: 10 }}>
          <AlertTriangle size={16} color={B.red} />
          <span style={{ fontSize: 13, color: B.red }}>{error}</span>
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div style={{ padding: 32, textAlign: "center", color: B.textMute, fontSize: 15 }}>No AI news available. Click Refresh to fetch.</div>
      )}

      {articles.map((a, i) => {
        const rel = REL_STYLE[a.relevance] || REL_STYLE.medium;
        const srcColor = SRC_COLORS[a.source] || "#94a3b8";
        return (
          <a key={`${a.url}-${i}`} href={a.url} target="_blank" rel="noopener noreferrer" style={{
            display: "block", padding: "16px 18px", background: "rgba(255,255,255,0.02)", borderRadius: 12,
            border: `1px solid ${B.border}`, marginBottom: 10, cursor: "pointer", transition: "all 0.2s ease", textDecoration: "none",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = B.amber + "30"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.transform = "none"; }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, fontWeight: 700, background: srcColor + "18", color: srcColor, padding: "3px 10px", borderRadius: 5 }}>{a.source}</span>
              <span style={{ fontSize: 11, fontWeight: 700, background: rel.bg, color: rel.text, padding: "3px 10px", borderRadius: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>{a.relevance}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: B.text, lineHeight: 1.5 }}>{a.title}</span>
              <ExternalLink size={14} color={B.textMute} style={{ flexShrink: 0, marginTop: 3 }} />
            </div>
            {a.summary && <div style={{ fontSize: 13, color: B.textSec, lineHeight: 1.6, marginTop: 6 }}>{a.summary}</div>}
          </a>
        );
      })}
    </div>
  );
}

function WeeklyCalendar() {
  return (
    <div style={{ ...glass, padding: 24, ...anim(5) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: B.text, margin: 0 }}>This Week</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Calendar size={15} color={B.textMute} /><span style={{ fontSize: 13, color: B.textMute }}>Mar 31 - Apr 4</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
        {SEED_CALENDAR.map(day => (
          <div key={day.day} style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${B.border}` }}>
            <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px 10px", textAlign: "center", borderBottom: `1px solid ${B.border}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: B.text }}>{day.day}</div>
              <div style={{ fontSize: 11, color: B.textMute }}>{day.date}</div>
            </div>
            <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 5, minHeight: 90 }}>
              {day.events.map((ev, i) => (
                <div key={i} style={{ padding: "6px 8px", borderRadius: 6, background: (EV_COL[ev.type] || B.textMute) + "0a", borderLeft: `2px solid ${EV_COL[ev.type] || B.textMute}` }}>
                  <div style={{ fontSize: 10, color: B.textMute }}>{ev.time}</div>
                  <div style={{ fontSize: 12, color: B.text, fontWeight: 500, lineHeight: 1.4 }}>{ev.title}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlackSync({ onSyncNow }) {
  const pulls = [{ time: "7:00 AM", status: "completed" }, { time: "12:00 PM", status: "upcoming" }, { time: "6:00 PM", status: "upcoming" }];
  return (
    <div style={{ ...glass, padding: 24, display: "flex", flexDirection: "column", ...anim(3) }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: B.text, margin: 0, marginBottom: 6 }}>Slack + News Sync</h2>
      <div style={{ fontSize: 13, color: B.textMute, marginBottom: 20 }}>#cowork-daily-organizer</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        {pulls.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.status === "completed" ? B.green : "rgba(255,255,255,0.1)", boxShadow: p.status === "completed" ? `0 0 10px ${B.green}40` : "none" }} />
            <span style={{ fontSize: 15, color: B.text, fontWeight: 500, width: 80 }}>{p.time}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: p.status === "completed" ? B.green : B.textMute }}>{p.status === "completed" ? "Synced" : "Upcoming"}</span>
          </div>
        ))}
      </div>
      <button onClick={onSyncNow} style={{
        marginTop: 20, width: "100%", padding: "12px 16px", background: "rgba(250,168,64,0.1)",
        border: `1px solid rgba(250,168,64,0.18)`, borderRadius: 10, cursor: "pointer", fontSize: 14,
        color: B.amber, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s ease",
      }}
      onMouseEnter={e => e.currentTarget.style.background = B.amberDim} onMouseLeave={e => e.currentTarget.style.background = "rgba(250,168,64,0.1)"}>
        <RefreshCw size={15} /> Sync Now
      </button>
    </div>
  );
}

export default function CommandCenter() {
  const [newsSyncTrigger, setNewsSyncTrigger] = useState(0);
  return (
    <div style={{ minHeight: "100vh", background: B.bg }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }`}</style>
      <HeroHeader />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 48px 48px" }}>
        <div style={{ marginTop: 0 }}><TopBar /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, marginTop: 20 }}>
          <QuickActions />
          <SlackSync onSyncNow={() => setNewsSyncTrigger(t => t + 1)} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
          <AINewsFeed syncTrigger={newsSyncTrigger} />
          <WeeklyCalendar />
        </div>
        <div style={{ textAlign: "center", padding: "36px 0 12px", fontSize: 12, color: B.textMute, letterSpacing: "0.08em", textTransform: "uppercase" }}>PerformanceLabs.AI Command Center</div>
      </div>
    </div>
  );
}
