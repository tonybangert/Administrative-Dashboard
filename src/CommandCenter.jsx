import { useEffect, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Keyboard } from "lucide-react";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import HeroHeader from "./components/HeroHeader.jsx";
import ProspectBar from "./components/ProspectBar.jsx";
import QuickActions from "./components/QuickActions.jsx";
import SlackSync from "./components/SlackSync.jsx";
import ZoomNotes from "./components/ZoomNotes.jsx";
import WeeklyCalendar from "./components/WeeklyCalendar.jsx";
import { useToast } from "./components/Toast.jsx";

const SHORTCUTS = [
  { key: "R", label: "Refresh all" },
  { key: "N", label: "New prospect" },
  { key: "?", label: "Toggle shortcuts" },
  { key: "Esc", label: "Close modal" },
];

function getShortcutAction(e) {
  if (e.metaKey || e.ctrlKey || e.altKey) return null;

  const key = e.key.toLowerCase();
  switch (key) {
    case "r": return "refresh";
    case "n": return "new-prospect";
    case "?": return "toggle-hints";
    case "escape": return "escape";
    default: return null;
  }
}

export default function CommandCenter({ onSignOut }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showProspectModal, setShowProspectModal] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const handleKeyboard = useCallback((e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;

    const action = getShortcutAction(e);
    if (!action) return;

    e.preventDefault();
    switch (action) {
      case "refresh":
        queryClient.invalidateQueries();
        toast?.("All sections refreshed");
        break;
      case "new-prospect":
        setShowProspectModal(true);
        break;
      case "toggle-hints":
        setShowShortcuts(prev => !prev);
        break;
      case "escape":
        setShowShortcuts(false);
        setShowProspectModal(false);
        break;
    }
  }, [queryClient, toast]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [handleKeyboard]);

  return (
    <div className="min-h-screen bg-bg-primary">
      <HeroHeader onSignOut={onSignOut} />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 pt-7 pb-12">
        <ErrorBoundary section="Prospects">
          <ProspectBar externalShowModal={showProspectModal} onModalClosed={() => setShowProspectModal(false)} />
        </ErrorBoundary>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 mt-5">
          <ErrorBoundary section="Quick Actions">
            <QuickActions />
          </ErrorBoundary>
          <ErrorBoundary section="Slack">
            <SlackSync />
          </ErrorBoundary>
        </div>

        <div className="mt-5">
          <ErrorBoundary section="Zoom Notes">
            <ZoomNotes />
          </ErrorBoundary>
        </div>

        <div className="mt-5">
          <ErrorBoundary section="Calendar">
            <WeeklyCalendar />
          </ErrorBoundary>
        </div>

        <div className="text-center pt-9 pb-3 text-xs text-text-muted tracking-wide uppercase">
          PerformanceLabs.AI Command Center
        </div>
      </div>

      {/* Keyboard shortcut hints */}
      <button
        onClick={() => setShowShortcuts(prev => !prev)}
        className="fixed bottom-5 right-5 z-40 w-9 h-9 rounded-xl bg-bg-card border border-border-default
                   flex items-center justify-center cursor-pointer backdrop-blur-xl
                   transition-all duration-200 hover:border-brand-amber hover:bg-bg-card-hover"
        title="Keyboard shortcuts (?)"
      >
        <Keyboard size={15} className="text-text-muted" />
      </button>

      {showShortcuts && (
        <div className="fixed bottom-16 right-5 z-50 glass p-4 animate-fade-in-up min-w-[200px]">
          <div className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-3">Shortcuts</div>
          <div className="flex flex-col gap-2">
            {SHORTCUTS.map(s => (
              <div key={s.key} className="flex items-center justify-between gap-6">
                <span className="text-[13px] text-text-secondary">{s.label}</span>
                <kbd className="text-[11px] font-mono font-bold text-brand-amber bg-brand-amber-dim px-2 py-0.5 rounded-md min-w-[28px] text-center">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
