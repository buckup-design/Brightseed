"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Table — Brightseed Forager design system.
 *
 * Color tokens (Brightseed semantics):
 *   Header text       → --ds-color-text-default
 *   Body cell text    → --ds-color-text-default
 *   Caption text      → --ds-color-text-subtle
 *   Row borders       → --ds-color-border-subtle      (sand-200; "hairlines, table grid")
 *   Footer surface    → --ds-color-surface-alt        (sand-100; inset panels)
 *   Footer border-top → --ds-color-border-default     (sand-300; emphatic divider above totals)
 *   Row hover         → --ds-color-surface-default-hover (sand-100)
 *   Row selected      → --ds-color-surface-selected   (info-50; matches the Forager selected-row pattern)
 *   Row selected hover → --ds-color-surface-selected-hover
 */

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "[&_tr]:border-b [&_tr]:border-[var(--ds-color-border-subtle)]",
        className
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-[var(--ds-color-border-default)]",
        "bg-[var(--ds-color-surface-alt)] text-[var(--ds-color-text-default)]",
        "font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-[var(--ds-color-border-subtle)]",
        "transition-colors duration-[120ms]",
        "hover:bg-[var(--ds-color-surface-default-hover)]",
        "has-aria-expanded:bg-[var(--ds-color-surface-default-hover)]",
        "data-[state=selected]:bg-[var(--ds-color-surface-selected)]",
        "data-[state=selected]:hover:bg-[var(--ds-color-surface-selected-hover)]",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle whitespace-nowrap",
        "font-medium text-[var(--ds-color-text-default)]",
        "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap",
        "text-[var(--ds-color-text-default)]",
        "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        "mt-4 text-sm text-[var(--ds-color-text-subtle)]",
        className
      )}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
