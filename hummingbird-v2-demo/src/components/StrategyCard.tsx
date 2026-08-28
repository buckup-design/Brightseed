import type { StrategyCardData } from "../data/demoScript";

interface StrategyCardProps {
  card: StrategyCardData;
  /** Drilling into a strategy is a click, not a chat send — see ProjectScreen. */
  onClick?: () => void;
}

const COLUMNS: { key: keyof Pick<StrategyCardData, "evidencedCompounds" | "predictedCompounds" | "totalCompounds">; label: string }[] = [
  { key: "evidencedCompounds", label: "Evidenced compounds" },
  { key: "predictedCompounds", label: "Predicted compounds" },
  { key: "totalCompounds", label: "Total compounds" },
];

// Project screen body item: strategy name, approach text, then either the
// plain evidenced/predicted/total compound-count table (not yet reviewed),
// or — once card.reviewed is set (see p2 in demoScript.ts, matching Figma
// node 136:92027) — the richer reviewed layout: a compounds summary +
// molecular-docking link, a natural-sources note + combinations table, and
// IP assessment / Notes sections either side of References. The whole card
// is the "drill into this strategy" affordance (see ProjectScreen) — not a
// real `<button>`, since it contains its own nested links, but
// keyboard-activatable the same way.
export default function StrategyCard({ card, onClick }: StrategyCardProps) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-xs ${onClick ? "cursor-pointer transition-colors hover:border-foreground/20" : ""}`}
    >
      <h3 className="text-base font-semibold text-foreground">{card.name}</h3>

      <div className="flex flex-col gap-1">
        <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Approach</h4>
        <p className="text-sm leading-6 text-foreground">{card.approach}</p>
      </div>

      {card.reviewed ? (
        <>
          <div className="flex flex-col gap-1">
            <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Compounds</h4>
            <p className="text-sm leading-6 text-foreground">
              Currently narrowed to {card.reviewed.evidencedCompoundNames.length} compounds with evidence:{" "}
              {card.reviewed.evidencedCompoundNames.join(", ")}.
            </p>
            <p className="text-sm leading-6 text-foreground">
              {card.reviewed.predictedCompoundsNote}{" "}
              <a href="#" onClick={(event) => event.stopPropagation()} className="underline underline-offset-2">
                {card.reviewed.molecularDockingLinkLabel}
              </a>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Natural sources</h4>
            <p className="text-sm leading-6 text-foreground">{card.reviewed.naturalSourcesNote}</p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-2 py-2 font-medium text-foreground">Combination</th>
                  <th className="px-2 py-2 font-medium text-foreground">Total predicted bioactive compounds</th>
                </tr>
              </thead>
              <tbody>
                {card.reviewed.combinations.map((combination) => (
                  <tr key={combination.id} className="border-b border-border last:border-b-0">
                    <td className="px-2 py-2 text-foreground">{combination.label}</td>
                    <td className="px-2 py-2">
                      <a
                        href="#"
                        onClick={(event) => event.stopPropagation()}
                        className="text-foreground underline underline-offset-2"
                      >
                        {combination.totalPredictedBioactiveCompounds.toLocaleString()}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              {COLUMNS.map((column) => (
                <th key={column.key} className="px-2 py-2 text-left font-medium text-foreground">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {COLUMNS.map((column) => (
                <td key={column.key} className="px-2 py-2 text-foreground">
                  {card[column.key].toLocaleString()}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}

      {card.reviewed && (
        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">IP assessment</h4>
          <a
            href="#"
            onClick={(event) => event.stopPropagation()}
            className="w-fit text-sm text-foreground underline underline-offset-2"
          >
            {card.reviewed.ipAssessmentLabel}
          </a>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">References</h4>
        <a
          href="#"
          onClick={(event) => event.stopPropagation()}
          className="w-fit text-sm text-foreground underline underline-offset-2"
        >
          {card.referencesLabel}
        </a>
      </div>

      {card.reviewed && (
        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Notes</h4>
          <a
            href="#"
            onClick={(event) => event.stopPropagation()}
            className="w-fit text-sm text-foreground underline underline-offset-2"
          >
            {card.reviewed.notesLabel}
          </a>
        </div>
      )}
    </div>
  );
}
