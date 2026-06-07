import * as React from "react"
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Spinner, Brightseed Quill design system.
 *
 * Defaults to --ds-color-icon-subtle (sand-700 / sand-300 dark) so the spinner
 * reads as "in progress, not urgent" against any surface. Override with
 * className when used inside a colored surface (e.g. on a lime button it
 * inherits forest text via currentColor, pass `text-current` to opt in).
 */
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn(
        "size-4 animate-spin text-[var(--c-spinner-icon-subtle)]",
        className
      )}
      {...props}
    />
  )
}

export { Spinner }
