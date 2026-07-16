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
 *   Hover, default      → --ds-color-surface-alt / --ds-color-text-subtle
 *   Hover, outline      → --ds-color-surface-brand-subtle / --ds-color-text-default
 *   Pressed (state=on)  → --ds-color-surface-brand-subtle / --ds-color-text-default
 *   Outline border      → --ds-color-border-default
 *   Focus ring          → --ds-color-border-focus / 50 (same recipe as Button + Switch)
 *   aria-invalid        → --ds-color-action-critical
 *   Radius              → --ds-shape-radius-md
 */
const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[var(--c-toggle-shape-radius-md)] text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none hover:bg-[var(--c-toggle-surface-alt)] hover:text-[var(--c-toggle-text-subtle)] focus-visible:border-[var(--c-toggle-border-focus)] focus-visible:ring-[3px] focus-visible:ring-[var(--c-toggle-border-focus)]/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-[var(--c-toggle-action-critical)] aria-invalid:ring-[var(--c-toggle-action-critical)]/20 data-[state=on]:bg-[var(--c-toggle-surface-brand-subtle)] data-[state=on]:text-[var(--c-toggle-text-default)] dark:aria-invalid:ring-[var(--c-toggle-action-critical)]/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  // BRIGHTSEED-TBD: [CONCERN] `disabled:opacity-50` kept verbatim rather than
  // swapped to --c-toggle-disabled-text-opacity: --ds-disabled-text-opacity is
  // 0.55, so the token would change the rendered fade. Matches the sibling
  // Checkbox/Select, which also keep stock `opacity-50`.
  // BRIGHTSEED-TBD: [CONCERN] `dark:aria-invalid:ring-*/40` tokenised in place
  // rather than removed. --ds-color-action-critical already swaps under
  // [data-theme="dark"]; this variant only changes the ring *opacity* (20 → 40),
  // not the colour, so there is no dark-specific colour to hoist into a token.
  // Deleting it would change appearance, so it stays.
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          // BRIGHTSEED-TBD: [BLOCKING] `shadow-xs` left as a stock Tailwind class.
          // The scale starts at --ds-shadow-sm, which is a different value, so
          // swapping it in would change elevation. Matches Checkbox/InputGroup.
          "border border-[var(--c-toggle-border-default)] bg-transparent shadow-xs hover:bg-[var(--c-toggle-surface-brand-subtle)] hover:text-[var(--c-toggle-text-default)]",
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
