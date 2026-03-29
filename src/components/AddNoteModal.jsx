import { useState, useEffect } from "react";
import { X } from "lucide-react";

const CATEGORIES = [
  { value: "client_todos", label: "Client To-Dos" },
  { value: "high_priority", label: "High Priority" },
  { value: "prospect_updates", label: "Prospect Updates" },
  { value: "meeting_notes", label: "Meeting Notes" },
  { value: "ideas", label: "Ideas" },
  { value: "links", label: "Links to Review" },
];

export default function AddNoteModal({ onClose, onAdd, defaultCategory }) {
  const [form, setForm] = useState({
    category: defaultCategory || "client_todos",
    text: "",
    tag: "",
    url: "",
  });
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
    const payload = { ...form };
    if (!payload.tag) delete payload.tag;
    if (!payload.url) delete payload.url;
    await onAdd(payload);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
         onClick={onClose}>
      <div className="glass p-5 sm:p-8 w-full max-w-lg animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-text-primary">Add Note</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors cursor-pointer bg-transparent border-none">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5 font-medium">Category</label>
            <select value={form.category} onChange={set("category")}
                    className="w-full px-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary text-sm
                               outline-none transition-all duration-200 focus:border-brand-amber">
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5 font-medium">Note</label>
            <textarea value={form.text} onChange={set("text")} required rows={3} autoFocus
                      className="w-full px-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary text-sm
                                 outline-none transition-all duration-200 focus:border-brand-amber focus:shadow-[0_0_0_3px_rgba(250,168,64,0.1)]
                                 placeholder:text-text-muted resize-none"
                      placeholder="What needs to be done?" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1.5 font-medium">Tag (optional)</label>
              <input value={form.tag} onChange={set("tag")}
                     className="w-full px-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary text-sm
                                outline-none transition-all duration-200 focus:border-brand-amber placeholder:text-text-muted"
                     placeholder="e.g. LNS, CRITICAL" />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1.5 font-medium">URL (optional)</label>
              <input value={form.url} onChange={set("url")} type="url"
                     className="w-full px-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary text-sm
                                outline-none transition-all duration-200 focus:border-brand-amber placeholder:text-text-muted"
                     placeholder="https://..." />
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose}
                    className="flex-1 py-3 border border-border-default rounded-xl text-sm text-text-secondary font-medium
                               transition-all duration-200 hover:border-text-muted cursor-pointer bg-transparent">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
                    className="flex-1 py-3 bg-brand-amber text-black font-bold rounded-xl text-sm
                               transition-all duration-200 hover:brightness-110 hover:shadow-[0_4px_20px_rgba(250,168,64,0.2)]
                               disabled:opacity-50 cursor-pointer active:scale-[0.98]">
              {submitting ? "Adding..." : "Add Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
