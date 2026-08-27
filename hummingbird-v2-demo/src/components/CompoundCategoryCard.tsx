import type { CompoundCategoryCardData } from "../data/demoScript";
import CompoundTable from "./CompoundTable";

interface CompoundCategoryCardProps {
  card: CompoundCategoryCardData;
}

// Strategy screen body item: a title, a Candidates compound table, an
// Eliminated compound table, and a references link.
export default function CompoundCategoryCard({ card }: CompoundCategoryCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-xs">
      <h3 className="text-base font-semibold text-foreground">{card.title}</h3>

      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Candidates</h4>
        <CompoundTable variant="candidates" rows={card.candidates} />
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Eliminated</h4>
        <CompoundTable variant="eliminated" rows={card.eliminated} />
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">References</h4>
        <a href="#" className="w-fit text-sm text-foreground underline underline-offset-2">
          {card.referencesLabel}
        </a>
      </div>
    </div>
  );
}
