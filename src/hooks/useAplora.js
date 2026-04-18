/**
 * React Query hooks for Aplora Sales CRM data.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aploraApi } from "../services/aploraApi.js";

// ── Pipeline ─────────────────────────────────

export function useAloraPipeline() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["aplora-pipeline"],
    queryFn: () => aploraApi.getPipeline(),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const updateStage = useMutation({
    mutationFn: ({ id, stage }) => aploraApi.updateProspect(id, { stage }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["aplora-pipeline"] }),
  });

  return {
    pipeline: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    updateStage,
  };
}

// ── Single Prospect ──────────────────────────

export function useAloraProspect(prospectId) {
  return useQuery({
    queryKey: ["aplora-prospect", prospectId],
    queryFn: () => aploraApi.getProspect(prospectId),
    enabled: !!prospectId,
  });
}

// ── Signals ──────────────────────────────────

export function useAloraSignals(prospectId) {
  return useQuery({
    queryKey: ["aplora-signals", prospectId],
    queryFn: () => aploraApi.listSignals(prospectId),
    enabled: !!prospectId,
    staleTime: 60 * 1000,
  });
}

// ── Actions ──────────────────────────────────

export function useAloraActions(prospectId) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["aplora-actions", prospectId],
    queryFn: () => aploraApi.listActions(prospectId),
    enabled: !!prospectId,
  });

  const completeAction = useMutation({
    mutationFn: (actionId) => aploraApi.completeAction(actionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aplora-actions", prospectId] });
      queryClient.invalidateQueries({ queryKey: ["aplora-signals", prospectId] });
    },
  });

  const skipAction = useMutation({
    mutationFn: (actionId) => aploraApi.skipAction(actionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["aplora-actions", prospectId] }),
  });

  return {
    actions: query.data ?? [],
    isLoading: query.isLoading,
    refetch: query.refetch,
    completeAction,
    skipAction,
  };
}

// ── Deal Lines ───────────────────────────────

export function useAloraDealLines(prospectId) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["aplora-deal-lines", prospectId],
    queryFn: () => aploraApi.getDealSummary(prospectId),
    enabled: !!prospectId,
  });

  const createLine = useMutation({
    mutationFn: (data) => aploraApi.createDealLine(prospectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aplora-deal-lines", prospectId] });
      queryClient.invalidateQueries({ queryKey: ["aplora-pipeline"] });
    },
  });

  const deleteLine = useMutation({
    mutationFn: (lineId) => aploraApi.deleteDealLine(lineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aplora-deal-lines", prospectId] });
      queryClient.invalidateQueries({ queryKey: ["aplora-pipeline"] });
    },
  });

  return {
    summary: query.data ?? null,
    isLoading: query.isLoading,
    refetch: query.refetch,
    createLine,
    deleteLine,
  };
}

// ── Prospect Mutations ───────────────────────

export function useAloraProspectMutations() {
  const queryClient = useQueryClient();

  const createProspect = useMutation({
    mutationFn: (data) => aploraApi.createProspect(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["aplora-pipeline"] }),
  });

  const updateProspect = useMutation({
    mutationFn: ({ id, ...data }) => aploraApi.updateProspect(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["aplora-pipeline"] });
      queryClient.invalidateQueries({ queryKey: ["aplora-prospect", variables.id] });
    },
  });

  const deleteProspect = useMutation({
    mutationFn: (id) => aploraApi.deleteProspect(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["aplora-pipeline"] }),
  });

  return { createProspect, updateProspect, deleteProspect };
}
