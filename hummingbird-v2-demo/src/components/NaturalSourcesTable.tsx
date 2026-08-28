import { Check } from "lucide-react";
import type { NaturalSourcesCardData } from "../data/demoScript";

interface NaturalSourcesTableProps {
  card: NaturalSourcesCardData;
}

// The Natural Sources tab's table. Anna's reference screenshot has a
// title/legend and color-coded cells/bars above and within it — deliberately
// simplified here to a plain table matching the rest of the app (a check
// icon for presence, plain numbers, no bars or color-coding).
export default function NaturalSourcesTable({ card }: NaturalSourcesTableProps) {
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
          <th className="px-2 py-2 text-right font-medium text-foreground">Predicted compounds</th>
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
            <td className="px-2 py-2 text-right align-top text-foreground">{row.predictedCompoundsCount}</td>
            <td className="px-2 py-2 text-center align-top text-foreground">{row.grasListed ? "yes" : "no"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
