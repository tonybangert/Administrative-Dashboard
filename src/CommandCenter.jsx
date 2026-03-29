import { useState, useEffect } from "react";
import { CheckCircle, TrendingUp, FileText, Lightbulb, Link2, AlertTriangle, Calendar, Plus, MessageSquare, ExternalLink, RefreshCw, ArrowUpRight, Video } from "lucide-react";

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
  { label: "Client To-Dos", icon: CheckCircle, color: B.amber, items: [
    { text: "Send LNS updated dashboard mockups to Andrew", tag: "LNS" },
    { text: "Follow up with Patrick on CJP newsletter schedule", tag: "CJP" },
    { text: "Review CK Sales Summit segmentation updates with Brad", tag: "CK" },
  ]},
  { label: "High Priority", icon: AlertTriangle, color: B.red, items: [
    { text: "Finalize Aplora JV deliverable timeline with Paul and Eric", tag: "CRITICAL" },
    { text: "Prep pipeline deck for new business meeting Monday", tag: "CRITICAL" },
  ]},
  { label: "Prospect Updates", icon: TrendingUp, color: B.green, items: [
    { text: "Initial call with mid-market fintech prospect went well. Sending proposal Monday.", tag: "$5K/mo" },
    { text: "Marketing services company interested in FDE model. Needs follow-up.", tag: "$8K/mo" },
  ]},
  { label: "Meeting Notes", icon: FileText, color: "#818cf8", items: [
    { text: "LNS sync (3/27): Ben flagged data integration timeline. Brandon wants weekly status updates.", tag: "LNS" },
    { text: "CK check-in (3/26): Kevin pushing for faster segmentation rollout. Need to scope Phase 2.", tag: "CK" },
  ]},
  { label: "Ideas", icon: Lightbulb, color: "#f472b6", items: [
    { text: "Could we build a self-serve AI readiness assessment as a lead gen tool?" },
    { text: "FDE model needs a one-pager that explains it in 60 seconds" },
  ]},
  { label: "Links to Review", icon: Link2, color: "#38bdf8", items: [
    { text: "Interesting thread on agentic AI in enterprise", url: "https://example.com/agentic-ai" },
    { text: "Competitor doing embedded analytics for mid-market", url: "https://example.com/competitor" },
    { text: "Good breakdown of forward-deployed engineering teams", url: "https://newsletter.pragmaticengineer.com/p/forward-deployed" },
  ]},
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

function ProspectBar() {
  return (
    <div style={{ ...glass, ...anim(1) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 24px", borderBottom: `1px solid ${B.border}` }}>
        <TrendingUp size={18} color={B.green} />
        <span style={{ fontSize: 15, fontWeight: 600, color: B.green }}>Prospects</span>
        <span style={{ fontSize: 12, fontWeight: 700, background: B.green, color: "#000", padding: "3px 10px", borderRadius: 10 }}>{SEED_PROSPECTS.length}</span>
      </div>
      <div style={{ padding: 24 }}>
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
      </div>
    </div>
  );
}

function QuickActions() {
  const [expanded, setExpanded] = useState(null);
  const active = QUICK_ACTIONS.find(a => a.label === expanded);

  return (
    <div style={{ ...glass, padding: 24, ...anim(2) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: B.text, margin: 0 }}>Quick Actions</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: B.greenDim, padding: "5px 14px", borderRadius: 20 }}>
          <MessageSquare size={13} color={B.green} />
          <span style={{ fontSize: 12, color: B.green, fontWeight: 600 }}>Slack-synced</span>
        </div>
      </div>

      {/* Button grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {QUICK_ACTIONS.map(a => {
          const Icon = a.icon;
          const isActive = expanded === a.label;
          return (
            <button key={a.label} onClick={() => setExpanded(isActive ? null : a.label)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "16px 18px",
              background: isActive ? a.color + "12" : "rgba(255,255,255,0.02)", borderRadius: 12,
              border: `1px solid ${isActive ? a.color + "50" : B.border}`, cursor: "pointer", transition: "all 0.2s ease",
              textAlign: "left", position: "relative", overflow: "hidden",
            }}
            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = a.color + "40"; e.currentTarget.style.transform = "translateY(-1px)"; }}}
            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.transform = "none"; }}}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: a.color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={18} color={a.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: isActive ? a.color : B.text }}>{a.label}</div>
                <div style={{ fontSize: 12, color: B.textMute }}>{a.items.length} items</div>
              </div>
              <ArrowUpRight size={14} color={isActive ? a.color : B.textMute} style={{ flexShrink: 0, transform: isActive ? "rotate(90deg)" : "none", transition: "transform 0.2s ease" }} />
            </button>
          );
        })}
      </div>

      {/* Expanded detail panel */}
      {active && (
        <div style={{ marginTop: 16, borderTop: `1px solid ${B.border}`, paddingTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {active.items.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px",
              background: "rgba(255,255,255,0.02)", borderRadius: 10, border: `1px solid ${B.border}`,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = active.color + "30"}
            onMouseLeave={e => e.currentTarget.style.borderColor = B.border}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: active.color, marginTop: 7, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: B.text, lineHeight: 1.6 }}>{item.text}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                  {item.tag && (
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 5,
                      background: item.tag === "CRITICAL" ? B.redDim : active.color + "15",
                      color: item.tag === "CRITICAL" ? B.red : active.color,
                    }}>{item.tag}</span>
                  )}
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
                      display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12,
                      color: "#38bdf8", textDecoration: "none", padding: "3px 8px",
                      background: "rgba(56,189,248,0.08)", borderRadius: 5, border: "1px solid rgba(56,189,248,0.15)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = B.amberDim; e.currentTarget.style.color = B.amber; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(56,189,248,0.08)"; e.currentTarget.style.color = "#38bdf8"; }}>
                      <ExternalLink size={11} /> Open link
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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

