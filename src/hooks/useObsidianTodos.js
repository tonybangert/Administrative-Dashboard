import { useQuery } from "@tanstack/react-query";

async function fetchTodos() {
  const res = await fetch("/api/obsidian-vault");
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
}

export function useObsidianTodos() {
  const query = useQuery({
    queryKey: ["obsidian-todos"],
    queryFn: fetchTodos,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const todos = query.data?.todos ?? [];
  const active = todos.filter((t) => !t.completed);
  const completed = todos.filter((t) => t.completed);

  return {
    todos,
    active,
    completed,
    isLoading: query.isLoading,
    error: query.error,
    lastFetched: query.data?.lastFetched,
    refetch: query.refetch,
  };
}
