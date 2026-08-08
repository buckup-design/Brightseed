"use client";

/**
 * CanvasDecor — the New chat screen's background: a fine grid and a botanical
 * band along the bottom. Figma: Collab Playground 142:4874 ("with grid and
 * flowers").
 *
 * Purely decorative and `aria-hidden`, so nothing here may ever be the only
 * carrier of meaning. Also `print:hidden` — an inline SVG is document content
 * and would otherwise print, unlike a CSS background.
 *
 * Grid geometry is taken from the Figma export, not eyeballed: 16px line pitch
 * at 2px, plus-accents every 80px (every 5th line) as a 20px cross, also 2px.
 * The 0.6 group opacity is folded into the tokens rather than applied here, so
 * the colours stay inspectable as single values.
 *
 * The band is delivered as a CSS mask, NOT an <img>. The SVG carries
 * stroke="currentColor", but currentColor cannot cross an <img> boundary — an
 * SVG loaded that way is an isolated document and resolves it to black, which
 * renders the band black-on-dark in dark mode. Masking a token-coloured element
 * themes correctly and keeps 160KB out of the JS bundle.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

/** Line pitch in px. Accents land every 5th line; see ACCENT_PITCH. */
const GRID_PITCH = 16;
/** Plus-accent spacing in px (80 = every 5th line), and the cross's arm length. */
const ACCENT_PITCH = 80;
const ACCENT_ARM = 10;
/** Cross centre within the tile. MUST be >= ACCENT_ARM: an SVG pattern clips
 *  anything outside its tile, so a cross centred at 0,0 renders as an L. Kept a
 *  multiple of GRID_PITCH so accents still land on line intersections. */
const ACCENT_OFFSET = 16;

export function CanvasDecor({ className }: { className?: string }) {
  // Two grids on one page would collide on a shared <pattern> id.
  const uid = React.useId().replace(/:/g, "");
  const lineId = `decor-grid-${uid}`;
  const accentId = `decor-accent-${uid}`;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden print:hidden",
        className
      )}
    >
      <svg className="absolute inset-0 size-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* userSpaceOnUse so the pitch stays 16px regardless of the box size. */}
          <pattern
            id={lineId}
            width={GRID_PITCH}
            height={GRID_PITCH}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${GRID_PITCH} 0 L 0 0 0 ${GRID_PITCH}`}
              fill="none"
              stroke="var(--c-canvas-decor-grid-line)"
              strokeWidth={2}
            />
          </pattern>
          <pattern
            id={accentId}
            width={ACCENT_PITCH}
            height={ACCENT_PITCH}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={
                `M ${ACCENT_OFFSET - ACCENT_ARM} ${ACCENT_OFFSET} ` +
                `H ${ACCENT_OFFSET + ACCENT_ARM} ` +
                `M ${ACCENT_OFFSET} ${ACCENT_OFFSET - ACCENT_ARM} ` +
                `V ${ACCENT_OFFSET + ACCENT_ARM}`
              }
              fill="none"
              stroke="var(--c-canvas-decor-grid-accent)"
              strokeWidth={2}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${lineId})`} />
        <rect width="100%" height="100%" fill={`url(#${accentId})`} />
      </svg>

      {/* Botanical band — bottom-anchored, bleeding off both edges. The source
          art is 3041x947 (3.21:1); `100% auto` keeps that ratio and lets the
          band crop rather than squash on a narrow viewport. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[42%] bg-[var(--c-canvas-decor-art)]"
        style={{
          maskImage: "url(/brand/flora-band.svg)",
          WebkitMaskImage: "url(/brand/flora-band.svg)",
          maskSize: "100% auto",
          WebkitMaskSize: "100% auto",
          maskPosition: "bottom left",
          WebkitMaskPosition: "bottom left",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      />
    </div>
  );
}

/**
 * HummingbirdBadge — the circular assistant mark above the greeting. 86px
 * circle on a surface tile, holding the 56px line glyph.
 *
 * strokeWidth is dialled down to 1: HummingbirdLine is authored at 24px with a
 * 1.5 stroke, so at 56px it would otherwise render 3.5px and read as a marker
 * pen. 1 lands at ~2.3px, matching the Figma.
 */
export function HummingbirdBadge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex size-[86px] shrink-0 items-center justify-center rounded-full",
        "bg-[var(--c-canvas-decor-badge-surface)] text-[var(--c-canvas-decor-badge-icon)]",
        className
      )}
    >
      {children}
    </div>
  );
}
