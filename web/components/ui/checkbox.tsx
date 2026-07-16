"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Checkbox, Brightseed Quill design system.
 *
 * Color tokens (Brightseed semantics, via --c-checkbox-*):
 *   Box border unchecked → --ds-color-border-default        (sand-300 light / sand-700 dark)
 *   Box fill checked     → --ds-color-action-primary        (lime-300; brand action)
 *   Check glyph          → --ds-color-text-on-action-primary (forest-800 on lime)
 *   Focus ring           → --ds-color-border-focus / 50     (lime-500 soft ring, same as Button/Switch)
 *   Invalid              → --ds-color-action-critical       (border + soft ring)
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
        "focus-visible:ring-[3px] focus-visible:ring-[var(--c-checkbox-border-focus)]/50",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-[var(--c-checkbox-disabled-text-opacity)]",
        // Invalid
        "aria-invalid:border-[var(--c-checkbox-action-critical)]",
        "aria-invalid:ring-[var(--c-checkbox-action-critical)]/20",
        "dark:aria-invalid:ring-[var(--c-checkbox-action-critical)]/40",
        // Checked: lime fill + forest check glyph
        "data-[state=checked]:border-[var(--c-checkbox-action-primary)]",
        "data-[state=checked]:bg-[var(--c-checkbox-action-primary)]",
        "data-[state=checked]:text-[var(--c-checkbox-text-on-action-primary)]",
        "dark:data-[state=checked]:bg-[var(--c-checkbox-action-primary)]",
        // Dark unchecked box gets a faint fill so it reads on the dark surface
        "dark:bg-[var(--c-checkbox-border-default)]/30",
        className
      )}
      {...props}
    >
      {/*
        BRIGHTSEED-TBD: [BLOCKING] indeterminate is half-built. Passing
        checked="indeterminate" wires the semantics up correctly (measured live:
        data-state="indeterminate", aria-checked="mixed"), but the Indicator
        renders an unconditional CheckIcon with no dash branch — so indeterminate
        draws a CHECK and is visually identical to checked. Screen readers get it
        right; sighted users are told the opposite of the truth, which is worse
        than not supporting it. Wants a MinusIcon on data-state=indeterminate.
        Left for a design call rather than guessed at.
      */}
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
