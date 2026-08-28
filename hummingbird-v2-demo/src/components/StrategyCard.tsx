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

// Project screen body item: strategy name, approach text, a small
// evidenced/predicted/total compound-count table, and a references link.
// The whole card is the "drill into this strategy" affordance (see
// ProjectScreen) — not a real `<button>`, since it contains its own nested
// link, but keyboard-activatable the same way.
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
    </div>
  );
}
