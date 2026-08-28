import type { PredictedCompoundsCardData } from "../data/demoScript";
import PredictedCompoundTable from "./PredictedCompoundTable";

interface PredictedCompoundsCardProps {
  card: PredictedCompoundsCardData;
}

// Strategy screen body item, rendered below the CompoundCategoryCard(s): a
// title + a single Candidates table of model-predicted compounds. No
// Eliminated section and no references link — this is model output, not a
// curated/cited list.
export default function PredictedCompoundsCard({ card }: PredictedCompoundsCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-xs">
      <h3 className="text-base font-semibold text-foreground">{card.title}</h3>

      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Candidates</h4>
        <PredictedCompoundTable rows={card.candidates} />
      </div>
    </div>
  );
}
