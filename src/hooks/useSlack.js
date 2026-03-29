import { useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchSlack({ queryKey }) {
  const [, forceRefresh] = queryKey;
  const res = await fetch("/api/slack-messages", { method: forceRefresh ? "POST" : "GET" });
  const data = await res.json();
  if (data.error && !data.messages?.length) throw new Error(data.error);
  return { messages: data.messages || [], channelName: data.channelName, error: data.error || null };
}

export function useSlack() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["slack-messages", false],
    queryFn: fetchSlack,
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const refresh = () => {
    queryClient.fetchQuery({
      queryKey: ["slack-messages", true],
      queryFn: fetchSlack,
      staleTime: 0,
    }).then((fresh) => {
      queryClient.setQueryData(["slack-messages", false], fresh);
    });
  };

  return {
    messages: data?.messages ?? [],
    channelName: data?.channelName ?? null,
    apiError: data?.error ?? null,
    isLoading,
    error,
    refresh,
  };
}
