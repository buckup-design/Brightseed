"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Toggle as TogglePrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Toggle, Brightseed Quill design system.
 *
 * Color tokens (Brightseed semantics, via the --c-toggle-* component tier):
 *   Rest surface        → transparent (both variants)
 *   Hover, off          → --ds-color-surface-alt / --ds-color-text-subtle (BOTH variants)
 *   On (state=on)       → --ds-color-surface-brand-subtle / --ds-color-text-default
 *   On + hover          → --ds-color-surface-brand-subtle-hover
 *   Outline border      → --ds-color-border-default
 *   Focus ring          → --ds-color-border-focus / 50 (same recipe as Button + Switch)
 *   aria-invalid        → --ds-color-action-critical
 *   Radius              → --ds-shape-radius-md
 *
 * The state ladder is three rungs and every rung must be a distinct surface:
 * page → hover → on (dark: sand-950 → sand-900 → sand-800). That is what forced
 * --ds-color-surface-brand-subtle to sand-800 in dark; at sand-900 it equalled
 * surface-alt, i.e. this component's own hover, and on/hover-off were the same
 * pixel. If you retune the dark sand ladder, keep those three apart.
 *
 * Two bugs fixed here July 2026, both of which made icon-only toggles unreadable:
 *   - outline used to set its OWN hover to the on-state token, so hovered-off and
 *     on were identical BY CONSTRUCTION, at any value, in both themes. It now
 *     inherits the base hover (surface-alt) like default does.
 *   - on+hover had no rule, and data-[state=on]:bg beats hover:bg on source order
 *     at equal specificity — so an ON toggle gave no hover feedback at all. The
 *     data-[state=on]:hover: rule below is (0,3,0) and wins over both cleanly.
 */
// BRIGHTSEED-TBD: [CONCERN] `dark:aria-invalid:ring-*/40` is dark-mode-specific
// component code, which CLAUDE.md would rather not exist. It carries no
// dark-only colour — --ds-color-action-critical already swaps under
// [data-theme="dark"] — it only raises the ring opacity 20 -> 40. Deleting it
// would change appearance, so it stays until a semantic token bakes the step in.
//
// BRIGHTSEED-TBD: [BLOCKING] on variant="default", aria-invalid renders NOTHING.
// It sets border-COLOR on an element with no border-WIDTH, and ring-COLOR with no
// ring-WIDTH — width only ever arrives via focus-visible:ring-[3px]. So a resting
// invalid toggle is pixel-identical to a valid one. (An earlier revision of this
// comment claimed it was "harmless because the ring carries the signal"; that was
// wrong — the ring is not painted at rest either.)
//
// Pre-existing and inherited from stock, but it is the same bar as the sidebar
// outline ring that was rated BLOCKING: a state that renders nothing. Not fixed
// here because it is not local — the aria-invalid recipe is shared across five
// components, and its root cause is that --ds-color-action-critical is red-100, a
// soft SURFACE tint, being used in border/ring slots. The right token
// (--ds-color-border-critical-bold) already exists, so this is a scoping call,
// not a token gap. Own ticket.
const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[var(--c-toggle-shape-radius-md)] text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none hover:bg-[var(--c-toggle-surface-alt)] hover:text-[var(--c-toggle-text-subtle)] focus-visible:border-[var(--c-toggle-border-focus)] focus-visible:ring-[3px] focus-visible:ring-[var(--c-toggle-border-focus)]/50 disabled:pointer-events-none disabled:opacity-[var(--c-toggle-disabled-text-opacity)] aria-invalid:border-[var(--c-toggle-action-critical)] aria-invalid:ring-[var(--c-toggle-action-critical)]/20 data-[state=on]:bg-[var(--c-toggle-surface-brand-subtle)] data-[state=on]:text-[var(--c-toggle-text-default)] data-[state=on]:hover:bg-[var(--c-toggle-surface-brand-subtle-hover)] dark:aria-invalid:ring-[var(--c-toggle-action-critical)]/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        // No hover:* here on purpose — it inherits the base hover (surface-alt /
        // text-subtle). Re-adding one would silently delete the base via
        // tailwind-merge's same-group conflict resolution, which is exactly how
        // outline's hover came to equal its on-state.
        outline:
          "border border-[var(--c-toggle-border-default)] bg-transparent shadow-[var(--c-toggle-shadow-xs)]",
      },
      size: {
        default: "h-9 min-w-9 px-2",
        sm: "h-8 min-w-8 px-1.5",
        lg: "h-10 min-w-10 px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
