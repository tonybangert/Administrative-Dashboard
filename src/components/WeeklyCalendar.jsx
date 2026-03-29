import { Calendar, RefreshCw } from "lucide-react";
import { useCalendar } from "../hooks/useCalendar.js";

const SEED_CALENDAR = [
  { day: "Mon", date: "Mar 31", events: [{ time: "9:00 AM", title: "LNS Weekly Sync", type: "client" }, { time: "2:00 PM", title: "Pipeline Review", type: "internal" }] },
  { day: "Tue", date: "Apr 1", events: [{ time: "10:00 AM", title: "CJP Content Planning", type: "client" }, { time: "3:00 PM", title: "Aplora JV Strategy", type: "partner" }] },
  { day: "Wed", date: "Apr 2", events: [{ time: "9:30 AM", title: "CK Check-in", type: "client" }, { time: "1:00 PM", title: "Prospect Discovery", type: "prospect" }] },
  { day: "Thu", date: "Apr 3", events: [{ time: "11:00 AM", title: "Dora: BD Sync", type: "internal" }, { time: "4:00 PM", title: "Build Block", type: "focus" }] },
  { day: "Fri", date: "Apr 4", events: [{ time: "9:00 AM", title: "Week Wrap", type: "internal" }] },
];

const EV_COLORS = {
  client: "#faa840",
  internal: "rgba(255,255,255,0.55)",
  partner: "#818cf8",
  prospect: "#34d399",
  focus: "#f472b6",
};

const CATEGORY_MAP = {
  "blue category": "client",
  "green category": "prospect",
  "purple category": "partner",
  "red category": "focus",
  "yellow category": "client",
  "orange category": "internal",
};

function classifyEvent(categories) {
  if (!categories || categories.length === 0) return "internal";
  const cat = categories[0].toLowerCase();
  return CATEGORY_MAP[cat] || "internal";
}

function groupEventsByDay(events) {
  const days = {};
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  events.forEach(ev => {
    const d = new Date(ev.start);
    const key = d.toISOString().slice(0, 10);
    if (!days[key]) {
      days[key] = {
        day: dayNames[d.getDay()],
        date: `${monthNames[d.getMonth()]} ${d.getDate()}`,
        sortKey: key,
        events: [],
      };
    }
    const time = ev.isAllDay ? "All Day" : d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    days[key].events.push({
      time,
      title: ev.title,
      type: classifyEvent(ev.categories),
    });
  });

  return Object.values(days)
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .filter(d => d.day !== "Sun" && d.day !== "Sat")
    .slice(0, 5);
}

export default function WeeklyCalendar() {
  const { events, isLoading, error, apiError, refresh } = useCalendar();

  const isLive = events.length > 0 && !apiError?.includes("not configured");
  const calDays = isLive ? groupEventsByDay(events) : SEED_CALENDAR;

  const now = new Date();
  const mon = new Date(now);
  mon.setDate(mon.getDate() - ((mon.getDay() + 6) % 7));
  const fri = new Date(mon);
  fri.setDate(fri.getDate() + 4);
  const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const rangeStr = isLive && calDays.length > 0
    ? `${calDays[0].date} - ${calDays[calDays.length - 1].date}`
    : `${fmt(mon)} - ${fmt(fri)}`;

  return (
    <div className="glass p-6 animate-fade-in-up stagger-5">
      <div className="flex justify-between items-center mb-4.5">
        <h2 className="text-lg font-bold text-text-primary">This Week</h2>
        <div className="flex items-center gap-3">
          {isLive && (
            <button onClick={refresh}
                    className="bg-transparent border border-border-default rounded-lg p-1.5 cursor-pointer
                               flex items-center transition-all duration-200 hover:border-brand-amber">
              <RefreshCw size={14} className="text-text-muted" />
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar size={15} className="text-text-muted" />
            <span className="text-[13px] text-text-muted">{rangeStr}</span>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-[140px] rounded-[10px] bg-white/3 animate-pulse-skeleton" />)}
        </div>
      )}

      {/* Error fallback */}
      {error && !isLive && (
        <div className="text-sm text-brand-amber bg-brand-amber-dim px-4 py-2.5 rounded-lg mb-4">
          {apiError || error.message} — showing sample data
        </div>
      )}

      {/* Calendar grid */}
      {!isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {calDays.map(day => (
            <div key={day.day + day.date} className="rounded-[10px] overflow-hidden border border-border-default">
              <div className="bg-white/3 px-2.5 py-2.5 text-center border-b border-border-default">
                <div className="text-[13px] font-bold text-text-primary">{day.day}</div>
                <div className="text-[11px] text-text-muted">{day.date}</div>
              </div>
              <div className="p-2 flex flex-col gap-1.5 min-h-[90px]">
                {day.events.map((ev, i) => {
                  const col = EV_COLORS[ev.type] || "rgba(255,255,255,0.55)";
                  return (
                    <div key={i} className="px-2 py-1.5 rounded-md"
                         style={{ background: col + "0a", borderLeft: `2px solid ${col}` }}>
                      <div className="text-[10px] text-text-muted">{ev.time}</div>
                      <div className="text-xs text-text-primary font-medium leading-snug">{ev.title}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
