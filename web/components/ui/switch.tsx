"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Switch, Brightseed Quill design system.
 *
 * Color tokens (Brightseed semantics):
 *   Track unchecked   → --ds-color-border-default        (sand-300 light / sand-700 dark)
 *   Track checked     → --ds-color-action-primary        (lime-300; brand action)
 *   Track edge        → --ds-color-border-control        (sand-600, both themes)
 *   Thumb             → --ds-color-surface-switch-thumb  (sand-800 light / sand-950 dark)
 *   Focus ring        → --ds-color-border-focus          (sand, opaque, same as Button)
 *   Disabled          → uses --ds-disabled-text-opacity
 *
 * The thumb carries NO outline. Reworked Aug 20 2026 (Becky). Three jobs, split
 * across three elements instead of loaded onto the thumb:
 *
 *   1. IDENTIFY THE CONTROL — the track's edge. The fill alone was 1.39:1 on a
 *      white page and 2.17:1 on a dark card, so nothing announced the control's
 *      extent. --ds-color-border-control exists for exactly this ("controls whose
 *      boundary is the ONLY thing announcing them") and is 3.50:1 light /
 *      4.71:1 dark. The 1px width was already in the box as `border-transparent`,
 *      so turning it on shifts no geometry.
 *   2. STATE IN DARK — the track fill. sand-700 vs lime-300 is 4.16:1, a real
 *      luminance change, so state reads without colour and the thumb is free to
 *      sit at 2.87:1. This is the one theme where "colour AND contrast" works.
 *   3. STATE IN LIGHT — thumb position, because light's tracks are 1.01:1 apart
 *      (luminance twins, SC 1.4.1 Level A). Position needs a visible thumb, and
 *      lime-300 is PALE (1.38:1 on white), so a light thumb cannot separate from
 *      the on-track. Hence charcoal: 6.92:1 / 6.96:1 on the two tracks.
 *
 * Do not "restore" a white thumb in light or drop the track edge; each closes a
 * different criterion. Slider deliberately still carries a thumb rim, because its
 * thumb is mostly adjacent to the PAGE rather than its track. See slider.tsx.
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
        // The edge that identifies the control. Width was already here.
        "rounded-full border border-[var(--c-switch-border-control)]",
        "transition-all duration-[120ms]",
        // Sizes
        "data-[size=default]:h-[1.15rem] data-[size=default]:w-8",
        "data-[size=sm]:h-3.5 data-[size=sm]:w-6",
        // Track surface. In dark this fill IS the state cue (4.16:1 off vs on).
        "data-[state=unchecked]:bg-[var(--c-switch-surface-track-off)]",
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
          // No border. The thumb is a plain disc; see the header for which
          // element carries which job. Removing the old `border-transparent` does
          // not resize it (size-4 is border-box) and does not move the end stop:
          // the -2px below compensates the TRACK's two 1px borders, not the
          // thumb's. 30px inner minus a 16px thumb is 14px of travel.
          "bg-[var(--c-switch-surface-thumb)]",
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
