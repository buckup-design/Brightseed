import * as React from "react";
import { Hexagon, BarChart3, ShieldAlert } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * CompoundCard — Forager Compounds view.
 *
 * Source mock: anna's mocks 4-29-26/filtered to compounds.png
 *
 * Visual hierarchy (top → bottom):
 *   1. Compound name (sans, default text) + confidence score (top-right)
 *   2. Mechanism one-liner
 *   3. Linked plant microlabel + underlined plant name(s)
 *   4. Bioactive tag row
 *   5. Footer category tag + IP Landscape badge
 */

interface CompoundCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  mechanism: string;
  linkedPlants: string[];
  bioactives: string[];
  bioactiveOverflow?: number;
  confidence?: number;
  category?: string;
  ipLandscape?: "clear" | "watch" | "blocked";
}

export function CompoundCard({
  name,
  mechanism,
  linkedPlants,
  bioactives,
  bioactiveOverflow = 0,
  confidence,
  category,
  ipLandscape = "watch",
  className,
  ...props
}: CompoundCardProps) {
  return (
    <div
      data-slot="compound-card"
      className={cn(
        "flex flex-col gap-3 p-4",
        "w-full min-w-0",
        "bg-[var(--color-surface-default)]",
        "border border-[var(--color-border-subtle)]",
        "rounded-[var(--shape-radius-lg)]",
        "transition-shadow duration-[120ms]",
        "hover:shadow-sm",
        className
      )}
      {...props}
    >
      {/* Header: molecule glyph + name + confidence score */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          <Hexagon className="size-4 mt-0.5 shrink-0 text-[var(--color-icon-data-orange)]" />
          <h3 className="text-base font-medium leading-tight text-[var(--color-text-default)] line-clamp-2 min-h-[2.5em]">
            {name}
          </h3>
        </div>
        {typeof confidence === "number" && (
          <div className="flex items-center gap-1 shrink-0 text-[var(--color-text-subtle)]">
            <BarChart3 className="size-3" />
            <span className="text-xs font-medium">{confidence}%</span>
          </div>
        )}
      </div>

      {/* Mechanism one-liner */}
      <p className="text-sm text-[var(--color-text-default)] leading-snug line-clamp-2 min-h-[2.75em]">
        {mechanism}
      </p>

      {/* Linked plant */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-subtle)]">
          Linked plant
        </span>
        <p className="text-sm text-[var(--color-text-default)]">
          {linkedPlants.map((plant, i) => (
            <React.Fragment key={plant}>
              <span className="italic underline underline-offset-2 decoration-[var(--color-border-default)]">
                {plant}
              </span>
              {i < linkedPlants.length - 1 && (
                <span className="text-[var(--color-text-subtle)]">, </span>
              )}
            </React.Fragment>
          ))}
        </p>
      </div>

      {/* Bioactive tag row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {bioactives.map((b) => (
          <NeutralTag key={b}>{b}</NeutralTag>
        ))}
        {bioactiveOverflow > 0 && (
          <span className="text-xs text-[var(--color-text-subtle)] font-medium px-1">
            +{bioactiveOverflow} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 mt-1">
        {category && (
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
            style={{
              background: "var(--color-surface-tag-sand)",
              color: "var(--color-text-tag-sand)",
            }}
          >
            {category}
          </span>
        )}
        {ipLandscape && (
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
            style={{
              background:
                ipLandscape === "clear"
                  ? "var(--color-surface-tag-forest)"
                  : "var(--color-surface-tag-orange)",
              color:
                ipLandscape === "clear"
                  ? "var(--color-text-tag-forest)"
                  : "var(--color-text-tag-orange)",
            }}
          >
            <ShieldAlert className="size-3" />
            IP Landscape
          </span>
        )}
      </div>
    </div>
  );
}

function NeutralTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
        "bg-[var(--color-surface-tag-sand)] text-[var(--color-text-tag-sand)]"
      )}
    >
      {children}
    </span>
  );
}
