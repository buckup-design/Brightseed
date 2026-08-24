import type { Compound } from "../types";

export type ScoreField = "easeOfFormulation" | "solubility" | "fto" | "patentability" | "admet";

/**
 * Every slider's floor (0) is "ANY" — no filter applied, dot at the far
 * left, always the default — and always includes compounds with no parsable
 * score ("unknown"/missing). For every field except `admet`, the real scale
 * then ascends left-to-right: 0 (ANY), 1, 2, 3(, 4, 5) — `matchesMinScore`
 * below, a compound must have a real score >= the threshold once it's off 0.
 *
 * `admet` ("Maximum toxicity score") is the one exception: it's a *maximum*
 * filter, not a minimum, and its real labels are deliberately reversed —
 * sliding right still tightens the filter (per Anna), but here that means
 * *lower* allowed toxicity, so position 1="High" (max real value 3, i.e.
 * barely restrictive — everything real still passes), 2="Med" (max 2), and
 * 3="Low" (max 1, the most restrictive: only real Low-toxicity compounds
 * pass). See `matchesMaxToxicity` below — `matchesMinScore` doesn't apply.
 *
 * `easeOfFormulation` is a 5-point scale (per Anna, now Very Hard..Very Easy
 * — see `FEASIBILITY_LABELS`), even though the sheet's own column header
 * says "(1 to 3)" and every real compound's `easeOfFormulation` value
 * therefore tops out at 3 — [CONCERN, not blocking]: dragging this slider
 * past 3 will currently zero out the results, since no compound in the
 * dataset scores that high. Flagging in case that's not intended; easy to
 * bring the real scale back to 3 if so. `solubility`'s 5-point scale already
 * matches the sheet's own "(1 to 5)" data.
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
/** Slider position → label. Reversed vs. the real admet scale — see SCORE_RANGES's admet comment. */
export const TOXICITY_LABELS = ["ANY", "High", "Med", "Low"];
/** Slider position → the real max-toxicity threshold it enforces (null = ANY, no threshold). */
const TOXICITY_POSITION_TO_MAX: Array<number | null> = [null, 3, 2, 1];

/** "unknown", missing, or otherwise non-numeric cells parse to null rather than NaN. */
export function parseScore(value?: string): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * At the field's floor (0/ANY), everything passes, including compounds with
 * no parsable score ("unknown"/missing). Above the floor, only compounds
 * with a real parsable score >= threshold pass — an unknown score can't be
 * confirmed to meet a real minimum. Doesn't apply to `admet` — use
 * `matchesMaxToxicity` for that field instead.
 */
export function matchesMinScore(compound: Compound, field: ScoreField, threshold: number): boolean {
  const { min } = SCORE_RANGES[field];
  if (threshold <= min) return true;
  const score = parseScore(compound[field]);
  return score !== null && score >= threshold;
}

/**
 * `admet`-specific: position 0 is ANY (everything passes, including
 * unknown). Positions 1-3 enforce a real *maximum* allowed toxicity
 * (High/Med/Low, per TOXICITY_POSITION_TO_MAX) — an unknown score can't be
 * confirmed to meet it, so it's excluded once off ANY, same as every other
 * field.
 */
export function matchesMaxToxicity(compound: Compound, position: number): boolean {
  const threshold = TOXICITY_POSITION_TO_MAX[position] ?? null;
  if (threshold === null) return true;
  const score = parseScore(compound.admet);
  return score !== null && score <= threshold;
}

/** Off = show everything. On = only compounds whose raw field value matches exactly. */
export function matchesFlag(rawValue: string | undefined, enabled: boolean, matchValue: string): boolean {
  if (!enabled) return true;
  return rawValue === matchValue;
}

const NON_OPTIONS = new Set(["n/a", "unknown"]);

/** Distinct real product-format values across the dataset, sorted — skips "n/a"/"unknown" placeholders. */
export function buildProductFormatOptions(compounds: Compound[]): string[] {
  const options = new Set<string>();
  for (const compound of compounds) {
    if (!compound.productFormat || NON_OPTIONS.has(compound.productFormat)) continue;
    for (const part of compound.productFormat.split(",")) {
      const trimmed = part.trim();
      if (trimmed) options.add(trimmed);
    }
  }
  return [...options].sort();
}

/** Empty selection ("Any") passes everything; otherwise the compound's comma-list must include the selected format. */
export function matchesProductFormat(compound: Compound, selected: string): boolean {
  if (!selected) return true;
  if (!compound.productFormat) return false;
  return compound.productFormat.split(",").some((part) => part.trim() === selected);
}
