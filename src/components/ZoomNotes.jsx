import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Video, RefreshCw, ExternalLink } from "lucide-react";

async function fetchZoomNotes({ queryKey }) {
  const [, forceRefresh] = queryKey;
  const res = await fetch("/api/zoom-notes", { method: forceRefresh ? "POST" : "GET" });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.notes || [];
}

export default function ZoomNotes() {
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading, error } = useQuery({
    queryKey: ["zoom-notes", false],
    queryFn: fetchZoomNotes,
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const handleRefresh = () => {
    queryClient.fetchQuery({
      queryKey: ["zoom-notes", true],
      queryFn: fetchZoomNotes,
      staleTime: 0,
    }).then((freshNotes) => {
      queryClient.setQueryData(["zoom-notes", false], freshNotes);
    });
  };

  return (
    <div className="glass p-4 sm:p-6 animate-fade-in-up stagger-4">
      <div className="flex justify-between items-center mb-4.5">
        <div className="flex items-center gap-2.5">
          <Video size={18} className="text-brand-purple" />
          <h2 className="text-lg font-bold text-text-primary">Zoom Meeting Notes</h2>
        </div>
        <button onClick={handleRefresh}
                className="bg-transparent border border-border-default rounded-lg p-1.5 cursor-pointer
                           flex items-center transition-all duration-200 hover:border-brand-purple">
          <RefreshCw size={14} className="text-text-muted" />
        </button>
      </div>

      {/* Loading skeleton */}
      {isLoading && notes.length === 0 && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[72px] rounded-xl bg-white/3 animate-pulse-skeleton" />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2.5 px-4.5 py-3.5 bg-brand-purple-dim rounded-xl border border-brand-purple/12">
          <span className="text-sm text-brand-purple">
            {error.message === "Zoom not configured" ? "Connect Zoom to see meeting notes" : error.message}
          </span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && notes.length === 0 && (
        <div className="text-center py-7 text-sm text-text-muted">
          No recent meetings in the last 7 days.
        </div>
      )}

      {/* Notes list */}
      <div className="flex flex-col gap-2.5">
        {notes.map((note) => (
          <div key={note.meetingId + note.date}
               className="px-5 py-4 bg-bg-subtle rounded-xl border border-border-default
                          transition-all duration-250 ease-out
                          hover:border-brand-purple/25 hover:-translate-y-px">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0" />
                  <span className="text-[15px] font-semibold text-text-primary">{note.topic}</span>
                </div>
                <div className="flex gap-2 mb-2 pl-3.5">
                  <span className="text-xs text-text-muted">{note.date}</span>
                  {note.duration > 0 && (
                    <>
                      <span className="text-xs text-text-muted">·</span>
                      <span className="text-xs text-text-muted">{note.duration} min</span>
                    </>
                  )}
                </div>
                {note.context && (
                  <p className="text-[13px] text-text-secondary leading-relaxed pl-3.5">{note.context}</p>
                )}
              </div>
              <a href={note.link} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-1.5 text-xs text-brand-purple no-underline px-2.5 py-1.5
                            bg-brand-purple-dim rounded-md border border-brand-purple/12 whitespace-nowrap
                            shrink-0 ml-3.5 sm:ml-0 sm:mt-0.5 self-start transition-all duration-200 hover:bg-brand-purple/15">
                View Notes <ExternalLink size={11} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
