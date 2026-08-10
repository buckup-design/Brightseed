/**
 * Filter model for the Filter Prototype — the faceted narrowing layer over a
 * Workspace result set.
 *
 * Ported from Anna's `propolis-filters` demo (branch `anna/filter-demo`), whose
 * logic layer was already presentation-free and is kept here close to verbatim.
 * Two things changed in the move:
 *
 *  1. It targets Quill's `Result` union instead of the demo's spreadsheet-derived
 *     `Compound`. The three facets land on fields Result already carries —
 *     Benefit → `benefit`, Compound Classes → `categories`, Biological Targets →
 *     `targets` — so no data was invented for them.
 *  2. Scores are `number | undefined` rather than strings. The demo parsed
 *     strings because its sheet had literal "unknown" cells; here `undefined` IS
 *     the unknown, so `parseScore` is gone. The SEMANTIC it protected is not:
 *     an unknown score still cannot be confirmed to meet a real threshold, so it
 *     passes at ANY and is excluded everywhere above it.
 *
 * Screening attributes live in a sidecar keyed by `resultKey(result)` (see
 * screening-data.ts), mirroring how WORKSPACE_DETAILS already hangs detail data
 * off results — nothing in the shipped `Result` type changes.
 */

import {
  resultKey,
  type Result,
} from "@/components/hummingbird/cards/result-card";

// ─── Screening profile ───────────────────────────────────────────────────────

/**
 * The feasibility / novelty / safety attributes the score panels filter on.
 * Every field is optional: a missing value is a genuine "unknown", not a zero,
 * and is treated as such by every predicate below.
 */
export interface ScreeningProfile {
  /** Comma-separated formats, e.g. "capsule, powder". */
  productFormat?: string;
  requiresDeliveryTechnology?: boolean;
  /** 1..5, higher = easier to formulate. */
  easeOfFormulation?: number;
  /** 1..5, higher = more soluble. */
  solubility?: number;
  /** 1..3, higher = more freedom to operate. */
  fto?: number;
  /** 1..3, higher = more patentable. */
  patentability?: number;
  /** 1..3 toxicity, LOWER is better — see matchesMaxToxicity. */
  admet?: number;
  hasGhsHazard?: boolean;
  grasSource?: boolean;
  nonNovelSource?: boolean;
}

export type ScreeningIndex = Record<string, ScreeningProfile>;

// ─── Facets ──────────────────────────────────────────────────────────────────

export interface FilterOption {
  label: string;
  count: number;
}

export interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
}

/** Pulls a filterable value (or values, for array fields like targets) off a result. */
export type FacetAccessor = (result: Result) => string | string[] | undefined;

