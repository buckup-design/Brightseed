import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Card, Brightseed Quill design system.
 *
 * Color tokens (Brightseed semantics):
 *   Surface     → --ds-color-surface-default   (white in light, sand-950 in dark)
 *   Text        → --ds-color-text-default      (sand-800 in light, sand-50 in dark)
 *   Description → --ds-color-text-subtle       (sand-700 / sand-300)
 *   Border      → --ds-color-border-default    (sand-300 / sand-700)
 *   Radius      → --ds-shape-radius-xl         (14px; what `rounded-xl` already
 *                                               resolved to via the @theme
 *                                               --radius-xl alias in globals.css)
 *   Shadow      → --ds-shadow-sm               (raised card on page bg, per shape.css)
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-6 py-6",
        "bg-[var(--c-card-surface-default)] text-[var(--c-card-text-default)]",
        "border border-[var(--c-card-border-default)]",
        "rounded-[var(--c-card-shape-radius-xl)]",
        "shadow-[var(--c-card-shadow-sm)]",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-[var(--c-card-text-subtle)]", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
