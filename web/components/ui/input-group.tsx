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
        // BRIGHTSEED-TBD: [BLOCKING] `shadow-xs` left as a stock Tailwind class.
        // --ds-shadow-* only has sm/md/lg/xl, no xs step, and `--shadow-*` is not
        // remapped in @theme inline, so this resolves to Tailwind's stock shadow.
        // Swapping in --ds-shadow-sm would change the rendered value. Matches the
        // sibling Input/Textarea, which also still use stock `shadow-xs`.
        //
        // BRIGHTSEED-TBD: [CONCERN] `dark:bg-.../30` reuses the *border* token as a
        // surface. That is stock shadcn's own `dark:bg-input/30` (--input →
        // --ds-color-border-default), preserved verbatim; the tier is now clean but
        // the semantic intent (border token painting a background) is inherited oddity.
        "group/input-group relative flex w-full items-center rounded-[var(--c-input-group-shape-radius-md)] border border-[var(--c-input-group-border-default)] shadow-xs transition-[color,box-shadow] outline-none dark:bg-[var(--c-input-group-border-default)]/30",
        "h-9 min-w-0 has-[>textarea]:h-auto",

        // Variants based on alignment.
        "has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",

        // Focus state.
        "has-[[data-slot=input-group-control]:focus-visible]:border-[var(--c-input-group-border-focus)] has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-[var(--c-input-group-border-focus)]/50",

        // Error state.
        // BRIGHTSEED-TBD: [CONCERN] `border-destructive` / `ring-destructive` both
        // resolve through the bridge to --ds-color-action-critical (the soft red-100
        // *surface* step), not a border/text step. Tokenised 1:1 to preserve the
        // current look; if the invalid outline reads too faint, that is a pre-existing
        // shadcn choice to revisit, not a regression from this migration.
        "has-[[data-slot][aria-invalid=true]]:border-[var(--c-input-group-action-critical)] has-[[data-slot][aria-invalid=true]]:ring-[var(--c-input-group-action-critical)]/20 dark:has-[[data-slot][aria-invalid=true]]:ring-[var(--c-input-group-action-critical)]/40",

        className
      )}
      {...props}
    />
  )
}

// BRIGHTSEED-TBD: [BLOCKING] `[&>kbd]:rounded-[calc(var(--radius)-5px)]` left as-is.
// Two reasons it cannot be mechanically tokenised:
//   1. Bare `--radius` is not defined anywhere in this project (app/globals.css
//      registers --radius-sm/md/lg/xl only), so this calc() is already dead today
//      and kbd renders with no radius. Binding it to a real token would CHANGE
//      appearance, which is out of scope for a re-plumb.
//   2. There is no --ds-* semantic for "radius-md minus 5px"; --ds-shape-radius-*
//      is a fixed ladder, and inventing an arithmetic offset would be improvising.
// Needs a design call on which radius step a <kbd> inside an addon should use.
const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-[var(--c-input-group-text-subtle)] select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
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
        // BRIGHTSEED-TBD: [BLOCKING] `rounded-[calc(var(--radius)-5px)]` on xs +
        // icon-xs left as-is, same reason as the kbd radius above: bare `--radius`
        // is undefined in this project and no --ds-shape-radius-* expresses an
        // arithmetic offset. Needs a design call, not a guess.
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 rounded-[var(--c-input-group-shape-radius-md)] px-2.5 has-[>svg]:px-2.5",
        "icon-xs":
          "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
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
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent",
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
        "flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent",
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
