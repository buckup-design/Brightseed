import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Alert — Brightseed Forager design system.
 *
 * Variants follow the soft-surface intent recipe: surface = subtle tint,
 * border = semi-transparent intent outline, text = semantic in light /
 * warm-white (sand-50) in dark. Icon color is explicit per variant via
 * --color-icon-* tokens — decoupled from text so dark mode icons stay
 * semantically colored while text falls back to neutral.
 *
 *   default      neutral surface — informational, no semantic weight
 *   info         blue tint
 *   success      forest tint
 *   warning      yellow tint
 *   destructive  red tint
 *
 * In dark mode every intent flips automatically via
 * tokens/semantics.css ([data-theme="dark"] override).
 */

const alertVariants = cva(
  cn(
    "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5",
    "rounded-[var(--shape-radius-md)] border px-4 py-3 text-sm",
    "has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3",
    // Icon size + position — color set per-variant below, not inherited from text
    "[&>svg]:size-4 [&>svg]:translate-y-0.5"
  ),
  {
    variants: {
      variant: {
        default: cn(
          "bg-[var(--color-surface-default)] text-[var(--color-text-default)]",
          "border-[var(--color-border-subtle)]",
          "[&>svg]:text-[var(--color-icon-default)]"
        ),
        info: cn(
          "bg-[var(--color-surface-info)] text-[var(--color-text-info)]",
          "border-[var(--color-border-info-default)]",
          "[&>svg]:text-[var(--color-icon-info)]"
        ),
        success: cn(
          "bg-[var(--color-surface-success)] text-[var(--color-text-success)]",
          "border-[var(--color-border-success-default)]",
          "[&>svg]:text-[var(--color-icon-success)]"
        ),
        warning: cn(
          "bg-[var(--color-surface-warning)] text-[var(--color-text-warning)]",
          "border-[var(--color-border-warning-default)]",
          "[&>svg]:text-[var(--color-icon-warning)]"
        ),
        destructive: cn(
          "bg-[var(--color-surface-critical)] text-[var(--color-text-critical)]",
          "border-[var(--color-border-critical-default)]",
          "[&>svg]:text-[var(--color-icon-critical)]"
        ),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      data-variant={variant ?? "default"}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        // Description inherits the variant's text token at 80% to soften the
        // hierarchy between title and description without a second token lookup.
        "col-start-2 grid justify-items-start gap-1 text-sm",
        "text-current/80 [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, alertVariants }
