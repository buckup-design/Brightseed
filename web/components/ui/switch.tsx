"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Switch, Brightseed Quill design system.
 *
 * Color tokens (Brightseed semantics):
 *   Track unchecked   → --ds-color-border-default       (sand-300 light / sand-700 dark)
 *   Track checked     → --ds-color-action-primary       (lime-300; brand action)
 *   Thumb             → --ds-color-surface-default      (white in light, sand-950 in dark)
 *   Thumb outline     → --ds-color-border-switch-thumb  (sand-700 light / none in dark)
 *   Focus ring        → --ds-color-border-focus         (sand, opaque, same as Button)
 *   Disabled          → uses --ds-disabled-text-opacity
 *
 * Accessibility note (Aug 6 2026). In light mode the two track colours are
 * 1.01:1 apart — lime-300 and sand-300 are the same shade in greyscale — so
 * colour cannot be what tells you the state (SC 1.4.1, Level A). The thumb's
 * POSITION carries it instead, which only works if the thumb is visible: a bare
 * white thumb was 1.39:1 / 1.38:1 against the two tracks. The thumb therefore
 * carries an outline in light mode (4.14:1 / 4.16:1). Do not remove it without
 * replacing the non-colour cue with another one.
 *
 * Sizes
 *   sm        h-3.5 w-6   thumb size-3
 *   default   h-[1.15rem] w-8   thumb size-4
 */
function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        // Layout
        "peer group/switch inline-flex shrink-0 items-center",
        "rounded-full border border-transparent",
        "transition-all duration-[120ms]",
        // Sizes
        "data-[size=default]:h-[1.15rem] data-[size=default]:w-8",
        "data-[size=sm]:h-3.5 data-[size=sm]:w-6",
        // Track surface (Brightseed action-primary ladder for checked, border-default for unchecked)
        "data-[state=unchecked]:bg-[var(--c-switch-border-default)]",
        "data-[state=checked]:bg-[var(--c-switch-action-primary)]",
        "hover:data-[state=checked]:bg-[var(--c-switch-action-primary-hover)]",
        // Focus
        "outline-none",
        "focus-visible:ring-[2px] focus-visible:ring-[var(--c-switch-border-focus)]",
        "focus-visible:border-[var(--c-switch-border-focus)]",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-[var(--c-switch-disabled-text-opacity)]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full",
          "bg-[var(--c-switch-surface-default)]",
          // Outline makes the thumb — and therefore its position, the non-colour
          // state cue — perceivable on both tracks. Width and colour are set
          // together: a bare `border` would paint currentColor, and a colour with
          // no width paints nothing. Transparent in dark, so the box size (and
          // thus the checked translate) is identical across themes.
          "border border-[var(--c-switch-border-thumb)]",
          "ring-0 transition-transform",
          "group-data-[size=default]/switch:size-4",
          "group-data-[size=sm]/switch:size-3",
          "data-[state=checked]:translate-x-[calc(100%-2px)]",
          "data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
