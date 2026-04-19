import { useState } from "react";
import {
  CheckCircle,
  StickyNote,
  Plus,
  Trash2,
  Check,
  ExternalLink,
  ArrowUpRight,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { MessageSquare } from "lucide-react";
import { supabase } from "../lib/supabase.js";
import { useNotes } from "../hooks/useNotes.js";
import { useObsidianTodos } from "../hooks/useObsidianTodos.js";
import { useSlack } from "../hooks/useSlack.js";
import { useToast } from "./Toast.jsx";
import AddNoteModal from "./AddNoteModal.jsx";

const SNAPSHOT_PREVIEW_COUNT = 3;

function SnapshotPreview({ items, getLabel, emptyText }) {
  if (items.length === 0) {
    return (
      <div className="text-xs text-text-muted italic">{emptyText}</div>
    );
  }
  return (
    <ul className="flex flex-col gap-1 text-xs text-text-secondary">
      {items.slice(0, SNAPSHOT_PREVIEW_COUNT).map((it, idx) => (
        <li key={idx} className="truncate">
          • {getLabel(it)}
        </li>
      ))}
      {items.length > SNAPSHOT_PREVIEW_COUNT && (
        <li className="text-text-muted">
          +{items.length - SNAPSHOT_PREVIEW_COUNT} more…
        </li>
      )}
    </ul>
  );
}

function SummaryCard({ icon: Icon, label, hex, count, isActive, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col gap-3 px-4 py-4 rounded-xl border text-left relative overflow-hidden
                  transition-all duration-200 cursor-pointer
                  ${isActive
                    ? "border-current/30 bg-current/5"
                    : "border-border-default bg-bg-subtle hover:-translate-y-px hover:border-current/25"}`}
      style={{ color: hex }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
          style={{ background: hex + "15" }}
        >
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div
            className={`text-sm font-semibold ${isActive ? "" : "text-text-primary"}`}
            style={isActive ? { color: hex } : undefined}
          >
            {label}
          </div>
          <div className="text-xs text-text-muted">{count} items</div>
        </div>
        <ArrowUpRight
          size={14}
          className={`shrink-0 transition-transform duration-200 ${isActive ? "rotate-90" : "text-text-muted"}`}
        />
      </div>
      {children}
    </button>
  );
}

export default function QuickActions() {
  const [expanded, setExpanded] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();

  const { notesByCategory, addNote, deleteNote, updateNote, refetch: refetchNotes } = useNotes();
  const { active: activeTodos, completed: completedTodos, error: obsidianError, isLoading: obsidianLoading, refetch: refetchObsidian, lastFetched } = useObsidianTodos();
  const { messages: slackMessages, apiError: slackError, refresh: refetchSlack } = useSlack();

  const appNotes = notesByCategory.general ?? [];

  // Merge Slack DM messages + app-added Supabase notes into one list for the Notes card.
  // Slack messages are read-only (source of truth is Slack); app notes are editable.
  const combinedNotes = [
    ...slackMessages.map((m) => ({
      id: `slack-${m.ts}`,
      text: m.text,
      source: "slack",
      createdAt: new Date(parseFloat(m.ts) * 1000).toISOString(),
      time: m.time,
    })),
    ...appNotes.map((n) => ({ ...n, source: "app" })),
  ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const handleAdd = async (form) => {
    try {
      await addNote.mutateAsync({ ...form, category: "general" });
      toast?.("Note added");
    } catch {
      toast?.("Failed to add note", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!supabase) return;
    try {
      await deleteNote.mutateAsync(id);
      toast?.("Note removed");
    } catch {
      toast?.("Failed to delete", "error");
    }
  };

  const handleToggleComplete = async (note) => {
    if (!supabase) return;
    try {
      await updateNote.mutateAsync({ id: note.id, completed: !note.completed });
      toast?.(note.completed ? "Marked incomplete" : "Marked complete");
    } catch {
      toast?.("Failed to update", "error");
    }
  };

  const handleRefresh = () => {
    refetchObsidian();
    refetchNotes();
    refetchSlack();
    toast?.("Refreshing…");
  };

  return (
    <>
      <div className="glass p-4 sm:p-6 animate-fade-in-up stagger-2">
        <div className="flex justify-between items-center mb-4.5 flex-wrap gap-2">
          <h2 className="text-lg font-bold text-text-primary">Quick Actions</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 text-xs text-text-secondary bg-bg-subtle px-3 py-1.5 rounded-[20px]
                         cursor-pointer border border-border-default transition-all duration-200 hover:border-text-muted"
              title="Refresh from Obsidian vault"
            >
              <RefreshCw size={12} /> Refresh
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 text-xs text-brand-amber bg-brand-amber-dim px-3 py-1.5 rounded-[20px]
                         cursor-pointer border-none transition-all duration-200 hover:bg-brand-amber-glow font-semibold"
            >
              <Plus size={12} /> Add Note
            </button>
          </div>
        </div>

        {/* Two summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SummaryCard
            icon={CheckCircle}
            label="To Do"
            hex="#faa840"
            count={activeTodos.length}
            isActive={expanded === "todo"}
            onClick={() => setExpanded(expanded === "todo" ? null : "todo")}
          >
            {obsidianError ? (
              <div className="flex items-center gap-2 text-xs text-brand-red">
                <AlertTriangle size={12} /> Obsidian sync failed — click to retry
              </div>
            ) : obsidianLoading ? (
              <div className="text-xs text-text-muted italic">Loading from vault…</div>
            ) : (
              <SnapshotPreview
                items={activeTodos}
                getLabel={(t) => t.text}
                emptyText="No open follow-ups in Obsidian."
              />
            )}
          </SummaryCard>

          <SummaryCard
            icon={StickyNote}
            label="Notes"
            hex="#818cf8"
            count={combinedNotes.length}
            isActive={expanded === "notes"}
            onClick={() => setExpanded(expanded === "notes" ? null : "notes")}
          >
            {slackError && !slackError.includes("not configured") ? (
              <div className="flex items-center gap-2 text-xs text-brand-red">
                <AlertTriangle size={12} /> Slack sync failed
              </div>
            ) : (
              <SnapshotPreview
                items={combinedNotes}
                getLabel={(n) => n.text}
                emptyText="No notes yet. DM the bot or click + Add Note."
              />
            )}
          </SummaryCard>
        </div>

        {/* Expanded To Do list */}
        {expanded === "todo" && (
          <div className="mt-4 border-t border-border-default pt-4 flex flex-col gap-2">
            {obsidianError && (
              <div className="text-sm text-brand-red bg-brand-red/5 rounded-[10px] px-4 py-3">
                Failed to load Obsidian todos: {obsidianError.message}
              </div>
            )}
            {activeTodos.length === 0 && !obsidianError && (
              <div className="text-sm text-text-muted text-center py-4">
                No open follow-ups. Tag items <code className="text-brand-amber">#status/follow-up</code> in Obsidian to see them here.
              </div>
            )}
            {activeTodos.map((todo, i) => (
              <div
                key={`${todo.source.file}:${todo.source.line}:${i}`}
                className="group flex items-start gap-3 px-4 py-3 bg-bg-subtle rounded-[10px] border border-border-default
                           transition-all duration-200 hover:border-brand-amber/20"
                style={{ color: "#faa840" }}
              >
                <div className="w-5 h-5 rounded-full mt-[1px] shrink-0 border-2 border-brand-amber opacity-80" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-text-primary leading-relaxed">{todo.text}</div>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    <span className="text-[11px] text-text-muted">
                      {todo.source.file}
                    </span>
                    {todo.tags
                      .filter((t) => t !== "status/follow-up")
                      .map((t) => (
                        <span
                          key={t}
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-[5px] bg-brand-amber/10 text-brand-amber"
                        >
                          #{t}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            ))}
            {completedTodos.length > 0 && (
              <div className="text-xs text-text-muted mt-2">
                {completedTodos.length} completed (hidden — check them off in Obsidian to clear).
              </div>
            )}
            {lastFetched && (
              <div className="text-[10px] text-text-muted text-right mt-1">
                Last synced: {new Date(lastFetched).toLocaleTimeString()}
              </div>
            )}
          </div>
        )}

        {/* Expanded Notes list */}
        {expanded === "notes" && (
          <div className="mt-4 border-t border-border-default pt-4 flex flex-col gap-2">
            {slackError && !slackError.includes("not configured") && (
              <div className="text-sm text-brand-red bg-brand-red/5 rounded-[10px] px-4 py-3 flex items-center gap-2">
                <AlertTriangle size={14} /> Slack: {slackError}
              </div>
            )}
            {combinedNotes.length === 0 && (
              <div className="text-sm text-text-muted text-center py-4">
                No notes yet. DM the Daily Ops Command bot in Slack, or click "+ Add Note".
              </div>
            )}
            {combinedNotes.map((note) => (
              <div
                key={note.id}
                className="group flex items-start gap-3 px-4 py-3 bg-bg-subtle rounded-[10px] border border-border-default
                           transition-all duration-200 hover:border-indigo-400/20"
                style={{ color: "#818cf8" }}
              >
                {note.source === "slack" ? (
                  <div
                    className="w-5 h-5 rounded-full mt-[1px] shrink-0 flex items-center justify-center"
                    style={{ background: "#4A154B20" }}
                    title="From Slack"
                  >
                    <MessageSquare size={11} style={{ color: "#4A154B" }} />
                  </div>
                ) : (
                  <button
                    onClick={() => handleToggleComplete(note)}
                    className={`w-5 h-5 rounded-full mt-[1px] shrink-0 cursor-pointer border-2 p-0 flex items-center justify-center
                                transition-all duration-200 bg-transparent
                                ${note.completed ? "opacity-60" : "opacity-80 hover:opacity-100"}`}
                    style={{
                      borderColor: "#818cf8",
                      background: note.completed ? "#818cf8" : "transparent",
                    }}
                  >
                    {note.completed && <Check size={12} className="text-black" />}
                  </button>
                )}
                <div
                  className={`flex-1 min-w-0 transition-opacity duration-200 ${note.completed ? "opacity-40" : ""}`}
                >
                  <div
                    className={`text-sm text-text-primary leading-relaxed whitespace-pre-wrap ${note.completed ? "line-through" : ""}`}
                  >
                    {note.text}
                  </div>
                  <div className="flex gap-2 mt-1.5 flex-wrap items-center">
                    {note.source === "slack" && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[5px] bg-[#4A154B]/10 text-[#d8a4d9]">
                        Slack · {note.time}
                      </span>
                    )}
                    {note.tag && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[5px] bg-indigo-500/10 text-indigo-400">
                        {note.tag}
                      </span>
                    )}
                    {note.url && (
                      <a
                        href={note.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-brand-sky no-underline px-2 py-0.5
                                   bg-brand-sky/8 rounded-[5px] border border-brand-sky/15
                                   transition-all duration-200 hover:bg-brand-amber-dim hover:text-brand-amber"
                      >
                        <ExternalLink size={11} /> Open link
                      </a>
                    )}
                  </div>
                </div>
                {note.source === "app" && supabase && (
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="sm:opacity-0 sm:group-hover:opacity-100 text-text-muted hover:text-brand-red transition-all duration-200
                               cursor-pointer bg-transparent border-none mt-0.5 p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <AddNoteModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
    </>
  );
}
