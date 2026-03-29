import { RefreshCw, MessageSquare } from "lucide-react";
import { useSlack } from "../hooks/useSlack.js";

export default function SlackSync() {
  const { messages, channelName, isLoading, apiError, refresh } = useSlack();

  const isLive = messages.length > 0 && !apiError?.includes("not configured");

  return (
    <div className="glass p-4 sm:p-6 flex flex-col animate-fade-in-up stagger-3">
      <h2 className="text-lg font-bold text-text-primary mb-1.5">Slack Sync</h2>
      <div className="text-[13px] text-text-muted mb-5">
        #{channelName || "cowork-daily-organizer"}
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="flex flex-col gap-3 flex-1">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 rounded-lg bg-white/3 animate-pulse-skeleton" />
          ))}
        </div>
      )}

      {/* Not configured fallback */}
      {!isLoading && !isLive && (
        <div className="flex flex-col gap-3.5 flex-1">
          {[
            { time: "7:00 AM", status: "completed" },
            { time: "12:00 PM", status: "upcoming" },
            { time: "6:00 PM", status: "upcoming" },
          ].map((p, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${p.status === "completed" ? "bg-brand-green shadow-[0_0_10px_rgba(52,211,153,0.25)]" : "bg-white/10"}`} />
              <span className="text-[15px] text-text-primary font-medium w-20">{p.time}</span>
              <span className={`text-[13px] font-semibold ${p.status === "completed" ? "text-brand-green" : "text-text-muted"}`}>
                {p.status === "completed" ? "Synced" : "Upcoming"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Live messages */}
      {!isLoading && isLive && (
        <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-[300px]">
          {messages.map((msg) => (
            <div key={msg.ts} className="px-3 py-2.5 bg-bg-subtle rounded-lg border border-border-default">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare size={11} className="text-brand-amber" />
                <span className="text-[11px] text-text-muted">{msg.time}</span>
              </div>
              <p className="text-[13px] text-text-primary leading-relaxed line-clamp-3">{msg.text}</p>
            </div>
          ))}
        </div>
      )}

      <button onClick={refresh}
              className="mt-5 w-full py-3 px-4 bg-brand-amber/10 border border-brand-amber/18 rounded-[10px]
                         cursor-pointer text-sm text-brand-amber font-bold flex items-center justify-center gap-2
                         transition-all duration-200 hover:bg-brand-amber-dim">
        <RefreshCw size={15} /> Sync Now
      </button>
    </div>
  );
}
