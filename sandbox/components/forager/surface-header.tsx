"use client"

/**
 * SurfaceHeader — full-width header band that sits above all surface content.
 *
 * The structural correction Becky flagged in shape:
 *   In Anna's mocks 4-29-26, the strategy title sits inside the right (results)
 *   panel, framed as a peer of the chat panel on the left. That makes the chat
 *   feel like a sibling of the surface, not a sibling of results. SurfaceHeader
 *   moves the title out of the column and runs it across the full surface
 *   width — chat and results both live BELOW it, as siblings inside the surface.
 *
 * Layout: three rows, all of which are optional.
 *   Row 1: back link (small, muted)
 *   Row 2: title + eyebrow + right-aligned actions
 *   Row 3: toolbar slot (tabs, filter chips, sort/density toggles, result count)
 *
 * Visual posture: editorial. Heavy display-scale title, calm metadata, no
 * decoration. Borders carry the band weight, not shadows.
 */

import * as React from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { cn } from "@/lib/utils"

export type SurfaceHeaderProps = {
  /** Display in an inline eyebrow position above the title (small, muted, uppercase). */
  eyebrow?: string
  /** Main title, h1 typographic weight. */
  title: string
  /** Optional secondary line under the title. */
  subtitle?: string
  /** Optional back link (rendered as a small inline link with chevron). */
  backLink?: { href: string; label: string }
  /** Optional right-aligned actions (buttons, dropdowns) sitting on the title row. */
  actions?: React.ReactNode
  /** Optional toolbar row below the title — tabs, filters, results count. */
  toolbar?: React.ReactNode
  className?: string
}

export function SurfaceHeader({
  eyebrow,
  title,
  subtitle,
  backLink,
  actions,
  toolbar,
  className,
}: SurfaceHeaderProps) {
  return (
    <header
      data-slot="surface-header"
      className={cn(
        "relative w-full border-b border-[var(--color-border-subtle)]",
        "bg-[var(--color-surface-default)]",
        "px-8 pt-6 pb-4",
        className
      )}
    >
      {/* Row 1 — back link */}
      {backLink ? (
        <div className="mb-3">
          <Link
            href={backLink.href}
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium tracking-wide uppercase",
              "text-[var(--color-text-subtle)] transition-colors duration-[120ms]",
              "hover:text-[var(--color-text-default)]",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[var(--color-border-focus)]/50 focus-visible:rounded-[var(--shape-radius-xs)]"
            )}
          >
            <ChevronLeft aria-hidden className="size-3.5" />
            {backLink.label}
          </Link>
        </div>
      ) : null}

      {/* Row 2 — eyebrow + title + actions */}
      <div className="flex items-end justify-between gap-6">
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--color-text-subtle)]">
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={cn(
              "text-[1.625rem] leading-[1.15] font-semibold tracking-[-0.01em]",
              "text-[var(--color-text-default)]"
            )}
          >
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-[var(--color-text-subtle)] max-w-[72ch]">
              {subtitle}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>

      {/* Row 3 — toolbar (tabs, filters, sort/density). Renders only if provided. */}
      {toolbar ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          {toolbar}
        </div>
      ) : null}
    </header>
  )
}
