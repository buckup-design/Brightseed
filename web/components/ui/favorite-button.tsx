"use client"

import * as React from "react"
import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * FavoriteButton, Brightseed Quill design system.
 *
 * A star toggle: filled gold when favorited, a faint outline when not. Composes
 * the ghost icon Button + a Star and carries the favorite semantics (aria-pressed
 * plus a Favorite / Unfavorite label). The star is the favorite affordance across
 * the product (report rows, compound / plant / strategy cards), so it lives here
 * as one control rather than being re-inlined per surface.
 *
 * Controlled: pass `favorited` and flip it in `onToggle`. `label` names the thing
 * being favorited for the accessible label ("report" → "Favorite report").
 *
 * Color tokens (via the component tier, --c-favorite-button-*):
 *   Favorited (fill + stroke) → --ds-color-icon-favorite-active   (gold, theme-invariant)
 *   Unselected (stroke)       → --ds-color-icon-favorite-inactive (very light)
 */
function FavoriteButton({
  favorited,
  onToggle,
  label,
  className,
  ...props
}: {
  favorited: boolean
  /** Fired on activation; flip `favorited` in the handler. */
  onToggle?: () => void
  /** Noun for the accessible label, e.g. "report" → "Favorite report". */
  label?: string
} & Omit<
  React.ComponentProps<typeof Button>,
  "onClick" | "children" | "variant" | "size"
>) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-pressed={favorited}
      aria-label={`${favorited ? "Unfavorite" : "Favorite"}${label ? ` ${label}` : ""}`}
      onClick={onToggle}
      className={className}
      {...props}
    >
      <Star
        className={cn(
          favorited
            ? "fill-current text-[var(--c-favorite-button-icon-active)]"
            : "text-[var(--c-favorite-button-icon-inactive)]"
        )}
      />
    </Button>
  )
}

export { FavoriteButton }
