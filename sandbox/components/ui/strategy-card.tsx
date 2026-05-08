"use client"

import * as React from "react"
import {
  ChevronRight,
  CircleCheck,
  CircleX,
  MoreVertical,
  Star,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * StrategyCard — Forager strategy hypothesis card.
 *
 * Spec: see CLAUDE.md "StrategyCard" (Apr 30, 2026 locked-in decision).
 * Mirrors the design intent sketched in the "Brightseed DS color studies"
 * Figma file, frame `239:19427` ("strategy card").
 *
 * One card represents a strategy a scientist is evaluating. Three pillars —
 * Evidence (literature + prediction), Feasibility (formula + safety), Legal
 * (freedom to operate) — each carrying a tri-state status (positive /
 * caution / negative) with a freeform label string.
 *
 * Interaction model — dual nav:
 *   • Each pillar row is its own button (drilldown into that pillar's detail).
 *   • The "Explore compounds" button is the card's primary action (list of
 *     molecules that hit this strategy).
 *   • The kebab holds overflow actions ("Tell me more" today; designed to grow).
 *   • The card surface is a styled container only — never a click target
 *     itself, since interactive elements can't nest inside an interactive parent.
 *
 * Card-level hover affordances — when the cursor enters anywhere inside the
 * card surface — fire all at once: border darkens, shadow deepens, the
 * favorite star reveals (if not already favorited), pillar value text steps
 * from foreground-muted to foreground, and chevron-right indicators reveal on
 * each row. Implemented via the `card-hovered` Tailwind variant declared in
 * globals.css, which fires for both real `:hover` and `data-force-state="hover"`.
 *
 * Row hover stacks on top: a single row gets a slightly tinted background
 * and the chevron jumps to full opacity, signaling "click here for that
 * pillar's detail."
 *
 * Loading: the entire card body is replaced by a skeleton (per spec).
 * Error: no visual change — load errors surface as an app-level toast (per spec).
 */

// ── Public types ──────────────────────────────────────────────────────────

export type StrategyCardStatus = "positive" | "caution" | "negative"

export type PillarStatus = {
  status: StrategyCardStatus
  /** Freeform label. Status vocabulary is loose by design — not a fixed enum. */
  label: string
}

export type KebabAction = {
  label: string
  /** Optional leading icon. */
  icon?: LucideIcon
  onClick?: () => void
  disabled?: boolean
  /** Renders the menu item in critical-toned text. */
  destructive?: boolean
}

export type StrategyCardProps = {
  /** Strategy headline, e.g. "Stimulate mTOR / IGF-1 signaling". */
  title: string
  /** Mechanism subtitle, e.g. "Amino acid sensing → increased casein synthesis". */
  mechanism: string
  evidence: PillarStatus
  feasibility: PillarStatus
  legal: PillarStatus

  favorited?: boolean
  /** Replaces the card body with a skeleton. */
  loading?: boolean

  onFavorite?: (next: boolean) => void
  onExploreCompounds?: () => void
  /** Called when a pillar row is clicked. The pillar key tells the consumer which detail panel to open. */
  onPillarClick?: (pillar: "evidence" | "feasibility" | "legal") => void

  /** Overflow actions for the kebab menu. Omit or pass an empty array to hide the kebab. */
  kebabActions?: KebabAction[]

  className?: string
} & Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title" | "onFavorite" | "onClick" | "children"
>

// ── Status icon (positive / caution / negative) ──────────────────────────

const STATUS_ICONS: Record<StrategyCardStatus, LucideIcon> = {
  positive: CircleCheck,
  caution: TriangleAlert,
  negative: CircleX,
}

/**
 * Color tokens for the status icon. Pulled from the tag set per the
 * StrategyCard spec — so positive maps to forest, caution to yellow, negative
 * to red. CLAUDE.md notes that tag colors are nominally decorative, but the
 * card's icon-plus-text composition still satisfies the "use icon + text for
 * status, not color alone" rule. If the tag and intent layers ever diverge,
 * status icons will follow the tag set, not the success/warning/critical
 * intent layer.
 */
const STATUS_COLOR: Record<StrategyCardStatus, string> = {
  positive: "var(--color-text-tag-forest)",
  caution: "var(--color-text-tag-yellow)",
  negative: "var(--color-text-tag-red)",
}

function StatusIcon({
  status,
  className,
}: {
  status: StrategyCardStatus
  className?: string
}) {
  const Icon = STATUS_ICONS[status]
  return (
    <Icon
      aria-hidden
      style={{ color: STATUS_COLOR[status] }}
      className={cn("size-4 shrink-0", className)}
    />
  )
}

// ── Pillar row ─────────────────────────────────────────────────────────────

const PILLAR_LABEL: Record<"evidence" | "feasibility" | "legal", string> = {
  evidence: "Evidence",
  feasibility: "Feasibility",
  legal: "Legal",
}

function PillarRow({
  pillar,
  status,
  onClick,
}: {
  pillar: "evidence" | "feasibility" | "legal"
  status: PillarStatus
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-slot="strategy-card-pillar-row"
      data-pillar={pillar}
      className={cn(
        "group/row flex w-full items-center gap-3",
        "rounded-[var(--shape-radius-sm)] px-3 py-2 text-left",
        "outline-none transition-colors duration-[120ms]",
        // Row hover: subtle tint. surface-alt-hover steps the correct direction
        // in both themes (sand-200 in light, sand-800 in dark) — going one shade
        // more pronounced than the pillar-table surface.
        "hover:bg-[var(--color-surface-alt-hover)]",
        // Keyboard focus
        "focus-visible:ring-[2px] focus-visible:ring-[var(--color-border-focus)]/50"
      )}
    >
      <span className="w-24 shrink-0 text-sm text-[var(--color-text-subtle)]">
        {PILLAR_LABEL[pillar]}
      </span>
      <StatusIcon status={status.status} />
      <span
        className={cn(
          "flex-1 truncate text-sm transition-colors",
          // Default: muted. On card-hover OR row-hover: foreground.
          "text-[var(--color-text-subtle)]",
          "card-hovered:text-[var(--color-text-default)]",
          "group-hover/row:text-[var(--color-text-default)]"
        )}
      >
        {status.label}
      </span>
      {/* Chevron — invisible by default, reveals on card-hover (60%) or row-hover (100%). */}
      <ChevronRight
        aria-hidden
        className={cn(
          "size-4 shrink-0 text-[var(--color-text-subtle)] transition-opacity",
          "opacity-0",
          "card-hovered:opacity-60",
          "group-hover/row:opacity-100"
        )}
      />
    </button>
  )
}

// ── Loading skeleton ──────────────────────────────────────────────────────

function StrategyCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      data-slot="strategy-card-skeleton"
      className={cn(
        "w-full max-w-[424px] rounded-[var(--shape-radius-lg)]",
        "border border-[var(--color-border-subtle)]",
        "bg-[var(--color-surface-default)] p-5",
        "shadow-[var(--shadow-sm)]",
        className
      )}
      aria-busy="true"
      aria-live="polite"
    >
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="mb-4 h-4 w-1/2" />
      <div className="space-y-2 rounded-[var(--shape-radius-md)] bg-[var(--color-surface-alt)] p-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </div>
      <Skeleton className="mt-4 h-9 w-full" />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────

function StrategyCard({
  title,
  mechanism,
  evidence,
  feasibility,
  legal,
  favorited = false,
  loading = false,
  onFavorite,
  onExploreCompounds,
  onPillarClick,
  kebabActions,
  className,
  ...rest
}: StrategyCardProps) {
  if (loading) {
    return <StrategyCardSkeleton className={className} />
  }

  const hasKebab = kebabActions && kebabActions.length > 0

  return (
    <div
      data-slot="strategy-card"
      data-favorited={favorited || undefined}
      className={cn(
        "group/card w-full max-w-[424px]",
        "rounded-[var(--shape-radius-lg)]",
        "border border-[var(--color-border-subtle)]",
        "bg-[var(--color-surface-default)]",
        "p-5",
        "shadow-[var(--shadow-sm)]",
        "transition-[border-color,box-shadow] duration-[120ms]",
        // Card hover: border darkens, shadow deepens. Mirrored on data-force-state for stories.
        "hover:border-[var(--color-border-default)] hover:shadow-[var(--shadow-md)]",
        "data-[force-state=hover]:border-[var(--color-border-default)]",
        "data-[force-state=hover]:shadow-[var(--shadow-md)]",
        className
      )}
      {...rest}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-4 flex items-start gap-2">
        {/* Favorite star: persistent when favorited, otherwise reveals on card-hover.
            BRIGHTSEED-TBD: --color-icon-favorited semantic token. Using --color-yellow-*
            primitives directly for v1; the favorited star is currently the only "warm
            yellow filled" usage in the system. If more land, hoist to a semantic. */}
        <button
          type="button"
          onClick={() => onFavorite?.(!favorited)}
          aria-label={
            favorited ? "Remove from favorites" : "Add to favorites"
          }
          aria-pressed={favorited}
          data-slot="strategy-card-favorite"
          className={cn(
            "mt-0.5 shrink-0 rounded-[var(--shape-radius-sm)] p-0.5",
            "outline-none transition-opacity duration-[120ms]",
            "focus-visible:ring-[2px] focus-visible:ring-[var(--color-border-focus)]/50",
            // Visibility:
            //  - favorited:   always visible
            //  - unfavorited: hidden by default, revealed on card-hover or focus
            favorited
              ? "opacity-100"
              : "opacity-0 card-hovered:opacity-100 focus-visible:opacity-100"
          )}
        >
          <Star
            className={cn(
              "size-5 transition-colors",
              favorited
                ? "stroke-[var(--color-yellow-500)] fill-[var(--color-yellow-400)]"
                : "stroke-[var(--color-text-subtle)] fill-none"
            )}
          />
        </button>

        {/* Title + mechanism. Single-line truncation on each (per spec). */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-[var(--color-text-default)]">
            {title}
          </h3>
          <p className="truncate text-sm text-[var(--color-text-subtle)]">
            {mechanism}
          </p>
        </div>

        {/* Kebab — only renders if kebabActions is non-empty. */}
        {hasKebab ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="More actions"
                className="shrink-0"
              >
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[10rem]">
              {kebabActions!.map((action) => {
                const Icon = action.icon
                return (
                  <DropdownMenuItem
                    key={action.label}
                    onSelect={() => action.onClick?.()}
                    disabled={action.disabled}
                    variant={action.destructive ? "destructive" : "default"}
                  >
                    {Icon ? <Icon /> : null}
                    {action.label}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

      {/* ── Pillar table ────────────────────────────────────────────────
          Faint sand inset against the white card surface. Each row is its
          own button — clicking opens that pillar's detail (dual-nav model). */}
      <div
        data-slot="strategy-card-pillar-table"
        className="mb-4 rounded-[var(--shape-radius-md)] bg-[var(--color-surface-alt)] p-1"
      >
        <PillarRow
          pillar="evidence"
          status={evidence}
          onClick={() => onPillarClick?.("evidence")}
        />
        <PillarRow
          pillar="feasibility"
          status={feasibility}
          onClick={() => onPillarClick?.("feasibility")}
        />
        <PillarRow
          pillar="legal"
          status={legal}
          onClick={() => onPillarClick?.("legal")}
        />
      </div>

      {/* ── Primary CTA ─────────────────────────────────────────────────
          Always active, even when the strategy has no compounds yet — the
          destination page handles that case (per spec). */}
      <Button
        variant="secondary"
        className="w-full"
        onClick={onExploreCompounds}
      >
        Explore compounds
      </Button>
    </div>
  )
}

export { StrategyCard, StrategyCardSkeleton }
