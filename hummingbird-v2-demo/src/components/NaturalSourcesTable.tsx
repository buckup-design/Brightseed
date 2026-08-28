import { Check } from "lucide-react";
import type { NaturalSourcesCardData } from "../data/demoScript";

interface NaturalSourcesTableProps {
  card: NaturalSourcesCardData;
}

// The Natural Sources tab's table. Anna's reference screenshot has a
// title/legend and color-coded cells above it — deliberately simplified
// here to a plain table matching the rest of the app (a check icon for
// presence, no color-coding) — except the Predicted compounds bar, which
// she asked to keep, rendered in greyscale rather than the source's color.
function PredictedCompoundsBar({ value, max }: { value: number; max: number }) {
  const widthPercent = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-muted-foreground" style={{ width: `${widthPercent}%` }} />
      </div>
      <span className="tabular-nums text-foreground">{value}</span>
    </div>
  );
}

export default function NaturalSourcesTable({ card }: NaturalSourcesTableProps) {
  const maxPredicted = Math.max(0, ...card.rows.map((row) => row.predictedCompoundsCount));

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-border text-left">
          <th className="px-2 py-2 font-medium text-foreground">Natural source</th>
          {card.compoundColumns.map((compound) => (
            <th key={compound} className="px-2 py-2 text-center font-medium text-foreground">
              {compound}
            </th>
          ))}
          <th className="px-2 py-2 text-right font-medium text-foreground">Direct</th>
          <th className="px-2 py-2 font-medium text-foreground">Predicted compounds</th>
          <th className="px-2 py-2 text-center font-medium text-foreground">GRAS</th>
        </tr>
      </thead>
      <tbody>
        {card.rows.map((row) => (
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
            <td className="px-2 py-2 text-right align-top text-foreground">{row.directCount}</td>
            <td className="px-2 py-2 align-top">
              <PredictedCompoundsBar value={row.predictedCompoundsCount} max={maxPredicted} />
            </td>
            <td className="px-2 py-2 text-center align-top text-foreground">{row.grasListed ? "yes" : "no"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
