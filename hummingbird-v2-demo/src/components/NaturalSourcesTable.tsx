import { Check, Plus, X } from "lucide-react";
import type { GrasStatus, NaturalSourceRow } from "../data/demoScript";

interface NaturalSourcesTableProps {
  variant: "candidates" | "eliminated";
  compoundColumns: string[];
  rows: NaturalSourceRow[];
  /** Shared across candidates + eliminated so bar scale is comparable between the two sections — see NaturalSourcesCard. */
  maxPredicted: number;
}

const GRAS_STATUS_LABEL: Record<GrasStatus, string> = {
  listed: "yes",
  "no-entry": "—",
  pending: "†",
};

// A greyscale bar, scaled to maxPredicted, kept from Anna's reference
// screenshot; everything else about that screenshot (color-coded cells,
// title/legend) was simplified away to match the rest of the app.
function PredictedCompoundsBar({ value, max }: { value: number; max: number }) {
  const widthPercent = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex w-full items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-muted-foreground" style={{ width: `${widthPercent}%` }} />
      </div>
      <span className="tabular-nums text-foreground">{value}</span>
    </div>
  );
}

// One of the two tables on a NaturalSourcesCard (Candidates / Eliminated),
// matching CompoundTable's structure and row-action icon on the Compounds
// tab (X to "remove" a candidate, + to "restore" an eliminated one).
export default function NaturalSourcesTable({ variant, compoundColumns, rows, maxPredicted }: NaturalSourcesTableProps) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-border text-left">
          <th className="px-2 py-2 font-medium text-foreground">Natural source</th>
          {compoundColumns.map((compound) => (
            <th key={compound} className="px-2 py-2 text-center font-medium text-foreground">
              {compound}
            </th>
          ))}
          <th className="px-2 py-2 font-medium text-foreground">Direct</th>
          <th className="px-2 py-2 font-medium text-foreground">Predicted compounds</th>
          <th className="px-2 py-2 text-center font-medium text-foreground">GRAS</th>
          <th className="w-10 px-2 py-2" />
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} className="border-b border-border last:border-b-0">
            <td className="px-2 py-2 align-top">
              <span className="italic text-foreground">{row.scientificName}</span>
              {row.commonName && <span className="block text-xs text-muted-foreground">{row.commonName}</span>}
            </td>
            {row.directCompoundFlags.map((present, index) => (
              <td key={index} className="px-2 py-2 text-center align-top">
                {present && <Check size={14} className="mx-auto text-foreground" />}
              </td>
            ))}
            <td className="px-2 py-2 align-top text-foreground">{row.directCount}</td>
            <td className="px-2 py-2 align-top">
              <PredictedCompoundsBar value={row.predictedCompoundsCount} max={maxPredicted} />
            </td>
            <td className="px-2 py-2 text-center align-top text-foreground">{GRAS_STATUS_LABEL[row.grasStatus]}</td>
            <td className="px-2 py-2 align-top">
              <button
                type="button"
                aria-label={variant === "candidates" ? `Remove ${row.scientificName}` : `Restore ${row.scientificName}`}
                className="flex size-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted hover:text-foreground"
              >
                {variant === "candidates" ? <X size={14} /> : <Plus size={14} />}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
