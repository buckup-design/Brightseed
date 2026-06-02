"use client"

import * as React from "react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * DropdownMenu — Brightseed sandbox version.
 *
 * Pulled into the sandbox following the same path as the rest of the
 * shadcn-derived components: the Radix primitive lives in the `radix-ui`
 * meta-package (already in package.json), and styling references Brightseed
 * semantic tokens via Tailwind arbitrary CSS-variable values — same pattern
 * the Button component established. The shadcn → Brightseed bridge stays
 * intentionally thin (see `bridge/globals.css`); component code reaches
 * directly for the semantic tokens it needs.
 *
 * Covers the 95% surface: Root, Trigger, Portal, Content, Item, Label,
 * Separator, Shortcut, Group. Submenu / checkbox-item / radio-item are not
 * included here — add when the first usage demands it.
 */

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  )
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden",
          "rounded-[var(--ds-shape-radius-md)]",
          "border border-[var(--ds-color-border-default)]",
          "bg-[var(--ds-color-surface-default)] text-[var(--ds-color-text-default)]",
          "p-1 shadow-[var(--ds-shadow-md)]",
          // Animations come from tw-animate-css (already imported in globals.css)
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  /** Reserve a left column for an alignment offset (matches sibling items with leading icons). */
  inset?: boolean
  /** "destructive" renders the item in critical text color. */
  variant?: "default" | "destructive"
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-variant={variant}
      data-inset={inset || undefined}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2",
        "rounded-[var(--ds-shape-radius-sm)] px-2 py-1.5 text-sm outline-none",
        "transition-colors duration-[120ms]",
        // Highlight (Radix sets data-highlighted on focus + hover)
        "data-[highlighted]:bg-[var(--ds-color-action-secondary-hover)]",
        "data-[highlighted]:text-[var(--ds-color-text-default)]",
        // Destructive variant: critical-toned text + hover surface
        "data-[variant=destructive]:text-[var(--ds-color-text-on-action-critical)]",
        "data-[variant=destructive]:data-[highlighted]:bg-[var(--ds-color-action-critical)]",
        // Disabled
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        // Inset (room for an alignment column)
        "data-[inset]:pl-8",
        // SVG defaults — leading icons size to text height
        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset || undefined}
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-[var(--ds-color-text-subtle)]",
        "data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn(
        "-mx-1 my-1 h-px bg-[var(--ds-color-border-subtle)]",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-[var(--ds-color-text-subtle)]",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
}
