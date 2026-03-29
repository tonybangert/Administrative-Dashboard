import { useState, useEffect } from "react";
import { X } from "lucide-react";

const STAGES = ["Discovery", "Proposal Sent", "Negotiation", "Closed Won", "Closed Lost"];

export default function AddProspectModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", stage: "Discovery", value: "", next_step: "" });
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onAdd(form);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
         onClick={onClose}>
      <div className="glass p-8 w-full max-w-lg animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-text-primary">Add Prospect</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors cursor-pointer bg-transparent border-none">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5 font-medium">Company Name</label>
            <input value={form.name} onChange={set("name")} required autoFocus
                   className="w-full px-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary text-sm
                              outline-none transition-all duration-200 focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(52,211,153,0.1)]
                              placeholder:text-text-muted"
                   placeholder="e.g. Acme Corp" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1.5 font-medium">Stage</label>
              <select value={form.stage} onChange={set("stage")}
                      className="w-full px-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary text-sm
                                 outline-none transition-all duration-200 focus:border-brand-green">
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1.5 font-medium">Value</label>
              <input value={form.value} onChange={set("value")}
                     className="w-full px-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary text-sm
                                outline-none transition-all duration-200 focus:border-brand-green placeholder:text-text-muted"
                     placeholder="$5K/mo" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5 font-medium">Next Step</label>
            <input value={form.next_step} onChange={set("next_step")}
                   className="w-full px-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary text-sm
                              outline-none transition-all duration-200 focus:border-brand-green placeholder:text-text-muted"
                   placeholder="e.g. Schedule FDE walkthrough" />
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose}
                    className="flex-1 py-3 border border-border-default rounded-xl text-sm text-text-secondary font-medium
                               transition-all duration-200 hover:border-text-muted cursor-pointer bg-transparent">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
                    className="flex-1 py-3 bg-brand-green text-black font-bold rounded-xl text-sm
                               transition-all duration-200 hover:brightness-110 hover:shadow-[0_4px_20px_rgba(52,211,153,0.2)]
                               disabled:opacity-50 cursor-pointer active:scale-[0.98]">
              {submitting ? "Adding..." : "Add Prospect"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
