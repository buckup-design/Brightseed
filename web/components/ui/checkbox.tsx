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
        // BRIGHTSEED-TBD: [BLOCKING] rounded-[4px] — the radius scale has no 4px step
        // (xs=2px, sm=6px). Left as a raw value; needs a design call, not a guess.
        "peer size-4 shrink-0 rounded-[4px]",
        // Border (unchecked)
        "border border-[var(--c-checkbox-border-default)]",
        // BRIGHTSEED-TBD: [BLOCKING] shadow-xs — no --ds-shadow-xs exists (scale starts at
        // sm, and --ds-shadow-sm is a different value). Left as stock Tailwind.
        "shadow-xs transition-shadow outline-none",
        // Focus
        "focus-visible:border-[var(--c-checkbox-border-focus)]",
        "focus-visible:ring-[3px] focus-visible:ring-[var(--c-checkbox-border-focus)]/50",
        // Disabled
        // BRIGHTSEED-TBD: [CONCERN] opacity-50 — --ds-disabled-text-opacity is 0.55.
        // Tokenising here would shift the fade; left at stock for now.
        "disabled:cursor-not-allowed disabled:opacity-50",
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
