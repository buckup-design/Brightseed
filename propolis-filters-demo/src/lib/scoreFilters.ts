import type { Compound } from "../types";

export type ScoreField = "easeOfFormulation" | "solubility" | "fto" | "patentability" | "admet";

/**
 * Hardcoded per the spreadsheet's own declared scale (its column headers say
 * "(1 to 3)" / "(1 to 5)") rather than derived from what values happen to be
 * present — the floor is the "no filter applied yet" slider position.
 */
export const SCORE_RANGES: Record<ScoreField, { min: number; max: number }> = {
  easeOfFormulation: { min: 1, max: 3 },
  solubility: { min: 1, max: 5 },
  fto: { min: 1, max: 3 },
  patentability: { min: 1, max: 3 },
  admet: { min: 1, max: 3 },
};

/** "unknown", missing, or otherwise non-numeric cells parse to null rather than NaN. */
export function parseScore(value?: string): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * At the field's floor, everything passes (no filter applied yet). Above the
 * floor, only compounds with a real parsable score >= threshold pass —
 * "unknown"/missing scores can't be confirmed to qualify.
 */
export function matchesMinScore(compound: Compound, field: ScoreField, threshold: number): boolean {
  const { min } = SCORE_RANGES[field];
  if (threshold <= min) return true;
  const score = parseScore(compound[field]);
  return score !== null && score >= threshold;
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
