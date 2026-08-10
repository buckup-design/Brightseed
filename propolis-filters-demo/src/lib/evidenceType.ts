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

/** "Any published data" is the superset of clinical + animal + in vitro — everything except predicted. */
export function matchesEvidenceType(
  compound: Pick<Compound, "evidenceType">,
  filter: EvidenceTypeValue
): boolean {
  const bucket = normalize(compound.evidenceType);
  if (filter === "any") return bucket !== undefined && bucket !== "predicted";
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
  counts.any = counts.clinical + counts.animal + counts["in-vitro"];
  return counts;
}
