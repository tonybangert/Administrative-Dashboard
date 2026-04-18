import { useState, useEffect } from "react";
import { TrendingUp, Plus, RefreshCw } from "lucide-react";
import { useAloraPipeline } from "../../hooks/useAplora.js";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import { useToast } from "../Toast.jsx";
import PipelineBoard from "./PipelineBoard.jsx";
import ProspectDetail from "./ProspectDetail.jsx";
import AddProspectForm from "./AddProspectForm.jsx";

function formatCurrency(value) {
  if (!value) return "--";
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

export default function AloraSales({ externalShowModal, onModalClosed }) {
  const [view, setView] = useState("pipeline");
  const [selectedProspectId, setSelectedProspectId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { pipeline, isLoading, error, refetch, updateStage } = useAloraPipeline();
  const isMobile = useIsMobile();
  const toast = useToast();

  useEffect(() => {
    if (externalShowModal) {
      setShowAddForm(true);
      onModalClosed?.();
    }
  }, [externalShowModal, onModalClosed]);

  const handleSelectProspect = (id) => {
    setSelectedProspectId(id);
    setView("detail");
  };

  const handleBack = () => {
    setSelectedProspectId(null);
    setView("pipeline");
    refetch();
  };

  const handleMoveProspect = async (prospectId, newStage) => {
    try {
      await updateStage.mutateAsync({ id: prospectId, stage: newStage });
      toast?.(`Moved to ${newStage}`);
    } catch {
      toast?.("Failed to move prospect", "error");
    }
  };

  const handleCreated = () => {
    setShowAddForm(false);
    refetch();
    toast?.("Prospect added");
  };

  const handleDeleted = () => {
    setSelectedProspectId(null);
    setView("pipeline");
    refetch();
    toast?.("Prospect deleted");
  };

  return (
    <>
      <div className="glass animate-fade-in-up stagger-1">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-4 sm:px-6 py-4 border-b border-border-default">
          <TrendingUp size={18} className="text-brand-blue" />
          <span className="text-[15px] font-semibold text-brand-blue">Sales Pipeline</span>
          {pipeline && (
            <span className="text-xs font-bold bg-brand-green-dim text-brand-green px-2.5 py-0.5 rounded-[10px]">
              {formatCurrency(pipeline.pipeline_value)}
            </span>
          )}
          {view === "detail" && (
            <button onClick={handleBack} className="text-xs text-text-muted hover:text-text-primary transition-colors ml-1">
              ← Back to Pipeline
            </button>
          )}
          <div className="flex-1" />
          {view === "pipeline" && (
            <>
              <button onClick={() => setShowAddForm(true)}
                className="flex items-center gap-1.5 text-xs text-brand-blue bg-brand-blue-dim px-3 py-1.5 rounded-[20px] cursor-pointer border-none transition-all duration-200 hover:bg-brand-blue/20 font-semibold">
                <Plus size={12} /> Add
              </button>
              <button onClick={() => refetch()}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary px-2 py-1.5 rounded-[20px] transition-all duration-200 hover:bg-bg-card-hover cursor-pointer border-none">
                <RefreshCw size={12} />
              </button>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6" style={{ overflow: view === "pipeline" ? "visible" : "hidden" }}>
          {error && !pipeline ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="text-text-muted text-sm text-center">
                {error.message?.includes("502") || error.message?.includes("Failed to fetch")
                  ? "Connecting to sales backend... (cold start may take 30-60s)"
                  : "Failed to load pipeline"}
              </div>
              <button onClick={() => refetch()} className="text-xs text-brand-blue hover:text-brand-blue/80 transition-colors">
                Try again
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
                <span className="text-sm text-text-muted">Loading pipeline...</span>
              </div>
            </div>
          ) : view === "detail" && selectedProspectId ? (
            <ProspectDetail prospectId={selectedProspectId} onBack={handleBack} onDeleted={handleDeleted} />
          ) : (
            <PipelineBoard pipeline={pipeline} onSelectProspect={handleSelectProspect} onMoveProspect={handleMoveProspect} isMobile={isMobile} />
          )}
        </div>
      </div>

      {showAddForm && <AddProspectForm onClose={() => setShowAddForm(false)} onCreated={handleCreated} />}
    </>
  );
}
