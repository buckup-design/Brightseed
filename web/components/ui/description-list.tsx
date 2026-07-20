import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * DescriptionList — a semantic label→value list (a real <dl>).
 *
 * The one primitive promoted out of the Hummingbird detail slide-over once a
 * second consumer arrived: it renders the detail sheet's Dosage / ADME rows AND
 * the Report Document's per-ingredient Formulation. Lifted verbatim from
 * result-detail's inline `DataRows`, so the two surfaces read one source of
 * truth.
 *
 * The `value` slot is `ReactNode`, not `string` — that's what lets a caller sit
 * an inline badge beside a value (the report's "500 mg <Marker>HED</Marker>")
 * without this primitive knowing anything about the domain. `string ⊂ ReactNode`,
 * so the detail sheet's `DataPoint[]` (string values) passes straight in.
 *
 * Quill public API (BSDS-102): reads ONLY its own --c-description-list-* tier,
 * never a --ds-* or --p-* directly. Each --c-* aliases the exact --ds-* the
 * inline DataRows used, so the extraction is provably zero-visual-change.
 */

export type DescriptionRow = {
  label: string;
  /** ReactNode, so a value can carry an inline badge (e.g. an HED marker). */
  value: React.ReactNode;
};

export function DescriptionList({
  rows,
  className,
  ...props
}: { rows: DescriptionRow[] } & Omit<React.ComponentProps<"dl">, "children">) {
  return (
    <dl data-slot="description-list" className={cn("flex flex-col", className)} {...props}>
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-baseline justify-between gap-4 border-b border-[var(--c-description-list-border-subtle)] py-2 last:border-b-0"
        >
          <dt className="text-[var(--c-description-list-text-subtle)]">{row.label}</dt>
          <dd className="text-right font-medium text-[var(--c-description-list-text-default)]">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
