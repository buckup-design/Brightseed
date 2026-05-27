"use client";

import * as React from "react";
import { Lightbulb, Star, Check, AlertTriangle, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * StrategyCard v2 — Forager Strategies overview.
 *
 * Source: Figma StrategyCard v2 Components, node 26585:379616
 * https://www.figma.com/design/ZZPjoeJ447MWuzNi3LL1BL?node-id=26585-379616
 *
 * Layout (top → bottom):
 *   1. Header row: lightbulb icon (left) + favorite star (right, fades in on hover)
 *   2. Strategy one-liner — SemiBold 15px
 *   3. Description — Regular 13px, subtle color
 *   4. Assessment table — bordered, 3 rows of Mono label + StatusIcon + value
 *   5. Full-width "Explore compounds" Secondary button
 *
 * Hover state:
 *   - Border steps subtle → default
 *   - Shadow deepens (1.5px → 6px)
 *   - Assessment row text steps subtle → default
 *   - Favorite star fades in (always visible when isFavorited=true)
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type StrategyStatus = "success" | "warning" | "critical";

export interface AssessmentRow {
  label: string;
  detail: string;
  status: StrategyStatus;
}

export interface StrategyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  oneLiner: string;
  description: string;
  evidence: AssessmentRow[];
  onExploreCompounds?: () => void;
  onFavorite?: () => void;
  isFavorited?: boolean;
}

// ─── StatusIcon ───────────────────────────────────────────────────────────────
// 24×24 pill, colored surface bg + centered 12×12 Lucide icon.
// All colors reference semantic tokens → auto-adapts to light/dark theme.

const STATUS_CONFIG: Record<
  StrategyStatus,
  { bg: string; iconClass: string; Icon: React.ElementType }
> = {
  success: {
    bg: "bg-[var(--color-surface-success)]",
    iconClass: "text-[var(--color-icon-success)]",
    Icon: Check,
  },
  warning: {
    bg: "bg-[var(--color-surface-warning)]",
    iconClass: "text-[var(--color-icon-warning)]",
    Icon: AlertTriangle,
  },
  critical: {
    bg: "bg-[var(--color-surface-critical)]",
    iconClass: "text-[var(--color-icon-critical)]",
    Icon: X,
  },
};

function StatusIcon({ status }: { status: StrategyStatus }) {
  const { bg, iconClass, Icon } = STATUS_CONFIG[status];
  return (
    <div
      className={cn(
        "size-6 rounded-full flex items-center justify-center shrink-0",
        bg
      )}
    >
      <Icon className={cn("size-3 shrink-0", iconClass)} strokeWidth={2.5} />
    </div>
  );
}

// ─── StrategyCard ─────────────────────────────────────────────────────────────

export function StrategyCard({
  oneLiner,
  description,
  evidence,
  onExploreCompounds,
  onFavorite,
  isFavorited: isFavoritedProp = false,
  className,
  ...props
}: StrategyCardProps) {
  // Internal toggle state so the star works without external wiring.
  // Storybook demos work out of the box; callers can still pass onFavorite
  // to sync with their own state layer.
  const [favorited, setFavorited] = React.useState(isFavoritedProp);

  const handleFavorite = () => {
    setFavorited((prev) => !prev);
    onFavorite?.();
  };

  return (
    <div
      data-slot="strategy-card"
      className={cn(
        // layout
        "group flex flex-col gap-3 p-4",
        // sizing — canonical card width from Figma
        "w-[320px]",
        // surface
        "bg-[var(--color-surface-default)]",
        // border: subtle at rest, one step bolder on hover
        "border border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)]",
        // corner radius: 8px (--shape-radius-md) matches Figma v2
        "rounded-[var(--shape-radius-md)]",
        // shadow: slight at rest, pronounced on hover
        "shadow-[0px_1px_1.5px_rgba(0,0,0,0.07)]",
        "hover:shadow-[0px_4px_6px_rgba(0,0,0,0.12)]",
        // transitions
        "transition-[border-color,box-shadow] duration-[120ms]",
        className
      )}
      {...props}
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        {/* Strategy glyph — Lightbulb indicates "this is a proposed strategy" */}
        <Lightbulb
          className="size-6 text-[var(--color-text-subtle)] shrink-0"
          strokeWidth={1.5}
        />

        {/* Favorite toggle — ghost icon button.
            Invisible at rest; fades in on card hover.
            Always visible when already favorited so the state is readable. */}
        {/* group/fav creates a named hover scope scoped to this button,
            independent of the card-level group. This lets the star respond
            to button-boundary hover separately from card-level hover. */}
        <button
          type="button"
          onClick={handleFavorite}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorited}
          className={cn(
            "group/fav size-8 flex items-center justify-center shrink-0",
            "rounded-[var(--shape-radius-md)]",
            // pinned cards always show; unpinned fades in on card hover
            favorited
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100",
            "transition-opacity duration-[120ms]",
            // keyboard focus only — no hover surface
            "focus-visible:opacity-100 outline-none",
            "focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-1",
          )}
        >
          <Star
            className={cn(
              // always outline — no fill ever
              "size-4 fill-none transition-colors duration-[120ms]",
              favorited
                // pinned: yellow outline
                ? "text-[var(--color-icon-favorite-active)]"
                // unpinned: grey outline → yellow outline on button hover (intent preview)
                : "text-[var(--color-icon-favorite-inactive)] group-hover/fav:text-[var(--color-icon-favorite-active)]"
            )}
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* ── One-liner ─────────────────────────────────────────────────────── */}
      <p className="text-[15px] font-semibold leading-tight text-[var(--color-text-default)]">
        {oneLiner}
      </p>

      {/* ── Description ───────────────────────────────────────────────────── */}
      <p className="text-[13px] leading-snug text-[var(--color-text-subtle)]">
        {description}
      </p>

      {/* ── Assessment table ──────────────────────────────────────────────── */}
      {/* Bordered table; 3 rows separated by hairlines.
          Row text steps from subtle → default on card hover (same timing as border/shadow). */}
      <div
        className={cn(
          "border border-[var(--color-border-subtle)]",
          "rounded-[var(--shape-radius-sm)]",  // 6px — tighter than card
          "overflow-hidden shrink-0 w-full"
        )}
      >
        {evidence.map((row, i) => (
          <React.Fragment key={row.label}>
            {i > 0 && (
              <div
                className="h-px bg-[var(--color-border-subtle)]"
                aria-hidden="true"
              />
            )}
            <div className="flex items-center gap-2 h-8 px-3">
              {/* Label — Geist Mono, 12px, fixed 96px column */}
              <p className="font-mono text-[12px] text-[var(--color-text-subtle)] w-24 shrink-0 leading-none">
                {row.label}
              </p>
              {/* Value — icon + text; text shifts to default on hover */}
              <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
                <StatusIcon status={row.status} />
                <p
                  className={cn(
                    "text-[13px] whitespace-nowrap leading-none",
                    "text-[var(--color-text-subtle)]",
                    "group-hover:text-[var(--color-text-default)]",
                    "transition-colors duration-[120ms]"
                  )}
                >
                  {row.detail}
                </p>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <Button
        variant="secondary"
        size="default"
        className="w-full"
        onClick={onExploreCompounds}
      >
        Explore compounds
      </Button>
    </div>
  );
}
