import * as React from "react";
import { CheckCircle2, AlertTriangle, MinusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * StrategyCard — Forager Strategies overview.
 *
 * Source mock: anna's mocks 4-29-26/strategies view.png
 *
 * Visual hierarchy (top → bottom):
 *   1. Strategy one-liner (bold, default text)
 *   2. Detailed description (subtle)
 *   3. Three evidence rows (status glyph + label + detail) — semantic colors
 *      map to Brightseed intents (success / warning / critical)
 *   4. Footer actions: "Tell me more" (outline) + "Explore compounds" (linktext)
 */

export type StrategyStatus = "success" | "warning" | "critical";

interface StrategyEvidence {
  label: string;
  detail: string;
  status: StrategyStatus;
}

interface StrategyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  oneLiner: string;
  description: string;
  evidence: StrategyEvidence[];
  onTellMeMore?: () => void;
  onExploreCompounds?: () => void;
}

export function StrategyCard({
  oneLiner,
  description,
  evidence,
  onTellMeMore,
  onExploreCompounds,
  className,
  ...props
}: StrategyCardProps) {
  return (
    <div
      data-slot="strategy-card"
      className={cn(
        "flex flex-col gap-4 p-5",
        "bg-[var(--color-surface-default)]",
        "border border-[var(--color-border-subtle)]",
        "rounded-[var(--shape-radius-lg)]",
        "transition-shadow duration-[120ms]",
        "hover:shadow-sm",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold leading-tight text-[var(--color-text-default)]">
          {oneLiner}
        </h3>
        <p className="text-sm text-[var(--color-text-subtle)] leading-snug">
          {description}
        </p>
      </div>

      {/* Evidence rows */}
      <div className="flex flex-col gap-2">
        {evidence.map((row) => (
          <EvidenceRow key={row.label} {...row} />
        ))}
      </div>

      {/* Footer actions */}
      <div className="flex items-center gap-2 mt-1">
        <Button variant="outline" size="sm" onClick={onTellMeMore}>
          Tell me more
        </Button>
        <Button variant="linktext" size="sm" onClick={onExploreCompounds}>
          Explore compounds
        </Button>
      </div>
    </div>
  );
}

function EvidenceRow({ label, detail, status }: StrategyEvidence) {
  const iconMap = {
    success: {
      Icon: CheckCircle2,
      color: "var(--color-icon-success)",
    },
    warning: {
      Icon: AlertTriangle,
      color: "var(--color-icon-warning)",
    },
    critical: {
      Icon: MinusCircle,
      color: "var(--color-icon-critical)",
    },
  }[status];
  const Icon = iconMap.Icon;

  return (
    <div className="flex items-start gap-2 text-sm leading-snug">
      <Icon className="size-4 mt-0.5 shrink-0" style={{ color: iconMap.color }} />
      <p className="text-[var(--color-text-default)]">
        <span className="font-medium">{label}:</span>{" "}
        <span className="text-[var(--color-text-subtle)]">{detail}</span>
      </p>
    </div>
  );
}
