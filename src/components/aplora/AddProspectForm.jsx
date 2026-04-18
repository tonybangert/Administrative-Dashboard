import { useState, useEffect, useRef } from "react";
import { X, Building2 } from "lucide-react";
import { aploraApi } from "../../services/aploraApi.js";

const PRODUCTS = ["Aplora Analyst", "Aplora Marketing", "Estate Planner", "Custom AI Solution", "Family Law Suite", "Other"];
const TEAM = ["Eric", "Tony", "Paul", "Matt"];

function getUserName() {
  try {
    const stored = localStorage.getItem("aplora_sales_user");
    if (stored) return JSON.parse(stored).name || "";
  } catch {}
  return "";
}

export default function AddProspectForm({ onClose, onCreated }) {
  const [form, setForm] = useState({
    contact_name: "", company: "", title: "", email: "", phone: "",
    website: "", product_interest: "", deal_value: "", deal_type: "one_time",
    source: "", industry: "", next_step: "", owner: getUserName(),
  });
  const [saving, setSaving] = useState(false);
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const companyInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const searchTimeoutRef = useRef();

  useEffect(() => {
    if (form.company.trim().length < 2) { setCompanySuggestions([]); setShowSuggestions(false); return; }
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await aploraApi.listCompanies({ search: form.company.trim() });
        setCompanySuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch { setCompanySuggestions([]); }
    }, 300);
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [form.company]);

  useEffect(() => {
    const handleClick = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) && companyInputRef.current && !companyInputRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectCompany = (company) => {
    setForm((prev) => ({ ...prev, company: company.name, website: company.website || prev.website, industry: company.industry || prev.industry }));
    setSelectedCompanyId(company.id);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.contact_name.trim() || !form.company.trim()) return;
    setSaving(true);
    try {
      await aploraApi.createProspect({
        contact_name: form.contact_name.trim(), company: form.company.trim(),
        title: form.title.trim() || undefined, email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined, website: form.website.trim() || undefined,
        product_interest: form.product_interest || undefined,
        deal_value: form.deal_value ? parseFloat(form.deal_value) : undefined,
        deal_type: form.deal_type, source: form.source.trim() || undefined,
        industry: form.industry.trim() || undefined, next_step: form.next_step.trim() || undefined,
        owner: form.owner || undefined, company_id: selectedCompanyId || undefined,
      });
      onCreated();
    } finally { setSaving(false); }
  };

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "company") setSelectedCompanyId(null);
  };

  const inputClass = "w-full px-3 py-2 bg-bg-input border border-border-default rounded-lg text-sm text-text-primary focus:outline-none focus:border-brand-blue/50 placeholder:text-text-muted";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="glass p-0 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-default">
          <h3 className="font-semibold text-text-primary">Add Prospect</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-bg-card-hover transition-colors text-text-muted">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-muted block mb-1">Contact Name *</label>
              <input type="text" value={form.contact_name} onChange={(e) => update("contact_name", e.target.value)} placeholder="Tony Romero" required className={inputClass} />
            </div>
            <div className="relative">
              <label className="text-xs text-text-muted block mb-1">Company *</label>
              <input ref={companyInputRef} type="text" value={form.company} onChange={(e) => update("company", e.target.value)} onFocus={() => companySuggestions.length > 0 && setShowSuggestions(true)} placeholder="Romero Auto Group" required className={inputClass} />
              {selectedCompanyId && <Building2 size={12} className="absolute right-3 top-[30px] text-brand-blue" />}
              {showSuggestions && companySuggestions.length > 0 && (
                <div ref={suggestionsRef} className="absolute z-50 top-full mt-1 left-0 right-0 glass p-0 max-h-40 overflow-y-auto">
                  {companySuggestions.map((c) => (
                    <button key={c.id} type="button" onClick={() => selectCompany(c)} className="w-full text-left px-3 py-2 text-sm hover:bg-bg-card-hover transition-colors flex items-center gap-2">
                      <Building2 size={12} className="text-text-muted flex-shrink-0" />
                      <span className="truncate text-text-primary">{c.name}</span>
                      {c.industry && <span className="text-[10px] text-text-muted ml-auto flex-shrink-0">{c.industry}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs text-text-muted block mb-1">Owner</label>
            <div className="flex gap-2">
              {TEAM.map((name) => (
                <button key={name} type="button" onClick={() => update("owner", form.owner === name ? "" : name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${form.owner === name ? "bg-brand-blue text-white" : "bg-bg-subtle text-text-muted hover:text-text-primary border border-border-default"}`}>
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-text-muted block mb-1">Title</label><input type="text" value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="VP Marketing" className={inputClass} /></div>
            <div><label className="text-xs text-text-muted block mb-1">Email</label><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="tony@romeroauto.com" className={inputClass} /></div>
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
              <input type="number" value={form.deal_value} onChange={(e) => update("deal_value", e.target.value)} placeholder={form.deal_type === "retainer" ? "2450" : "75000"} className={inputClass} />
              <div className="flex mt-1.5 bg-bg-subtle rounded-lg border border-border-default overflow-hidden">
                <button type="button" onClick={() => update("deal_type", "one_time")} className={`flex-1 px-2 py-1.5 text-xs font-medium transition-colors ${form.deal_type === "one_time" ? "bg-brand-blue text-white" : "text-text-muted hover:text-text-primary"}`}>One-time</button>
                <button type="button" onClick={() => update("deal_type", "retainer")} className={`flex-1 px-2 py-1.5 text-xs font-medium transition-colors ${form.deal_type === "retainer" ? "bg-brand-green text-black" : "text-text-muted hover:text-text-primary"}`}>Monthly</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-text-muted block mb-1">Source</label><input type="text" value={form.source} onChange={(e) => update("source", e.target.value)} placeholder="Referral, Cold outreach..." className={inputClass} /></div>
            <div><label className="text-xs text-text-muted block mb-1">LinkedIn Profile</label><input type="text" value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="linkedin.com/in/username" className={inputClass} /></div>
          </div>

          <div><label className="text-xs text-text-muted block mb-1">Next Step</label><input type="text" value={form.next_step} onChange={(e) => update("next_step", e.target.value)} placeholder="Schedule discovery call for Tuesday" className={inputClass} /></div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-text-muted hover:text-text-primary transition-colors">Cancel</button>
            <button type="submit" disabled={saving || !form.contact_name.trim() || !form.company.trim()} className="px-5 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-brand-blue/90 transition-colors disabled:opacity-50">
              {saving ? "Adding..." : "Add Prospect"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
