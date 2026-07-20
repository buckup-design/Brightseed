"use client";

/**
 * WorkspaceCanvas — Hummingbird's signature surface, and its single state owner.
 *
 * The Workspace is the split view a search opens into: a streaming chat/thread
 * panel on the left, a results panel (Evidence Filter Bar + grid of ResultCards)
 * on the right, and a detail slide-over that a card opens into. This Block owns
 * ALL cross-panel state — the active evidence filter, the grid/list view, the
 * banner's dismissed state, the favorites Set, and the selected result + sheet —
 * and derives everything the two halves render, so a card favorited in the grid,
 * the same card inline in chat, and the detail's Pin never desync. ChatPanel and
 * ResultsPanel are presentational; this file is the only place state lives.
 *
 * It also picks the LAYOUT: a ResizablePanelGroup on desktop, a two-tab layout
 * below md (two panels can't sit side by side on a phone). The SAME ChatPanel /
 * ResultsPanel instances render in both — only the height-providing container
 * changes — so there is no divergent mobile markup to drift.
 *
 * The detail is the reused ResultDetailSheet, mounted ONCE here and portaled to
 * document.body — that keeps the split at two panels, not three, and consumes
 * the two hardest atoms (ResultCard, ResultDetailSheet) unchanged.
 *
 * A Block: it composes Resizable / Tabs / ChatPanel / ResultsPanel /
 * ResultDetailSheet. Leaf app surface → reads --ds-* directly.
 */

import * as React from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ResultDetailSheet,
  type ResultDetail,
} from "@/components/hummingbird/result-detail";
import {
  resultKey,
  type ComboResult,
  type Result,
  type SingleResult,
} from "@/components/hummingbird/cards/result-card";
import type { ChatMessage } from "@/components/hummingbird/data";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import { ChatPanel } from "./chat-panel";
import {
  ResultsPanel,
  evidenceCounts,
  filterResults,
  type FilterKey,
  type ViewMode,
} from "./results-panel";

export interface WorkspaceCanvasProps {
  /** The conversation thread shown in the left panel. */
  messages: ChatMessage[];
  /** The full result set. The canvas derives counts + the visible slice. */
  results: Result[];
  /**
   * Resolve a studied result to its detail for the slide-over. Predicted results
   * are never passed here (they have no detail). Returning undefined leaves the
   * card non-navigating (a missing detail never opens an empty Sheet). This is
   * the seam an app swaps a fetch into.
   */
  resolveDetail: (result: SingleResult | ComboResult) => ResultDetail | undefined;
  /** Breadcrumb: "Workspace › N searches completed". */
  searchesCompleted?: number;
  /** Replaces the results with a "Preparing workspace…" state. */
  preparing?: boolean;
  /**
   * Drives the dismissible "Updated workspace with N new results." banner. The
   * banner re-shows whenever this value changes (a new search), even after a
   * prior dismiss. null/undefined = no banner.
   */
  updateCount?: number | null;
  /** Composer submit. Inert by default (the app owns what "send" does). */
  onSend?: (value: string) => void;
  /** The detail's "Generate report" — the bridge to the Reports tab. */
  onGenerateReport?: (detail: ResultDetail) => void;
  /** The filter bar's "+ Add". Inert by default. */
  onAddFilter?: () => void;
  className?: string;
}

