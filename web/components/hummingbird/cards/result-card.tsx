"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { CompoundMultiple, CompoundSingle } from "@/components/ui/badge-icons";
import { EvidenceTag } from "@/components/ui/evidence-tag";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { ScoreMeter } from "@/components/ui/score-meter";

/**
 * ResultCard — a Hummingbird Workspace result card.
 *
 * The reconciled successor to compound-card.tsx (design panel, July 18 2026).
 * It drops the retired rumen/"mechanism" framing for the live product's
 * benefit + biomarker + confidence model, and replaces the aria-hidden rainbow
 * ConfidenceSparkline with the announceable ScoreMeter atom. compound-card.tsx
 * stays until this reaches parity, then it and its story are deleted.
 *
 * One card, three TYPES (a discriminated union), the type drives the glyph, the
 * headline quantity, and the evidence treatment:
 *
 *   single     one compound. CompoundSingle glyph (orange). Score = CONFIDENCE
 *              %. Evidence = an inline EvidenceTag chip in the footer.
 *   combo      a synergy pair ("A + B"). CompoundMultiple glyph (lime). Score =
 *              SYNERGY %. Evidence = the footer EvidenceTag chip (Clinical /
 *              Animal), text-carried, per the "colour never implies status" rule.
 *   predicted  ML-predicted / unstudied. Sparkles glyph (lavender). Score = a
 *              raw 0–1 BIOACTIVITY decimal (".85"). A green "Predicted" badge +
 *              a faint forest body tint mark it; the footer stays sand so the
 *              forest ScoreMeter keeps its ≥3:1 backdrop.
 *
 * Score is ALWAYS normalized 0–1 in the data; ScoreMeter picks the display unit.
 *
 * Token tier: the card is a leaf app-surface composition and reads --ds-*
 * directly, the same convention its compound/plant/strategy-card neighbours
 * follow. The embedded ScoreMeter is the strict --c-* reused atom — the two
 * conventions do not mix inside one file.
 *
 * Click model: one shared onSelect routes to the detail slide-over (name,
 * targets, "+N more" all fire it). The favorite star is the only control that
 * does not.
 */

// ─── Model ───────────────────────────────────────────────────────────────────

/** Evidence backing a result. Drives SINGLE/COMBO's footer evidence chip. */
export type EvidenceClass =
  | "clinical"
  | "animal"
  | "in-vitro"
  | "predicted"
  | "none";

/** A biological target / biomarker symbol, e.g. "IGF-1R". */
export type Biomarker = string;

interface ResultBase {
  /** Health-benefit / intent line, e.g. "Weight Management". */
  benefit: string;
  /** Targets & biomarkers. 0..N; overflow collapses to "+N more". */
  targets?: Biomarker[];
  /** Decorative descriptors (Antioxidant, Polyphenol…). Colour ≠ status. */
  categories?: string[];
  /** Strongest available evidence (precedence clinical > animal > in-vitro). */
  evidence: EvidenceClass;
  isFavorited?: boolean;
}

export interface SingleResult extends ResultBase {
  type: "single";
  /** e.g. "Resveratrol". */
  name: string;
  /** Confidence, 0..1, shown as "85%". */
  score: number;
  /** "predicted" is the predicted type's own evidence — excluding it here stops
   * a single/combo carrying it and silently rendering no evidence indicator. */
  evidence: Exclude<EvidenceClass, "predicted">;
}

export interface ComboResult extends ResultBase {
  type: "combo";
  /** The pair, e.g. ["Berberine", "Sulforaphane"] → "Berberine + Sulforaphane". */
  names: [string, string];
  /** Synergy strength, 0..1, shown as "85%". */
  score: number;
  evidence: Exclude<EvidenceClass, "predicted">;
}

export interface PredictedResult extends ResultBase {
  type: "predicted";
  /** The Brightseed-HBPB catalog id, e.g. "Brightseed-HBPB0049946". */
  name: string;
  /** Bioactivity likelihood, 0..1, shown as ".85". */
  score: number;
  evidence: "predicted";
}

export type Result = SingleResult | ComboResult | PredictedResult;

// ─── Per-type config ─────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  single: { Icon: CompoundSingle, iconClass: "text-[var(--ds-color-icon-data-orange)]" },
  combo: { Icon: CompoundMultiple, iconClass: "text-[var(--ds-color-icon-brand)]" },
  predicted: { Icon: Sparkles, iconClass: "text-[var(--ds-color-icon-data-lavender)]" },
} as const;

