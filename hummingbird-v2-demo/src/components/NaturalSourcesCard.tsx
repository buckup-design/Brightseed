import type { NaturalSourcesCardData } from "../data/demoScript";
import NaturalSourcesTable from "./NaturalSourcesTable";

interface NaturalSourcesCardProps {
  card: NaturalSourcesCardData;
}

// Natural Sources tab body item — a Candidates table + an Eliminated table,
// same Candidates/Eliminated split as CompoundCategoryCard on the Compounds
// tab (no title, no references link — this card is just the two tables).
export default function NaturalSourcesCard({ card }: NaturalSourcesCardProps) {
  const maxPredicted = Math.max(
    0,
    ...card.candidates.map((row) => row.predictedCompoundsCount),
    ...card.eliminated.map((row) => row.predictedCompoundsCount)
  );

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-xs">
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Candidates</h4>
        <NaturalSourcesTable
          variant="candidates"
          compoundColumns={card.compoundColumns}
          rows={card.candidates}
          maxPredicted={maxPredicted}
        />
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Eliminated</h4>
        <NaturalSourcesTable
          variant="eliminated"
          compoundColumns={card.compoundColumns}
          rows={card.eliminated}
          maxPredicted={maxPredicted}
        />
      </div>
    </div>
  );
}
