import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft, Brain, Send, Phone, Mail, Linkedin, Sparkles, ChevronDown, Loader2,
  Trash2, Pencil, TrendingUp, Target, Cpu, MessageCircle, ExternalLink,
  Zap, AlertTriangle, Users, Globe, CheckCircle2, ArrowRight,
} from "lucide-react";
import { aploraApi } from "../../services/aploraApi.js";
import SignalFeed from "./SignalFeed.jsx";
import EditProspectForm from "./EditProspectForm.jsx";
import DealValuationEditor from "./DealValuationEditor.jsx";
import ActionPanel from "./ActionPanel.jsx";
import OwnershipBadge from "./OwnershipBadge.jsx";

const STAGES = ["lead", "discovery", "proposal", "negotiation", "won", "lost"];
const STAGE_COLORS = {
  lead: "#6B7280", discovery: "#3B82F6", proposal: "#8B5CF6",
  negotiation: "#F59E0B", won: "#10B981", lost: "#EF4444",
};

export default function ProspectDetail({ prospectId, onBack, onDeleted }) {
  const [prospect, setProspect] = useState(null);
  const [signals, setSignals] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [researching, setResearching] = useState(false);
  const [research, setResearch] = useState(null);
  const [showStageMenu, setShowStageMenu] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [researchError, setResearchError] = useState(null);
  const [markingContacted, setMarkingContacted] = useState(false);

  const load = useCallback(async () => {
    const [p, s] = await Promise.all([aploraApi.getProspect(prospectId), aploraApi.listSignals(prospectId)]);
    setProspect(p);
    setSignals(s);
  }, [prospectId]);

  useEffect(() => { load(); }, [load]);

  const handleStageChange = async (stage) => {
    if (!prospect) return;
    await aploraApi.updateProspect(prospect.id, { stage });
    setShowStageMenu(false);
    load();
  };

  const handleAddNote = async () => {
    if (!noteText.trim() || !prospect) return;
    await aploraApi.createSignal({ prospect_id: prospect.id, signal_type: "note", content: noteText.trim() });
    setNoteText("");
    load();
  };

  const handleResearch = async () => {
    if (!prospect) return;
    setResearching(true); setResearchError(null);
    try { const result = await aploraApi.runResearch(prospect.id); setResearch(result); load(); }
    catch (err) { setResearchError(err instanceof Error ? err.message : "Research failed. Try again."); }
    finally { setResearching(false); }
  };

  const handleDelete = async () => {
    if (!prospect || !confirm(`Delete ${prospect.company}? This cannot be undone.`)) return;
    await aploraApi.deleteProspect(prospect.id);
    onDeleted();
  };

  const handleMarkContacted = async () => {
    if (!prospect) return;
    setMarkingContacted(true);
    try { await aploraApi.markContacted(prospect.id); load(); }
    finally { setMarkingContacted(false); }
  };

  if (!prospect) {
    return (
      <div className="flex items-center justify-center h-64 text-text-muted">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
          <span className="text-sm">Loading prospect...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-bg-card-hover transition-colors text-text-muted">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold truncate text-text-primary">{prospect.company}</h2>
            {prospect.contacted
              ? <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-brand-green-dim text-brand-green rounded"><CheckCircle2 size={12} />Contacted</span>
              : <span className="text-xs px-2 py-0.5 bg-brand-blue-dim text-brand-blue rounded">Needs outreach</span>}
          </div>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span>{prospect.contact_name}{prospect.title ? ` · ${prospect.title}` : ""}</span>
            <OwnershipBadge owner={prospect.owner} size="md" />
          </div>
        </div>
        {!prospect.contacted && prospect.stage !== "won" && prospect.stage !== "lost" && (
          <button onClick={handleMarkContacted} disabled={markingContacted} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-green-dim text-brand-green hover:bg-brand-green/20 transition-colors text-sm disabled:opacity-50">
            <CheckCircle2 size={14} /> {markingContacted ? "Saving..." : "Mark Contacted"}
          </button>
        )}
        <button onClick={() => setShowEditForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-text-muted hover:text-brand-blue hover:bg-brand-blue-dim transition-colors text-sm">
          <Pencil size={14} /> Edit
        </button>
        <button onClick={handleDelete} className="p-2 rounded-lg text-text-muted hover:text-brand-red hover:bg-brand-red-dim transition-colors" title="Delete prospect">
          <Trash2 size={16} />
        </button>
      </div>

      {/* Recommended Action Banner */}
      {prospect.recommended_action && prospect.stage !== "won" && prospect.stage !== "lost" && (
        <div className="flex items-center gap-3 px-4 py-3 bg-brand-amber/10 border border-brand-amber/20 rounded-lg">
          <ArrowRight size={18} className="text-brand-amber flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-medium text-brand-amber">Recommended Action</div>
            <div className="text-sm text-text-primary">{prospect.recommended_action}</div>
            {prospect.urgency_reason && <div className="text-xs text-text-muted mt-0.5">{prospect.urgency_reason}</div>}
          </div>
        </div>
      )}

      {/* Quick info cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="relative">
          <button onClick={() => setShowStageMenu(!showStageMenu)} className="w-full p-3 bg-bg-card rounded-lg border border-border-default hover:border-brand-blue/50 transition-colors text-left">
            <div className="text-xs text-text-muted mb-1">Stage</div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STAGE_COLORS[prospect.stage] }} />
              <span className="font-medium capitalize text-text-primary">{prospect.stage}</span>
              <ChevronDown size={12} className="ml-auto text-text-muted" />
            </div>
          </button>
          {showStageMenu && (
            <div className="absolute top-full left-0 mt-1 w-full glass p-0 shadow-xl z-10">
              {STAGES.map((s) => (
                <button key={s} onClick={() => handleStageChange(s)} className={`w-full text-left px-3 py-2 text-sm hover:bg-bg-card-hover transition-colors capitalize flex items-center gap-2 ${s === prospect.stage ? "text-brand-blue" : "text-text-primary"}`}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STAGE_COLORS[s] }} />{s}
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setShowEditForm(true)} className="p-3 bg-bg-card rounded-lg border border-border-default hover:border-brand-blue/50 transition-colors text-left group">
          <div className="text-xs text-text-muted mb-1 flex items-center justify-between">Deal Value<Pencil size={10} className="opacity-0 group-hover:opacity-100 text-brand-blue transition-opacity" /></div>
          <div className={`font-medium ${prospect.deal_type === "retainer" ? "text-brand-green" : "text-brand-green"}`}>
            {prospect.deal_value ? `$${prospect.deal_value.toLocaleString()}` : "--"}{prospect.deal_value && prospect.deal_type === "retainer" && <span className="text-xs font-normal text-brand-green">/mo</span>}
          </div>
          {prospect.deal_value && prospect.deal_type === "retainer" && <div className="text-[10px] text-text-muted mt-0.5">${(prospect.deal_value * 12).toLocaleString()} ARR</div>}
        </button>
        <button onClick={() => setShowEditForm(true)} className="p-3 bg-bg-card rounded-lg border border-border-default hover:border-brand-blue/50 transition-colors text-left group">
          <div className="text-xs text-text-muted mb-1 flex items-center justify-between">Product<Pencil size={10} className="opacity-0 group-hover:opacity-100 text-brand-blue transition-opacity" /></div>
          <div className="font-medium truncate text-text-primary">{prospect.product_interest || "--"}</div>
        </button>
        <button onClick={() => setShowEditForm(true)} className="p-3 bg-bg-card rounded-lg border border-border-default hover:border-brand-blue/50 transition-colors text-left group">
          <div className="text-xs text-text-muted mb-1 flex items-center justify-between">Lead Source<Pencil size={10} className="opacity-0 group-hover:opacity-100 text-brand-blue transition-opacity" /></div>
          <div className="font-medium truncate text-text-primary">{prospect.source || "--"}</div>
        </button>
      </div>

      {/* Contact row */}
      <div className="flex flex-wrap gap-3">
        {prospect.email && <a href={`mailto:${prospect.email}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-card rounded-lg border border-border-default text-sm hover:border-brand-blue/50 transition-colors text-text-primary"><Mail size={14} className="text-text-muted" />{prospect.email}</a>}
        {prospect.phone && <a href={`tel:${prospect.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-card rounded-lg border border-border-default text-sm hover:border-brand-blue/50 transition-colors text-text-primary"><Phone size={14} className="text-text-muted" />{prospect.phone}</a>}
        {prospect.website && <a href={prospect.website.startsWith("http") ? prospect.website : `https://${prospect.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-card rounded-lg border border-border-default text-sm hover:border-brand-blue/50 transition-colors text-text-primary"><Linkedin size={14} className="text-text-muted" />LinkedIn</a>}
      </div>

      {/* AI Research section */}
      <div className="bg-bg-card rounded-lg border border-border-default">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
          <div className="flex items-center gap-2">
            <Brain size={16} className="text-brand-purple" />
            <span className="font-medium text-sm text-text-primary">AI Intelligence</span>
            {research?.web_search_successful && <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-brand-green-dim text-brand-green rounded"><Globe size={10} />Live Web Data</span>}
            {research?.deal_priority && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${research.deal_priority === "high" ? "bg-brand-green-dim text-brand-green" : research.deal_priority === "medium" ? "bg-brand-amber-dim text-brand-amber" : "bg-bg-subtle text-text-muted"}`}>
                {research.deal_priority.toUpperCase()} PRIORITY
              </span>
            )}
          </div>
          <button onClick={handleResearch} disabled={researching} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-purple-dim text-brand-purple rounded-lg text-sm hover:bg-brand-purple/20 transition-colors disabled:opacity-50">
            {researching ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {researching ? "Searching web..." : "Research Company"}
          </button>
        </div>

        <div className="p-4 space-y-4">
          {research ? (
            <>
              {research.company_summary && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1"><Users size={12} />Company Overview{research.estimated_company_size && <span className="ml-1 px-1.5 py-0.5 bg-bg-subtle rounded text-[10px]">{research.estimated_company_size}</span>}</div>
                  <div className="text-sm text-text-secondary">{research.company_summary}</div>
                </div>
              )}
              {research.recent_developments && (
                <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-brand-blue mb-1"><TrendingUp size={12} />Recent Developments</div>
                  <div className="text-sm text-text-secondary">{research.recent_developments}</div>
                </div>
              )}
              {research.competitive_position && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1"><Target size={12} />Competitive Position</div>
                  <div className="text-sm text-text-secondary">{research.competitive_position}</div>
                </div>
              )}
              {research.tech_assessment && (
                <div className="bg-bg-subtle rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-brand-purple mb-2"><Cpu size={12} />Technology Assessment</div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="text-text-muted mb-0.5">AI Readiness</div>
                      <span className={`font-medium ${research.tech_assessment.ai_readiness === "high" ? "text-brand-green" : research.tech_assessment.ai_readiness === "medium" ? "text-brand-amber" : "text-text-muted"}`}>
                        {research.tech_assessment.ai_readiness?.toUpperCase() || "Unknown"}
                      </span>
                    </div>
                    <div className="col-span-2"><div className="text-text-muted mb-0.5">Current Stack</div><div className="text-text-primary">{research.tech_assessment.current_stack || "Unknown"}</div></div>
                  </div>
                  {research.tech_assessment.digital_maturity && <div className="mt-2 text-xs"><span className="text-text-muted">Maturity: </span>{research.tech_assessment.digital_maturity}</div>}
                </div>
              )}
              {research.company_strategy && <div><div className="text-xs text-text-muted mb-1">Strategy & Priorities</div><div className="text-sm text-text-secondary">{research.company_strategy}</div></div>}
              {research.outreach_hooks?.length > 0 && (
                <div className="bg-brand-green/5 border border-brand-green/20 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-brand-green mb-2"><Zap size={12} />Outreach Hooks (use these to open conversations)</div>
                  <ul className="space-y-1.5">{research.outreach_hooks.map((hook, i) => <li key={i} className="text-sm flex gap-2 text-text-secondary"><span className="text-brand-green font-bold">{i + 1}.</span>{hook}</li>)}</ul>
                </div>
              )}
              {research.pitch_angles?.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1"><MessageCircle size={12} />Pitch Angles</div>
                  <ul className="space-y-1">{research.pitch_angles.map((a, i) => <li key={i} className="text-sm flex gap-2 text-text-secondary"><span className="text-brand-blue">-</span>{a}</li>)}</ul>
                </div>
              )}
              {research.key_questions?.length > 0 && (
                <div>
                  <div className="text-xs text-text-muted mb-1">Discovery Questions</div>
                  <ul className="space-y-1">{research.key_questions.map((q, i) => <li key={i} className="text-sm flex gap-2 text-text-secondary"><span className="text-brand-amber">?</span>{q}</li>)}</ul>
                </div>
              )}
              {research.risk_factors?.length > 0 && (
                <div className="bg-brand-red/5 border border-brand-red/20 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-brand-red mb-1"><AlertTriangle size={12} />Risk Factors</div>
                  <ul className="space-y-1">{research.risk_factors.map((r, i) => <li key={i} className="text-sm flex gap-2 text-text-secondary"><span className="text-brand-red">!</span>{r}</li>)}</ul>
                </div>
              )}
              {research.contact_intel && <div><div className="text-xs text-text-muted mb-1">Contact Intelligence</div><div className="text-sm text-text-secondary">{research.contact_intel}</div></div>}
              {research.sources?.length > 0 && (
                <div className="border-t border-border-default pt-3">
                  <div className="flex items-center gap-1.5 text-xs text-text-muted mb-2"><ExternalLink size={12} />Sources ({research.sources.length})</div>
                  <div className="flex flex-wrap gap-1.5">
                    {research.sources.slice(0, 8).map((url, i) => {
                      let domain = url;
                      try { domain = new URL(url).hostname.replace("www.", ""); } catch {}
                      return <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 bg-bg-subtle rounded hover:bg-brand-blue-dim hover:text-brand-blue transition-colors truncate max-w-[150px]" title={url}>{domain}</a>;
                    })}
                    {research.sources.length > 8 && <span className="text-[10px] px-2 py-1 text-text-muted">+{research.sources.length - 8} more</span>}
                  </div>
                </div>
              )}
            </>
          ) : prospect.company_summary ? (
            <div>
              <div className="text-xs text-text-muted mb-1">Company</div>
              <div className="text-sm text-text-secondary">{prospect.company_summary}</div>
              {prospect.company_strategy && <><div className="text-xs text-text-muted mb-1 mt-2">Strategy</div><div className="text-sm text-text-secondary">{prospect.company_strategy}</div></>}
              <button onClick={handleResearch} disabled={researching} className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-brand-purple/10 text-brand-purple rounded-lg text-xs hover:bg-brand-purple/20 transition-colors"><Sparkles size={12} />Run deeper research with live web data</button>
            </div>
          ) : (
            <button onClick={handleResearch} disabled={researching} className="w-full py-6 flex flex-col items-center gap-2 rounded-lg border border-dashed border-brand-purple/30 hover:border-brand-purple/60 hover:bg-brand-purple/5 transition-colors group">
              <Sparkles size={24} className="text-brand-purple group-hover:text-brand-purple/80" />
              <div className="text-sm font-medium text-brand-purple">Run AI Research on {prospect.company}</div>
              <div className="text-xs text-text-muted max-w-sm text-center">Searches the web for real-time intel: recent news, competitors, tech stack, and generates pitch angles, discovery questions, and outreach hooks</div>
            </button>
          )}
          {researchError && <div className="text-sm text-brand-red bg-brand-red-dim border border-brand-red/20 rounded-lg px-3 py-2">{researchError}</div>}
        </div>
      </div>

      {/* Next step */}
      {prospect.next_step && (
        <div className="px-4 py-3 bg-brand-blue/10 border border-brand-blue/20 rounded-lg">
          <div className="text-xs text-brand-blue mb-1">Next Step</div>
          <div className="text-sm text-text-primary">{prospect.next_step}</div>
        </div>
      )}

      {/* Deal Valuation */}
      <DealValuationEditor prospectId={prospectId} />

      {/* Deal Actions */}
      <ActionPanel prospectId={prospectId} />

      {/* Add note */}
      <div className="flex gap-2">
        <input type="text" value={noteText} onChange={(e) => setNoteText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
          placeholder="Add a note, log a call, anything..." className="flex-1 px-4 py-2.5 bg-bg-card border border-border-default rounded-lg text-sm text-text-primary focus:outline-none focus:border-brand-blue/50 placeholder:text-text-muted" />
        <button onClick={handleAddNote} disabled={!noteText.trim()} className="px-4 py-2.5 bg-brand-blue text-white rounded-lg text-sm hover:bg-brand-blue/90 transition-colors disabled:opacity-50">
          <Send size={16} />
        </button>
      </div>

      {/* Signal feed */}
      <SignalFeed signals={signals} onActionUpdate={load} />

      {/* Edit modal */}
      {showEditForm && <EditProspectForm prospect={prospect} onClose={() => setShowEditForm(false)} onUpdated={() => { setShowEditForm(false); load(); }} />}
    </div>
  );
}
