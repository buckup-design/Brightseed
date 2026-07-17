"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        // Field fill: a lighter inset than the panel it sits on, brightening one
        // step on hover. Closes the old [CONCERN] here — the dark-only
        // `bg-[border]/30` hack is retired now that --ds-color-surface-field
        // exists. The inner control is bg-transparent (below), so this surface,
        // and its hover, is what shows.
        "group/input-group relative flex w-full items-center rounded-[var(--c-input-group-shape-radius-md)] border border-[var(--c-input-group-border-default)] shadow-[var(--c-input-group-shadow-xs)] transition-[color,box-shadow] outline-none bg-[var(--c-input-group-surface-default)] hover:bg-[var(--c-input-group-surface-hover)]",
        "h-9 min-w-0 has-[>textarea]:h-auto",

        // Variants based on alignment.
        "has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",

        // Focus state.
        "has-[[data-slot=input-group-control]:focus-visible]:border-[var(--c-input-group-border-focus)] has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-[var(--c-input-group-border-focus)]/50",

        // Error state. Was --ds-color-action-critical until July 2026 — red-100, a
        // soft *surface* tint sitting in border/ring slots, which read 1.19:1 on
        // white (fainter than the VALID border's 1.39:1) and 1.01:1 in dark. Now
        // --ds-color-border-critical-bold: 5.90:1 light / 4.19:1 dark. The /20 and
        // /40 halo opacities are stock's and are kept — red-600 at /20 lands at
        // 1.43:1, next to the valid lime halo's 1.46:1, so the opacity was never
        // the bug. The colour was.
        "has-[[data-slot][aria-invalid=true]]:border-[var(--c-input-group-border-critical-bold)] has-[[data-slot][aria-invalid=true]]:ring-[var(--c-input-group-border-critical-bold)]/20 dark:has-[[data-slot][aria-invalid=true]]:ring-[var(--c-input-group-border-critical-bold)]/40",

        className
      )}
      {...props}
    />
  )
}

// The <kbd> radius was stock's `calc(var(--radius) - 5px)`. Bare `--radius` is
// undefined project-wide (only --radius-sm/md/lg/xl are registered), so that
// calc() was dead and kbd rendered SQUARE. Now --ds-shape-radius-xs (4px).
//
// Why 4px: stock's base `--radius` is 10px, so its kbd step is 5px. Our ladder is
// NOT rescaled from stock — 6/8/10/14 is bit-for-bit what stock's
// calc(radius-4|-2|+0|+4) produces — so the honest answer is that 4px is simply
// the nearest rung to stock's 5px, which has no step of its own here. It is a
// rounding, not a derivation. It only became available in July 2026: --p-radius-xs
// moved 2px -> 4px in 3d95499, which is what unblocked this flag. Checkbox reads
// the same step for the same reason (small control, nested inside an 8px group).
const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-[var(--c-input-group-text-subtle)] select-none group-data-[disabled=true]/input-group:opacity-[var(--c-input-group-disabled-text-opacity)] [&>kbd]:rounded-[var(--c-input-group-shape-radius-xs)] [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
        "inline-end":
          "order-last pr-3 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]",
        "block-start":
          "order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5 [.border-b]:pb-3",
        "block-end":
          "order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5 [.border-t]:pt-3",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva(
  "flex items-center gap-2 text-sm shadow-none",
  {
    variants: {
      size: {
        // xs + icon-xs were the same dead `calc(var(--radius) - 5px)` as the kbd
        // radius above, so both rendered square. Now radius-xs (4px) against sm's
        // radius-md (8px) — see the note on inputGroupAddonVariants for why 4px.
        xs: "h-6 gap-1 rounded-[var(--c-input-group-shape-radius-xs)] px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 rounded-[var(--c-input-group-shape-radius-md)] px-2.5 has-[>svg]:px-2.5",
        "icon-xs":
          "size-6 rounded-[var(--c-input-group-shape-radius-xs)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
)

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-sm text-[var(--c-input-group-text-subtle)] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        // Transparent at rest AND on hover so the group owns the field surface;
        // enabled:hover:bg-transparent cancels the base Input's own hover fill.
        "flex-1 rounded-none border-0 bg-transparent enabled:hover:bg-transparent shadow-none focus-visible:ring-0",
        className
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent enabled:hover:bg-transparent py-3 shadow-none focus-visible:ring-0",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
