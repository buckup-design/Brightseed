/**
 * MSW request handlers — the prototype "fake backend."
 *
 * A disposable HTTP layer backed by the existing Hummingbird fixtures
 * (`components/hummingbird/data.ts`). The UI fetches real `/api/*` URLs through
 * these handlers (via the browser worker in Storybook + `next dev`), so
 * prototypes get genuine loading / empty / error behaviour instead of props.
 *
 * The boundary is deliberate: this `mocks/` folder is throwaway. When a real
 * backend lands, delete it and point `lib/api.ts` at the host — the API shape
 * below is the contract to honour, and no UI call site changes.
 *
 * Deferred (documented fast-follow, not this cut): `mocks/server.ts`
 * (`setupServer`) + a root `instrumentation.ts` so React Server Component /
 * server-side fetches route through MSW too. Skipped for now — Next is the
 * alpha client mock; Storybook is canonical, and the browser worker covers it.
 */

import { http, HttpResponse, delay } from "msw";

import {
  COMPOUNDS,
  PLANTS,
  PROJECT,
  REPORT_DOCUMENTS,
  SAMPLE_WORKSPACE_RESULTS,
  SAMPLE_WORKSPACE_THREAD,
  STRATEGIES,
  resolveReportDocument,
  resolveWorkspaceDetail,
} from "@/components/hummingbird/data";
import { resultKey } from "@/components/hummingbird/cards/result-card";

/** A modest, uniform latency so loading states are real, not theoretical. */
const LATENCY_MS = 350;

export const handlers = [
  // ── Workspace results ──────────────────────────────────────────────────────
  // The full set — the canvas does its own client-side evidence filtering. The
  // optional ?evidence= is supported for completeness (a future server filter).
  http.get("/api/results", async ({ request }) => {
    await delay(LATENCY_MS);
    const evidence = new URL(request.url).searchParams.get("evidence");
    const data =
      evidence && evidence !== "all"
        ? SAMPLE_WORKSPACE_RESULTS.filter((r) => r.evidence === evidence)
        : SAMPLE_WORKSPACE_RESULTS;
    return HttpResponse.json(data);
  }),

  // Result detail by identity key (the client encodeURIComponent-s it). Predicted
  // results are unstudied and have no detail → 404 (the client maps that to
  // undefined, i.e. a non-navigating card).
  http.get("/api/results/:key", async ({ params }) => {
    const key = decodeURIComponent(String(params.key));
    const result = SAMPLE_WORKSPACE_RESULTS.find((r) => resultKey(r) === key);
    if (!result || result.type === "predicted") {
      return new HttpResponse(null, { status: 404 });
    }
    await delay(LATENCY_MS);
    return HttpResponse.json(resolveWorkspaceDetail(result));
  }),

  // ── Chat thread ─────────────────────────────────────────────────────────────
  http.get("/api/thread", async () => {
    await delay(LATENCY_MS);
    return HttpResponse.json(SAMPLE_WORKSPACE_THREAD);
  }),

  // ── Reports ──────────────────────────────────────────────────────────────────
  http.get("/api/reports", async () => {
    await delay(LATENCY_MS);
    const list = Object.values(REPORT_DOCUMENTS).map((r) => ({
      id: r.id,
      displayId: r.displayId,
      title: r.title,
      status: r.status,
      created: r.created,
      pending: r.pending ?? false,
    }));
    return HttpResponse.json(list);
  }),
  http.get("/api/reports/:id", async ({ params }) => {
    await delay(LATENCY_MS);
    return HttpResponse.json(resolveReportDocument(String(params.id)));
  }),

  // ── Reference data (no consumer yet — completes the API artifact) ────────────
  http.get("/api/project", () => HttpResponse.json(PROJECT)),
  http.get("/api/strategies", () => HttpResponse.json(STRATEGIES)),
  http.get("/api/compounds", () => HttpResponse.json(COMPOUNDS)),
  http.get("/api/compounds/:id", ({ params }) => {
    const found = COMPOUNDS.find((c) => c.id === params.id);
    return found
      ? HttpResponse.json(found)
      : new HttpResponse(null, { status: 404 });
  }),
  http.get("/api/plants", () => HttpResponse.json(PLANTS)),
  http.get("/api/plants/:id", ({ params }) => {
    const found = PLANTS.find((p) => p.id === params.id);
    return found
      ? HttpResponse.json(found)
      : new HttpResponse(null, { status: 404 });
  }),
];
