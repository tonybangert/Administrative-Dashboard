import { useState } from "react";
import { CheckCircle, TrendingUp, FileText, Lightbulb, Link2, AlertTriangle, ArrowUpRight, ExternalLink, MessageSquare, Plus, Trash2, Check } from "lucide-react";
import { supabase } from "../lib/supabase.js";
import { useNotes } from "../hooks/useNotes.js";
import { useToast } from "./Toast.jsx";
import AddNoteModal from "./AddNoteModal.jsx";

const CATEGORY_CONFIG = [
  { key: "client_todos", label: "Client To-Dos", icon: CheckCircle, hex: "#faa840" },
  { key: "high_priority", label: "High Priority", icon: AlertTriangle, hex: "#ef4537" },
  { key: "prospect_updates", label: "Prospect Updates", icon: TrendingUp, hex: "#34d399" },
  { key: "meeting_notes", label: "Meeting Notes", icon: FileText, hex: "#818cf8" },
  { key: "ideas", label: "Ideas", icon: Lightbulb, hex: "#f472b6" },
  { key: "links", label: "Links to Review", icon: Link2, hex: "#38bdf8" },
];

const SEED_NOTES = {
  client_todos: [
    { id: "s1", text: "Send LNS updated dashboard mockups to Andrew", tag: "LNS" },
    { id: "s2", text: "Follow up with Patrick on CJP newsletter schedule", tag: "CJP" },
    { id: "s3", text: "Review CK Sales Summit segmentation updates with Brad", tag: "CK" },
  ],
  high_priority: [
    { id: "s4", text: "Finalize Aplora JV deliverable timeline with Paul and Eric", tag: "CRITICAL" },
    { id: "s5", text: "Prep pipeline deck for new business meeting Monday", tag: "CRITICAL" },
  ],
  prospect_updates: [
    { id: "s6", text: "Initial call with mid-market fintech prospect went well. Sending proposal Monday.", tag: "$5K/mo" },
    { id: "s7", text: "Marketing services company interested in FDE model. Needs follow-up.", tag: "$8K/mo" },
  ],
  meeting_notes: [
    { id: "s8", text: "LNS sync (3/27): Ben flagged data integration timeline. Brandon wants weekly status updates.", tag: "LNS" },
    { id: "s9", text: "CK check-in (3/26): Kevin pushing for faster segmentation rollout. Need to scope Phase 2.", tag: "CK" },
  ],
  ideas: [
    { id: "s10", text: "Could we build a self-serve AI readiness assessment as a lead gen tool?" },
    { id: "s11", text: "FDE model needs a one-pager that explains it in 60 seconds" },
  ],
  links: [
    { id: "s12", text: "Interesting thread on agentic AI in enterprise", url: "https://example.com/agentic-ai" },
    { id: "s13", text: "Competitor doing embedded analytics for mid-market", url: "https://example.com/competitor" },
    { id: "s14", text: "Good breakdown of forward-deployed engineering teams", url: "https://newsletter.pragmaticengineer.com/p/forward-deployed" },
  ],
};

