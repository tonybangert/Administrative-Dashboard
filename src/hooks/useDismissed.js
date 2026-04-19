import { useCallback, useState } from "react";

/**
 * UI-only "dismissed" state for items we cannot or do not want to mutate at
 * their source (Obsidian todos, Slack messages). Persists in localStorage so
 * the hidden state survives refreshes but does NOT touch Obsidian or Slack.
 *
 * For app-created notes (Supabase), use the existing `completed` column
 * instead — this hook is only for sources we treat as read-only.
 */
const STORAGE_KEY = "quick-actions-dismissed-v1";

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function persist(next) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  } catch {
    // localStorage quota/disabled — fail silently, in-memory state still works
  }
}

export function useDismissed() {
  const [dismissed, setDismissed] = useState(loadInitial);

  const dismiss = useCallback((id) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      persist(next);
      return next;
    });
  }, []);

  const undismiss = useCallback((id) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.delete(id);
      persist(next);
      return next;
    });
  }, []);

  return {
    isDismissed: (id) => dismissed.has(id),
    dismiss,
    undismiss,
    count: dismissed.size,
  };
}