function valuesOf(result: Result, getValues: FacetAccessor): string[] {
  const raw = getValues(result);
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

/**
 * Builds a filter group straight from the result data: counts how many results
 * carry each distinct value (via `getValues`), most-common first. Works for both
 * scalar fields (benefit) and array fields (targets, categories) — a result
 * counts once per distinct value it has either way.
 */
export function buildFilterGroup(
  results: Result[],
  id: string,
  title: string,
  getValues: FacetAccessor
): FilterGroup {
  const counts = new Map<string, number>();
  for (const result of results) {
    for (const value of new Set(valuesOf(result, getValues))) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }

  const options = [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  return { id, title, options };
}

/**
 * `null` = pristine, nothing ever clicked — matches everything, and every chip
 * should render as if selected. Once the user clicks anything, this becomes a
 * real (possibly empty) Set and is taken literally from then on — including an
 * explicitly-emptied Set, which matches nothing.
 */
export type FacetSelection = Set<string> | null;

/** Pristine (null) → everything matches. Otherwise: union — match if the result has ANY selected value (a real but empty Set matches nothing). */
export function matchesAnySelected(
  result: Result,
  selected: FacetSelection,
  getValues: FacetAccessor
): boolean {
  if (selected === null) return true;
  return valuesOf(result, getValues).some((value) => selected.has(value));
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
 * The first-ever click on a pristine (null) facet narrows straight to just that
 * one value — "filter to one, deselect the rest" — rather than toggling against
 * an empty Set (which would look the same today but would then also let the very
 * next click empty it back to null/pristine, silently reverting to "everything"
 * instead of honoring an intentional "select nothing"). Every click after that is
 * a normal add/remove toggle, which can reach — and stay at — a real empty Set.
 */
export function toggleFacetSelection(current: FacetSelection, value: string): Set<string> {
  if (current === null) return new Set([value]);
  return toggleSetValue(current, value);
}

// ─── Score filters ───────────────────────────────────────────────────────────

export type ScoreField = "easeOfFormulation" | "solubility" | "fto" | "patentability" | "admet";

/**
 * Every slider's floor (0) is "ANY" — no filter applied, dot at the far left,
 * always the default — and always includes results with no score recorded. For
 * every field except `admet`, the real scale then ascends left-to-right: 0 (ANY),
 * 1, 2, 3(, 4, 5) — see `matchesMinScore`, where a result must carry a real score
 * >= the threshold once it's off 0.
 *
 * `admet` ("Acceptable toxicity score") is the one exception: it's a *maximum*
 * filter, not a minimum, and its labels are deliberately reversed — sliding right
 * still tightens the filter (per Anna), but here that means *lower* allowed
 * toxicity, so position 1="High" (max real value 3, barely restrictive), 2="Med"
 * (max 2), 3="Low" (max 1, the most restrictive). See `matchesMaxToxicity`.
 *
 * `easeOfFormulation` is a 5-point scale per Anna. Her original note carried a
 * [CONCERN] that her sheet's own values topped out at 3, so dragging past 3 would
 * zero the results; the fixtures here are authored across the full 1..5 range, so
 * that concern does not carry over to this prototype.
 */
export const SCORE_RANGES: Record<ScoreField, { min: number; max: number }> = {
  easeOfFormulation: { min: 0, max: 5 },
  solubility: { min: 0, max: 5 },
  fto: { min: 0, max: 3 },
  patentability: { min: 0, max: 3 },
  admet: { min: 0, max: 3 }, // position 0..3 — see matchesMaxToxicity, not a real score scale
};

/** `labels[0]` is the ANY/floor label; `labels[n]` is the label for slider value `n`. */
export function scoreLabelFormatter(labels: string[]): (value: number) => string {
  return (value) => labels[value] ?? String(value);
}

export const THREE_POINT_LABELS = ["ANY", "LOW", "MEDIUM", "HIGH"];
export const FEASIBILITY_LABELS = ["ANY", "Very Hard", "Hard", "Moderate", "Easy", "Very Easy"];
export const SOLUBILITY_LABELS = ["ANY", "Lowest", "Low", "Medium", "High", "Highest"];
/** Slider position → label. Reversed vs. the real admet scale — see SCORE_RANGES. */
export const TOXICITY_LABELS = ["ANY", "High", "Med", "Low"];
/** Slider position → the real max-toxicity threshold it enforces (null = ANY). */
const TOXICITY_POSITION_TO_MAX: Array<number | null> = [null, 3, 2, 1];

/**
 * At the field's floor (0/ANY) everything passes, including results with no
 * recorded score. Above the floor, only results with a real score >= threshold
 * pass — an unknown score can't be confirmed to meet a real minimum. Doesn't
 * apply to `admet`; use `matchesMaxToxicity` for that field.
 */
export function matchesMinScore(
  profile: ScreeningProfile | undefined,
  field: ScoreField,
  threshold: number
): boolean {
  if (threshold <= SCORE_RANGES[field].min) return true;
  const score = profile?.[field];
  return score !== undefined && score >= threshold;
}

/**
 * `admet`-specific: position 0 is ANY (everything passes, including unknown).
 * Positions 1-3 enforce a real *maximum* allowed toxicity (High/Med/Low, per
 * TOXICITY_POSITION_TO_MAX) — an unknown score can't be confirmed to meet it, so
 * it's excluded once off ANY, same as every other field.
 */
export function matchesMaxToxicity(
  profile: ScreeningProfile | undefined,
  position: number
): boolean {
  const threshold = TOXICITY_POSITION_TO_MAX[position] ?? null;
  if (threshold === null) return true;
  const score = profile?.admet;
  return score !== undefined && score <= threshold;
}

/**
 * Off = show everything. On = the result's flag must actually equal `required` —
 * an unrecorded flag is excluded, same "can't confirm it" rule the scores use.
 */
export function matchesFlag(
  value: boolean | undefined,
  enabled: boolean,
  required: boolean
): boolean {
  if (!enabled) return true;
  return value === required;
}

const NON_OPTIONS = new Set(["n/a", "unknown"]);

/** Distinct real product-format values across the set, sorted — skips placeholders. */
export function buildProductFormatOptions(
  results: Result[],
  screening: ScreeningIndex
): string[] {
  const options = new Set<string>();
  for (const result of results) {
    const format = screening[resultKey(result)]?.productFormat;
    if (!format || NON_OPTIONS.has(format)) continue;
    for (const part of format.split(",")) {
      const trimmed = part.trim();
      if (trimmed) options.add(trimmed);
    }
  }
  return [...options].sort();
}

/** Empty selection ("Any") passes everything; otherwise the comma-list must include it. */
export function matchesProductFormat(
  profile: ScreeningProfile | undefined,
  selected: string
): boolean {
  if (!selected) return true;
  if (!profile?.productFormat) return false;
  return profile.productFormat.split(",").some((part) => part.trim() === selected);
}

// ─── Composed state + predicate ──────────────────────────────────────────────

/** Everything the drawer controls, in one bag the canvas owns. */
export interface FilterState {
  benefits: FacetSelection;
  classes: FacetSelection;
  targets: FacetSelection;
  productFormat: string;
  requiresNoDeliveryTech: boolean;
  formulationScore: number;
  solubilityScore: number;
  ftoScore: number;
  patentabilityScore: number;
  admetScore: number;
  noGhsHazard: boolean;
  requiresGras: boolean;
  requiresNonNovel: boolean;
}

/** Pristine: every facet null, every slider at its floor, every switch off. */
export const INITIAL_FILTER_STATE: FilterState = {
  benefits: null,
  classes: null,
  targets: null,
  productFormat: "",
  requiresNoDeliveryTech: false,
  formulationScore: SCORE_RANGES.easeOfFormulation.min,
  solubilityScore: SCORE_RANGES.solubility.min,
  ftoScore: SCORE_RANGES.fto.min,
  patentabilityScore: SCORE_RANGES.patentability.min,
  admetScore: SCORE_RANGES.admet.min,
  noGhsHazard: false,
  requiresGras: false,
  requiresNonNovel: false,
};

/** True when nothing is narrowing — drives the "Clear all" affordance. */
export function isPristine(state: FilterState): boolean {
  return (
    state.benefits === null &&
    state.classes === null &&
    state.targets === null &&
    state.productFormat === "" &&
    !state.requiresNoDeliveryTech &&
    state.formulationScore === SCORE_RANGES.easeOfFormulation.min &&
    state.solubilityScore === SCORE_RANGES.solubility.min &&
    state.ftoScore === SCORE_RANGES.fto.min &&
    state.patentabilityScore === SCORE_RANGES.patentability.min &&
    state.admetScore === SCORE_RANGES.admet.min &&
    !state.noGhsHazard &&
    !state.requiresGras &&
    !state.requiresNonNovel
  );
}

export const FACET_ACCESSORS = {
  benefit: (r: Result) => r.benefit,
  categories: (r: Result) => r.categories,
  targets: (r: Result) => r.targets,
} satisfies Record<string, FacetAccessor>;

/** The single predicate the drawer's whole state resolves to. */
export function applyFilters(
  results: Result[],
  state: FilterState,
  screening: ScreeningIndex
): Result[] {
  return results.filter((result) => {
    const profile = screening[resultKey(result)];
    return (
      matchesAnySelected(result, state.benefits, FACET_ACCESSORS.benefit) &&
      matchesAnySelected(result, state.classes, FACET_ACCESSORS.categories) &&
      matchesAnySelected(result, state.targets, FACET_ACCESSORS.targets) &&
      matchesProductFormat(profile, state.productFormat) &&
      matchesFlag(profile?.requiresDeliveryTechnology, state.requiresNoDeliveryTech, false) &&
      matchesMinScore(profile, "easeOfFormulation", state.formulationScore) &&
      matchesMinScore(profile, "solubility", state.solubilityScore) &&
      matchesMinScore(profile, "fto", state.ftoScore) &&
      matchesMinScore(profile, "patentability", state.patentabilityScore) &&
      matchesMaxToxicity(profile, state.admetScore) &&
      matchesFlag(profile?.hasGhsHazard, state.noGhsHazard, false) &&
      matchesFlag(profile?.grasSource, state.requiresGras, true) &&
      matchesFlag(profile?.nonNovelSource, state.requiresNonNovel, true)
    );
  });
}
