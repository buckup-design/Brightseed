import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * CardGrid, the shared responsive grid for Hummingbird cards (Compound, Strategy,
 * Plant). One place owns the column bounds so every card surface reflows the same
 * way: cards fill the row left to right, then wrap down.
 *
 * Bounds: min 300px (the Compound footer's "BIOACTIVITY PREDICTION" label stays on
 * one line), max 420px (Figma's native card width). Locked default June 2026.
 *
 * Why 1fr + a per-card max-width instead of minmax(300px, 420px):
 * auto-fill counts columns using the track's MAXIMUM when that maximum is a
 * definite length. With minmax(300px, 420px) the browser asks "how many 420px
 * columns fit?" so a ~810px container (e.g. the Storybook docs preview) fits only
 * one and the grid collapses to a single column. Using 1fr as the max makes
 * auto-fill count by the 300px MINIMUM (so it packs as many columns as actually
 * fit), and we cap each card at 420px with max-width so cards still never exceed
 * the Figma width. justify-items: start keeps a capped card aligned to the left of
 * its track, and the last partial row packs from the left.
 *
 * The cards themselves stay w-full min-w-0, the column width is the grid's job.
 * Override minCardWidth / maxCardWidth only for a deliberately denser or wider
 * surface (e.g. StrategyCard's wider assessment table may want minCardWidth={340}).
 */

export interface CardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Minimum column width in px. Default 300. */
  minCardWidth?: number;
  /** Maximum card width in px (cap, not a track size). Default 420. */
  maxCardWidth?: number;
  /** Gap between cards in px. Default 16. */
  gap?: number;
}

export function CardGrid({
  minCardWidth = 300,
  maxCardWidth = 420,
  gap = 16,
  className,
  style,
  children,
  ...props
}: CardGridProps) {
  return (
    <div
      data-slot="card-grid"
      className={cn(
        "grid w-full [&>*]:w-full [&>*]:min-w-0 [&>*]:max-w-[var(--card-max-width)]",
        className,
      )}
      style={{
        ...({ "--card-max-width": `${maxCardWidth}px` } as React.CSSProperties),
        gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`,
        justifyContent: "start",
        justifyItems: "start",
        alignItems: "start",
        gap,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
