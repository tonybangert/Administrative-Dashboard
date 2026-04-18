import { useCallback, useEffect, useState } from "react";
import { Check, Lightbulb, Plus, SkipForward, Sparkles, X, Zap } from "lucide-react";
import { aploraApi } from "../../services/aploraApi.js";

const ACTION_TYPES = ["follow_up", "send_email", "schedule_meeting", "send_proposal", "nurture", "custom"];

function ActionRow({ action, onComplete, onSkip }) {
  const isDone = action.status === "completed";
  const isSkipped = action.status === "skipped";

  return (
    <div className={`flex items-center gap-2 p-2 bg-bg-subtle rounded-lg text-xs group ${isDone ? "opacity-60" : ""} ${isSkipped ? "opacity-40" : ""}`}>
      {action.is_ai_suggested && <Sparkles className="w-3 h-3 text-brand-purple shrink-0" />}
      <span className="px-1.5 py-0.5 bg-brand-blue-dim text-brand-blue rounded text-[10px] shrink-0">
        {action.action_type.replace("_", " ")}
      </span>
      <span className={`flex-1 truncate ${isDone ? "line-through text-text-muted" : "text-text-primary"}`}>
        {action.title}
      </span>
      {action.status === "pending" && (
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity shrink-0">
          <button onClick={() => onComplete(action.id)} className="p-0.5 text-brand-green hover:text-brand-green/80" title="Complete">
            <Check className="w-3 h-3" />
          </button>
          <button onClick={() => onSkip(action.id)} className="p-0.5 text-text-muted hover:text-text-primary" title="Skip">
            <SkipForward className="w-3 h-3" />
          </button>
        </div>
      )}
      {isDone && <Check className="w-3 h-3 text-brand-green shrink-0" />}
      {isSkipped && <SkipForward className="w-3 h-3 text-text-muted shrink-0" />}
    </div>
  );
}

function AddActionForm({ prospectId, onClose, onCreated }) {
  const [form, setForm] = useState({ title: "", action_type: "follow_up", description: "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try { await aploraApi.createAction(prospectId, form); onCreated(); }
    catch (err) { console.error("Failed to create action", err); }
    finally { setSaving(false); }
  };

  return (
    <div className="mt-3 border-t border-border-default pt-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-medium text-text-primary">New Action</h4>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary"><X className="w-3.5 h-3.5" /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <select value={form.action_type} onChange={(e) => setForm((f) => ({ ...f, action_type: e.target.value }))}
          className="w-full px-2 py-1.5 bg-bg-subtle border border-border-default rounded-lg text-text-primary text-xs focus:outline-none focus:border-brand-blue">
          {ACTION_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
        </select>
        <input autoFocus placeholder="Action title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="w-full px-2 py-1.5 bg-bg-subtle border border-border-default rounded-lg text-text-primary text-xs focus:outline-none focus:border-brand-blue" />
        <textarea placeholder="Description (optional)" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={2} className="w-full px-2 py-1.5 bg-bg-subtle border border-border-default rounded-lg text-text-primary text-xs focus:outline-none focus:border-brand-blue resize-none" />
        <button type="submit" disabled={saving || !form.title.trim()}
          className="w-full px-3 py-1.5 bg-brand-blue rounded-lg text-white text-xs font-medium disabled:opacity-50 hover:bg-brand-blue/90 transition-colors">
          {saving ? "Adding..." : "Add Action"}
        </button>
      </form>
    </div>
  );
}

export default function ActionPanel({ prospectId }) {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggesting, setSuggesting] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [reasoning, setReasoning] = useState(null);

  const load = useCallback(async () => {
    try { setActions(await aploraApi.listActions(prospectId)); }
    catch { setActions([]); }
    finally { setLoading(false); }
  }, [prospectId]);

  useEffect(() => { load(); }, [load]);

  const handleComplete = async (actionId) => { try { await aploraApi.completeAction(actionId); load(); } catch (err) { console.error("Failed to complete action", err); } };
  const handleSkip = async (actionId) => { try { await aploraApi.skipAction(actionId); load(); } catch (err) { console.error("Failed to skip action", err); } };

  const handleSuggest = async () => {
    setSuggesting(true);
    try { const result = await aploraApi.suggestActions(prospectId); setReasoning(result.reasoning); load(); }
    catch (err) { console.error("Failed to get AI suggestions", err); }
    finally { setSuggesting(false); }
  };

  const pending = actions.filter((a) => a.status === "pending");
  const completed = actions.filter((a) => a.status === "completed");
  const skipped = actions.filter((a) => a.status === "skipped");

  return (
    <div className="bg-bg-card border border-border-default rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand-amber" /> Deal Actions
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={handleSuggest} disabled={suggesting} className="text-xs flex items-center gap-1 text-brand-purple hover:text-brand-purple/80 disabled:opacity-50">
            <Sparkles className="w-3 h-3" /> {suggesting ? "Thinking..." : "AI Suggest"}
          </button>
          <button onClick={() => setShowAdd(true)} className="text-xs flex items-center gap-1 text-brand-blue hover:text-brand-blue/80">
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
      </div>

      {loading ? <p className="text-xs text-text-muted">Loading...</p> : (
        <>
          {reasoning && (
            <div className="mb-3 p-2 bg-brand-purple/10 border border-brand-purple/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-3.5 h-3.5 text-brand-purple mt-0.5 shrink-0" />
                <p className="text-xs text-brand-purple/80">{reasoning}</p>
              </div>
              <button onClick={() => setReasoning(null)} className="text-[10px] text-brand-purple mt-1 hover:underline">Dismiss</button>
            </div>
          )}

          {pending.length === 0 && completed.length === 0 && skipped.length === 0 ? (
            <p className="text-xs text-text-muted py-2">No actions yet. Use &quot;AI Suggest&quot; to get recommended next steps.</p>
          ) : (
            <div className="space-y-1.5">
              {pending.map((a) => <ActionRow key={a.id} action={a} onComplete={handleComplete} onSkip={handleSkip} />)}
              {completed.length > 0 && (
                <details className="mt-2">
                  <summary className="text-[10px] text-text-muted uppercase cursor-pointer hover:text-text-primary">Completed ({completed.length})</summary>
                  <div className="mt-1 space-y-1.5">{completed.map((a) => <ActionRow key={a.id} action={a} onComplete={handleComplete} onSkip={handleSkip} />)}</div>
                </details>
              )}
              {skipped.length > 0 && (
                <details className="mt-2">
                  <summary className="text-[10px] text-text-muted uppercase cursor-pointer hover:text-text-primary">Skipped ({skipped.length})</summary>
                  <div className="mt-1 space-y-1.5">{skipped.map((a) => <ActionRow key={a.id} action={a} onComplete={handleComplete} onSkip={handleSkip} />)}</div>
                </details>
              )}
            </div>
          )}
        </>
      )}
      {showAdd && <AddActionForm prospectId={prospectId} onClose={() => setShowAdd(false)} onCreated={() => { setShowAdd(false); load(); }} />}
    </div>
  );
}