const SCORE_LABEL = {
  single: "Confidence",
  combo: "Synergy",
  predicted: "Bioactivity",
} as const;

const EVIDENCE_LABEL: Record<Exclude<EvidenceClass, "none" | "predicted">, string> = {
  clinical: "Clinical",
  animal: "Animal",
  "in-vitro": "In Vitro",
};

export function displayName(result: Result): string {
  return result.type === "combo"
    ? `${result.names[0]} + ${result.names[1]}`
    : result.name;
}

/**
 * Identity key for a result — the React key in grids/stacks AND the key the
 * Workspace favorites Set is stored under, so a star toggled on a grid card,
 * on the same result rendered inline in chat, and on the detail sheet's Pin all
 * refer to one entry. Detail fixtures MUST set detail.name === resultKey(result)
 * for that sync to hold. Coincides with displayName today; kept a separate seam
 * so a future ResultBase.id can change identity without touching the label.
 */
export function resultKey(result: Result): string {
  return displayName(result);
}

// ─── Pills + targets overflow ────────────────────────────────────────────────

const PILL_BASE = cn(
  "inline-flex h-6 items-center rounded-[var(--ds-shape-radius-md)] px-2",
  "text-[13px] leading-none whitespace-nowrap shrink-0 transition-colors outline-none",
  "focus-visible:ring-1 focus-visible:ring-[var(--ds-color-border-focus)] focus-visible:ring-offset-1",
);

// A target pill / overflow link is only a control when the card navigates. When
// onSelect is absent (a non-navigating card, e.g. predicted) it renders as a
// static span so it isn't a focusable no-op stop for keyboard / SR users.
function TargetPill({ label, onSelect }: { label: string; onSelect?: () => void }) {
  const surface = "bg-[var(--ds-color-surface-alt)] text-[var(--ds-color-text-default)]";
  if (!onSelect) {
    return <span className={cn(PILL_BASE, surface)}>{label}</span>;
  }
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(PILL_BASE, surface, "hover:bg-[var(--ds-color-surface-alt-hover)]")}
    >
      {label}
    </button>
  );
}

function MoreLink({ count, onSelect }: { count: number; onSelect?: () => void }) {
  if (!onSelect) {
    return (
      <span className={cn(PILL_BASE, "bg-transparent text-[var(--ds-color-text-subtle)]")}>
        +{count} more
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        PILL_BASE,
        "bg-transparent text-[var(--ds-color-text-default)] hover:text-[var(--ds-color-text-default-hover)]",
      )}
    >
      +{count} more
    </button>
  );
}

/** Single line of target pills; a conservative count cap keeps them on one row
 * (the card's height is fixed, so the row must not wrap), the rest collapse. */
function TargetsRow({ targets, onSelect }: { targets: string[]; onSelect?: () => void }) {
  const CAP = 3;
  const shown = targets.slice(0, CAP);
  const overflow = targets.length - shown.length;
  return (
    <div className="flex h-6 items-center gap-1.5 overflow-hidden">
      {shown.map((t) => (
        <TargetPill key={t} label={t} onSelect={onSelect} />
      ))}
      {overflow > 0 && <MoreLink count={overflow} onSelect={onSelect} />}
    </div>
  );
}

// ─── ResultCard ──────────────────────────────────────────────────────────────

export interface ResultCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  result: Result;
  onFavorite?: (favorited: boolean) => void;
  /** Shared navigation to the detail slide-over (name, targets, "+N more"). */
  onSelect?: () => void;
}

