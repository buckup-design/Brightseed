"use client"

/**
 * PlantCard — result card for the Forager Plants view.
 *
 * Mirrors CompoundCard's chrome (same border, radius, padding, hover behavior)
 * so the surface reads as one when the user toggles between Compounds and
 * Plants. The card differs in metadata: scientific name is the anchor, common
 * name is the eyebrow, "compounds present" and "predicted bioactives" are
 * stacked tag rows, GRAS + IP sit as bottom-row pills.
 *
 * The two cards intentionally share the section sequence (header → mechanism
 * → entity-specific tag stacks → footer pills) so the eye can move down the
 * grid without re-orienting on every row.
 */

import * as React from "react"
import {
  Bookmark,
  Sprout,
  ShieldCheck,
  ShieldAlert,
  Shield,
} from "lucide-react"

import { cn } from "@/lib/utils"
import type { IpSignal, Plant } from "./data"

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

function CompoundChip({ label }: { label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--shape-radius-xs)] px-1.5 py-0.5",
        "text-[10.5px] font-medium leading-none",
        "bg-[var(--color-surface-tag-orange)] text-[var(--color-text-tag-orange)]"
      )}
    >
      {label}
    </span>
  )
}

function BioactiveChip({ label }: { label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--shape-radius-xs)] px-1.5 py-0.5",
        "text-[10.5px] font-medium leading-none",
        "bg-[var(--color-surface-tag-cyan)] text-[var(--color-text-tag-cyan)]"
      )}
    >
      {label}
    </span>
  )
}

export type PlantCardProps = {
  plant: Plant
  saved?: boolean
  onSaveToggle?: (next: boolean) => void
  onSelect?: () => void
  className?: string
}

export function PlantCard({
  plant,
  saved = false,
  onSaveToggle,
  onSelect,
  className,
}: PlantCardProps) {
  const IpIcon = IP_SIGNAL_ICON[plant.ip]

  return (
    <article
      data-slot="plant-card"
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
      {/* ── Header: save + scientific name + common-name eyebrow ───── */}
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <button
            type="button"
            onClick={() => onSaveToggle?.(!saved)}
            aria-label={saved ? "Remove from saved" : "Save plant"}
            aria-pressed={saved}
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
            <h3 className="truncate text-base font-semibold italic text-[var(--color-text-default)]">
              {plant.scientificName}
            </h3>
            <p className="truncate text-xs font-medium tracking-wide uppercase text-[var(--color-text-subtle)]">
              {plant.commonName}
            </p>
          </button>
        </div>

        <span
          className={cn(
            "shrink-0 inline-flex items-center gap-1",
            "text-[11px] font-medium tracking-wide uppercase",
            "text-[var(--color-text-subtle)]"
          )}
        >
          <Sprout aria-hidden className="size-3" />
          Bioactive
        </span>
      </div>

      {/* ── Mechanism ────────────────────────────────────────────────── */}
      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[var(--color-text-default)]">
        {plant.mechanism}
      </p>

      {/* ── Compounds present ────────────────────────────────────────── */}
      <div className="mb-3">
        <p className="mb-1.5 text-[10.5px] font-medium uppercase tracking-wide text-[var(--color-text-subtle)]">
          Compounds present
        </p>
        <div className="flex flex-wrap items-center gap-1">
          {plant.compoundsPresent.map((c) => (
            <CompoundChip key={c} label={c} />
          ))}
          {plant.additionalCompounds ? (
            <span className="text-[10.5px] font-medium text-[var(--color-text-subtle)]">
              +{plant.additionalCompounds} more
            </span>
          ) : null}
        </div>
      </div>

      {/* ── Predicted bioactives ─────────────────────────────────────── */}
      <div className="mb-4">
        <p className="mb-1.5 text-[10.5px] font-medium uppercase tracking-wide text-[var(--color-text-subtle)]">
          Forager predicted bioactives
        </p>
        <div className="flex flex-wrap items-center gap-1">
          {plant.predictedBioactives.map((b) => (
            <BioactiveChip key={b} label={b} />
          ))}
          {plant.additionalBioactives ? (
            <span className="text-[10.5px] font-medium text-[var(--color-text-subtle)]">
              +{plant.additionalBioactives} more
            </span>
          ) : null}
        </div>
      </div>

      {/* ── Footer pills (GRAS · IP signal) ──────────────────────────── */}
      <div className="flex flex-wrap items-center gap-1.5">
        {plant.isGras ? (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5",
              "text-[11px] font-medium leading-none whitespace-nowrap"
            )}
            style={{
              backgroundColor: "var(--color-surface-tag-forest)",
              color: "var(--color-text-tag-forest)",
            }}
          >
            <ShieldCheck aria-hidden className="size-3" />
            GRAS
          </span>
        ) : null}
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5",
            "text-[11px] font-medium leading-none whitespace-nowrap"
          )}
          style={{
            backgroundColor: IP_SIGNAL_TAG[plant.ip],
            color: IP_SIGNAL_TEXT[plant.ip],
          }}
        >
          <IpIcon aria-hidden className="size-3" />
          {plant.ip}
        </span>
      </div>
    </article>
  )
}
