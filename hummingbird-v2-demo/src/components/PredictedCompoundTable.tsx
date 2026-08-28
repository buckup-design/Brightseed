import { X } from "lucide-react";
import type { PredictedCompoundRow } from "../data/demoScript";

interface PredictedCompoundTableProps {
  rows: PredictedCompoundRow[];
}

// Model-predicted candidates (see PredictedCompoundRow) — always candidates,
// no eliminated variant, so unlike CompoundTable this only ever renders the
// "remove" row action.
export default function PredictedCompoundTable({ rows }: PredictedCompoundTableProps) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-border text-left">
          <th className="px-2 py-2 font-medium text-foreground">Structural identifier</th>
          <th className="px-2 py-2 font-medium text-foreground">Predicted association</th>
          <th className="px-2 py-2 text-right font-medium text-foreground">Fingerprint score</th>
          <th className="px-2 py-2 font-medium text-foreground">Chemical grouping</th>
          <th className="px-2 py-2 text-right font-medium text-foreground">Predicted bioavailability</th>
          <th className="w-10 px-2 py-2" />
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} className="border-b border-border last:border-b-0">
            <td className="px-2 py-2 font-mono text-xs text-foreground">{row.structuralIdentifier}</td>
            <td className="px-2 py-2 text-foreground">{row.predictedAssociation}</td>
            <td className="px-2 py-2 text-right text-foreground">{row.fingerprintScore.toFixed(3)}</td>
            <td className="px-2 py-2 text-foreground">{row.chemicalGrouping}</td>
            <td
              className={`px-2 py-2 text-right text-foreground ${row.highlightBioavailability ? "font-semibold" : ""}`}
            >
              {row.predictedBioavailability}
            </td>
            <td className="px-2 py-2">
              <button
                type="button"
                aria-label={`Remove ${row.structuralIdentifier}`}
                className="flex size-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted hover:text-foreground"
              >
                <X size={14} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
