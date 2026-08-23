import type { Compound } from "../types";

export type EvidenceTypeValue = "any" | "clinical" | "animal" | "in-vitro" | "predicted";

export const EVIDENCE_TYPE_OPTIONS: { value: EvidenceTypeValue; label: string }[] = [
  { value: "any", label: "Any published data" },
  { value: "clinical", label: "Clinical" },
  { value: "animal", label: "Animal" },
  { value: "in-vitro", label: "In Vitro" },
  { value: "predicted", label: "Predicted" },
];

type EvidenceTypeBucket = Exclude<EvidenceTypeValue, "any">;

function normalize(evidenceType?: string): EvidenceTypeBucket | undefined {
  const value = evidenceType?.toLowerCase().trim();
  if (value === "clinical") return "clinical";
  if (value === "animal") return "animal";
  if (value === "in vitro" || value === "in-vitro") return "in-vitro";
  if (value === "predicted") return "predicted";
  return undefined;
}

/**
 * Resolves a compound's real evidence-type bucket(s) as a set — 0, 1, or
 * (combos only) many. Prefers the plural `evidenceTypes` (combos can carry
 * e.g. both "clinical" and "animal" at once); falls back to wrapping the
 * singular `evidenceType` in a one-element set otherwise, so every existing
 * single/predicted compound resolves to exactly the same 0-or-1-element
 * result it always did.
 */
function bucketsFor(
  compound: Pick<Compound, "evidenceType" | "evidenceTypes">
): Set<EvidenceTypeBucket> {
  const raw =
    compound.evidenceTypes && compound.evidenceTypes.length > 0
      ? compound.evidenceTypes
      : compound.evidenceType != null
        ? [compound.evidenceType]
        : [];
  const buckets = new Set<EvidenceTypeBucket>();
  for (const value of raw) {
    const bucket = normalize(value);
    if (bucket) buckets.add(bucket);
  }
  return buckets;
}

/**
 * "Any published data" is everything except predicted — including real
 * compounds that simply have no recorded evidence-type bucket yet (e.g. the
 * 140 real Muscle Health compounds added from the ontology DAG, which have a
 * real name/benefit but no clinical/animal/in-vitro classification on record
 * for this demo). Leaving evidence-type unset isn't the same as being
 * predicted, so it shouldn't be excluded from "any" — only real classified
 * buckets are excluded from "any" by not matching a *specific* filter below.
 * A combo with multiple buckets matches "any" as long as at least one of
 * them isn't "predicted" (predicted never co-occurs with another bucket in
 * practice, but this stays correct even if it did).
 */
export function matchesEvidenceType(
  compound: Pick<Compound, "evidenceType" | "evidenceTypes">,
  filter: EvidenceTypeValue
): boolean {
  const buckets = bucketsFor(compound);
  if (filter === "any") {
    if (buckets.size === 0) return true;
    return [...buckets].some((bucket) => bucket !== "predicted");
  }
  return buckets.has(filter);
}

export function countEvidenceTypes(
  compounds: Pick<Compound, "evidenceType" | "evidenceTypes">[]
): Record<EvidenceTypeValue, number> {
  const counts: Record<EvidenceTypeValue, number> = {
    any: 0,
    clinical: 0,
    animal: 0,
    "in-vitro": 0,
    predicted: 0,
  };
  for (const compound of compounds) {
    const buckets = bucketsFor(compound);
    // A combo with both clinical and animal evidence increments BOTH
    // buckets' counts — selecting either filter should surface it, so each
    // bucket it belongs to gets its own count.
    for (const bucket of buckets) counts[bucket] += 1;
    if (matchesEvidenceType(compound, "any")) counts.any += 1;
  }
  return counts;
}
