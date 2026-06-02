"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Switch — Brightseed Forager design system.
 *
 * Color tokens (Brightseed semantics):
 *   Track unchecked   → --ds-color-border-default       (sand-300; soft neutral track)
 *   Track checked     → --ds-color-action-primary       (lime-300; brand action)
 *   Thumb             → --ds-color-surface-default      (white in light, sand-950 in dark)
 *   Focus ring        → --ds-color-border-focus / 50    (lime-500 soft ring — same as Button)
 *   Disabled          → uses --ds-disabled-text-opacity
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
        "data-[state=unchecked]:bg-[var(--ds-color-border-default)]",
        "data-[state=checked]:bg-[var(--ds-color-action-primary)]",
        "hover:data-[state=checked]:bg-[var(--ds-color-action-primary-hover)]",
        // Focus
        "outline-none",
        "focus-visible:ring-[3px] focus-visible:ring-[var(--ds-color-border-focus)]/50",
        "focus-visible:border-[var(--ds-color-border-focus)]",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-[var(--ds-disabled-text-opacity)]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full",
          "bg-[var(--ds-color-surface-default)]",
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
