"use client"

/**
 * CompoundCard — result card for the Forager Compounds view.
 *
 * Mirrors the structural intent of Anna's mocks 4-29-26 (filtered to
 * compounds.png), restructured per the impeccable design brief:
 *   - Editorial typography. The compound name is the anchor element.
 *   - Tight chrome (lg radius, 1px subtle border, no shadow). Pillowy → flat.
 *   - Score reads as caption-scale meta on the right, not a hero number.
 *   - Source classification + IP signal sit as decorative tag pills at the
 *     bottom — color is differentiation only (per DESIGN.md "tag colors are
 *     decorative, not semantic"), with status meaning carried by the icon.
 *   - Card surface is a styled container, never a click target. Save toggle
 *     and primary CTA are real interactive elements; nesting buttons inside
 *     a clickable card surface is invalid.
 *
 * Hover contract follows StrategyCard's pattern (group/card, card-hovered
 * Tailwind variant, subtle border darkening, save reveal).
 */

import * as React from "react"
import { Bookmark, Layers, Shield, ShieldCheck, ShieldAlert } from "lucide-react"

import { cn } from "@/lib/utils"
import type {
  Compound,
  CompoundSourceClass,
  IpSignal,
} from "./data"

// ── Source-class & IP-signal pill helpers ─────────────────────────────────

const SOURCE_CLASS_TAG: Record<CompoundSourceClass, string> = {
  "Animal · cow": "var(--color-surface-tag-orange)",
  "Animal · ruminant": "var(--color-surface-tag-orange)",
  "Plant · botanical": "var(--color-surface-tag-forest)",
  "Plant · spice": "var(--color-surface-tag-forest)",
  Microbial: "var(--color-surface-tag-cyan)",
}
const SOURCE_CLASS_TEXT: Record<CompoundSourceClass, string> = {
  "Animal · cow": "var(--color-text-tag-orange)",
  "Animal · ruminant": "var(--color-text-tag-orange)",
  "Plant · botanical": "var(--color-text-tag-forest)",
  "Plant · spice": "var(--color-text-tag-forest)",
  Microbial: "var(--color-text-tag-cyan)",
}

/**
 * IP signal carries icon + text composition. Color tracks signal intent
 * (lime = open, yellow = caution-landscape, red = crowded) but the icon
 * is the load-bearing semantic — color alone never carries status meaning,
 * per DESIGN.md.
 */
const IP_SIGNAL_ICON = {
  "Open IP": ShieldCheck,
  "IP Landscape": ShieldAlert,
  "Crowded IP": Shield,
} as const

const IP_SIGNAL_TAG: Record<IpSignal, string> = {
  "Open IP": "var(--color-surface-tag-lime)",
  "IP Landscape": "var(--color-surface-tag-yellow)",
  "Crowded IP": "var(--color-surface-tag-red)",
}
const IP_SIGNAL_TEXT: Record<IpSignal, string> = {
  "Open IP": "var(--color-text-tag-lime)",
  "IP Landscape": "var(--color-text-tag-yellow)",
  "Crowded IP": "var(--color-text-tag-red)",
}

function TagPill({
  surface,
  text,
  icon: Icon,
  children,
}: {
  surface: string
  text: string
  icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5",
        "text-[11px] font-medium leading-none whitespace-nowrap"
      )}
      style={{ backgroundColor: surface, color: text }}
    >
      {Icon ? <Icon aria-hidden className="size-3" /> : null}
      {children}
    </span>
  )
}

function GeneTargetChip({ label }: { label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--shape-radius-xs)] px-1.5 py-0.5",
        "text-[10.5px] font-medium leading-none",
        "bg-[var(--color-surface-tag-cyan)] text-[var(--color-text-tag-cyan)]",
        "tabular-nums"
      )}
    >
      {label}
    </span>
  )
}

// ── Main component ────────────────────────────────────────────────────────

export type CompoundCardProps = {
  compound: Compound
  saved?: boolean
  onSaveToggle?: (next: boolean) => void
  onSelect?: () => void
  className?: string
}

