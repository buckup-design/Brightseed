import type { Compound, FilterGroup } from "../types";

/** Pulls a filterable value (or values, for array fields like targets) off a compound. */
type FacetAccessor = (compound: Compound) => string | string[] | undefined;

function valuesOf(compound: Compound, getValues: FacetAccessor): string[] {
  const raw = getValues(compound);
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

/**
 * Builds a filter group straight from the compound data: counts how many
 * compounds carry each distinct value (via `getValues`), most-common first.
 * Works for both scalar fields (benefit, classification) and array fields
 * (targets) — a compound counts once per distinct value it has either way.
 */
export function buildFilterGroup(
  compounds: Compound[],
  id: string,
  title: string,
  getValues: FacetAccessor
): FilterGroup {
  const counts = new Map<string, number>();
  for (const compound of compounds) {
    for (const value of new Set(valuesOf(compound, getValues))) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }

  const options = [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  return { id, title, options };
}

/**
 * `null` = pristine, nothing ever clicked — matches everything, and every
 * chip should render as if selected. Once the user clicks anything, this
 * becomes a real (possibly empty) Set and is taken literally from then on —
 * including an explicitly-emptied Set, which matches nothing.
 */
export type FacetSelection = Set<string> | null;

/** Pristine (null) → everything matches. Otherwise: union — match if the compound has ANY selected value (a real but empty Set matches nothing). */
export function matchesAnySelected(
  compound: Compound,
  selected: FacetSelection,
  getValues: FacetAccessor
): boolean {
  if (selected === null) return true;
  return valuesOf(compound, getValues).some((value) => selected.has(value));
}

export function toggleSetValue(current: Set<string>, value: string): Set<string> {
  const next = new Set(current);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}

/**
 * The first-ever click on a pristine (null) facet narrows straight to just
 * that one value — "filter to one, deselect the rest" — rather than toggling
 * against an empty Set (which would look the same today but would then also
 * let the very next click empty it back to null/pristine, silently reverting
 * to "everything" instead of honoring an intentional "select nothing").
 * Every click after that is a normal add/remove toggle, which can reach —
 * and stay at — a real empty Set.
 */
export function toggleFacetSelection(current: FacetSelection, value: string): Set<string> {
  if (current === null) return new Set([value]);
  return toggleSetValue(current, value);
}
