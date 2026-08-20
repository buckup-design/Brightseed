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
 * "Any published data" is everything except predicted — including real
 * compounds that simply have no recorded evidence-type bucket yet (e.g. the
 * 140 real Muscle Health compounds added from the ontology DAG, which have a
 * real name/benefit but no clinical/animal/in-vitro classification on record
 * for this demo). Leaving evidence-type unset isn't the same as being
 * predicted, so it shouldn't be excluded from "any" — only real classified
 * buckets are excluded from "any" by not matching a *specific* filter below.
 */
export function matchesEvidenceType(
  compound: Pick<Compound, "evidenceType">,
  filter: EvidenceTypeValue
): boolean {
  const bucket = normalize(compound.evidenceType);
  if (filter === "any") return bucket !== "predicted";
  return bucket === filter;
}

export function countEvidenceTypes(
  compounds: Pick<Compound, "evidenceType">[]
): Record<EvidenceTypeValue, number> {
  const counts: Record<EvidenceTypeValue, number> = {
    any: 0,
    clinical: 0,
    animal: 0,
    "in-vitro": 0,
    predicted: 0,
  };
  for (const compound of compounds) {
    const bucket = normalize(compound.evidenceType);
    if (bucket) counts[bucket] += 1;
  }
  // Matches matchesEvidenceType's "any" definition above: everything except
  // predicted, including compounds with no recorded bucket at all.
  counts.any = compounds.length - counts.predicted;
  return counts;
}
