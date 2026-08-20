"use client";

/**
 * QuillGrid — marketing port of the Quill app-shell canvas grid
 * (components/quill/canvas-decor.tsx): 16px line pitch + a 20px plus-accent
 * every 80px (arm 10, centred at 24,24 so crosses land on grid lines), both
 * strokeWidth 2, drawn as two userSpaceOnUse patterns. Colors come from the
 * page SKIN (--mk-grid-line / --mk-grid-accent): the app's decor tokens are
 * tuned for the app canvas and vanish on marketing's sand-50 grounds. No
 * flora band; inset-0 (no -inset-6 padding trick to counter here). "use
 * client" only for React.useId — two grids on one page would collide on a
 * shared <pattern> id.
 *
 * offsetY shifts the lattice's phase within the host (any CSS length, so it
 * can track a fluid clamp()). Needed where a hard edge sits on a surface
 * whose offset is fluid: the edge then sweeps through the fixed pitch as the
 * viewport resizes and periodically lands on a line or a plus arm. Pass the
 * host's own top offset and the edge holds one phase at every width.
 */

import * as React from "react";

const GRID_PITCH = 16;
const ACCENT_PITCH = 80;
const ACCENT_ARM = 10;
const ACCENT_OFFSET = 24; // must stay on a line (LINE_OFFSET + n*GRID_PITCH) and >= ACCENT_ARM
const LINE_OFFSET = 8; // half pitch, so 2px strokes are not clipped at tile edges
// Multiple of both pitches (240 = 15*16 = 3*80), so lifting the svg by it
// shifts the lattice by a whole number of tiles, i.e. not at all. Must exceed
// the largest offsetY any caller passes, or the host's top edge goes bare.
const PHASE_CUSHION = 240;

export function QuillGrid({
  className = "",
  lineColor = "var(--mk-grid-line)",
  accentColor = "var(--mk-grid-accent)",
  offsetY = "0px",
}: {
  className?: string;
  lineColor?: string;
  accentColor?: string;
  /** CSS length shifting the lattice down within the host. Default "0px". */
  offsetY?: string;
}) {
  const uid = React.useId().replace(/:/g, "");
  const lineId = `mk-grid-${uid}`;
  const accentId = `mk-accent-${uid}`;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden print:hidden ${className}`}
    >
      {/* Lifted by PHASE_CUSHION and grown to match, so a positive offsetY
          still paints to the host's top edge instead of leaving a bare strip.
          The cushion is a common multiple of BOTH pitches, so it moves zero
          phase on its own and offsetY="0px" renders exactly as inset-0 did.

          w-full is load-bearing, do not drop it for inset-x-0 alone: <svg> is a
          REPLACED element, so left:0 + right:0 + width:auto does not stretch it
          the way it would a div — the used width comes from the default 300px
          intrinsic size and the over-constrained equation discards right. That
          shipped once (dae23e1) and painted the grid only in the leftmost 300px
          of every host. Height is safe inline because it is explicit. */}
      <svg
        className="absolute inset-x-0 w-full"
        style={{
          top: `calc(${offsetY} - ${PHASE_CUSHION}px)`,
          height: `calc(100% + ${PHASE_CUSHION}px)`,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={lineId} width={GRID_PITCH} height={GRID_PITCH} patternUnits="userSpaceOnUse">
            <path
              d={`M 0 ${LINE_OFFSET} H ${GRID_PITCH} M ${LINE_OFFSET} 0 V ${GRID_PITCH}`}
              fill="none"
              stroke={lineColor}
              strokeWidth={2}
            />
          </pattern>
          <pattern id={accentId} width={ACCENT_PITCH} height={ACCENT_PITCH} patternUnits="userSpaceOnUse">
            <path
              d={`M ${ACCENT_OFFSET - ACCENT_ARM} ${ACCENT_OFFSET} H ${ACCENT_OFFSET + ACCENT_ARM} M ${ACCENT_OFFSET} ${ACCENT_OFFSET - ACCENT_ARM} V ${ACCENT_OFFSET + ACCENT_ARM}`}
              fill="none"
              stroke={accentColor}
              strokeWidth={2}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${lineId})`} />
        <rect width="100%" height="100%" fill={`url(#${accentId})`} />
      </svg>
    </div>
  );
}