export function CompoundCard({
  compound,
  saved = false,
  onSaveToggle,
  onSelect,
  className,
}: CompoundCardProps) {
  const IpIcon = IP_SIGNAL_ICON[compound.ip]
  const additionalText = compound.additionalTargets
    ? `+ ${compound.additionalTargets} more`
    : null

  return (
    <article
      data-slot="compound-card"
      className={cn(
        "group/card relative w-full",
        "rounded-[var(--shape-radius-lg)]",
        "border border-[var(--color-border-subtle)]",
        "bg-[var(--color-surface-default)]",
        "p-5",
        "transition-[border-color] duration-[120ms]",
        "hover:border-[var(--color-border-default)]",
        "data-[force-state=hover]:border-[var(--color-border-default)]",
        className
      )}
    >
      {/* ── Header row: save + name (left) · score (right) ───────────── */}
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <button
            type="button"
            onClick={() => onSaveToggle?.(!saved)}
            aria-label={saved ? "Remove from saved" : "Save compound"}
            aria-pressed={saved}
            data-slot="compound-card-save"
            className={cn(
              "mt-0.5 shrink-0 rounded-[var(--shape-radius-xs)] p-0.5",
              "outline-none transition-opacity duration-[120ms]",
              "focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]/50",
              saved
                ? "opacity-100"
                : "opacity-0 card-hovered:opacity-100 focus-visible:opacity-100"
            )}
          >
            <Bookmark
              className={cn(
                "size-4",
                saved
                  ? "fill-[var(--color-action-primary-active)] stroke-[var(--color-action-primary-active)]"
                  : "stroke-[var(--color-text-subtle)] fill-none"
              )}
            />
          </button>
          <button
            type="button"
            onClick={onSelect}
            className={cn(
              "min-w-0 max-w-full text-left",
              "rounded-[var(--shape-radius-xs)] outline-none",
              "focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]/50"
            )}
          >
            <h3 className="truncate text-base font-semibold text-[var(--color-text-default)]">
              {compound.name}
            </h3>
          </button>
        </div>
        <span
          className={cn(
            "shrink-0 inline-flex items-center gap-1",
            "text-[11px] font-medium tracking-wide uppercase",
            "text-[var(--color-text-subtle)]"
          )}
        >
          <Layers aria-hidden className="size-3" />
          <span className="tabular-nums text-[var(--color-text-default)]">
            {compound.score}%
          </span>
        </span>
      </div>

      {/* ── Mechanism (1-2 lines, body copy) ────────────────────────── */}
      <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-[var(--color-text-default)]">
        {compound.mechanism}
      </p>

      {/* ── Primary source (italic, subtle) ─────────────────────────── */}
      <p className="mb-3 truncate text-xs italic text-[var(--color-text-subtle)]">
        {compound.primarySource}
      </p>

      {/* ── Gene targets (cyan chips, dense row) ────────────────────── */}
      <div className="mb-4 flex flex-wrap items-center gap-1">
        {compound.geneTargets.map((target) => (
          <GeneTargetChip key={target} label={target} />
        ))}
        {additionalText ? (
          <span className="text-[10.5px] font-medium text-[var(--color-text-subtle)]">
            {additionalText}
          </span>
        ) : null}
      </div>

      {/* ── Footer pills (source class · IP signal) ─────────────────── */}
      <div className="flex flex-wrap items-center gap-1.5">
        <TagPill
          surface={SOURCE_CLASS_TAG[compound.sourceClass]}
          text={SOURCE_CLASS_TEXT[compound.sourceClass]}
        >
          {compound.sourceClass}
        </TagPill>
        <TagPill
          surface={IP_SIGNAL_TAG[compound.ip]}
          text={IP_SIGNAL_TEXT[compound.ip]}
          icon={IpIcon}
        >
          {compound.ip}
        </TagPill>
      </div>
    </article>
  )
}
