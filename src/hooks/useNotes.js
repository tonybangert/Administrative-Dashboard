import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase.js";

const NOOP_MUTATION = { mutateAsync: async () => {}, isPending: false };

export function useNotes() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!supabase,
  });

  const addNote = useMutation({
    mutationFn: async (note) => {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from("notes")
        .insert(note)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const updateNote = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from("notes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const deleteNote = useMutation({
    mutationFn: async (id) => {
      if (!supabase) return;
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const notesByCategory = (query.data ?? []).reduce((acc, note) => {
    if (!acc[note.category]) acc[note.category] = [];
    acc[note.category].push(note);
    return acc;
  }, {});

  return {
    notes: query.data ?? [],
    notesByCategory,
    isLoading: query.isLoading && !!supabase,
    error: query.error,
    addNote: supabase ? addNote : NOOP_MUTATION,
    updateNote: supabase ? updateNote : NOOP_MUTATION,
    deleteNote: supabase ? deleteNote : NOOP_MUTATION,
    refetch: query.refetch,
  };
}
