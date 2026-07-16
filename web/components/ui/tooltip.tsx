"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Tooltip, Brightseed Quill design system.
 *
 * NOTE: the tooltip is deliberately INVERTED — the text color paints the
 * surface and the surface color paints the text. That is what stock shadcn
 * does (`bg-foreground` / `text-background`) and this migration preserves it
 * exactly. There is no `--ds-color-surface-inverse`, and
 * `--ds-color-text-inverse` (sand-50 light / sand-900 dark) is a different
 * value, so it cannot stand in without shifting the color. The token names
 * below therefore follow the --ds-* they alias, not the role they paint:
 *
 *   Surface (the chip + arrow) → --c-tooltip-text-default   (--ds-color-text-default)
 *   Text                       → --c-tooltip-surface-default (--ds-color-surface-default)
 *   Radius, content            → --c-tooltip-shape-radius-md (8px)
 *   Radius, arrow              → --c-tooltip-shape-radius-xs (2px)
 *
 * The inversion flows through dark theme for free: `data-theme="dark"` swaps
 * text-default → sand-50 and surface-default → sand-950, so the tooltip stays
 * inverted in both themes with no `dark:` variants in this file.
 */

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-fit origin-(--radix-tooltip-content-transform-origin)",
          "px-3 py-1.5 text-xs text-balance",
          // Inverted surface + text (see note above)
          "bg-[var(--c-tooltip-text-default)] text-[var(--c-tooltip-surface-default)]",
          "rounded-[var(--c-tooltip-shape-radius-md)]",
          // Animations come from tw-animate-css (already imported in globals.css)
          "animate-in fade-in-0 zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow
          className={cn(
            "z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45",
            "rounded-[var(--c-tooltip-shape-radius-xs)]",
            "bg-[var(--c-tooltip-text-default)] fill-[var(--c-tooltip-text-default)]"
          )}
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
