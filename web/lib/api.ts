/**
 * Prototype data-access layer — the client the UI fetches through.
 *
 * Unlike `mocks/` (the disposable fake backend), this module is PERMANENT: it is
 * the seam that survives the backend swap. Every function hits a relative
 * `/api/*` URL; today MSW answers, tomorrow a real host does, and no call site
 * changes. Keep it fetch-only — types are imported, never fixtures.
 *
 * URLs are relative because this cut is client-only (Storybook + `next dev`
 * client fetches). The server/RSC path needs an absolute origin; that arrives
 * with the deferred instrumentation work (see mocks/handlers.ts header).
 */

import type { Result } from "@/components/hummingbird/cards/result-card";
import type { ResultDetail } from "@/components/hummingbird/result-detail";
import type { ReportDocument } from "@/components/hummingbird/report-document";
import type {
  ChatMessage,
  Compound,
  Plant,
  Strategy,
} from "@/components/hummingbird/data";

export type Project = {
  name: string;
  goal: string;
  audience: string;
  team: string[];
};

export type ReportSummary = {
  id: string;
  displayId: string;
  title: string;
  status: string;
  created: string;
  pending: boolean;
};

function apiUrl(path: string): string {
  return `/api${path}`;
}

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(apiUrl(path));
  if (!res.ok) {
    throw new Error(`GET /api${path} failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

/** The workspace result set. The canvas derives counts + the visible slice. */
export function getResults(params?: { evidence?: string }): Promise<Result[]> {
  const q = params?.evidence
    ? `?evidence=${encodeURIComponent(params.evidence)}`
    : "";
  return getJSON<Result[]>(`/results${q}`);
}

/** A studied result's detail, by identity key. Undefined for predicted/unknown
 *  (the server 404s), which leaves the card non-navigating. */
export async function getResultDetail(
  key: string,
): Promise<ResultDetail | undefined> {
  const res = await fetch(apiUrl(`/results/${encodeURIComponent(key)}`));
  if (res.status === 404) return undefined;
  if (!res.ok) {
    throw new Error(`result detail failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as ResultDetail;
}

export function getThread(): Promise<ChatMessage[]> {
  return getJSON<ChatMessage[]>("/thread");
}

export function getReports(): Promise<ReportSummary[]> {
  return getJSON<ReportSummary[]>("/reports");
}

export function getReport(id: string): Promise<ReportDocument> {
  return getJSON<ReportDocument>(`/reports/${encodeURIComponent(id)}`);
}

export function getProject(): Promise<Project> {
  return getJSON<Project>("/project");
}

export function getStrategies(): Promise<Strategy[]> {
  return getJSON<Strategy[]>("/strategies");
}

export function getCompounds(): Promise<Compound[]> {
  return getJSON<Compound[]>("/compounds");
}

export function getPlants(): Promise<Plant[]> {
  return getJSON<Plant[]>("/plants");
}
