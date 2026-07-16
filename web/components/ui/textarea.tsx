import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Textarea, Brightseed Quill design system.
 *
 * Color tokens (via the component tier, --c-textarea-*):
 *   Border resting      → --ds-color-border-default
 *   Border hover        → --ds-color-border-default-hover
 *   Border/ring focus   → --ds-color-border-focus
 *   Border/ring invalid → --ds-color-action-critical
 *   Placeholder         → --ds-color-text-subtle
 *   Radius              → --ds-shape-radius-md   (8px; the Input/Select/Textarea convention)
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Layout / sizing
        "flex field-sizing-content min-h-16 w-full px-3 py-2 text-base md:text-sm",
        "transition-[color,box-shadow] outline-none",
        // Surface + border + radius
        "bg-transparent",
        "border border-[var(--c-textarea-border-default)]",
        "rounded-[var(--c-textarea-shape-radius-md)]",
        // BRIGHTSEED-TBD: [BLOCKING] `shadow-xs` is Tailwind's stock elevation
        // (0 1px 2px 0 rgb(0 0 0 / 0.05)). The Brightseed shadow ramp starts at
        // --ds-shadow-sm; there is no --ds-shadow-xs, and --ds-shadow-sm is a
        // different, forest-tinted recipe. Left un-tokenised rather than guess a
        // token that doesn't exist or silently restyle the field. Needs either a
        // new --ds-shadow-xs or a decision to drop the shadow. (Same call as Input.)
        "shadow-xs",
        // Placeholder
        "placeholder:text-[var(--c-textarea-text-subtle)]",
        // BRIGHTSEED-TBD: [CONCERN] `disabled:opacity-50` is stock 0.5, not the
        // Brightseed --ds-disabled-text-opacity (0.55). Tokenising would shift the
        // fade, so it stays raw to preserve appearance. Matches Input.
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Dark-mode field fill. Restates the stock `dark:bg-input/30`; --input
        // bridges to --ds-color-border-default, so this is the same colour at 30%.
        "dark:bg-[var(--c-textarea-border-default)]/30",
        // Focus
        "focus-visible:border-[var(--c-textarea-border-focus)]",
        "focus-visible:ring-[3px] focus-visible:ring-[var(--c-textarea-border-focus)]/50",
        // Hover (resting only, focus and invalid own the border in their states)
        "enabled:hover:not-focus-visible:not-aria-invalid:border-[var(--c-textarea-border-default-hover)]",
        // Invalid
        "aria-invalid:border-[var(--c-textarea-action-critical)]",
        "aria-invalid:ring-[var(--c-textarea-action-critical)]/20",
        "dark:aria-invalid:ring-[var(--c-textarea-action-critical)]/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
