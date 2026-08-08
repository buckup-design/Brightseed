"use client";

import * as React from "react";
import { Leaf, Star, EllipsisVertical } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

/**
 * PlantCard, Hummingbird Plants view.
 *
 * Source mock: anna's mocks 4-29-26/filtered to plants.png
 * Anna's content shapes are close to accurate; this component rebuilds the
 * typography and hierarchy on Brightseed Quill tokens.
 *
 * Visual hierarchy (top → bottom, attention loud → quiet):
 *   1. Header row: leaf icon (left) + favorite star + kebab actions menu (right, reveal on hover)
 *   2. Scientific name (sans-serif, SemiBold 15px — matches StrategyCard one-liner)
 *   3. Strategy one-liner (sans-serif, default text)
 *   4. Evidence prose (sans-serif, subtle)
 *   5. Compound tag row (sand tags)
 *   6. Forager predicted bioactives microlabel + tag row (sand tags)
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
  onFavorite?: () => void;
  isFavorited?: boolean;
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
  onFavorite,
  isFavorited: isFavoritedProp = false,
  className,
  ...props
}: PlantCardProps) {
  // Internal toggle state so the star works without external wiring,
  // identical to StrategyCard. Callers can pass onFavorite to sync.
  const [favorited, setFavorited] = React.useState(isFavoritedProp);

  const handleFavorite = () => {
    setFavorited((prev) => !prev);
    onFavorite?.();
  };

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
        "bg-[var(--ds-color-surface-raised)]",
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
      {/* Header: leaf icon (left) + kebab actions menu (right).
          The favorite star now lives inline beside the scientific name below. */}
      <div className="flex items-center justify-between">
        <Leaf
          className="size-6 shrink-0 text-[var(--ds-color-icon-success)]"
          strokeWidth={1.5}
        />

        {/* Kebab actions menu, top-right. Always visible. */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="More actions"
              className={cn(
                "size-8 flex items-center justify-center shrink-0",
                "rounded-[var(--ds-shape-radius-md)]",
                "text-[var(--ds-color-icon-subtle)] hover:text-[var(--ds-color-text-default)]",
                // transparent border at rest (no layout shift); on hover a
                // subtle gray outline appears.
                "border border-transparent hover:border-[var(--ds-color-icon-subtle)]",
                "transition-colors duration-[120ms] outline-none",
                "focus-visible:ring-2 focus-visible:ring-[var(--ds-color-border-focus)] focus-visible:ring-offset-1"
              )}
            >
              <EllipsisVertical className="size-4" strokeWidth={1.5} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[10rem]">
            <DropdownMenuItem>Save to project</DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem>Disable</DropdownMenuItem>
            <DropdownMenuItem>Add note</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Scientific name — matches StrategyCard one-liner typography.
          Favorite star sits inline, ~8px (ml-2) after the last bit of text. */}
      <h3 className="text-[15px] font-semibold leading-tight text-[var(--ds-color-text-default)] line-clamp-2 min-h-[2.5em]">
        {scientificName}
        {commonName && (
          <span className="font-normal text-[var(--ds-color-text-subtle)]">
            {" "}
            ({commonName})
          </span>
        )}
        {/* Favorite toggle — always visible. Light gray (sand-300) by default;
            colored + filled (yellow-500 stroke and fill) when selected. */}
        <button
          type="button"
          onClick={handleFavorite}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorited}
          className={cn(
            "ml-2 inline-flex items-center justify-center align-middle shrink-0",
            "rounded-[var(--ds-shape-radius-sm)] outline-none",
            "focus-visible:ring-2 focus-visible:ring-[var(--ds-color-border-focus)] focus-visible:ring-offset-1"
          )}
        >
          <Star
            className={cn(
              "size-4 transition-colors duration-[120ms]",
              favorited
                // selected: colored stroke + matching fill
                ? "text-[var(--ds-color-icon-favorite-active)] fill-current"
                // default: light gray outline, no fill
                : "text-[var(--ds-color-icon-favorite-inactive)] fill-none"
            )}
            strokeWidth={1.5}
          />
        </button>
      </h3>

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
        <span
          className={cn(
            // roll-up affordance, styled as Linktext (matches login screen):
            // bold, rests on brand green, brightens to forest-550 on hover
            // (lime in dark mode via token swap).
            "text-xs font-bold px-1 cursor-pointer",
            "text-[var(--ds-color-text-link-brand)]",
            "hover:text-[var(--ds-color-text-link-brand-hover)]",
            "transition-colors duration-[120ms]"
          )}
        >
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

