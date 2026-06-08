import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * CardGrid, the shared responsive grid for Hummingbird cards (Compound, Strategy,
 * Plant). One place owns the column bounds so every card surface reflows the same
 * way.
 *
 * Behavior: cards fill the row left to right, then wrap down. Columns use
 * auto-fill with a min AND max track:
 *
 *   repeat(auto-fill, minmax(300px, 420px))
 *
 * so a card never shrinks below 300px (the Compound footer's "BIOACTIVITY
 * PREDICTION" label stays on one line) and never stretches past 420px (the Figma
 * native card width). Between those, columns grow to absorb free space; once every
 * column is at 420px the leftover sits at the trailing edge (justify-content:
 * start) rather than stretching the cards. Locked default June 2026.
 *
 * The cards themselves stay w-full min-w-0, the column width is the grid's job,
 * not the card's. Override minCardWidth / maxCardWidth only for a deliberately
 * denser or wider surface.
 */

export interface CardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Minimum column width in px. Default 300. */
  minCardWidth?: number;
  /** Maximum column width in px. Default 420. */
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
      className={cn("grid w-full", className)}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, ${maxCardWidth}px))`,
        justifyContent: "start",
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
