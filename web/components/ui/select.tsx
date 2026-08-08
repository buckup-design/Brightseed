"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Select, Brightseed Quill design system.
 *
 * Migrated from stock shadcn bridge classes to component-scoped tokens
 * (BSDS-102): component code references only --c-select-*, each of which
 * aliases exactly one global --ds-* semantic in tokens/components.css.
 *
 * Mechanical re-plumb, no redesign. Bridge equivalences applied:
 *   border-input (trigger)      → --c-select-border-field  (→ --ds-color-border-field)
 *   border-border / bg-border   → --c-select-border-default (popover edge + separator)
 *   ring-ring / border-ring                  → --c-select-border-focus
 *   bg-popover / text-popover-foreground     → --c-select-surface-default / -text-default
 *   text-muted-foreground                    → --c-select-text-subtle
 *   bg-accent / text-accent-foreground       → --c-select-surface-brand-subtle / -text-default
 *   border-destructive / ring-destructive    → --c-select-border-critical-bold
 *   rounded-md / rounded-sm                  → --c-select-shape-radius-md / -sm
 */

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        // Layout / sizing (untouched)
        "flex w-fit items-center justify-between gap-2 px-3 py-2 text-sm whitespace-nowrap",
        "data-[size=default]:h-9 data-[size=sm]:h-8",
        "transition-[color,box-shadow] outline-none",
        // Surface + border + radius. Field fill is a lighter inset than the
        // panel it sits on; see --ds-color-surface-field.
        "bg-[var(--c-select-surface-field)] shadow-[var(--c-select-shadow-xs)]",
        "rounded-[var(--c-select-shape-radius-md)]",
        "border border-[var(--c-select-border-field)]",
        // Hover: border deepens (resting only) and the field brightens one step.
        "enabled:hover:not-focus-visible:not-aria-invalid:border-[var(--c-select-border-field-hover)]",
        "enabled:hover:bg-[var(--c-select-surface-field-hover)]",
        // Focus
        "focus-visible:border-[var(--c-select-border-focus)]",
        "focus-visible:bg-[var(--c-select-surface-focus)]",
        "focus-visible:ring-[2px] focus-visible:ring-[var(--c-select-ring-focus)]",
        // Disabled (opacity-50 kept verbatim: --ds-disabled-text-opacity is 0.55,
        // so swapping it would change the rendered value)
        "disabled:cursor-not-allowed disabled:opacity-[var(--c-select-disabled-text-opacity)]",
        // Invalid
        "aria-invalid:border-[var(--c-select-border-critical-bold)]",
        "aria-invalid:ring-[var(--c-select-border-critical-bold)]/20",
        "dark:aria-invalid:ring-[var(--c-select-border-critical-bold)]/40",
        // Placeholder
        "data-[placeholder]:text-[var(--c-select-text-subtle)]",
        // Value slot
        "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2",
        // Icons
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "[&_svg:not([class*='text-'])]:text-[var(--c-select-text-subtle)]",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto",
          // Surface + border + radius + shadow
          "rounded-[var(--c-select-shape-radius-md)]",
          "border border-[var(--c-select-border-default)]",
          "bg-[var(--c-select-surface-default)] text-[var(--c-select-text-default)]",
          "shadow-[var(--c-select-shadow-md)]",
          // Animations
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        "px-2 py-1.5 text-xs text-[var(--c-select-text-subtle)]",
        className
      )}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 py-1.5 pr-8 pl-2 text-sm outline-hidden select-none",
        "rounded-[var(--c-select-shape-radius-sm)]",
        // Highlight
        "focus:bg-[var(--c-select-surface-brand-subtle)] focus:text-[var(--c-select-text-default)]",
        // Disabled (opacity-50 kept verbatim, see SelectTrigger)
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-[var(--c-select-disabled-text-opacity)]",
        // Icons
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "[&_svg:not([class*='text-'])]:text-[var(--c-select-text-subtle)]",
        "*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span
        data-slot="select-item-indicator"
        className="absolute right-2 flex size-3.5 items-center justify-center"
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        "pointer-events-none -mx-1 my-1 h-px bg-[var(--c-select-border-default)]",
        className
      )}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
