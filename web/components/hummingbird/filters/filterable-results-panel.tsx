"use client";

/**
 * FilterableResultsPanel — the Filter Prototype's top-level composition: the
 * Workspace results panel with the faceted FilterDrawer wired into the `+ Add`
 * button that has been sitting inert in the filter bar.
 *
 * It owns every piece of filter state and hands ResultsPanel a fully-derived
 * view, which is the same contract the WorkspaceCanvas already has with that
 * panel — one copy of the state upstream, so the pill counts, the drawer's
 * controls, and the grid can never disagree.
 *
 * Ported from Anna's `propolis-filters` demo (branch `anna/filter-demo`).
 *
 * WORK IN PROGRESS. On promotion this composition is what WorkspaceCanvas should
 * absorb, so the drawer reaches the real Workspace rather than only this story.
 */

import * as React from "react";

import {
  ResultsPanel,
  evidenceCounts,
  filterResults,
  type FilterKey,
  type ViewMode,
} from "@/components/hummingbird/workspace/results-panel";
import {
  resultKey,
  type Result,
} from "@/components/hummingbird/cards/result-card";
import { FilterDrawer } from "./filter-drawer";
import {
  FACET_ACCESSORS,
  INITIAL_FILTER_STATE,
  applyFilters,
  buildFilterGroup,
  buildProductFormatOptions,
  type FilterState,
  type ScreeningIndex,
} from "./filter-model";

export interface FilterableResultsPanelProps {
  results: Result[];
  screening: ScreeningIndex;
  /** Start with the drawer expanded. Default true, so the story lands on it. */
  defaultDrawerOpen?: boolean;
  searchesCompleted?: number;
  className?: string;
}

export function FilterableResultsPanel({
  results,
  screening,
  defaultDrawerOpen = true,
  searchesCompleted = 1,
  className,
}: FilterableResultsPanelProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(defaultDrawerOpen);
  const [filters, setFilters] = React.useState<FilterState>(INITIAL_FILTER_STATE);
  const [evidence, setEvidence] = React.useState<FilterKey>("all");
  const [view, setView] = React.useState<ViewMode>("grid");
  const [favoritedIds, setFavoritedIds] = React.useState<Set<string>>(
    () => new Set(results.filter((r) => r.isFavorited).map(resultKey))
  );

  // Facet groups and their counts are built from the FULL set, once. Same reason
  // the evidence pills' counts are: a count that moved as you narrowed would
  // make the chips impossible to aim at.
  const benefitGroup = React.useMemo(
    () => buildFilterGroup(results, "benefit", "Benefit", FACET_ACCESSORS.benefit),
    [results]
  );
  const classGroup = React.useMemo(
    () => buildFilterGroup(results, "classes", "Compound Classes", FACET_ACCESSORS.categories),
    [results]
  );
  const targetGroup = React.useMemo(
    () =>
      buildFilterGroup(
        results,
        "targets",
        "Biological Targets + Biomarkers",
        FACET_ACCESSORS.targets
      ),
    [results]
  );
  const productFormatOptions = React.useMemo(
    () => buildProductFormatOptions(results, screening),
    [results, screening]
  );

  const counts = React.useMemo(() => evidenceCounts(results), [results]);

  // Both predicates, applied in either order — the drawer's narrowing and the
  // evidence pill are independent.
  const visible = React.useMemo(
    () => filterResults(applyFilters(results, filters, screening), evidence),
    [results, filters, screening, evidence]
  );

  const clearAll = React.useCallback(() => {
    setFilters(INITIAL_FILTER_STATE);
    setEvidence("all");
  }, []);

  return (
    <ResultsPanel
      className={className}
      results={visible}
      counts={counts}
      filter={evidence}
      onFilterChange={setEvidence}
      view={view}
      onViewChange={setView}
      favoritedIds={favoritedIds}
      onFavorite={(result, favorited) =>
        setFavoritedIds((current) => {
          const next = new Set(current);
          if (favorited) next.add(resultKey(result));
          else next.delete(resultKey(result));
          return next;
        })
      }
      // Detail is out of scope for the filter prototype — the drawer is what's
      // under review here, and WorkspaceCanvas already owns the slide-over.
      onSelectResult={() => {}}
      searchesCompleted={searchesCompleted}
      onAddFilter={() => setDrawerOpen((open) => !open)}
      filterDrawerExpanded={drawerOpen}
      onClearFilters={clearAll}
      filterDrawer={
        drawerOpen ? (
          <FilterDrawer
            benefitGroup={benefitGroup}
            classGroup={classGroup}
            targetGroup={targetGroup}
            productFormatOptions={productFormatOptions}
            state={filters}
            onChange={setFilters}
          />
        ) : undefined
      }
    />
  );
}
