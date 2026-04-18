import { useState } from "react";
import {
  MessageSquare, Phone, Mail, CalendarCheck, ArrowRightLeft, Brain,
  Flag, ChevronDown, ChevronUp, Zap, CheckSquare, Bot, User, Check, SkipForward,
} from "lucide-react";
import { aploraApi } from "../../services/aploraApi.js";

const SIGNAL_CONFIG = {
  note: { icon: MessageSquare, color: "#6B7280", label: "Note" },
  call: { icon: Phone, color: "#3B82F6", label: "Call" },
  email: { icon: Mail, color: "#8B5CF6", label: "Email" },
  meeting: { icon: CalendarCheck, color: "#F59E0B", label: "Meeting" },
  stage_change: { icon: ArrowRightLeft, color: "#10B981", label: "Stage Change" },
  research: { icon: Brain, color: "#A855F7", label: "AI Research" },
  milestone: { icon: Flag, color: "#0066FF", label: "Milestone" },
  action: { icon: Zap, color: "#F59E0B", label: "Action" },
  task: { icon: CheckSquare, color: "#06B6D4", label: "Task" },
};

function formatTime(dateStr) {
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function renderInlineFormatting(text) {
  const parts = [];
  let remaining = text;
  let keyIdx = 0;
  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) parts.push(<span key={keyIdx++}>{remaining.slice(0, boldMatch.index)}</span>);
      parts.push(<strong key={keyIdx++} className="font-semibold text-text-primary">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
    } else {
      parts.push(<span key={keyIdx++}>{remaining}</span>);
      break;
    }
  }
  return <>{parts}</>;
}

function renderContent(text) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const key = `line-${i}`;
    if (line.startsWith("### ")) return <div key={key} className="font-semibold text-sm mt-3 mb-1 text-brand-blue">{line.slice(4)}</div>;
    if (line.startsWith("## ")) return <div key={key} className="font-bold text-sm mt-3 mb-1 text-text-primary">{line.slice(3)}</div>;
    if (line.match(/^\*\*[^*]+\*\*:?\s*$/)) return <div key={key} className="font-semibold text-sm mt-3 mb-1 text-text-primary">{line.replace(/\*\*/g, "").replace(/:$/, "")}</div>;
    if (line.match(/^[-•]\s/)) return <div key={key} className="flex gap-2 ml-2 text-sm"><span className="text-brand-blue">•</span><span>{renderInlineFormatting(line.slice(2))}</span></div>;
    if (line.match(/^\d+\.\s/)) { const num = line.match(/^(\d+)\./)?.[1]; return <div key={key} className="flex gap-2 ml-2 text-sm"><span className="text-brand-blue font-medium">{num}.</span><span>{renderInlineFormatting(line.replace(/^\d+\.\s/, ""))}</span></div>; }
    if (line.trim() === "") return <div key={key} className="h-2" />;
    return <div key={key} className="text-sm">{renderInlineFormatting(line)}</div>;
  });
}

function getActionMeta(signal) {
  if (signal.signal_type !== "action") return null;
  try {
    const meta = typeof signal.metadata_json === "string" ? JSON.parse(signal.metadata_json) : signal.metadata_json;
    return meta || null;
  } catch { return null; }
}

