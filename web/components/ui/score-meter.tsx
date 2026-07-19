"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * ScoreMeter — the shared 0–1 magnitude meter.
 *
 * A slim horizontal bar whose fill LENGTH encodes a normalized score. Length on
 * a common baseline is the one pre-attentive channel that lets a grid of cards
 * be ranked honestly by eye, which is why this beat the segmented and radial
 * forms in the design panel (July 18 2026). One atom serves every score in
 * Hummingbird: the result cards' Confidence / Synergy / Bioactivity, and later
 * the detail slide-over's Confidence Score and the IP gauges.
 *
 * It is deliberately NOT the Progress component. Progress's indicator resolves
 * to brand lime (--c-progress-action-primary → lime-300), which is 1.23:1 on
 * the sand card footer — fine as UI chrome, banned as a data series. ScoreMeter
 * fills through the forest magnitude ramp instead (--c-score-meter-fill-*),
 * whose floor (forest-600, 3.81:1) clears WCAG 1.4.11 on the worst-case footer.
 *
 * Colour is never the sole signal: the fill LENGTH carries the value, the tier
 * only DARKENS the same forest hue (no traffic-light hue-shift), and the value
 * is always printed. role="meter" with a formatted aria-valuetext makes it
 * announceable — a real fix over the old aria-hidden sparkline it replaces.
 *
 * `value` is ALWAYS normalized 0–1; the display unit is chosen by `format`
 * ("85%" for a percentage, ".85" for a raw bioactivity score).
 */

export interface ScoreMeterProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "role"> {
  /** The score, normalized 0–1. Fill width = value; clamped internally. */
  value: number;
  /** Quantity name, e.g. "Confidence" / "Synergy" / "Bioactivity". */
  label: string;
  /** "percent" → "85%"; "score" → ".85" (leading zero stripped). */
  format?: "percent" | "score";
  /** 0–1 position of the decorative threshold notch; null hides it. */
  threshold?: number | null;
  /** Tier cut points (0–1) that pick the fill darkness. */
  thresholds?: { med: number; high: number };
  /** Hide the label/value row for a bare inline bar. */
  showLabel?: boolean;
}

const FILL_TOKEN = {
  low: "var(--c-score-meter-fill-soft)",
  med: "var(--c-score-meter-fill)",
  high: "var(--c-score-meter-fill-strong)",
} as const;

export function ScoreMeter({
  value,
  label,
  format = "percent",
  threshold = 0.7,
  thresholds = { med: 0.5, high: 0.8 },
  showLabel = true,
  className,
  ...props
}: ScoreMeterProps) {
  // Number.isFinite guard first — Math.min(1, NaN) is NaN, so a bare clamp would
  // leak NaN into "NaN%", width:NaN%, and aria-valuenow=NaN (see the ScoreMeter
  // contract: "clamped internally"). A missing/0-of-0 score reads as empty.
  const clamped = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
  const tier =
    clamped >= thresholds.high ? "high" : clamped >= thresholds.med ? "med" : "low";

  // percent: "85%" on a 0–100 aria scale. score: ".85" on a 0–1 scale.
  const display =
    format === "score"
      ? clamped.toFixed(2).replace(/^0/, "")
      : `${Math.round(clamped * 100)}%`;

  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={format === "score" ? 1 : 100}
      aria-valuenow={format === "score" ? clamped : Math.round(clamped * 100)}
      aria-valuetext={display}
      data-slot="score-meter"
      data-tier={tier}
      className={cn("flex w-full flex-col gap-1", className)}
      {...props}
    >
      {showLabel && (
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[11px] font-medium tracking-[0.06em] text-[var(--c-score-meter-label)] uppercase">
            {label}
          </span>
          <span className="shrink-0 text-[13px] font-medium tabular-nums text-[var(--c-score-meter-value)]">
            {display}
          </span>
        </div>
      )}

      <div
        className="relative h-2 w-full overflow-hidden rounded-[var(--c-score-meter-shape-radius-round)] bg-[var(--c-score-meter-track)]"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-[var(--c-score-meter-shape-radius-round)] transition-[width,background-color] duration-[120ms]"
          style={{ width: `${clamped * 100}%`, background: FILL_TOKEN[tier] }}
        />
        {/* Decorative threshold notch: the high-confidence boundary, so the
            fill's edge relative to it reads at a glance. aria-hidden — the value
            is already announced. Sits above the fill (later in DOM). */}
        {threshold != null && (
          <span
            aria-hidden="true"
            className="absolute inset-y-0 w-[2px] -translate-x-1/2 bg-[var(--c-score-meter-tick)]"
            style={{
              left: `${Math.max(0, Math.min(1, Number.isFinite(threshold) ? threshold : 0)) * 100}%`,
            }}
          />
        )}
      </div>
    </div>
  );
}
