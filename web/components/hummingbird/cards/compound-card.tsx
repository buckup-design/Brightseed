"use client";

import * as React from "react";
import { Sparkles, TestTubeDiagonal, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { CompoundSingle, CompoundMultiple } from "@/components/ui/badge-icons";
import { EvidenceTag } from "@/components/ui/evidence-tag";

/**
 * CompoundCard, Hummingbird Compounds view.
 *
 * Source: Figma "Card/compound" set (Collab Playground, node 42:1328), built on
 * the StrategyCard shell. A compound is one of three TYPES, the type drives the
 * header glyph and the footer score treatment:
 *
 *   predicted  Sparkles glyph (lavender). Footer shows BIOACTIVITY PREDICTION as
 *              a 0-1 decimal (e.g. ".85"). No sparkline.
 *   single     CompoundSingle glyph (orange). Footer shows CONFIDENCE as a
 *              percent (e.g. "85%") plus a sparkline.
 *   combo      CompoundMultiple glyph (lime). Same footer as single.
 *
 * Layout (top to bottom):
 *   1. Header: type glyph (left) + favorite star (right, StrategyCard behavior)
 *   2. Compound name (clickable, routes to detail)
 *   3. Mechanism of action
 *   4. Samples row: TestTubeDiagonal pills (clickable). Count-based overflow,
 *      0 hidden, 1-3 shown, 4+ shows two then "+N more".
 *   5. Targets row: sand pills (clickable). Width-based overflow, single line,
 *      never wraps and never truncates a tag, the rest collapse to "+N more".
 *   6. Footer: score (per type) on the left, single evidence tag on the right.
 *
 * Fixed height: every region keeps its slot even when empty, so cards stay the
 * same height across a grid. Empty Samples / Targets rows are hidden but their
 * space is reserved (the row container is always rendered at h-6).
 *
 * Click model: one shared onSelect handler. The name, every sample, every
 * target, both "+N more" links, and the evidence tag all route to the same
 * compound detail view for now. The favorite star is the only interactive
 * element that does NOT route to detail.
 *
 * Hover: inherited from StrategyCard, border steps subtle to default and the
 * shadow deepens on card hover; the favorite star fades in on hover (always
 * visible when favorited).
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type CompoundType = "predicted" | "single" | "combo";

/** A compound shows at most one evidence tag; "none" renders nothing. */
export type CompoundEvidence = "none" | "animal" | "clinical";

export interface CompoundCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  type: CompoundType;
  name: string;
  mechanism: string;
  /** Sample identifiers (e.g. "ERD250174"). 0 to N. */
  samples?: string[];
  /** Biological target symbols (e.g. "IGF-1R"). 0 to N. */
  targets?: string[];
  /** Strongest available evidence for this compound (clinical beats animal). */
  evidence?: CompoundEvidence;
  /**
   * The headline score, 0 to 1. Rendered as a decimal for "predicted"
   * (BIOACTIVITY PREDICTION) and as a percent for "single" / "combo"
   * (CONFIDENCE). Omit to hide the score.
   */
  score?: number;
  /**
   * Sparkline bar heights, each 0 to 1, shown next to CONFIDENCE on
   * single / combo cards. BRIGHTSEED-TBD: the real score-to-bars mapping is
   * unknown (we don't yet have how confidence is calculated). Until then the
   * data layer supplies these explicitly; if omitted, a placeholder is derived
   * from `score` so the bar still reads as dynamic.
   */
  sparkline?: number[];
  isFavorited?: boolean;
  onFavorite?: () => void;
  /** Shared navigation: fired by name, samples, targets, "+N more", evidence. */
  onSelect?: () => void;
}

// ─── Type config: glyph + color per compound type ────────────────────────────

const TYPE_CONFIG: Record<
  CompoundType,
  { Icon: React.ElementType; iconClass: string }
> = {
  predicted: {
    Icon: Sparkles,
    iconClass: "text-[var(--ds-color-icon-data-lavender)]",
  },
  single: {
    Icon: CompoundSingle,
    iconClass: "text-[var(--ds-color-icon-data-orange)]",
  },
  combo: {
    Icon: CompoundMultiple,
    iconClass: "text-[var(--ds-color-icon-brand)]",
  },
};

