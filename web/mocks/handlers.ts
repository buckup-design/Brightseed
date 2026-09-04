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
 * When that lands, do NOT copy the client gate: `next build` forces
 * NODE_ENV=production, so a NODE_ENV check would disable mocks in every built
 * prototype. Gate on an explicit flag plus `process.env.NEXT_RUNTIME === "nodejs"`.
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
import {
  COMBINATIONS,
  COMPOUND_CANDIDATES,
  COMPOUND_ELIMINATED,
  PREDICTED_COMPOUNDS,
  PROJECT_VIRAL,
  STRATEGIES_VIRAL,
  SOURCE_CANDIDATES,
  MATRIX_COMPOUNDS,
  SOURCE_ELIMINATED,
} from "@/components/hummingbird/project-data";

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

  // ── The discovery flow (business goal → strategies → formulation plans) ──────
  // Project-scoped, and separate from the flat reference routes below: this is
  // the viral-infection dataset the v2 direction is built against, and it must
  // not disturb the GLP-1 fixtures the shipped stories still use.
  http.get("/api/projects/:id", async () => {
    await delay(LATENCY_MS);
    return HttpResponse.json(PROJECT_VIRAL);
  }),

  http.get("/api/projects/:id/strategies", async () => {
    await delay(LATENCY_MS);
    return HttpResponse.json(STRATEGIES_VIRAL);
  }),

  // The compounds table ships PRE-SPLIT by the model. That split is a proposal,
  // not a review — the client's triage model treats it as the starting position
  // and counts only human decisions as reviewed.
  http.get("/api/strategies/:id/compounds", async () => {
    await delay(LATENCY_MS);
    return HttpResponse.json({
      candidates: COMPOUND_CANDIDATES,
      eliminated: COMPOUND_ELIMINATED,
    });
  }),
  http.get("/api/strategies/:id/predicted-compounds", async () => {
    await delay(LATENCY_MS);
    return HttpResponse.json(PREDICTED_COMPOUNDS);
  }),
  http.get("/api/strategies/:id/sources", async () => {
    await delay(LATENCY_MS);
    return HttpResponse.json({
      compoundColumns: MATRIX_COMPOUNDS,
      candidates: SOURCE_CANDIDATES,
      eliminated: SOURCE_ELIMINATED,
    });
  }),
  http.get("/api/strategies/:id/combinations", async () => {
    await delay(LATENCY_MS);
    return HttpResponse.json(COMBINATIONS);
  }),

  // ── Reference data (completes the API artifact) ──────────────────────────────
  // These carry the same latency as everything else; without it a loading state
  // cannot be demonstrated on them at all.
  http.get("/api/project", async () => {
    await delay(LATENCY_MS);
    return HttpResponse.json(PROJECT);
  }),
  http.get("/api/strategies", async () => {
    await delay(LATENCY_MS);
    return HttpResponse.json(STRATEGIES);
  }),
  http.get("/api/compounds", async () => {
    await delay(LATENCY_MS);
    return HttpResponse.json(COMPOUNDS);
  }),
  http.get("/api/compounds/:id", ({ params }) => {
    const found = COMPOUNDS.find((c) => c.id === params.id);
    return found
      ? HttpResponse.json(found)
      : new HttpResponse(null, { status: 404 });
  }),
  http.get("/api/plants", async () => {
    await delay(LATENCY_MS);
    return HttpResponse.json(PLANTS);
  }),
  http.get("/api/plants/:id", ({ params }) => {
    const found = PLANTS.find((p) => p.id === params.id);
    return found
      ? HttpResponse.json(found)
      : new HttpResponse(null, { status: 404 });
  }),
];
