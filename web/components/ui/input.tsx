import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Input, Brightseed Quill design system.
 *
 * Color tokens (via the component tier, --c-input-*):
 *   Border resting      → --ds-color-border-default
 *   Border hover        → --ds-color-border-default-hover
 *   Border/ring focus   → --ds-color-border-focus
 *   Border/ring invalid → --ds-color-action-critical
 *   Placeholder         → --ds-color-text-subtle
 *   File-button label   → --ds-color-text-default
 *   Selection           → --ds-color-action-primary / --ds-color-text-on-action-primary
 *   Radius              → --ds-shape-radius-md   (8px; the Input/Select/Textarea convention)
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Layout / sizing
        "h-9 w-full min-w-0 px-3 py-1 text-base md:text-sm",
        "transition-[color,box-shadow] outline-none",
        // Surface + border + radius
        "bg-transparent",
        "border border-[var(--c-input-border-default)]",
        "rounded-[var(--c-input-shape-radius-md)]",
        "shadow-[var(--c-input-shadow-xs)]",
        // Text selection
        "selection:bg-[var(--c-input-action-primary)] selection:text-[var(--c-input-text-on-action-primary)]",
        // File-input button
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "file:text-[var(--c-input-text-default)]",
        // Placeholder
        "placeholder:text-[var(--c-input-text-subtle)]",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-[var(--c-input-disabled-text-opacity)]",
        // Dark-mode field fill. Restates the stock `dark:bg-input/30`; --input
        // bridges to --ds-color-border-default, so this is the same colour at 30%.
        "dark:bg-[var(--c-input-border-default)]/30",
        // Focus
        "focus-visible:border-[var(--c-input-border-focus)]",
        "focus-visible:ring-[3px] focus-visible:ring-[var(--c-input-border-focus)]/50",
        // Hover (resting only, focus and invalid own the border in their states)
        "enabled:hover:not-focus-visible:not-aria-invalid:border-[var(--c-input-border-default-hover)]",
        // Invalid
        "aria-invalid:border-[var(--c-input-action-critical)]",
        "aria-invalid:ring-[var(--c-input-action-critical)]/20",
        "dark:aria-invalid:ring-[var(--c-input-action-critical)]/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
