import { Badge, type BadgeProps } from "@/components/ui/badge"

/**
 * Chip, Brightseed Quill design system.
 *
 * A standard, interactive badge pill (rounded-full, hover + focus). One of the
 * three public badge components, alongside `Tag` (static/informational) and
 * `NumberBadge` (counts). All three are thin wrappers over the shared `Badge`
 * styling engine, which carries the 12-color `variant` axis and the token
 * recipe, see components/ui/badge.tsx. Chip is `Badge` with `kind="chip"`.
 *
 * Renamed from the old Badge `kind="primary"` (June 5, 2026).
 */

export type ChipProps = Omit<BadgeProps, "kind">

function Chip(props: ChipProps) {
  return <Badge kind="chip" {...props} />
}

export { Chip }
