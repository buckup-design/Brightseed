import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * StatusBadge, Brightseed Quill design system.
 *
 * A small status indicator: a dot + label. Status is signalled by composing a
 * glyph (the dot) with text — the system's status rule — NOT by a decorative
 * Tag color (Tags stay decorative; color never implies status). "Draft", the
 * report lifecycle's first state, is a NEUTRAL tone: an in-progress label, not a
 * success/warning/critical signal, so it stays quiet.
 *
 * Extend by adding to `statusConfig` as the product surfaces new states; map
 * each to a tone, and add the tone's tokens to `toneClasses` + components.css.
 * Status now unions report-lifecycle states with the FTO dimension states
 * (clear/restricted/blocked) — accepted at alpha; IP code narrows through
 * `FtoDimensionStatus`, the tight 3-value subset.
 *
 * Color tokens live in components.css (--c-status-badge-*); the block comment
 * there carries the -raised / chip-overlay surface reasoning.
 */

type Tone = "neutral" | "success" | "warning" | "critical"

const toneClasses: Record<Tone, { surface: string; text: string; dot: string }> = {
  neutral: {
    surface: "bg-[var(--c-status-badge-surface-neutral)]",
    text: "text-[var(--c-status-badge-text-neutral)]",
    dot: "bg-[var(--c-status-badge-dot-neutral)]",
  },
  success: {
    surface: "bg-[var(--c-status-badge-surface-success)]",
    text: "text-[var(--c-status-badge-text-success)]",
    dot: "bg-[var(--c-status-badge-dot-success)]",
  },
  warning: {
    surface: "bg-[var(--c-status-badge-surface-warning)]",
    text: "text-[var(--c-status-badge-text-warning)]",
    dot: "bg-[var(--c-status-badge-dot-warning)]",
  },
  critical: {
    surface: "bg-[var(--c-status-badge-surface-critical)]",
    text: "text-[var(--c-status-badge-text-critical)]",
    dot: "bg-[var(--c-status-badge-dot-critical)]",
  },
}

const statusConfig = {
  draft: { label: "Draft", tone: "neutral" },
  completed: { label: "Completed", tone: "success" },
  clear: { label: "Clear", tone: "success" },
  restricted: { label: "Restricted", tone: "warning" },
  blocked: { label: "Blocked", tone: "critical" },
} as const satisfies Record<string, { label: string; tone: Tone }>

export type Status = keyof typeof statusConfig

function StatusBadge({
  status,
  className,
  ...props
}: {
  status: Status
} & Omit<React.ComponentProps<"span">, "children">) {
  const { label, tone } = statusConfig[status]
  const c = toneClasses[tone]
  return (
    <span
      data-slot="status-badge"
      data-status={status}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5",
        "text-xs font-medium",
        c.surface,
        c.text,
        className
      )}
      {...props}
    >
      <span className={cn("size-1.5 rounded-full", c.dot)} aria-hidden="true" />
      {label}
    </span>
  )
}

export { StatusBadge }
