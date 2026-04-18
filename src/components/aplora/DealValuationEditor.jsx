import { useCallback, useEffect, useState } from "react";
import { DollarSign, Plus, Trash2, X } from "lucide-react";
import { aploraApi } from "../../services/aploraApi.js";

const LINE_TYPES = ["retainer", "platform_fee", "project", "saas", "other"];
const FREQUENCIES = ["one_time", "monthly", "quarterly", "annual"];
const freqLabel = { one_time: "One-time", monthly: "Monthly", quarterly: "Quarterly", annual: "Annual" };

function MetricBox({ label, value }) {
  return (
    <div className="bg-bg-subtle rounded-lg p-2 text-center">
      <div className="text-[10px] text-text-muted uppercase">{label}</div>
      <div className="text-sm font-semibold text-text-primary">${value.toLocaleString()}</div>
    </div>
  );
}

function AddDealLineForm({ prospectId, onClose, onCreated }) {
  const [form, setForm] = useState({ line_type: "retainer", description: "", amount: 0, frequency: "monthly", duration_months: 12 });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description.trim() || form.amount <= 0) return;
    setSaving(true);
    try { await aploraApi.createDealLine(prospectId, form); onCreated(); }
    catch (err) { console.error("Failed to create deal line", err); }
    finally { setSaving(false); }
  };

  return (
    <div className="mt-3 border-t border-border-default pt-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-medium text-text-primary">New Line Item</h4>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary"><X className="w-3.5 h-3.5" /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <select value={form.line_type} onChange={(e) => setForm((f) => ({ ...f, line_type: e.target.value }))}
            className="px-2 py-1.5 bg-bg-subtle border border-border-default rounded-lg text-text-primary text-xs focus:outline-none focus:border-brand-blue">
            {LINE_TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
          </select>
          <select value={form.frequency} onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value }))}
            className="px-2 py-1.5 bg-bg-subtle border border-border-default rounded-lg text-text-primary text-xs focus:outline-none focus:border-brand-blue">
            {FREQUENCIES.map((f) => <option key={f} value={f}>{freqLabel[f]}</option>)}
          </select>
        </div>
        <input placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="w-full px-2 py-1.5 bg-bg-subtle border border-border-default rounded-lg text-text-primary text-xs focus:outline-none focus:border-brand-blue" />
        <div className="grid grid-cols-2 gap-2">
          <input type="number" placeholder="Amount ($)" value={form.amount || ""} onChange={(e) => setForm((f) => ({ ...f, amount: parseFloat(e.target.value) || 0 }))}
            className="px-2 py-1.5 bg-bg-subtle border border-border-default rounded-lg text-text-primary text-xs focus:outline-none focus:border-brand-blue" />
          <input type="number" placeholder="Duration (months)" value={form.duration_months || ""} onChange={(e) => setForm((f) => ({ ...f, duration_months: parseInt(e.target.value) || undefined }))}
            className="px-2 py-1.5 bg-bg-subtle border border-border-default rounded-lg text-text-primary text-xs focus:outline-none focus:border-brand-blue" />
        </div>
        <button type="submit" disabled={saving || !form.description.trim() || form.amount <= 0}
          className="w-full px-3 py-1.5 bg-brand-blue rounded-lg text-white text-xs font-medium disabled:opacity-50 hover:bg-brand-blue/90 transition-colors">
          {saving ? "Adding..." : "Add Line Item"}
        </button>
      </form>
    </div>
  );
}

export default function DealValuationEditor({ prospectId }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = useCallback(async () => {
    try { setSummary(await aploraApi.getDealSummary(prospectId)); }
    catch { setSummary(null); }
    finally { setLoading(false); }
  }, [prospectId]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (lineId) => {
    try { await aploraApi.deleteDealLine(lineId); load(); }
    catch (err) { console.error("Failed to delete deal line", err); }
  };

  const lines = summary?.lines || [];
  const hasLines = lines.length > 0;

  return (
    <div className="bg-bg-card border border-border-default rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-brand-green" /> Deal Valuation
        </h3>
        <button onClick={() => setShowAdd(true)} className="text-xs flex items-center gap-1 text-brand-blue hover:text-brand-blue/80">
          <Plus className="w-3 h-3" /> Add Line
        </button>
      </div>

      {loading ? <p className="text-xs text-text-muted">Loading...</p>
      : !hasLines ? <p className="text-xs text-text-muted py-2">No deal lines yet. Add line items to build your deal valuation.</p>
      : (
        <>
          <div className="grid grid-cols-4 gap-2 mb-3">
            <MetricBox label="TCV" value={summary.tcv} />
            <MetricBox label="MRR" value={summary.mrr} />
            <MetricBox label="ARR" value={summary.arr} />
            <MetricBox label="One-time" value={summary.total_one_time} />
          </div>
          <div className="space-y-1.5">
            {lines.map((line) => (
              <div key={line.id} className="flex items-center gap-2 p-2 bg-bg-subtle rounded-lg text-xs group">
                <span className="px-1.5 py-0.5 bg-brand-blue-dim text-brand-blue rounded text-[10px] shrink-0">{line.line_type}</span>
                <span className="text-text-primary flex-1 truncate">{line.description}</span>
                <span className="text-brand-green shrink-0">${line.amount.toLocaleString()}{line.frequency !== "one_time" ? `/${line.frequency.slice(0, 2)}` : ""}</span>
                {line.duration_months && <span className="text-text-muted shrink-0">{line.duration_months}mo</span>}
                <button onClick={() => handleDelete(line.id)} className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-brand-red transition-opacity shrink-0">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      {showAdd && <AddDealLineForm prospectId={prospectId} onClose={() => setShowAdd(false)} onCreated={() => { setShowAdd(false); load(); }} />}
    </div>
  );
}
