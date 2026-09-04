import { Check } from "lucide-react";

import type { CellValue, ColumnDef } from "@/components/ui/data-table";
import type {
  CombinationRow,
  EvidencedCompound,
  GrasStatus,
  MatrixCompound,
  NaturalSourceRow,
  PredictedCompound,
} from "@/components/hummingbird/project-data";

/**
 * Column definitions for the discovery flow's tables.
 *
 * Every table in the flow is a column array over the shared engine, so this file
 * is the whole difference between them. Nothing here renders — these are data,
 * which is what lets the natural-sources matrix generate its middle columns from
 * a runtime list in one `.map`.
 *
 * Headers are sentence case per the naming rule; the mock's "Evidence Context"
 * and "Natural Sources" are title case and are corrected here.
 *
 * hummingbird/ tier: pure TypeScript, no styles, no tokens.
 */

/**
 * GRAS is tri-state. "—" for no entry and "†" for pending are value glyphs, not
 * prose, and the "†" is what the card's footnote explains.
 *
 * Glyphs alone are not accessible text: a screen reader at default punctuation
 * reads "—" as nothing at all (an empty cell, indistinguishable from missing
 * data) and "†" as "dagger". The footnote that explains the dagger lives outside
 * the table with no programmatic association, so each state carries its own
 * spoken label.
 */
const GRAS_LABELS = { yes: "yes", no: "—", unknown: "†" };
const GRAS_SR_LABELS = {
  yes: "GRAS listed",
  no: "No GRAS entry",
  unknown: "GRAS status pending review",
};

function grasCell(status: GrasStatus): CellValue {
  return {
    kind: "flag",
    value: status === "listed" ? true : status === "pending" ? null : false,
    labels: GRAS_LABELS,
    srLabels: GRAS_SR_LABELS,
  };
}

// ── Compounds with direct evidence ─────────────────────────────────────────

export function compoundEvidenceColumns(handlers?: {
  onOpenCompound?: (row: EvidencedCompound) => void;
  onOpenEvidence?: (row: EvidencedCompound) => void;
}): ColumnDef<EvidencedCompound>[] {
  return [
    {
      id: "compound",
      header: "Compound",
      width: "18%",
      cell: (row) => ({
        kind: "link",
        label: row.compoundName,
        onClick: () => handlers?.onOpenCompound?.(row),
      }),
    },
    {
      id: "association",
      header: "Predicted association",
      width: "16%",
      cell: (row) => ({ kind: "text", value: row.predictedAssociation }),
    },
    {
      id: "evidence",
      header: "Evidence context",
      width: "30%",
      cell: (row) => ({
        kind: "link",
        label: row.evidenceContextLabel,
        onClick: () => handlers?.onOpenEvidence?.(row),
      }),
    },
    {
      id: "food-grade",
      header: "Food grade",
      width: "9%",
      cell: (row) => ({ kind: "flag", value: row.foodGrade }),
    },
    {
      id: "drink",
      header: "Drink",
      width: "8%",
      cell: (row) => ({ kind: "flag", value: row.drink }),
    },
    {
      id: "gummy",
      header: "Gummy",
      width: "8%",
      cell: (row) => ({ kind: "flag", value: row.gummy }),
    },
  ];
}

// ── Top predicted compounds ────────────────────────────────────────────────

export function predictedCompoundColumns(): ColumnDef<PredictedCompound>[] {
  return [
    {
      id: "identifier",
      header: "Structural identifier",
      width: "22%",
      cell: (row) => ({ kind: "text", value: row.structuralIdentifier, mono: true }),
    },
    {
      id: "association",
      header: "Predicted association",
      width: "20%",
      cell: (row) => ({ kind: "text", value: row.predictedAssociation }),
    },
    {
      id: "fingerprint",
      header: "Fingerprint score",
      align: "end",
      width: "14%",
      cell: (row) => ({ kind: "number", value: row.fingerprintScore }),
    },
    {
      id: "grouping",
      header: "Chemical grouping",
      width: "20%",
      cell: (row) => ({ kind: "text", value: row.chemicalGrouping }),
    },
    {
      id: "bioavailability",
      header: "Predicted bioavailability",
      align: "end",
      width: "18%",
      /* A range string, not a number — "0.37–0.78", sometimes with a footnote
       * asterisk. Kept as text so the range and the marker survive intact. */
      cell: (row) => ({
        kind: "text",
        value: row.predictedBioavailability,
        emphasis: row.highlightBioavailability,
      }),
    },
  ];
}