export function ResultCard({
  result,
  onFavorite,
  onSelect,
  className,
  ...props
}: ResultCardProps) {
  const { Icon, iconClass } = TYPE_CONFIG[result.type];
  const isPredicted = result.type === "predicted";
  // Predicted results have no detail, so the card must not route anywhere — its
  // name and targets render as static text rather than focusable no-op buttons
  // (dead keyboard / screen-reader stops). Non-predicted cards navigate when the
  // caller supplies onSelect.
  const canNavigate = !isPredicted && !!onSelect;
  const targets = result.targets ?? [];
  const categories = result.categories ?? [];

  // Fully controlled, like FavoriteButton itself: the parent owns favorite
  // state (the way ReportsList owns its favoritedIds), so the star can never
  // desync from result.isFavorited on a clear-all, an external favorite, or a
  // recycled list row. A toggle just asks the parent to flip it; the stories
  // wrap the card in local state to stay interactive.
  const favorited = result.isFavorited ?? false;

  const showEvidenceChip =
    result.evidence !== "none" && result.evidence !== "predicted";

  return (
    <div
      data-slot="result-card"
      data-type={result.type}
      className={cn(
        "group flex w-full min-w-0 flex-col gap-3 p-4",
        "rounded-[var(--ds-shape-radius-md)] border border-[var(--ds-color-border-subtle)]",
        "shadow-[var(--ds-shadow-xs)] transition-[border-color,box-shadow] duration-[120ms]",
        "hover:border-[var(--ds-color-border-default)] hover:shadow-[var(--ds-shadow-sm)]",
        // PREDICTED gets a faint forest body tint; others sit on plain white.
        isPredicted
          ? "bg-[var(--ds-color-surface-success)]"
          : "bg-[var(--ds-color-surface-default)]",
        className,
      )}
      {...props}
    >
      {/* ── Header: glyph (+ Predicted badge) · favorite ──────────────────── */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Icon className={cn("size-6 shrink-0", iconClass)} strokeWidth={1.5} />
          {isPredicted && (
            <span className="inline-flex h-5 items-center rounded-full bg-[var(--ds-color-surface-success-active)] px-2 text-[11px] font-medium tracking-[0.04em] text-[var(--ds-color-text-success-strong)] uppercase">
              Predicted
            </span>
          )}
        </div>
        <div
          className={cn(
            "shrink-0 transition-opacity duration-[120ms]",
            // Reveal-on-hover only where hover exists. On touch (hover: none) the
            // star stays solid — otherwise it's an invisible-but-tappable phantom
            // target, the exact bug fixed on the sidebar toggle.
            favorited
              ? "opacity-100"
              : "opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:focus-within:opacity-100",
          )}
        >
          <FavoriteButton
            favorited={favorited}
            onToggle={() => onFavorite?.(!favorited)}
            label={displayName(result)}
          />
        </div>
      </div>

      {/* ── Name(s) — routes to detail when the card navigates ────────────── */}
      {canNavigate ? (
        <button
          type="button"
          onClick={onSelect}
          className={cn(
            "line-clamp-2 min-h-[2.5em] text-left text-[15px] leading-tight font-semibold",
            "text-[var(--ds-color-text-default)] hover:text-[var(--ds-color-text-default-hover)]",
            "rounded-[var(--ds-shape-radius-sm)] outline-none transition-colors duration-[120ms]",
            "focus-visible:ring-2 focus-visible:ring-[var(--ds-color-border-focus)] focus-visible:ring-offset-1",
          )}
        >
          {displayName(result)}
        </button>
      ) : (
        <span className="line-clamp-2 block min-h-[2.5em] text-[15px] leading-tight font-semibold text-[var(--ds-color-text-default)]">
          {displayName(result)}
        </span>
      )}

      {/* ── Benefit / intent line ─────────────────────────────────────────── */}
      <p className="text-[13px] leading-snug font-medium text-[var(--ds-color-text-subtle)]">
        {result.benefit}
      </p>

      {/* ── Categories (decorative, non-interactive) ──────────────────────── */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <span
              key={c}
              className="inline-flex h-5 items-center rounded-full bg-[var(--ds-color-surface-alt)] px-2 text-[11px] font-medium text-[var(--ds-color-text-subtle)]"
            >
              {c}
            </span>
          ))}
        </div>
      )}

      {/* ── Targets (height always reserved so a grid stays even) ─────────── */}
      <div className="h-6">
        {targets.length > 0 && (
          <TargetsRow targets={targets} onSelect={canNavigate ? onSelect : undefined} />
        )}
      </div>

      {/* ── Footer: ScoreMeter (left) + evidence chip (right) ─────────────────
          mt-auto pins it to the card bottom, so in a stretch-height grid every
          footer lines up even when cards carry different content above. */}
      <div className="-mx-4 -mb-4 mt-auto flex h-14 items-center gap-3 rounded-b-[var(--ds-shape-radius-md)] border-t border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-alt)] px-4">
        <div className="min-w-0 flex-1">
          <ScoreMeter
            value={result.score}
            label={SCORE_LABEL[result.type]}
            format={isPredicted ? "score" : "percent"}
          />
        </div>
        {showEvidenceChip && (
          // asChild → a real <button>, so the chip is tab-reachable and
          // Enter/Space-activatable (a bare <span onClick> is neither).
          <EvidenceTag asChild className="shrink-0">
            <button type="button" onClick={onSelect} className="cursor-pointer">
              {EVIDENCE_LABEL[result.evidence as keyof typeof EVIDENCE_LABEL]}
            </button>
          </EvidenceTag>
        )}
      </div>
    </div>
  );
}