function SignalItem({ signal, onActionUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const config = SIGNAL_CONFIG[signal.signal_type] || SIGNAL_CONFIG.note;
  const Icon = config.icon;

  const actionMeta = getActionMeta(signal);
  const isAction = signal.signal_type === "action";
  const isPendingAction = isAction && actionMeta?.status === "pending";
  const isCompletedAction = isAction && actionMeta?.status === "completed";
  const isSkippedAction = isAction && actionMeta?.status === "skipped";
  const isSystemAction = isAction && actionMeta?.action_source === "system";

  const isLong = signal.content.length > 200 || signal.content.split("\n").length > 5;
  const isResearch = signal.signal_type === "research";
  const shouldCollapse = isLong && !expanded;

  const handleComplete = async () => {
    setActionLoading(true);
    try { await aploraApi.completeAction(signal.id); onActionUpdate?.(); }
    finally { setActionLoading(false); }
  };

  const handleSkip = async () => {
    setActionLoading(true);
    try { await aploraApi.skipAction(signal.id); onActionUpdate?.(); }
    finally { setActionLoading(false); }
  };

  return (
    <div className={`rounded-lg transition-colors ${
      isResearch ? "bg-brand-purple/5 border border-brand-purple/20"
      : isPendingAction ? "bg-brand-amber/5 border border-brand-amber/20"
      : isCompletedAction ? "bg-brand-green/5 border border-brand-green/10"
      : isSkippedAction ? "opacity-60"
      : "hover:bg-bg-card"
    }`}>
      <div className="flex gap-3 p-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${config.color}20` }}>
          {isAction ? (
            isSystemAction ? <Bot size={14} style={{ color: config.color }} /> : <User size={14} style={{ color: config.color }} />
          ) : (
            <Icon size={14} style={{ color: config.color }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {signal.title && <div className={`text-sm font-medium ${isCompletedAction ? "line-through text-text-muted" : "text-text-primary"}`}>{signal.title}</div>}
            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${config.color}15`, color: config.color }}>{config.label}</span>
            {signal.created_by && <span className="text-[10px] text-text-muted">by {signal.created_by}</span>}
            <span className="text-[10px] text-text-muted ml-auto">{formatTime(signal.created_at)}</span>
          </div>

          <div className={`text-text-secondary ${shouldCollapse ? "max-h-24 overflow-hidden relative" : ""}`}>
            {isResearch ? renderContent(signal.content) : (
              <div className={`text-sm whitespace-pre-wrap ${isCompletedAction ? "text-text-muted" : ""}`}>{signal.content}</div>
            )}
            {shouldCollapse && <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-bg-primary to-transparent" />}
          </div>

          {isPendingAction && (
            <div className="flex items-center gap-2 mt-2">
              <button onClick={handleComplete} disabled={actionLoading} className="flex items-center gap-1 px-2 py-1 text-xs text-brand-green bg-brand-green-dim rounded hover:bg-brand-green/20 transition-colors disabled:opacity-50">
                <Check size={12} /> Complete
              </button>
              <button onClick={handleSkip} disabled={actionLoading} className="flex items-center gap-1 px-2 py-1 text-xs text-text-muted hover:text-text-primary bg-bg-card rounded hover:bg-bg-card-hover transition-colors disabled:opacity-50">
                <SkipForward size={12} /> Skip
              </button>
              {actionMeta?.due_date && <span className="text-[10px] text-text-muted ml-auto">Due {new Date(actionMeta.due_date).toLocaleDateString([], { month: "short", day: "numeric" })}</span>}
            </div>
          )}
          {isCompletedAction && <div className="flex items-center gap-1 mt-1.5 text-[10px] text-brand-green"><Check size={10} /> Completed</div>}
          {isSkippedAction && <div className="flex items-center gap-1 mt-1.5 text-[10px] text-text-muted"><SkipForward size={10} /> Skipped</div>}

          {isLong && (
            <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 mt-2 text-xs text-brand-blue hover:text-brand-blue/80 transition-colors">
              {expanded ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Show more</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SignalFeed({ signals, onActionUpdate }) {
  if (signals.length === 0) {
    return <div className="text-center py-8 text-text-muted text-sm">No activity yet. Add a note to get started.</div>;
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-text-muted px-1 mb-3 uppercase tracking-wider flex items-center gap-2">
        Activity Feed
        <span className="text-[10px] bg-bg-card px-1.5 py-0.5 rounded">{signals.length}</span>
      </div>
      {signals.map((signal) => (
        <SignalItem key={signal.id} signal={signal} onActionUpdate={onActionUpdate} />
      ))}
    </div>
  );
}
