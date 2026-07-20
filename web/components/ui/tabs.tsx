"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Tabs, Brightseed Quill design system.
 *
 * Color tokens (via the component tier, --c-tabs-*):
 *   List surface (default kind)  → --ds-color-surface-alt
 *   Active trigger surface       → --ds-color-surface-default
 *   Resting trigger label        → --ds-color-text-default @ 60%
 *   Active / hover label         → --ds-color-text-default
 *   Dark resting label           → --ds-color-text-subtle
 *   Active underline (line kind) → --ds-color-text-default
 *   Border / ring focus          → --ds-color-border-focus
 *   Dark active border + fill    → --ds-color-border-default
 *   Radius, list                 → --ds-shape-radius-lg
 *   Radius, trigger              → --ds-shape-radius-md
 *   Elevation, active trigger    → --ds-shadow-sm
 *
 * Two `variant`s on TabsList: "default" (segmented control on a sand-100
 * inset, active tab gets a raised white pill) and "line" (transparent, active
 * tab marked by the ::after underline rule).
 */

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  cn(
    "group/tabs-list inline-flex w-fit items-center justify-center",
    "rounded-[var(--c-tabs-shape-radius-lg)] p-[3px]",
    "text-[var(--c-tabs-text-subtle)]",
    "group-data-[orientation=horizontal]/tabs:h-9",
    "group-data-[orientation=vertical]/tabs:h-fit",
    "group-data-[orientation=vertical]/tabs:flex-col",
    // `rounded-none` left as stock Tailwind: a degenerate "no radius" switch,
    // not a design decision. Matches how `rounded-full` is kept stock in
    // Badge/Chip/Avatar/Switch.
    "data-[variant=line]:rounded-none"
  ),
  {
    variants: {
      variant: {
        default: "bg-[var(--c-tabs-surface-alt)]",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Layout / sizing
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5",
        "rounded-[var(--c-tabs-shape-radius-md)] border border-transparent px-2 py-1",
        "text-sm font-medium whitespace-nowrap",
        // Resting label: --foreground at 60%, the stock shadcn recipe.
        "text-[var(--c-tabs-text-default)]/60 transition-all",
        "group-data-[orientation=vertical]/tabs:w-full",
        "group-data-[orientation=vertical]/tabs:justify-start",
        "hover:text-[var(--c-tabs-text-default)]",
        // Focus
        "focus-visible:border-[var(--c-tabs-border-focus)]",
        "focus-visible:ring-[2px] focus-visible:ring-[var(--c-tabs-border-focus)]/50",
        "focus-visible:outline-1 focus-visible:outline-[var(--c-tabs-border-focus)]",
        // Disabled. `opacity-50` left as stock Tailwind: --ds-disabled-text-opacity
        // is 0.55, so swapping it in would change the rendered fade. Matches
        // Input/DropdownMenu, which also keep the stock 50%.
        "disabled:pointer-events-none disabled:opacity-[var(--c-tabs-disabled-text-opacity)]",
        // Elevation of the active pill (default kind only).
        "group-data-[variant=default]/tabs-list:data-[state=active]:shadow-[var(--c-tabs-shadow-sm)]",
        "group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none",
        // Dark resting label. Restates the stock `dark:text-muted-foreground`:
        // in dark the label drops the 60% fade and uses the subtle text step at
        // full opacity, so this is a real override, not something the token swap
        // would cover on its own. Tokenised in place rather than removed.
        "dark:text-[var(--c-tabs-text-subtle)] dark:hover:text-[var(--c-tabs-text-default)]",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // Line kind: no surface of its own in either theme.
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent",
        // Active pill. In dark, stock adds a border + a 30% fill; --input bridges
        // to --ds-color-border-default, so `dark:bg-input/30` is that same colour
        // at 30%. Restated verbatim through the component tier.
        "data-[state=active]:bg-[var(--c-tabs-surface-default)] data-[state=active]:text-[var(--c-tabs-text-default)] dark:data-[state=active]:border-[var(--c-tabs-border-default)] dark:data-[state=active]:bg-[var(--c-tabs-border-default)]/30 dark:data-[state=active]:text-[var(--c-tabs-text-default)]",
        // Active underline for the line kind (::after, faded in on active).
        "after:absolute after:bg-[var(--c-tabs-text-default)] after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
