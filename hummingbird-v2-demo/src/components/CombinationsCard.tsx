import type { CombinationsCardData } from "../data/demoScript";

interface CombinationsCardProps {
  card: CombinationsCardData;
}

// Natural Sources tab body item, rendered above NaturalSourcesCard once
// Anna's "run the combinations" — a ranked list of source pairings. No
// action icons here (unlike the Candidates/Eliminated tables): these are
// computed results, not a list to add to or remove from.
export default function CombinationsCard({ card }: CombinationsCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-xs">
      <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Best combinations - include all 5 selected compounds
      </h4>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="px-2 py-2 font-medium text-foreground">Rank</th>
            <th className="px-2 py-2 font-medium text-foreground">Combination</th>
            <th className="px-2 py-2 font-medium text-foreground">Additional predicted bioactives</th>
            <th className="px-2 py-2 font-medium text-foreground">GRAS status</th>
          </tr>
        </thead>
        <tbody>
          {card.rows.map((row) => (
            <tr key={row.id} className="border-b border-border last:border-b-0">
              <td className={`px-2 py-2 align-top text-foreground ${row.highlight ? "font-semibold" : ""}`}>
                {row.rank}
              </td>
              <td className={`px-2 py-2 align-top text-foreground ${row.highlight ? "font-semibold" : ""}`}>
                {row.combinationLabel}
              </td>
              <td className={`px-2 py-2 align-top text-foreground ${row.highlight ? "font-semibold" : ""}`}>
                {row.combinedPredicted}
              </td>
              <td className="px-2 py-2 align-top text-foreground">{row.grasStatusLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