// ── Natural sources (the presence matrix) ──────────────────────────────────

/**
 * The matrix. `compounds` comes from the compounds kept in the stage before, so
 * the middle columns are literally the previous decision made visible — which is
 * why the engine takes a column ARRAY rather than JSX children.
 *
 * Presence is looked up BY ID, never by position. The kept set both shrinks and
 * is ordered differently from the row's own fields, so an index would quietly
 * shift every check mark sideways.
 *
 * `max` normalizes the predicted-compounds meter against the dataset, not
 * against 1.
 */
export function naturalSourceColumns(
  compounds: MatrixCompound[],
  max: number,
): ColumnDef<NaturalSourceRow>[] {
  return [
    {
      id: "source",
      header: "Natural source",
      width: "16%",
      pin: "start",
      cell: (row) => ({
        kind: "entity",
        primary: row.scientificName,
        secondary: row.commonName || undefined,
        italic: true,
      }),
    },
    ...compounds.map((compound) => ({
      id: `compound-${compound.id}`,
      header: compound.label,
      align: "center" as const,
      cell: (row: NaturalSourceRow) =>
        ({
          kind: "presence",
          present: row.directCompounds[compound.id] ?? false,
          label: `${compound.label} present in ${row.scientificName}`,
        }) as CellValue,
    })),
    {
      id: "direct",
      header: "Direct",
      align: "end",
      width: "7%",
      /* Counted over the columns actually SHOWN, not the fixture's frozen
       * directCount — eliminate a compound and this must fall with it, or the
       * row claims evidence for a compound no longer on screen. */
      cell: (row) => ({
        kind: "number",
        value: compounds.reduce(
          (n, c) => n + (row.directCompounds[c.id] ? 1 : 0),
          0,
        ),
      }),
    },
    {
      id: "predicted",
      header: "Predicted compounds",
      width: "14%",
      cell: (row) => ({
        kind: "meter",
        value: row.predictedCompoundsCount,
        max,
      }),
    },
    {
      id: "gras",
      header: "GRAS",
      width: "7%",
      cell: (row) => grasCell(row.grasStatus),
    },
  ];
}

/** The meter's denominator: the largest count across every row shown. */
export function sourceMeterMax(...groups: NaturalSourceRow[][]): number {
  return Math.max(
    1,
    ...groups.flat().map((row) => row.predictedCompoundsCount),
  );
}

// ── Best combinations (mixture info) ───────────────────────────────────────

export function combinationColumns(): ColumnDef<CombinationRow>[] {
  return [
    {
      id: "rank",
      header: "Rank",
      width: "8%",
      cell: (row) => ({ kind: "rank", value: row.rank }),
    },
    {
      id: "combination",
      header: "Combination",
      width: "42%",
      cell: (row) => ({ kind: "text", value: row.combinationLabel }),
    },
    {
      id: "predicted",
      header: "Additional predicted bioactives",
      align: "end",
      width: "26%",
      cell: (row) => ({ kind: "number", value: row.combinedPredicted }),
    },
    {
      id: "gras",
      header: "GRAS status",
      width: "24%",
      /* The fixture's label carries its own "✓". Strip it and let the status
       * cell supply the icon, so the glyph is decorative and the text is read. */
      cell: (row) => ({
        kind: "status",
        label: row.grasStatusLabel.replace("✓ ", ""),
        tone: "success",
        icon: Check,
      }),
    },
  ];
}
