import { useState } from "react";
import { X } from "lucide-react";
import { aploraApi } from "../../services/aploraApi.js";

const PRODUCTS = ["Aplora Analyst", "Aplora Marketing", "Estate Planner", "Custom AI Solution", "Family Law Suite", "Other"];

export default function EditProspectForm({ prospect, onClose, onUpdated }) {
  const [form, setForm] = useState({
    contact_name: prospect.contact_name, company: prospect.company,
    title: prospect.title || "", email: prospect.email || "", phone: prospect.phone || "",
    website: prospect.website || "", product_interest: prospect.product_interest || "",
    deal_value: prospect.deal_value != null ? String(prospect.deal_value) : "",
    deal_type: prospect.deal_type || "one_time", confidence: String(prospect.confidence),
    source: prospect.source || "", industry: prospect.industry || "", next_step: prospect.next_step || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.contact_name.trim() || !form.company.trim()) return;
    setSaving(true); setError(null);
    try {
      await aploraApi.updateProspect(prospect.id, {
        contact_name: form.contact_name.trim(), company: form.company.trim(),
        title: form.title.trim() || null, email: form.email.trim() || null,
        phone: form.phone.trim() || null, website: form.website.trim() || null,
        product_interest: form.product_interest || null,
        deal_value: form.deal_value ? parseFloat(form.deal_value) : null,
        deal_type: form.deal_type, confidence: form.confidence ? parseInt(form.confidence, 10) : prospect.confidence,
        source: form.source.trim() || null, industry: form.industry.trim() || null,
        next_step: form.next_step.trim() || null,
      });
      onUpdated();
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to save changes"); }
    finally { setSaving(false); }
  };

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const inputClass = "w-full px-3 py-2 bg-bg-input border border-border-default rounded-lg text-sm text-text-primary focus:outline-none focus:border-brand-blue/50 placeholder:text-text-muted";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="glass p-0 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-default">
          <h3 className="font-semibold text-text-primary">Edit Prospect</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-bg-card-hover transition-colors text-text-muted"><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-text-muted block mb-1">Contact Name *</label><input type="text" value={form.contact_name} onChange={(e) => update("contact_name", e.target.value)} required className={inputClass} /></div>
            <div><label className="text-xs text-text-muted block mb-1">Company *</label><input type="text" value={form.company} onChange={(e) => update("company", e.target.value)} required className={inputClass} /></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-text-muted block mb-1">Title</label><input type="text" value={form.title} onChange={(e) => update("title", e.target.value)} className={inputClass} /></div>
            <div><label className="text-xs text-text-muted block mb-1">Email</label><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} /></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-text-muted block mb-1">Phone</label><input type="text" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} /></div>
            <div><label className="text-xs text-text-muted block mb-1">Industry</label><input type="text" value={form.industry} onChange={(e) => update("industry", e.target.value)} className={inputClass} /></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-muted block mb-1">Product Interest</label>
              <select value={form.product_interest} onChange={(e) => update("product_interest", e.target.value)} className={inputClass}>
                <option value="">Select...</option>
                {PRODUCTS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1">Deal Value ($)</label>
              <input type="number" value={form.deal_value} onChange={(e) => update("deal_value", e.target.value)} className={inputClass} />
              <div className="flex mt-1.5 bg-bg-subtle rounded-lg border border-border-default overflow-hidden">
                <button type="button" onClick={() => update("deal_type", "one_time")} className={`flex-1 px-2 py-1.5 text-xs font-medium transition-colors ${form.deal_type === "one_time" ? "bg-brand-blue text-white" : "text-text-muted hover:text-text-primary"}`}>One-time</button>
                <button type="button" onClick={() => update("deal_type", "retainer")} className={`flex-1 px-2 py-1.5 text-xs font-medium transition-colors ${form.deal_type === "retainer" ? "bg-brand-green text-black" : "text-text-muted hover:text-text-primary"}`}>Monthly</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-text-muted block mb-1">Source</label><input type="text" value={form.source} onChange={(e) => update("source", e.target.value)} className={inputClass} /></div>
            <div><label className="text-xs text-text-muted block mb-1">LinkedIn Profile</label><input type="text" value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="linkedin.com/in/username" className={inputClass} /></div>
          </div>

          <div><label className="text-xs text-text-muted block mb-1">Next Step</label><input type="text" value={form.next_step} onChange={(e) => update("next_step", e.target.value)} className={inputClass} /></div>

          {error && <div className="text-sm text-brand-red bg-brand-red-dim border border-brand-red/20 rounded-lg px-3 py-2">{error}</div>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-text-muted hover:text-text-primary transition-colors">Cancel</button>
            <button type="submit" disabled={saving || !form.contact_name.trim() || !form.company.trim()} className="px-5 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-brand-blue/90 transition-colors disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