function SlackSync() {
  const pulls = [{ time: "7:00 AM", status: "completed" }, { time: "12:00 PM", status: "upcoming" }, { time: "6:00 PM", status: "upcoming" }];
  return (
    <div style={{ ...glass, padding: 24, display: "flex", flexDirection: "column", ...anim(3) }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: B.text, margin: 0, marginBottom: 6 }}>Slack Sync</h2>
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
      <button style={{
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

function ZoomNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = (force = false) => {
    setLoading(true);
    fetch("/api/zoom-notes", { method: force ? "POST" : "GET" })
      .then(r => r.json())
      .then(data => {
        setNotes(data.notes || []);
        setError(data.error || null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotes(); }, []);

  const purple = "#a78bfa";
  const purpleDim = "rgba(167,139,250,0.12)";

  return (
    <div style={{ ...glass, padding: 24, ...anim(4) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Video size={18} color={purple} />
          <h2 style={{ fontSize: 18, fontWeight: 700, color: B.text, margin: 0 }}>Zoom Meeting Notes</h2>
        </div>
        <button
          onClick={() => fetchNotes(true)}
          style={{
            background: "transparent", border: `1px solid ${B.border}`, borderRadius: 8,
            padding: "6px 8px", cursor: "pointer", display: "flex", alignItems: "center",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = purple}
          onMouseLeave={e => e.currentTarget.style.borderColor = B.border}
        >
          <RefreshCw size={14} color={B.textMute} />
        </button>
      </div>

      {loading && notes.length === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              height: 72, borderRadius: 12, background: "rgba(255,255,255,0.03)",
              animation: "pulse 1.5s ease-in-out infinite",
            }} />
          ))}
        </div>
      )}

      {error && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "14px 18px",
          background: purpleDim, borderRadius: 12, border: `1px solid ${purple}20`,
        }}>
          <span style={{ fontSize: 14, color: purple }}>
            {error === "Zoom not configured" ? "Connect Zoom to see meeting notes" : error}
          </span>
        </div>
      )}

      {!loading && !error && notes.length === 0 && (
        <div style={{ textAlign: "center", padding: "28px 0", fontSize: 14, color: B.textMute }}>
          No recent meetings in the last 7 days.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {notes.map((note) => (
          <div key={note.meetingId + note.date} style={{
            padding: "16px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 12,
            border: `1px solid ${B.border}`, transition: "all 0.25s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = purple + "40"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.transform = "none"; }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: purple, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, fontWeight: 650, color: B.text }}>{note.topic}</span>
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 8, paddingLeft: 14 }}>
                  <span style={{ fontSize: 12, color: B.textMute }}>{note.date}</span>
                  {note.duration > 0 && (
                    <>
                      <span style={{ fontSize: 12, color: B.textMute }}>·</span>
                      <span style={{ fontSize: 12, color: B.textMute }}>{note.duration} min</span>
                    </>
                  )}
                </div>
                {note.context && (
                  <p style={{ fontSize: 13, color: B.textSec, lineHeight: 1.6, margin: 0, paddingLeft: 14 }}>
                    {note.context}
                  </p>
                )}
              </div>
              <a href={note.link} target="_blank" rel="noopener noreferrer" style={{
                display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: purple,
                textDecoration: "none", padding: "5px 10px", background: purpleDim,
                borderRadius: 6, border: `1px solid ${purple}20`, whiteSpace: "nowrap",
                transition: "all 0.2s ease", flexShrink: 0, marginTop: 2,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = purple + "25"; }}
              onMouseLeave={e => { e.currentTarget.style.background = purpleDim; }}>
                View Notes <ExternalLink size={11} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CommandCenter() {
  return (
    <div style={{ minHeight: "100vh", background: B.bg }}>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }`}</style>
      <HeroHeader />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 48px 48px" }}>
        <div style={{ marginTop: 0 }}><ProspectBar /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, marginTop: 20 }}>
          <QuickActions />
          <SlackSync />
        </div>
        <div style={{ marginTop: 20 }}>
          <ZoomNotes />
        </div>
        <div style={{ marginTop: 20 }}>
          <WeeklyCalendar />
        </div>
        <div style={{ textAlign: "center", padding: "36px 0 12px", fontSize: 12, color: B.textMute, letterSpacing: "0.08em", textTransform: "uppercase" }}>PerformanceLabs.AI Command Center</div>
      </div>
    </div>
  );
}
