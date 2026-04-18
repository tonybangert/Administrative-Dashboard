/**
 * Aplora Sales API client.
 * All requests route through /api/aplora → proxy → Render backend.
 * Includes retry logic for Render cold starts (30-60s spin-up).
 */

const BASE = "/api/aplora";

async function request(path, options) {
  const maxRetries = 2;
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(`${BASE}${path}`, {
        headers: { "Content-Type": "application/json", ...options?.headers },
        ...options,
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || `Request failed: ${res.status}`);
      }
      return res.json();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (lastError.message.startsWith("Request failed:")) throw lastError;
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      }
    }
  }

  throw lastError;
}

export const aploraApi = {
  // ── Prospects ──────────────────────────────

  listProspects: (params) => {
    const qs = new URLSearchParams();
    if (params?.stage) qs.set("stage", params.stage);
    if (params?.search) qs.set("search", params.search);
    const query = qs.toString();
    return request(`/api/prospects/${query ? "?" + query : ""}`);
  },

  getPipeline: () => request("/api/prospects/pipeline"),

  getProspect: (id) => request(`/api/prospects/${id}`),

  createProspect: (data) =>
    request("/api/prospects/", { method: "POST", body: JSON.stringify(data) }),

  updateProspect: (id, data) =>
    request(`/api/prospects/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  deleteProspect: (id) =>
    request(`/api/prospects/${id}`, { method: "DELETE" }),

  markContacted: (id) =>
    request(`/api/prospects/${id}/contacted`, { method: "POST" }),

  // ── Signals ────────────────────────────────

  listSignals: (prospectId, limit = 50) =>
    request(`/api/signals/${prospectId}?limit=${limit}`),

  createSignal: (data) =>
    request("/api/signals/", { method: "POST", body: JSON.stringify(data) }),

  // ── Research ───────────────────────────────

  runResearch: (prospectId) =>
    request(`/api/research/${prospectId}`, { method: "POST" }),

  // ── Companies ──────────────────────────────

  listCompanies: (params) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set("search", params.search);
    if (params?.industry) qs.set("industry", params.industry);
    const query = qs.toString();
    return request(`/api/companies/${query ? "?" + query : ""}`);
  },

  getCompany: (id) => request(`/api/companies/${id}`),

  createCompany: (data) =>
    request("/api/companies/", { method: "POST", body: JSON.stringify(data) }),

  // ── Deal Lines ─────────────────────────────

  listDealLines: (prospectId) =>
    request(`/api/prospects/${prospectId}/deal-lines`),

  createDealLine: (prospectId, data) =>
    request(`/api/prospects/${prospectId}/deal-lines`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateDealLine: (lineId, data) =>
    request(`/api/deal-lines/${lineId}`, { method: "PATCH", body: JSON.stringify(data) }),

  deleteDealLine: (lineId) =>
    request(`/api/deal-lines/${lineId}`, { method: "DELETE" }),

  getDealSummary: (prospectId) =>
    request(`/api/prospects/${prospectId}/deal-summary`),

  // ── Actions ────────────────────────────────

  listActions: (prospectId, status) => {
    const qs = new URLSearchParams();
    if (status) qs.set("status", status);
    const query = qs.toString();
    return request(`/api/prospects/${prospectId}/actions${query ? "?" + query : ""}`);
  },

  createAction: (prospectId, data) =>
    request(`/api/prospects/${prospectId}/actions`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  completeAction: (actionId) =>
    request(`/api/actions/${actionId}/complete`, { method: "POST" }),

  skipAction: (actionId) =>
    request(`/api/actions/${actionId}/skip`, { method: "POST" }),

  suggestActions: (prospectId) =>
    request(`/api/prospects/${prospectId}/actions/suggest`, { method: "POST" }),

  // ── Metrics ────────────────────────────────

  getPipelineMetrics: () => request("/api/metrics/pipeline"),

  getActivitySummary: (days = 7) =>
    request(`/api/metrics/activity?days=${days}`),
};
