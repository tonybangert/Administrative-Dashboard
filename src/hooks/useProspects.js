import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase.js";

const NOOP_MUTATION = { mutateAsync: async () => {}, isPending: false };

export function useProspects() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["prospects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prospects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!supabase,
  });

  const addProspect = useMutation({
    mutationFn: async (prospect) => {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from("prospects")
        .insert(prospect)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["prospects"] }),
  });

  const updateProspect = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from("prospects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["prospects"] }),
  });

  const deleteProspect = useMutation({
    mutationFn: async (id) => {
      if (!supabase) return;
      const { error } = await supabase
        .from("prospects")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["prospects"] }),
  });

  return {
    prospects: query.data ?? [],
    isLoading: query.isLoading && !!supabase,
    error: query.error,
    addProspect: supabase ? addProspect : NOOP_MUTATION,
    updateProspect: supabase ? updateProspect : NOOP_MUTATION,
    deleteProspect: supabase ? deleteProspect : NOOP_MUTATION,
    refetch: query.refetch,
  };
}
