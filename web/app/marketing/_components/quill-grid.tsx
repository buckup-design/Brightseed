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
 */

import * as React from "react";

const GRID_PITCH = 16;
const ACCENT_PITCH = 80;
const ACCENT_ARM = 10;
const ACCENT_OFFSET = 24; // must stay on a line (LINE_OFFSET + n*GRID_PITCH) and >= ACCENT_ARM
const LINE_OFFSET = 8; // half pitch, so 2px strokes are not clipped at tile edges

export function QuillGrid({
  className = "",
  lineColor = "var(--mk-grid-line)",
  accentColor = "var(--mk-grid-accent)",
}: {
  className?: string;
  lineColor?: string;
  accentColor?: string;
}) {
  const uid = React.useId().replace(/:/g, "");
  const lineId = `mk-grid-${uid}`;
  const accentId = `mk-accent-${uid}`;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden print:hidden ${className}`}
    >
      <svg className="absolute inset-0 size-full" xmlns="http://www.w3.org/2000/svg">
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
