import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * PageHeading, Brightseed Quill design system.
 *
 * A page/section title with an optional description beneath it — the h1 + p
 * pattern that opens most product surfaces (the agent home greeting, a list
 * view's masthead, an empty state). Product UI, so it stays in Geist via
 * Tailwind's size scale; the Tiempos display face is marketing/docs only
 * (see DesignGuidelines.mdx). One fixed size for now — add size variants if a
 * surface needs them; that's non-breaking.
 *
 * - `as` sets only the heading element for document outline correctness
 *   (a page has one h1); it does not change the visual size.
 * - `align` centers or left-aligns the whole block (title + description).
 *
 * Color tokens (via the component tier, --c-page-heading-*):
 *   Title       → --ds-color-text-default
 *   Description → --ds-color-text-subtle
 */
function PageHeading({
  title,
  description,
  align = "left",
  as: Heading = "h1",
  className,
  ...props
}: {
  title: React.ReactNode
  /** Optional subheading beneath the title. */
  description?: React.ReactNode
  align?: "left" | "center"
  /** Heading element for the document outline. Visual size is unaffected. */
  as?: "h1" | "h2" | "h3"
} & Omit<React.ComponentProps<"div">, "title">) {
  return (
    <div
      data-slot="page-heading"
      className={cn(
        "space-y-2",
        align === "center" ? "text-center" : "text-left",
        className
      )}
      {...props}
    >
      <Heading
        data-slot="page-heading-title"
        className="text-2xl font-semibold text-[var(--c-page-heading-text-default)]"
      >
        {title}
      </Heading>
      {description ? (
        <p
          data-slot="page-heading-description"
          className="text-[var(--c-page-heading-text-subtle)]"
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}

export { PageHeading }
