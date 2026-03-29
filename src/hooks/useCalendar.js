import { useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchCalendar({ queryKey }) {
  const [, forceRefresh] = queryKey;
  const res = await fetch("/api/outlook-calendar", { method: forceRefresh ? "POST" : "GET" });
  const data = await res.json();
  if (data.error && !data.events?.length) throw new Error(data.error);
  return { events: data.events || [], error: data.error || null };
}

export function useCalendar() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["outlook-calendar", false],
    queryFn: fetchCalendar,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const refresh = () => {
    queryClient.fetchQuery({
      queryKey: ["outlook-calendar", true],
      queryFn: fetchCalendar,
      staleTime: 0,
    }).then((fresh) => {
      queryClient.setQueryData(["outlook-calendar", false], fresh);
    });
  };

  return {
    events: data?.events ?? [],
    apiError: data?.error ?? null,
    isLoading,
    error,
    refresh,
  };
}
