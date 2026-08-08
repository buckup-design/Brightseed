"use client";

/**
 * ResultsPanel — the right half of the Workspace canvas.
 *
 * A presentational, fully-controlled surface: it renders whatever the
 * WorkspaceCanvas Block hands it (the visible/filtered results, the per-filter
 * counts, the active filter + view, the banner, the favorites Set) and reports
 * intent back through callbacks. It owns no cross-panel state — that lives in
 * the canvas, so the grid, the same result rendered inline in chat, and the
 * detail sheet's Pin never desync.
 *
 * Structure mirrors the live product: a shrink-0 header stack (a Breadcrumb
 * "Workspace › N searches completed", the dismissible WorkspaceBanner, and the
 * EvidenceFilterBar) over a flex-1 min-h-0 scroll region holding the CardGrid of
 * ResultCards (grid view) or a single-column stack (list view) — or the
 * preparing / empty / no-results-for-filter states.
 *
 * EvidenceFilterBar and WorkspaceBanner are inlined here (each used exactly
 * once) rather than promoted to ui/ Components — extracting from a single use is
 * the premature abstraction the working rules warn against.
 *
 * Token tier: a Hummingbird leaf app surface, so it reads global --ds-* directly
 * (the result-card / result-detail precedent). Every primitive it composes —
 * ToggleGroup, Breadcrumb, Button, Spinner, CardGrid, ResultCard — carries its
 * own --c-* block; the two tiers never mix inside one file.
 */

import * as React from "react";
import { Check, LayoutGrid, List, Plus, X } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { CardGrid } from "@/components/hummingbird/card-grid";
import {
  ResultCard,
  resultKey,
  type Result,
} from "@/components/hummingbird/cards/result-card";
import { cn } from "@/lib/utils";

// ─── Filter model ────────────────────────────────────────────────────────────

/** The Evidence Filter Bar's axes: "all" + the four evidence classes. */
export type FilterKey = "all" | "clinical" | "animal" | "in-vitro" | "predicted";
export type ViewMode = "grid" | "list";
export type EvidenceCounts = Record<FilterKey, number>;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "clinical", label: "Clinical" },
  { key: "animal", label: "Animal" },
  { key: "in-vitro", label: "In Vitro" },
  { key: "predicted", label: "Predicted" },
];

const FILTER_LABEL: Record<FilterKey, string> = {
  all: "All",
  clinical: "Clinical",
  animal: "Animal",
  "in-vitro": "In Vitro",
  predicted: "Predicted",
};

/**
 * Per-filter counts over the FULL result set (before filtering), so the pill
 * numbers never move when a pill is clicked. "Predicted" resolves by TYPE;
 * clinical/animal/in-vitro resolve by EVIDENCE on the studied (non-predicted)
 * types. The discriminated union guarantees the two axes never double-count
 * (single/combo evidence excludes "predicted", predicted evidence is exactly
 * "predicted"). Note: single/combo with evidence "none" match no class pill and
 * appear only under All, so the four class counts can sum to LESS than `all` —
 * that gap is the "none"-evidence rows, which is correct.
 */
export function evidenceCounts(results: Result[]): EvidenceCounts {
  return {
    all: results.length,
    clinical: results.filter((r) => r.type !== "predicted" && r.evidence === "clinical").length,
    animal: results.filter((r) => r.type !== "predicted" && r.evidence === "animal").length,
    "in-vitro": results.filter((r) => r.type !== "predicted" && r.evidence === "in-vitro").length,
    predicted: results.filter((r) => r.type === "predicted").length,
  };
}

/** The identical predicate applied to produce the visible set. */
export function filterResults(results: Result[], filter: FilterKey): Result[] {
  if (filter === "all") return results;
  if (filter === "predicted") return results.filter((r) => r.type === "predicted");
  return results.filter((r) => r.type !== "predicted" && r.evidence === filter);
}

