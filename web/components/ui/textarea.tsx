import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Textarea, Brightseed Quill design system.
 *
 * Color tokens (via the component tier, --c-textarea-*):
 *   Border resting      → --ds-color-border-default
 *   Border hover        → --ds-color-border-default-hover
 *   Border/ring focus   → --ds-color-border-focus
 *   Border/ring invalid → --ds-color-border-critical-bold
 *   Surface rest/hover  → --ds-color-surface-field / --ds-color-surface-field-hover
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
        // Surface + border + radius. Field fill is a lighter inset than the
        // panel it sits on; see --ds-color-surface-field.
        "bg-[var(--c-textarea-surface-default)]",
        "border border-[var(--c-textarea-border-default)]",
        "rounded-[var(--c-textarea-shape-radius-md)]",
        "shadow-[var(--c-textarea-shadow-xs)]",
        // Placeholder
        "placeholder:text-[var(--c-textarea-text-subtle)]",
        "disabled:cursor-not-allowed disabled:opacity-[var(--c-textarea-disabled-text-opacity)]",
        // Focus
        "focus-visible:border-[var(--c-textarea-border-focus)]",
        "focus-visible:ring-[3px] focus-visible:ring-[var(--c-textarea-border-focus)]/50",
        // Hover: border deepens (resting only; focus and invalid own the border
        // in their states) and the field brightens one step.
        "enabled:hover:not-focus-visible:not-aria-invalid:border-[var(--c-textarea-border-default-hover)]",
        "enabled:hover:bg-[var(--c-textarea-surface-hover)]",
        // Invalid
        "aria-invalid:border-[var(--c-textarea-border-critical-bold)]",
        "aria-invalid:ring-[var(--c-textarea-border-critical-bold)]/20",
        "dark:aria-invalid:ring-[var(--c-textarea-border-critical-bold)]/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
