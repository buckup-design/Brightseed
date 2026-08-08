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
 *   On border (state)   → --ds-color-border-selected-brand (forest-600 L / sand-500 D)
 *   Focus ring          → --ds-color-border-focus (same recipe as Button + Switch)
 *   aria-invalid        → --ds-color-border-critical-bold (border + soft ring)
 *   Radius              → --ds-shape-radius-md
 *
 * The base carries `border border-transparent` so BOTH variants have a border-box
 * to paint into. Without it, default had no border-WIDTH, so its focus-visible and
 * aria-invalid border rules set a colour on nothing and silently painted zero.
 * Transparent means default still looks borderless at rest, and box-sizing is
 * border-box so the 1px costs padding, not outer size.
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
// dark-only colour — --ds-color-border-critical-bold already swaps under
// [data-theme="dark"] — it only raises the ring opacity 20 -> 40. Deleting it
// would change appearance, so it stays until a semantic token bakes the step in.
//
// Note on aria-invalid: the RING is still colour-only here — ring-width arrives
// solely from focus-visible:ring-[2px], so a resting invalid toggle shows the red
// border and no halo, and picks up the halo when focused. That is the intended
// stock recipe and it is fine now that the border actually paints. It was NOT fine
// before July 2026, when this rule pointed at --ds-color-action-critical (red-100,
// a soft surface tint) on an element with no border-width: colour on nothing, plus
// a halo at 1.03:1 — an invalid toggle was pixel-identical to a valid one.
const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[var(--c-toggle-shape-radius-md)] border border-transparent text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none hover:bg-[var(--c-toggle-surface-alt)] hover:text-[var(--c-toggle-text-subtle)] focus-visible:border-[var(--c-toggle-border-focus)] focus-visible:ring-[2px] focus-visible:ring-[var(--c-toggle-border-focus)] disabled:pointer-events-none disabled:opacity-[var(--c-toggle-disabled-text-opacity)] aria-invalid:border-[var(--c-toggle-border-critical-bold)] aria-invalid:ring-[var(--c-toggle-border-critical-bold)]/20 data-[state=on]:bg-[var(--c-toggle-surface-brand-subtle)] data-[state=on]:border-[var(--c-toggle-border-selected)] data-[state=on]:text-[var(--c-toggle-text-default)] data-[state=on]:hover:bg-[var(--c-toggle-surface-brand-subtle-hover)] dark:aria-invalid:ring-[var(--c-toggle-border-critical-bold)]/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
