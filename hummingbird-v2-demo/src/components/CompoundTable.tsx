import { Plus, X } from "lucide-react";
import type { CompoundRow } from "../data/demoScript";

interface CompoundTableProps {
  variant: "candidates" | "eliminated";
  rows: CompoundRow[];
}

function YesNo({ value }: { value: boolean }) {
  return <span className="text-sm text-foreground">{value ? "yes" : "no"}</span>;
}

// Generic compound-row table, reused for both the Candidates and Eliminated
// lists on a Strategy screen category card. table-fixed + an explicit
// colgroup (rather than table-auto) is what makes the Candidates and
// Eliminated tables' columns line up with each other — table-auto would
// size each table's columns independently off its own row content, and the
// two lists rarely have the same content widths. The trailing row-action
// icon is purely decorative in this scripted demo (X to "remove" a
// candidate, + to "restore" an eliminated one) — it doesn't do anything on
// click.
export default function CompoundTable({ variant, rows }: CompoundTableProps) {
  return (
    <table className="w-full table-fixed border-collapse text-sm">
      <colgroup>
        <col className="w-[16%]" />
        <col className="w-[14%]" />
        <col className="w-[38%]" />
        <col className="w-[10%]" />
        <col className="w-[8%]" />
        <col className="w-[8%]" />
        <col className="w-10" />
      </colgroup>
      <thead>
        <tr className="border-b border-border text-left">
          <th className="px-2 py-2 font-medium text-foreground">Compound</th>
          <th className="px-2 py-2 font-medium text-foreground">Predicted association</th>
          <th className="px-2 py-2 font-medium text-foreground">Evidence Context</th>
          <th className="px-2 py-2 font-medium text-foreground">Food grade</th>
          <th className="px-2 py-2 font-medium text-foreground">Drink</th>
          <th className="px-2 py-2 font-medium text-foreground">Gummy</th>
          <th className="px-2 py-2" />
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} className="border-b border-border last:border-b-0">
            <td className="break-words px-2 py-2 align-top">
              <a href="#" className="text-foreground underline underline-offset-2">
                {row.compoundName}
              </a>
            </td>
            <td className="break-words px-2 py-2 align-top text-foreground">{row.predictedAssociation}</td>
            <td className="break-words px-2 py-2 align-top">
              <a href="#" className="text-foreground underline underline-offset-2">
                {row.evidenceContextLabel}
              </a>
            </td>
            <td className="px-2 py-2 align-top">
              <YesNo value={row.foodGrade} />
            </td>
            <td className="px-2 py-2 align-top">
              <YesNo value={row.drink} />
            </td>
            <td className="px-2 py-2 align-top">
              <YesNo value={row.gummy} />
            </td>
            <td className="px-2 py-2 align-top">
              <button
                type="button"
                aria-label={variant === "candidates" ? `Remove ${row.compoundName}` : `Restore ${row.compoundName}`}
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
