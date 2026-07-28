"use client"

import * as React from "react"
import { CheckIcon, MinusIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Checkbox, Brightseed Quill design system.
 *
 * Color tokens (Brightseed semantics, via --c-checkbox-*):
 *   Box border unchecked → --ds-color-border-field          (sand-300 light / sand-600 dark)
 *   Box fill unchecked   → --ds-color-surface-field         (sand-50 light / sand-800 dark; brightens on hover)
 *   Box fill checked     → --ds-color-action-primary        (lime-300; brand action)
 *   Box fill indeterminate → same as checked; only the glyph differs
 *   Check / dash glyph   → --ds-color-text-on-action-primary (forest-800 on lime)
 *   Focus ring           → --ds-color-border-focus / 50     (lime-500 soft ring, same as Button/Switch)
 *   Invalid              → --ds-color-border-critical-bold  (border + soft ring)
 *   Corner               → --ds-shape-radius-xs             (4px; the step added for this box, July 2026)
 *   Elevation            → --ds-shadow-xs                   (form-control step, added July 2026)
 *   Disabled             → --ds-disabled-text-opacity       (0.55, the system-wide fade)
 */
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Layout
        "peer size-4 shrink-0 rounded-[var(--c-checkbox-shape-radius-xs)]",
        // Border (unchecked)
        "border border-[var(--c-checkbox-border-default)]",
        "shadow-[var(--c-checkbox-shadow-xs)] transition-shadow outline-none",
        // Focus
        "focus-visible:border-[var(--c-checkbox-border-focus)]",
        "focus-visible:ring-[2px] focus-visible:ring-[var(--c-checkbox-border-focus)]/50",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-[var(--c-checkbox-disabled-text-opacity)]",
        // Invalid
        "aria-invalid:border-[var(--c-checkbox-border-critical-bold)]",
        "aria-invalid:ring-[var(--c-checkbox-border-critical-bold)]/20",
        "dark:aria-invalid:ring-[var(--c-checkbox-border-critical-bold)]/40",
        // Checked: lime fill + forest check glyph
        "data-[state=checked]:border-[var(--c-checkbox-action-primary)]",
        "data-[state=checked]:bg-[var(--c-checkbox-action-primary)]",
        "data-[state=checked]:text-[var(--c-checkbox-text-on-action-primary)]",
        // Indeterminate: identical box to checked — a filled box saying "some of
        // the below". Only the glyph differs (dash, not check). Spelled out
        // rather than folded in with checked because Tailwind has no variant union.
        "data-[state=indeterminate]:border-[var(--c-checkbox-action-primary)]",
        "data-[state=indeterminate]:bg-[var(--c-checkbox-action-primary)]",
        "data-[state=indeterminate]:text-[var(--c-checkbox-text-on-action-primary)]",
        // Unchecked box rests on the field surface (sand-50 light / sand-800 dark),
        // uniform with Input/Select. The checked + indeterminate fills above are
        // higher-specificity data-state selectors, so they win in both themes with
        // no dark re-assert. Brightens on hover, scoped to the unchecked state so
        // the lime fill is never touched.
        "bg-[var(--c-checkbox-surface-default)]",
        "enabled:hover:data-[state=unchecked]:bg-[var(--c-checkbox-surface-hover)]",
        className
      )}
      {...props}
    >
      {/* Radix renders the Indicator for BOTH checked and indeterminate, and
          stamps its own data-state on it — so the glyph branches in CSS off that
          state rather than off a prop. A prop branch would miss the uncontrolled
          (defaultChecked) case, where this component never sees the state at
          all. */}
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="group/indicator grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3.5 group-data-[state=indeterminate]/indicator:hidden" />
        <MinusIcon className="hidden size-3.5 group-data-[state=indeterminate]/indicator:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
