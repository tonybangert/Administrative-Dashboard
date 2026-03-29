import { useState, useEffect } from "react";
import { TrendingUp, Plus, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase.js";
import { useProspects } from "../hooks/useProspects.js";
import { useToast } from "./Toast.jsx";
import AddProspectModal from "./AddProspectModal.jsx";

const SEED_PROSPECTS = [
  { id: "seed-1", name: "Mid-Market Fintech Co.", stage: "Proposal Sent", value: "$5K/mo", next_step: "Follow up Monday", last_activity: "2026-03-27" },
  { id: "seed-2", name: "Marketing Services Firm", stage: "Discovery", value: "$8K/mo", next_step: "Schedule FDE walkthrough", last_activity: "2026-03-26" },
];

export default function ProspectBar({ externalShowModal, onModalClosed }) {
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();
  const { prospects, isLoading, addProspect, deleteProspect } = useProspects();

  useEffect(() => {
    if (externalShowModal) {
      setShowModal(true);
      onModalClosed?.();
    }
  }, [externalShowModal, onModalClosed]);

  const displayProspects = supabase && prospects.length > 0 ? prospects : (isLoading ? [] : SEED_PROSPECTS);

  const handleAdd = async (form) => {
    try {
      await addProspect.mutateAsync(form);
      toast?.("Prospect added");
    } catch {
      toast?.("Failed to add prospect", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!supabase) return;
    try {
      await deleteProspect.mutateAsync(id);
      toast?.("Prospect removed");
    } catch {
      toast?.("Failed to delete", "error");
    }
  };

  return (
    <>
      <div className="glass animate-fade-in-up stagger-1">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-4 sm:px-6 py-4 border-b border-border-default">
          <TrendingUp size={18} className="text-brand-green" />
          <span className="text-[15px] font-semibold text-brand-green">Prospects</span>
          <span className="text-xs font-bold bg-brand-green text-black px-2.5 py-0.5 rounded-[10px]">{displayProspects.length}</span>
          <div className="flex-1" />
          <button onClick={() => setShowModal(true)}
                  className="flex items-center gap-1.5 text-xs text-brand-green bg-brand-green-dim px-3 py-1.5 rounded-[20px]
                             cursor-pointer border-none transition-all duration-200 hover:bg-brand-green/20 font-semibold">
            <Plus size={12} /> Add
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => <div key={i} className="h-[120px] rounded-[14px] bg-white/3 animate-pulse-skeleton" />)}
          </div>
        )}

        {/* Cards grid */}
        {!isLoading && (
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayProspects.map((p) => (
                <div key={p.id}
                     className="group relative p-5 bg-bg-subtle rounded-[14px] border border-border-default
                                transition-all duration-250 ease-out overflow-hidden
                                hover:border-brand-green/25 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(52,211,153,0.06)]">
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-brand-green to-transparent" />
                  <div className="flex justify-between mb-2.5">
                    <span className="text-base sm:text-[17px] font-semibold text-text-primary">{p.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold bg-brand-amber-dim text-brand-amber px-2.5 py-1 rounded-md uppercase tracking-wide">{p.stage}</span>
                      {supabase && (
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                                className="sm:opacity-0 sm:group-hover:opacity-100 text-text-muted hover:text-brand-red transition-all duration-200 cursor-pointer bg-transparent border-none p-1">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 mb-2">
                    <span className="text-xl font-bold text-brand-green">{p.value}</span>
                    <span className="text-sm text-text-muted self-center">retainer</span>
                  </div>
                  <div className="text-sm text-text-secondary"><b className="font-semibold">Next:</b> {p.next_step}</div>
                </div>
              ))}

              {/* Add prospect placeholder */}
              <div onClick={() => setShowModal(true)}
                   className="p-5 rounded-[14px] border border-dashed border-white/10 flex items-center justify-center cursor-pointer
                              transition-all duration-200 hover:border-brand-amber hover:bg-brand-amber/3 min-h-[120px]">
                <Plus size={20} className="text-text-muted" />
                <span className="text-[15px] text-text-muted ml-2 font-medium">Add Prospect</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && <AddProspectModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
    </>
  );
}