export function WorkspaceCanvas({
  messages,
  results,
  resolveDetail,
  searchesCompleted,
  preparing = false,
  updateCount,
  onSend,
  onGenerateReport,
  onAddFilter,
  className,
}: WorkspaceCanvasProps) {
  const isMobile = useIsMobile();

  const [filter, setFilter] = React.useState<FilterKey>("all");
  const [view, setView] = React.useState<ViewMode>("grid");
  const [dismissedFor, setDismissedFor] = React.useState<number | null>(null);
  // Favorites = each result's own isFavorited, overridden by the user's explicit
  // toggles. Storing only the OVERRIDES (not a materialized Set) keeps favorites a
  // pure derivation: a new search's results contribute their own favorite state
  // for free, while a favorite the user has set or cleared persists across result
  // changes — no effect, no re-seeding, and an override always wins so a cleared
  // favorite is never resurrected. Keyed by resultKey.
  const [favoriteOverrides, setFavoriteOverrides] = React.useState<
    Map<string, boolean>
  >(() => new Map());
  const favoritedIds = React.useMemo(() => {
    const ids = new Set<string>();
    for (const r of results) {
      const key = resultKey(r);
      if (favoriteOverrides.get(key) ?? !!r.isFavorited) ids.add(key);
    }
    return ids;
  }, [results, favoriteOverrides]);
  const [detail, setDetail] = React.useState<ResultDetail | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);

  const counts = React.useMemo(() => evidenceCounts(results), [results]);
  const visible = React.useMemo(
    () => filterResults(results, filter),
    [results, filter],
  );

  // Known limitation: re-show identity is the updateCount VALUE, so two
  // consecutive searches that return the SAME new-result count won't re-show the
  // banner after a dismiss. Fixing that cleanly needs a monotonic search-epoch
  // prop separate from the displayed number — a trivial add once a real caller
  // wires searches (none does yet; onSend is inert).
  const bannerShown = updateCount != null && dismissedFor !== updateCount;
  const updateMessage = bannerShown
    ? `Updated workspace with ${updateCount} new result${updateCount === 1 ? "" : "s"}.`
    : null;

  const toggleFavoriteKey = React.useCallback((key: string, favorited: boolean) => {
    setFavoriteOverrides((prev) => new Map(prev).set(key, favorited));
  }, []);

  const handleFavorite = React.useCallback(
    (result: Result, favorited: boolean) =>
      toggleFavoriteKey(resultKey(result), favorited),
    [toggleFavoriteKey],
  );

  const handleSelect = React.useCallback(
    (result: Result) => {
      // Predicted results are unstudied — no detail exists, so the card is
      // non-navigating (its favorite star still works). Guard resolveDetail too,
      // so a missing detail never opens an empty Sheet.
      if (result.type === "predicted") return;
      const resolved = resolveDetail(result);
      if (!resolved) return;
      setDetail(resolved);
      setDetailOpen(true);
    },
    [resolveDetail],
  );

  // Keep `detail` set through the Sheet's close animation; the next open
  // overwrites it. Only `detailOpen` flips on dismiss.
  const chat = (
    <ChatPanel
      messages={messages}
      favoritedIds={favoritedIds}
      onSend={onSend}
      onSelectResult={handleSelect}
      onFavorite={handleFavorite}
    />
  );

  const resultsPanel = (
    <ResultsPanel
      results={visible}
      counts={counts}
      filter={filter}
      onFilterChange={setFilter}
      view={view}
      onViewChange={setView}
      favoritedIds={favoritedIds}
      onFavorite={handleFavorite}
      onSelectResult={handleSelect}
      searchesCompleted={searchesCompleted}
      preparing={preparing}
      updateMessage={updateMessage}
      onDismissUpdate={() => setDismissedFor(updateCount ?? null)}
      onAddFilter={onAddFilter}
    />
  );

  return (
    <div
      className={cn(
        "flex h-full min-h-0 w-full flex-col overflow-hidden",
        className,
      )}
    >
      {isMobile ? (
        <Tabs defaultValue="results" className="flex min-h-0 flex-1 flex-col gap-0">
          {/* w-full + justify-start: TabsList's base is w-fit, which would leave
              the bar background and bottom divider spanning only the tabs' width
              (a ~130px box, obvious in dark) instead of the whole panel. */}
          <TabsList className="w-full justify-start shrink-0 rounded-none border-b border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-default)] px-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="results">Results {counts.all}</TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="min-h-0 flex-1 overflow-hidden">
            {chat}
          </TabsContent>
          <TabsContent value="results" className="min-h-0 flex-1 overflow-hidden">
            {resultsPanel}
          </TabsContent>
        </Tabs>
      ) : (
        <ResizablePanelGroup orientation="horizontal" className="min-h-0 flex-1">
          {/* String percents, NOT numbers: in react-resizable-panels v4 a numeric
              size is PIXELS (defaultSize={38} would be a 38px panel). 38/62 ≈ the
              live ~540px chat ratio. className lands on the INNER overflow:auto div
              — flex-col there is what pins the composer instead of scrolling it. */}
          <ResizablePanel
            defaultSize="38"
            minSize="28"
            maxSize="52"
            className="flex min-h-0 flex-col"
          >
            {chat}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="62" minSize="45" className="flex min-h-0 flex-col">
            {resultsPanel}
          </ResizablePanel>
        </ResizablePanelGroup>
      )}

      {/* Mounted once, portaled to body — the reused slide-over, not a third
          panel. Rendered only when a detail exists; the sheet's Pin reads the
          same favorites Set (keyed by detail.name === resultKey). */}
      {detail && (
        <ResultDetailSheet
          detail={detail}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          favorited={favoritedIds.has(detail.name)}
          onFavorite={(favorited) => toggleFavoriteKey(detail.name, favorited)}
          onGenerateReport={() => onGenerateReport?.(detail)}
        />
      )}
    </div>
  );
}
