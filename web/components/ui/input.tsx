import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Input, Brightseed Quill design system.
 *
 * Color tokens (via the component tier, --c-input-*):
 *   Border resting      → --ds-color-border-default
 *   Border hover        → --ds-color-border-default-hover
 *   Border focus        → --ds-color-border-focus  (sand-500, neutral)
 *   Ring focus          → --ds-color-ring-focus    (faint lime whisper, 2px)
 *   Border/ring invalid → --ds-color-border-critical-bold
 *   Surface rest/hover  → --ds-color-surface-field / --ds-color-surface-field-hover
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
        // Surface + border + radius. Field fill is a lighter inset than the
        // panel it sits on; see --ds-color-surface-field.
        "bg-[var(--c-input-surface-default)]",
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
        // Focus
        "focus-visible:border-[var(--c-input-border-focus)]",
        "focus-visible:ring-[2px] focus-visible:ring-[var(--c-input-ring-focus)]",
        // Hover: border deepens (resting only; focus and invalid own the border
        // in their states) and the field brightens one step.
        "enabled:hover:not-focus-visible:not-aria-invalid:border-[var(--c-input-border-default-hover)]",
        "enabled:hover:bg-[var(--c-input-surface-hover)]",
        // Invalid
        "aria-invalid:border-[var(--c-input-border-critical-bold)]",
        "aria-invalid:ring-[var(--c-input-border-critical-bold)]/20",
        "dark:aria-invalid:ring-[var(--c-input-border-critical-bold)]/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