const EVIDENCE_LABEL: Record<Exclude<CompoundEvidence, "none">, string> = {
  animal: "Animal",
  clinical: "Clinical",
};

/**
 * Resolve the single evidence tag to show from raw flags. Clinical evidence is
 * stronger than animal trials, so it wins when both are present. Exported so
 * callers / data layers can apply the same precedence rule.
 */
export function strongestEvidence(opts: {
  animal?: boolean;
  clinical?: boolean;
}): CompoundEvidence {
  if (opts.clinical) return "clinical";
  if (opts.animal) return "animal";
  return "none";
}

// ─── Shared pill primitives (Samples / Targets / overflow) ───────────────────
// These reference --ds-* semantics directly, matching StrategyCard's convention
// for Hummingbird surface components (the strict --c-{component}-* tier is for
// core Quill components; these app-surface pills follow the card's own pattern).

const PILL_BASE = cn(
  "inline-flex h-6 items-center gap-1.5 rounded-[var(--ds-shape-radius-md)]",
  "px-2 text-[13px] leading-none whitespace-nowrap shrink-0",
  "transition-colors duration-[120ms] outline-none",
  "focus-visible:ring-1 focus-visible:ring-[var(--ds-color-border-focus)] focus-visible:ring-offset-1",
);

function SamplePill({ id, onSelect }: { id: string; onSelect?: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        PILL_BASE,
        "bg-[var(--ds-color-surface-alt)] text-[var(--ds-color-text-subtle)]",
        "hover:bg-[var(--ds-color-surface-alt-hover)] hover:text-[var(--ds-color-text-default)]",
      )}
    >
      <TestTubeDiagonal className="size-3.5 shrink-0" strokeWidth={1.5} />
      {id}
    </button>
  );
}

function TargetPill({
  label,
  onSelect,
}: {
  label: string;
  onSelect?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        PILL_BASE,
        "bg-[var(--ds-color-surface-alt)] text-[var(--ds-color-text-default)]",
        "hover:bg-[var(--ds-color-surface-alt-hover)]",
      )}
    >
      {label}
    </button>
  );
}

/** Borderless "+N more" link. Transparent surface, deepens color on hover. */
function MoreLink({
  count,
  onSelect,
}: {
  count: number;
  onSelect?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        PILL_BASE,
        // No underline: deepen sand-800 to sand-950 on hover, same as the name.
        "bg-transparent text-[var(--ds-color-text-default)] hover:text-[var(--ds-color-text-default-hover)]",
      )}
    >
      +{count} more
    </button>
  );
}

// ─── Targets row: width-based, single line, no wrap, no truncation ───────────
// A hidden "ghost" row renders every tag at full size so we always have real
// widths to measure (even after some are hidden in the visible row). On mount
// and on resize we compute how many whole tags fit, reserving room for the
// "+N more" link when there is a remainder.

function TargetsRow({
  targets,
  onSelect,
}: {
  targets: string[];
  onSelect?: () => void;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const ghostItemRefs = React.useRef<Array<HTMLSpanElement | null>>([]);
  const ghostMoreRef = React.useRef<HTMLSpanElement>(null);
  const [visibleCount, setVisibleCount] = React.useState(targets.length);

  React.useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const GAP = 6; // matches gap-1.5

    const recompute = () => {
      const available = container.clientWidth;
      const widths = ghostItemRefs.current.map((el) =>
        el ? el.getBoundingClientRect().width : 0,
      );
      const moreWidth = ghostMoreRef.current
        ? ghostMoreRef.current.getBoundingClientRect().width
        : 56;

      let used = 0;
      let fit = 0;
      for (let i = 0; i < targets.length; i++) {
        const next = used + (i > 0 ? GAP : 0) + widths[i];
        const remainderAfter = i < targets.length - 1;
        const reserve = remainderAfter ? GAP + moreWidth : 0;
        if (next + reserve <= available) {
          used = next;
          fit = i + 1;
        } else {
          break;
        }
      }
      setVisibleCount(fit);
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(container);
    return () => ro.disconnect();
  }, [targets]);

  const overflow = targets.length - visibleCount;

  return (
    <div ref={containerRef} className="relative h-6 w-full overflow-hidden">
      {/* Ghost measurer: full-size, never visible, never interactive. */}
      <div
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-0 flex gap-1.5 whitespace-nowrap"
      >
        {targets.map((t, i) => (
          <span
            key={t}
            ref={(el) => {
              ghostItemRefs.current[i] = el;
            }}
            className={cn(PILL_BASE, "bg-[var(--ds-color-surface-alt)]")}
          >
            {t}
          </span>
        ))}
        <span ref={ghostMoreRef} className={cn(PILL_BASE)}>
          +{targets.length} more
        </span>
      </div>

      {/* Visible row */}
      <div className="flex h-6 items-center gap-1.5 overflow-hidden">
        {targets.slice(0, visibleCount).map((t) => (
          <TargetPill key={t} label={t} onSelect={onSelect} />
        ))}
        {overflow > 0 && <MoreLink count={overflow} onSelect={onSelect} />}
      </div>
    </div>
  );
}