// ─── Evidence Filter Bar (inlined) ───────────────────────────────────────────

function EvidenceFilterBar({
  filter,
  counts,
  onFilterChange,
  view,
  onViewChange,
  onAddFilter,
}: {
  filter: FilterKey;
  counts: EvidenceCounts;
  onFilterChange: (filter: FilterKey) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onAddFilter?: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-[var(--ds-color-border-subtle)] px-4 py-2">
      {/* Single-select evidence pills. ToggleGroup gives roving-tabindex + a
          theme-safe selected treatment (data-[state=on] = forest-50 / dark tint)
          for free — deliberately NOT a hand-rolled brand pill, which is
          invisible in dark (surface-brand and text-inverse both resolve to
          sand-900). The `v &&` guard stops single-select from clearing to "". */}
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        spacing={1}
        value={filter}
        onValueChange={(v) => v && onFilterChange(v as FilterKey)}
        aria-label="Filter results by evidence"
        className="min-w-0 overflow-x-auto"
      >
        {FILTERS.map((f) => (
          <ToggleGroupItem key={f.key} value={f.key} className="shrink-0 rounded-full px-3">
            {f.label}
            <span className="ml-1.5 tabular-nums opacity-70">{counts[f.key]}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {/* + Add is an action, not a filter value — kept OUT of the ToggleGroup so
          it never joins the roving-tabindex set. Inert by default. */}
      <Button variant="ghost" size="sm" className="shrink-0" onClick={onAddFilter}>
        <Plus />
        Add
      </Button>

      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        value={view}
        onValueChange={(v) => v && onViewChange(v as ViewMode)}
        aria-label="Results view"
        className="ml-auto shrink-0"
      >
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <LayoutGrid />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="List view">
          <List />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

// ─── Update banner (inlined) ─────────────────────────────────────────────────

function WorkspaceBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  // Purely visual — announcement is handled by the persistent sr-only live
  // region in ResultsPanel. A role=status node inserted with its content already
  // present (as this banner is, being conditionally mounted) announces
  // unreliably across screen readers; a text change in a persistent region does not.
  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-success)] px-4 py-2 text-sm text-[var(--ds-color-text-success-strong)]">
      <Check className="size-4 shrink-0 text-[var(--ds-color-icon-success)]" />
      <span className="min-w-0 flex-1">{message}</span>
      <button
        type="button"
        aria-label="Dismiss update"
        onClick={onDismiss}
        className="-mr-1 flex size-6 shrink-0 items-center justify-center rounded-[var(--ds-shape-radius-sm)] text-[var(--ds-color-text-success-strong)] outline-none hover:bg-[var(--ds-color-surface-success-hover)] focus-visible:ring-1 focus-visible:ring-[var(--ds-color-border-focus)] [&>svg]:size-4"
      >
        <X />
      </button>
    </div>
  );
}

// ─── State renderers ─────────────────────────────────────────────────────────

function CenteredState({
  title,
  body,
  children,
}: {
  title: string;
  body?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      {children}
      <div>
        <p className="text-sm font-medium text-[var(--ds-color-text-default)]">{title}</p>
        {body && (
          <p className="mt-1 text-sm text-[var(--ds-color-text-subtle)]">{body}</p>
        )}
      </div>
    </div>
  );
}

// ─── ResultsPanel ────────────────────────────────────────────────────────────

export interface ResultsPanelProps {
  /** The VISIBLE (already-filtered) results. */
  results: Result[];
  /** Counts over the full set (drives the pill numbers + empty-vs-filter gate). */
  counts: EvidenceCounts;
  filter: FilterKey;
  onFilterChange: (filter: FilterKey) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  /** Favorites keyed by resultKey(result); one source of truth in the canvas. */
  favoritedIds: Set<string>;
  onFavorite: (result: Result, favorited: boolean) => void;
  /** Opens the detail slide-over (single/combo only — predicted is a no-op). */
  onSelectResult: (result: Result) => void;
  /** Breadcrumb count; omit while preparing. */
  searchesCompleted?: number;
  /** Replaces the filter bar + grid with a "Preparing workspace…" state. */
  preparing?: boolean;
  /** Banner text; null/undefined hides it. */
  updateMessage?: string | null;
  onDismissUpdate?: () => void;
  onAddFilter?: () => void;
  className?: string;
}

export function ResultsPanel({
  results,
  counts,
  filter,
  onFilterChange,
  view,
  onViewChange,
  favoritedIds,
  onFavorite,
  onSelectResult,
  searchesCompleted,
  preparing = false,
  updateMessage,
  onDismissUpdate,
  onAddFilter,
  className,
}: ResultsPanelProps) {
  const isEmpty = counts.all === 0;
  const noMatches = !isEmpty && results.length === 0;

  return (
    <div className={cn("flex h-full min-h-0 flex-col bg-[var(--ds-color-surface-canvas)]", className)}>
      {/* Persistent live region: always mounted, so a NEW search updating the
          banner text announces as a reliable text change (see WorkspaceBanner). */}
      <div role="status" aria-live="polite" className="sr-only">
        {updateMessage ?? ""}
      </div>

      {/* ── Header: breadcrumb ─────────────────────────────────────────────── */}
      <div className="flex shrink-0 items-center border-b border-[var(--ds-color-border-subtle)] px-4 py-2.5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[var(--ds-color-text-default)]">
                Workspace
              </BreadcrumbPage>
            </BreadcrumbItem>
            {!preparing && searchesCompleted != null && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="text-[var(--ds-color-text-subtle)]">
                  {searchesCompleted} search{searchesCompleted === 1 ? "" : "es"} completed
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {preparing ? (
        <CenteredState title="Preparing workspace…">
          <Spinner className="size-6 text-[var(--ds-color-text-subtle)]" />
        </CenteredState>
      ) : (
        <>
          {updateMessage && (
            <WorkspaceBanner message={updateMessage} onDismiss={onDismissUpdate} />
          )}

          {!isEmpty && (
            <EvidenceFilterBar
              filter={filter}
              counts={counts}
              onFilterChange={onFilterChange}
              view={view}
              onViewChange={onViewChange}
              onAddFilter={onAddFilter}
            />
          )}

          {/* ── Scroll region ────────────────────────────────────────────── */}
          <div className="scrollbar-overlay min-h-0 flex-1 overflow-y-auto p-4">
            {isEmpty ? (
              <CenteredState
                title="No results yet"
                body="Ask Hummingbird a question to populate the workspace."
              />
            ) : noMatches ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <p className="text-sm text-[var(--ds-color-text-subtle)]">
                  No {FILTER_LABEL[filter]} results yet.
                </p>
                <button
                  type="button"
                  onClick={() => onFilterChange("all")}
                  className="rounded-[var(--ds-shape-radius-sm)] text-sm font-medium text-[var(--ds-color-text-link-brand)] underline-offset-2 outline-none hover:underline focus-visible:ring-1 focus-visible:ring-[var(--ds-color-border-focus)]"
                >
                  Clear filter
                </button>
              </div>
            ) : view === "grid" ? (
              <CardGrid>
                {results.map((result) => (
                  <ResultCard
                    key={resultKey(result)}
                    result={{ ...result, isFavorited: favoritedIds.has(resultKey(result)) }}
                    onFavorite={(favorited) => onFavorite(result, favorited)}
                    onSelect={() => onSelectResult(result)}
                  />
                ))}
              </CardGrid>
            ) : (
              <div className="flex flex-col gap-2">
                {results.map((result) => (
                  <ResultCard
                    key={resultKey(result)}
                    result={{ ...result, isFavorited: favoritedIds.has(resultKey(result)) }}
                    onFavorite={(favorited) => onFavorite(result, favorited)}
                    onSelect={() => onSelectResult(result)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