export default function QuickActions() {
  const [expanded, setExpanded] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();
  const { notesByCategory, isLoading, addNote, deleteNote, updateNote } = useNotes();

  const getItems = (key) => {
    const live = notesByCategory[key];
    if (live && live.length > 0) return live;
    if (!supabase) return SEED_NOTES[key] || [];
    return [];
  };

  const handleAdd = async (form) => {
    try {
      await addNote.mutateAsync(form);
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

  const activeConfig = CATEGORY_CONFIG.find(c => c.key === expanded);
  const activeItems = expanded ? getItems(expanded) : [];

  return (
    <>
      <div className="glass p-4 sm:p-6 animate-fade-in-up stagger-2">
        <div className="flex justify-between items-center mb-4.5 flex-wrap gap-2">
          <h2 className="text-lg font-bold text-text-primary">Quick Actions</h2>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowModal(true)}
                    className="flex items-center gap-1.5 text-xs text-brand-amber bg-brand-amber-dim px-3 py-1.5 rounded-[20px]
                               cursor-pointer border-none transition-all duration-200 hover:bg-brand-amber-glow font-semibold">
              <Plus size={12} /> Add Note
            </button>
            <div className="flex items-center gap-1.5 bg-brand-green-dim px-3.5 py-1 rounded-[20px]">
              <MessageSquare size={13} className="text-brand-green" />
              <span className="text-xs text-brand-green font-semibold">Slack-synced</span>
            </div>
          </div>
        </div>

        {/* Button grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CATEGORY_CONFIG.map(a => {
            const Icon = a.icon;
            const isActive = expanded === a.key;
            const items = getItems(a.key);
            return (
              <button key={a.key} onClick={() => setExpanded(isActive ? null : a.key)}
                      className={`flex items-center gap-3 px-4 py-3.5 sm:px-4.5 sm:py-4 rounded-xl border text-left relative overflow-hidden
                                  transition-all duration-200 cursor-pointer
                                  ${isActive
                                    ? "border-current/30 bg-current/5"
                                    : "border-border-default bg-bg-subtle hover:-translate-y-px hover:border-current/25"}`}
                      style={{ color: a.hex }}>
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                     style={{ background: a.hex + "15" }}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold ${isActive ? "" : "text-text-primary"}`}
                       style={isActive ? { color: a.hex } : undefined}>{a.label}</div>
                  <div className="text-xs text-text-muted">{items.length} items</div>
                </div>
                <ArrowUpRight size={14} className={`shrink-0 transition-transform duration-200 ${isActive ? "rotate-90" : "text-text-muted"}`} />
              </button>
            );
          })}
        </div>

        {/* Expanded detail panel */}
        {activeConfig && (
          <div className="mt-4 border-t border-border-default pt-4 flex flex-col gap-2">
            {activeItems.length === 0 && (
              <div className="text-sm text-text-muted text-center py-4">No items yet. Click "Add Note" to get started.</div>
            )}
            {activeItems.map((item) => (
              <div key={item.id}
                   className="group flex items-start gap-3 px-4 py-3 bg-bg-subtle rounded-[10px] border border-border-default
                              transition-all duration-200 hover:border-current/20"
                   style={{ color: activeConfig.hex }}>
                {/* Completion toggle */}
                <button onClick={() => handleToggleComplete(item)}
                        className={`w-6 h-6 sm:w-5 sm:h-5 rounded-full mt-[1px] shrink-0 cursor-pointer border-2 p-0 flex items-center justify-center
                                    transition-all duration-200 bg-transparent
                                    ${item.completed ? "opacity-60" : "opacity-80 hover:opacity-100"}`}
                        style={{ borderColor: activeConfig.hex, background: item.completed ? activeConfig.hex : "transparent" }}>
                  {item.completed && <Check size={12} className="text-black" />}
                </button>
                <div className={`flex-1 min-w-0 transition-opacity duration-200 ${item.completed ? "opacity-40" : ""}`}>
                  <div className={`text-sm text-text-primary leading-relaxed ${item.completed ? "line-through" : ""}`}>{item.text}</div>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    {item.tag && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[5px]"
                            style={{
                              background: item.tag === "CRITICAL" ? "rgba(239,69,55,0.12)" : activeConfig.hex + "15",
                              color: item.tag === "CRITICAL" ? "#ef4537" : activeConfig.hex,
                            }}>{item.tag}</span>
                    )}
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer"
                         className="inline-flex items-center gap-1.5 text-xs text-brand-sky no-underline px-2 py-0.5
                                    bg-brand-sky/8 rounded-[5px] border border-brand-sky/15
                                    transition-all duration-200 hover:bg-brand-amber-dim hover:text-brand-amber">
                        <ExternalLink size={11} /> Open link
                      </a>
                    )}
                  </div>
                </div>
                {supabase && (
                  <button onClick={() => handleDelete(item.id)}
                          className="sm:opacity-0 sm:group-hover:opacity-100 text-text-muted hover:text-brand-red transition-all duration-200
                                     cursor-pointer bg-transparent border-none mt-0.5 p-1">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <AddNoteModal onClose={() => setShowModal(false)} onAdd={handleAdd} defaultCategory={expanded} />}
    </>
  );
}
