import * as React from "react";
import { Leaf, ShieldCheck, ShieldAlert } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * PlantCard, Hummingbird Plants view.
 *
 * Source mock: anna's mocks 4-29-26/filtered to plants.png
 * Anna's content shapes are close to accurate; this component rebuilds the
 * typography and hierarchy on Brightseed Quill tokens.
 *
 * Visual hierarchy (top → bottom, attention loud → quiet):
 *   1. Scientific name (Tiempos italic, display, brand gravity)
 *   2. Strategy one-liner (sans-serif, default text)
 *   3. Evidence prose (sans-serif, subtle)
 *   4. Compound tag row (sand tags)
 *   5. Forager predicted bioactives microlabel + tag row (sand tags)
 *   6. Footer status badges (semantic tokens, GRAS=success, IP=warning)
 *
 * Card container layout inherits StrategyCard's rules:
 *   - Border steps subtle → default on hover
 *   - Shadow deepens (1.5px → 6px) on hover
 *   - Corner radius --ds-shape-radius-md (8px)
 *   - transition border-color + box-shadow, 120ms
 */

interface PlantCardProps extends React.HTMLAttributes<HTMLDivElement> {
  scientificName: string;
  commonName?: string;
  strategyOneLiner: string;
  evidence: string;
  compounds: string[];
  bioactives: string[];
  compoundOverflow?: number;
  bioactiveOverflow?: number;
  bioactivePotential?: boolean;
  gras?: boolean;
  ipLandscape?: "clear" | "watch" | "blocked";
}

export function PlantCard({
  scientificName,
  commonName,
  strategyOneLiner,
  evidence,
  compounds,
  bioactives,
  compoundOverflow = 0,
  bioactiveOverflow = 0,
  bioactivePotential = true,
  gras = true,
  ipLandscape = "watch",
  className,
  ...props
}: PlantCardProps) {
  return (
    <div
      data-slot="plant-card"
      className={cn(
        // layout
        "group flex flex-col gap-3 p-4",
        // w-full: card fills its grid column. min-w-0: allows shrink below
        // intrinsic content width so it doesn't overflow narrow columns.
        "w-full min-w-0",
        // surface
        "bg-[var(--ds-color-surface-default)]",
        // border: subtle at rest, one step bolder on hover
        "border border-[var(--ds-color-border-subtle)] hover:border-[var(--ds-color-border-default)]",
        // corner radius: 8px (--ds-shape-radius-md), matches StrategyCard / Figma v2
        "rounded-[var(--ds-shape-radius-md)]",
        // shadow: slight at rest, pronounced on hover
        "shadow-[0px_1px_1.5px_rgba(0,0,0,0.07)]",
        "hover:shadow-[0px_4px_6px_rgba(0,0,0,0.12)]",
        // transitions
        "transition-[border-color,box-shadow] duration-[120ms]",
        className
      )}
      {...props}
    >
      {/* Header: leaf icon + scientific name + bioactive potential badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          <Leaf className="size-4 mt-1 shrink-0 text-[var(--ds-color-icon-success)]" />
          <h3
            className="text-base leading-tight text-[var(--ds-color-text-default)] line-clamp-2 min-h-[2.5em]"
            style={{
              fontFamily: 'var(--font-display, "Tiempos Fine", serif)',
              fontStyle: "italic",
            }}
          >
            {scientificName}
            {commonName && (
              <span className="text-[var(--ds-color-text-subtle)]">
                {" "}
                ({commonName})
              </span>
            )}
          </h3>
        </div>
        {bioactivePotential && (
          <SemanticPill intent="success">Bioactive potential</SemanticPill>
        )}
      </div>

      {/* Strategy one-liner */}
      <p className="text-sm text-[var(--ds-color-text-default)] leading-snug line-clamp-2 min-h-[2.75em]">
        {strategyOneLiner}
      </p>

      {/* Evidence prose, leading-relaxed (1.625) → 2 lines = 3.25em */}
      <p className="text-sm text-[var(--ds-color-text-subtle)] leading-relaxed line-clamp-2 min-h-[3.25em]">
        {evidence}
      </p>

      {/* Compound tag row */}
      <TagRow items={compounds} overflow={compoundOverflow} />

      {/* Forager predicted bioactives */}
      <div className="flex flex-col gap-2 mt-1">
        <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--ds-color-text-subtle)]">
          Forager predicted bioactives
        </span>
        <TagRow items={bioactives} overflow={bioactiveOverflow} />
      </div>

      {/* Footer status badges */}
      <div className="flex items-center gap-2 mt-2">
        {gras && (
          <StatusBadge intent="success" icon={<ShieldCheck className="size-3" />}>
            GRAS
          </StatusBadge>
        )}
        {ipLandscape && (
          <StatusBadge
            intent={ipLandscape === "clear" ? "success" : "warning"}
            icon={<ShieldAlert className="size-3" />}
          >
            IP Landscape
          </StatusBadge>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Internal sub-components
 * ───────────────────────────────────────────────────────────────────────── */

function TagRow({ items, overflow = 0 }: { items: string[]; overflow?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {items.map((item) => (
        <NeutralTag key={item}>{item}</NeutralTag>
      ))}
      {overflow > 0 && (
        <span className="text-xs text-[var(--ds-color-text-subtle)] font-medium px-1">
          +{overflow} more
        </span>
      )}
    </div>
  );
}

function NeutralTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
        "bg-[var(--ds-color-surface-tag-sand)] text-[var(--ds-color-text-tag-sand)]"
      )}
    >
      {children}
    </span>
  );
}

type IntentPill = "success" | "warning" | "critical" | "info";

function SemanticPill({
  intent,
  children,
}: {
  intent: IntentPill;
  children: React.ReactNode;
}) {
  const map = {
    success: {
      bg: "var(--ds-color-surface-tag-forest)",
      text: "var(--ds-color-text-tag-forest)",
    },
    warning: {
      bg: "var(--ds-color-surface-tag-orange)",
      text: "var(--ds-color-text-tag-orange)",
    },
    critical: {
      bg: "var(--ds-color-surface-tag-red)",
      text: "var(--ds-color-text-tag-red)",
    },
    info: {
      bg: "var(--ds-color-surface-tag-blue)",
      text: "var(--ds-color-text-tag-blue)",
    },
  }[intent];

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0"
      style={{ background: map.bg, color: map.text }}
    >
      {children}
    </span>
  );
}

function StatusBadge({
  intent,
  icon,
  children,
}: {
  intent: IntentPill;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const map = {
    success: {
      bg: "var(--ds-color-surface-tag-forest)",
      text: "var(--ds-color-text-tag-forest)",
    },
    warning: {
      bg: "var(--ds-color-surface-tag-orange)",
      text: "var(--ds-color-text-tag-orange)",
    },
    critical: {
      bg: "var(--ds-color-surface-tag-red)",
      text: "var(--ds-color-text-tag-red)",
    },
    info: {
      bg: "var(--ds-color-surface-tag-blue)",
      text: "var(--ds-color-text-tag-blue)",
    },
  }[intent];

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
      style={{ background: map.bg, color: map.text }}
    >
      {icon}
      {children}
    </span>
  );
}