// ─── Samples row: count-based overflow ───────────────────────────────────────
// 0 hidden (row still reserves its height), 1-3 shown, 4+ shows the first two
// then a "+N more" link.

function SamplesRow({
  samples,
  onSelect,
}: {
  samples: string[];
  onSelect?: () => void;
}) {
  const shown = samples.length >= 4 ? samples.slice(0, 2) : samples;
  const overflow = samples.length - shown.length;

  return (
    <div className="flex h-6 items-center gap-1.5 overflow-hidden">
      {shown.map((id) => (
        <SamplePill key={id} id={id} onSelect={onSelect} />
      ))}
      {overflow > 0 && <MoreLink count={overflow} onSelect={onSelect} />}
    </div>
  );
}

// ─── Confidence sparkline ────────────────────────────────────────────────────
// A row of fixed-width bars, bottom-aligned, heights driven by data. Colors use
// the sanctioned chart category namespace (--chart-cat-*), never brand lime or
// forest as a data series (per CLAUDE.md). Composed from <div> bars, not a
// hand-rolled SVG glyph.

const SPARK_COLORS = [
  "var(--chart-cat-3)", // orange
  "var(--chart-cat-1)", // teal
  "var(--chart-cat-2)", // lavender
  "var(--chart-cat-6)", // dark teal
  "var(--chart-cat-8)", // burnt orange
];

function ConfidenceSparkline({ values }: { values: number[] }) {
  const MAX_H = 13; // px, matches Figma
  const MIN_H = 3;
  return (
    <div aria-hidden="true" className="flex h-[13px] items-end gap-[2px] shrink-0">
      {values.map((v, i) => {
        const clamped = Math.max(0, Math.min(1, v));
        const height = Math.max(MIN_H, Math.round(clamped * MAX_H));
        return (
          <span
            key={i}
            className="w-[5px] rounded-[1px]"
            style={{
              height: `${height}px`,
              background: SPARK_COLORS[i % SPARK_COLORS.length],
            }}
          />
        );
      })}
    </div>
  );
}

/** Placeholder bars derived from score until the real mapping is defined. */
function deriveSparkline(score: number): number[] {
  return [score, score * 0.65, score * 0.45];
}

// ─── Footer score ────────────────────────────────────────────────────────────

function FooterScore({
  type,
  score,
  sparkline,
}: {
  type: CompoundType;
  score: number;
  sparkline?: number[];
}) {
  const isPredicted = type === "predicted";
  const label = isPredicted ? "BIOACTIVITY PREDICTION" : "CONFIDENCE";
  // Predicted: 0-1 decimal, leading zero stripped (".85"). Others: percent.
  const value = isPredicted
    ? score.toFixed(2).replace(/^0/, "")
    : `${Math.round(score * 100)}%`;
  const bars = isPredicted ? null : (sparkline ?? deriveSparkline(score));

  return (
    <div className="flex items-center gap-2 min-w-0">
      {bars && <ConfidenceSparkline values={bars} />}
      <span className="font-mono text-[12px] tracking-wide text-[var(--ds-color-text-subtle)] truncate">
        {label}
      </span>
      <span className="text-[13px] font-medium text-[var(--ds-color-text-subtle)] tabular-nums">
        {value}
      </span>
    </div>
  );
}

