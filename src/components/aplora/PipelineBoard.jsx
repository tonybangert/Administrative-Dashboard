import { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  CircleDot, Search, Handshake, FileText, Trophy, XCircle,
  DollarSign, GripVertical, Brain, Sparkles, Mail, Copy, Zap, Repeat,
} from "lucide-react";
import OwnershipBadge from "./OwnershipBadge.jsx";

const STAGES = [
  { key: "lead", label: "Leads", icon: CircleDot, color: "#6B7280" },
  { key: "discovery", label: "Discovery", icon: Search, color: "#3B82F6" },
  { key: "proposal", label: "Proposal", icon: FileText, color: "#8B5CF6" },
  { key: "negotiation", label: "Negotiation", icon: Handshake, color: "#F59E0B" },
  { key: "won", label: "Won", icon: Trophy, color: "#10B981" },
  { key: "lost", label: "Lost", icon: XCircle, color: "#EF4444" },
];

function formatCurrency(value) {
  if (!value) return "--";
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function getInitials(name) {
  if (!name) return "";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function ProspectCard({ prospect: p, isMobile, onSelect, dragHandleProps, isDragging }) {
  return (
    <div
      className={`w-full text-left rounded-md border transition-colors ${
        isMobile ? "p-4" : "p-3"
      } ${
        isDragging
          ? "border-brand-blue shadow-lg shadow-brand-blue/10 bg-bg-card"
          : !p.contacted
          ? "border-l-2 border-l-brand-blue border-t-border-default border-r-border-default border-b-border-default hover:border-brand-blue/50 bg-bg-subtle"
          : "border-border-default hover:border-brand-blue/50 bg-bg-subtle"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          {...dragHandleProps}
          className={`flex-shrink-0 mt-0.5 text-text-muted hover:text-text-primary cursor-grab active:cursor-grabbing ${
            isMobile ? "p-1 -m-1" : ""
          }`}
        >
          <GripVertical size={isMobile ? 16 : 12} />
        </div>
        <div className="min-w-0 flex-1 cursor-pointer" onClick={onSelect}>
          <div className="flex items-center gap-1.5">
            <span className={`font-medium truncate ${isMobile ? "text-base" : "text-sm"}`}>
              {p.company}
            </span>
            {p.owner && !isMobile && (
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-blue/20 text-[9px] text-brand-blue font-medium flex items-center justify-center"
                title={p.owner}
              >
                {getInitials(p.owner)}
              </span>
            )}
          </div>
          <div className="text-xs text-text-muted truncate">
            {p.contact_name}
            {!isMobile && p.title ? ` · ${p.title}` : ""}
          </div>
          {!isMobile && p.email && (
            <div className="flex items-center gap-1 mt-1 text-xs text-text-muted">
              <Mail size={10} className="flex-shrink-0" />
              <span className="truncate">{p.email}</span>
              <button
                onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(p.email); }}
                className="flex-shrink-0 p-0.5 rounded hover:bg-bg-card hover:text-brand-blue transition-colors"
                title="Copy email"
              >
                <Copy size={10} />
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          {p.deal_value && (
            <span className={`text-xs font-medium whitespace-nowrap ${p.deal_type === "retainer" ? "text-brand-green" : "text-brand-green"}`}>
              {formatCurrency(p.deal_value)}{p.deal_type === "retainer" ? "/mo" : ""}
            </span>
          )}
          {!isMobile && p.monthly_recurring > 0 && (
            <span className="flex items-center gap-0.5 text-[9px] text-brand-green bg-brand-green-dim rounded px-1 py-0.5">
              <Repeat size={8} />
              {formatCurrency(p.monthly_recurring)}/mo
            </span>
          )}
        </div>
      </div>

      {!isMobile && p.product_interest && (
        <div className="mt-1.5 text-xs text-brand-blue truncate cursor-pointer" onClick={onSelect}>
          {p.product_interest}
        </div>
      )}

      {!isMobile && !p.contacted && p.stage !== "won" && p.stage !== "lost" && (
        <div
          className="mt-2 flex items-center justify-center w-6 h-6 text-brand-amber bg-brand-amber-dim rounded cursor-pointer hover:bg-brand-amber/20 transition-colors"
          onClick={onSelect}
          title="Needs outreach"
        >
          <Mail size={12} />
        </div>
      )}

      {!isMobile && (
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            <div
              className={`flex items-center gap-1 text-[10px] cursor-pointer rounded px-1 py-0.5 transition-colors ${
                p.company_summary
                  ? "text-brand-purple bg-brand-purple-dim"
                  : "text-text-muted hover:text-brand-purple hover:bg-brand-purple-dim"
              }`}
              onClick={onSelect}
              title={p.company_summary ? "AI research available" : "Run AI research"}
            >
              {p.company_summary ? <Brain size={10} /> : <Sparkles size={10} />}
              <span>{p.company_summary ? "AI Intel" : "Research"}</span>
            </div>
            {p.pending_action_count > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-brand-amber bg-brand-amber-dim rounded px-1 py-0.5" title={`${p.pending_action_count} pending actions`}>
                <Zap size={9} />
                {p.pending_action_count}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
            <OwnershipBadge owner={p.owner} size="sm" />
            {p.signal_count > 0 && (
              <span className="flex items-center gap-0.5">
                <Mail size={10} />
                {p.signal_count}
              </span>
            )}
            <span>{timeAgo(p.updated_at)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PipelineBoard({ pipeline, onSelectProspect, onMoveProspect, isMobile = false }) {
  const [hideClosedStages, setHideClosedStages] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const visibleStages = hideClosedStages
    ? STAGES.filter((s) => s.key !== "won" && s.key !== "lost")
    : STAGES;

  useEffect(() => {
    if (!isMobile || !scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const columnWidth = container.offsetWidth * 0.88;
      const gap = 12;
      const index = Math.round(scrollLeft / (columnWidth + gap));
      setCurrentStageIndex(Math.max(0, Math.min(index, visibleStages.length - 1)));
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isMobile, visibleStages.length]);

  const scrollToStage = (index) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const columnWidth = container.offsetWidth * 0.88;
    const gap = 12;
    container.scrollTo({ left: index * (columnWidth + gap), behavior: "smooth" });
  };

  if (!pipeline) {
    return (
      <div className="flex items-center justify-center h-64 text-text-muted">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
          <span className="text-sm">Loading pipeline...</span>
        </div>
      </div>
    );
  }

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    const prospectId = parseInt(draggableId, 10);
    const newStage = destination.droppableId;
    onMoveProspect(prospectId, newStage);
  };

  return (
    <div className="space-y-4">
      {/* Pipeline stats bar */}
      <div className="flex items-center gap-6 px-4 py-3 bg-bg-subtle rounded-lg border border-border-default">
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-brand-blue" />
          <span className="text-sm text-text-muted">Pipeline</span>
          <span className="font-semibold text-text-primary">{formatCurrency(pipeline.pipeline_value)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-muted">Weighted</span>
          <span className="font-semibold text-brand-green">{formatCurrency(pipeline.weighted_pipeline_value)}</span>
        </div>
        <div className="ml-auto">
          <button
            onClick={() => setHideClosedStages(!hideClosedStages)}
            className="text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            {hideClosedStages ? "Show closed" : "Hide closed"}
          </button>
        </div>
      </div>

      {/* Kanban columns */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div
          ref={scrollContainerRef}
          className={`flex gap-3 overflow-x-auto pb-4 ${
            isMobile ? "snap-x scroll-smooth mobile-hide-scrollbar px-[6vw]" : ""
          }`}
          style={{ minHeight: "60vh" }}
        >
          {visibleStages.map((stage) => {
            const prospects = pipeline.stages[stage.key] || [];
            const total = pipeline.totals[stage.key] || { count: 0, value: 0 };
            const Icon = stage.icon;

            return (
              <div
                key={stage.key}
                className={`flex-shrink-0 rounded-lg border border-border-default flex flex-col overflow-hidden ${
                  isMobile ? "w-[88vw] snap-center" : "w-72"
                }`}
                style={{
                  background: `linear-gradient(180deg, ${stage.color}15 0%, ${stage.color}08 30%, rgba(8, 15, 30, 0.95) 100%)`,
                }}
              >
                <div
                  className="flex items-center gap-2 px-3 py-2.5 border-b border-border-default/50"
                  style={{ background: `linear-gradient(90deg, ${stage.color}20 0%, transparent 100%)` }}
                >
                  <Icon size={14} style={{ color: stage.color }} />
                  <span className="text-sm font-medium text-text-primary">{stage.label}</span>
                  {total.weight > 0 && total.weight < 1 && (
                    <span className="text-[10px] text-text-muted">{Math.round(total.weight * 100)}%</span>
                  )}
                  <span className="ml-auto text-xs text-text-muted">{total.count}</span>
                  {total.value > 0 && (
                    <span className="text-xs" style={{ color: stage.color }}>
                      {formatCurrency(total.weighted_value || 0)}
                    </span>
                  )}
                </div>

                <Droppable droppableId={stage.key}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-2 space-y-2 flex-1 min-h-[100px] overflow-y-auto transition-colors ${
                        isMobile ? "max-h-[55vh]" : "max-h-[65vh]"
                      }`}
                      style={{ backgroundColor: snapshot.isDraggingOver ? `${stage.color}10` : "transparent" }}
                    >
                      {prospects.length === 0 && !snapshot.isDraggingOver && (
                        <div className="text-xs text-text-muted text-center py-8">No prospects</div>
                      )}
                      {[...prospects].sort((a, b) => {
                        if (!a.contacted && b.contacted) return -1;
                        if (a.contacted && !b.contacted) return 1;
                        const aValue = a.deal_value || 0;
                        const bValue = b.deal_value || 0;
                        if (bValue !== aValue) return bValue - aValue;
                        if (a.company_summary && !b.company_summary) return -1;
                        if (!a.company_summary && b.company_summary) return 1;
                        return 0;
                      }).map((p, index) => (
                        <Draggable key={p.id} draggableId={String(p.id)} index={index}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps}>
                              <ProspectCard
                                prospect={p}
                                isMobile={isMobile}
                                onSelect={() => onSelectProspect(p.id)}
                                dragHandleProps={provided.dragHandleProps ?? undefined}
                                isDragging={snapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {isMobile && (
        <div className="flex justify-center gap-2 pb-2">
          {visibleStages.map((stage, index) => (
            <button
              key={stage.key}
              onClick={() => scrollToStage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStageIndex ? "bg-brand-blue w-4" : "bg-text-muted/40"
              }`}
              aria-label={`Go to ${stage.label}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
