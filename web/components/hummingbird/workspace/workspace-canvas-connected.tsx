"use client";

/**
 * WorkspaceCanvasConnected — the MSW-backed Workspace.
 *
 * The same presentational WorkspaceCanvas, but fed by real `/api` fetches
 * (through Mock Service Worker) instead of fixtures-as-props. This is the
 * prototyping-data layer's proof: a prototype that talks to a (fake) backend,
 * with genuine loading / empty / error states and a detail slide-over that
 * fetches on open.
 *
 * The seam is honest — getResults / getThread / getResultDetail hit relative
 * `/api` URLs (see lib/api.ts). Delete `mocks/`, point lib/api.ts at a real
 * host, and this component is unchanged.
 */

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  resultKey,
  type ComboResult,
  type SingleResult,
} from "@/components/hummingbird/cards/result-card";
import { getResultDetail, getResults, getThread } from "@/lib/api";
import { useResource } from "@/hooks/use-resource";

import { WorkspaceCanvas, type WorkspaceCanvasProps } from "./workspace-canvas";

type ConnectedProps = Pick<
  WorkspaceCanvasProps,
  "onSend" | "onGenerateReport" | "onAddFilter" | "className"
>;

export function WorkspaceCanvasConnected({
  onSend,
  onGenerateReport,
  onAddFilter,
  className,
}: ConnectedProps) {
  const results = useResource(() => getResults(), []);
  const thread = useResource(() => getThread(), []);

  const loading = results.loading || thread.loading;
  const failed = results.error ?? thread.error;

  // The detail seam: fetch on open, keyed by identity. Predicted cards never
  // reach here (the canvas guards them), so this only ever sees single/combo.
  const resolveDetail = React.useCallback(
    (result: SingleResult | ComboResult) => getResultDetail(resultKey(result)),
    [],
  );

  if (failed) {
    return (
      <div className="flex h-full min-h-0 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="max-w-sm text-sm text-[var(--ds-color-text-subtle)]">
          Couldn’t load the workspace. {failed.message}
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            results.reload();
            thread.reload();
          }}
        >
          Try again
        </Button>
      </div>
    );
  }

  const resultData = results.data ?? [];

  return (
    <WorkspaceCanvas
      className={className}
      messages={thread.data ?? []}
      results={resultData}
      resolveDetail={resolveDetail}
      preparing={loading}
      searchesCompleted={loading ? undefined : 1}
      // No banner while loading or on an empty result set (0 new results reads
      // as noise, not signal).
      updateCount={loading || resultData.length === 0 ? null : resultData.length}
      onSend={onSend}
      onGenerateReport={onGenerateReport}
      onAddFilter={onAddFilter}
    />
  );
}