// ─── CompoundCard ─────────────────────────────────────────────────────────────

export function CompoundCard({
  type,
  name,
  mechanism,
  samples = [],
  targets = [],
  evidence = "none",
  score,
  sparkline,
  isFavorited: isFavoritedProp = false,
  onFavorite,
  onSelect,
  className,
  ...props
}: CompoundCardProps) {
  const { Icon, iconClass } = TYPE_CONFIG[type];

  const [favorited, setFavorited] = React.useState(isFavoritedProp);
  const handleFavorite = () => {
    setFavorited((prev) => !prev);
    onFavorite?.();
  };

  return (
    <div
      data-slot="compound-card"
      data-type={type}
      className={cn(
        "group flex flex-col gap-3 p-4 w-full min-w-0",
        "bg-[var(--ds-color-surface-default)]",
        "border border-[var(--ds-color-border-subtle)] hover:border-[var(--ds-color-border-default)]",
        "rounded-[var(--ds-shape-radius-md)]",
        "shadow-[0px_1px_1.5px_rgba(0,0,0,0.07)]",
        "hover:shadow-[0px_4px_6px_rgba(0,0,0,0.12)]",
        "transition-[border-color,box-shadow] duration-[120ms]",
        className,
      )}
      {...props}
    >
      {/* ── Header: type glyph + favorite star ─────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Icon className={cn("size-6 shrink-0", iconClass)} strokeWidth={1.5} />

        <button
          type="button"
          onClick={handleFavorite}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorited}
          className={cn(
            "group/fav size-8 flex items-center justify-center shrink-0",
            "rounded-[var(--ds-shape-radius-md)]",
            favorited ? "opacity-100" : "opacity-0 group-hover:opacity-100",
            "transition-opacity duration-[120ms]",
            "focus-visible:opacity-100 outline-none",
            "focus-visible:ring-2 focus-visible:ring-[var(--ds-color-border-focus)] focus-visible:ring-offset-1",
          )}
        >
          <Star
            className={cn(
              "size-4 fill-none transition-colors duration-[120ms]",
              favorited
                ? "text-[var(--ds-color-icon-favorite-active)]"
                : "text-[var(--ds-color-icon-favorite-inactive)] group-hover/fav:text-[var(--ds-color-icon-favorite-active)]",
            )}
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* ── Name (clickable) ───────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "text-left text-[15px] font-semibold leading-tight line-clamp-2 min-h-[2.5em]",
          // Clickable: no underline. Affordance is the color deepening from
          // default (sand-800) to hover (sand-950) plus the pointer cursor.
          "text-[var(--ds-color-text-default)] hover:text-[var(--ds-color-text-default-hover)]",
          "transition-colors duration-[120ms] outline-none rounded-[var(--ds-shape-radius-sm)]",
          "focus-visible:ring-2 focus-visible:ring-[var(--ds-color-border-focus)] focus-visible:ring-offset-1",
        )}
      >
        {name}
      </button>

      {/* ── Mechanism ──────────────────────────────────────────────────────── */}
      <p className="text-[13px] leading-snug text-[var(--ds-color-text-subtle)] line-clamp-2 min-h-[2.75em]">
        {mechanism}
      </p>

      {/* ── Samples row (height always reserved) ───────────────────────────── */}
      <SamplesRow samples={samples} onSelect={onSelect} />

      {/* ── Targets row (height always reserved) ───────────────────────────── */}
      <TargetsRow targets={targets} onSelect={onSelect} />

      {/* ── Footer: score (left) + single evidence tag (right) ─────────────── */}
      <div
        className={cn(
          "flex items-center justify-between gap-2 -mx-4 -mb-4 mt-1 px-4 h-14",
          "rounded-b-[var(--ds-shape-radius-md)]",
          "bg-[var(--ds-color-surface-alt)] border-t border-[var(--ds-color-border-subtle)]",
        )}
      >
        {typeof score === "number" ? (
          <FooterScore type={type} score={score} sparkline={sparkline} />
        ) : (
          <span />
        )}

        {evidence !== "none" && (
          <EvidenceTag onClick={onSelect} className="cursor-pointer">
            {EVIDENCE_LABEL[evidence]}
          </EvidenceTag>
        )}
      </div>
    </div>
  );
}
