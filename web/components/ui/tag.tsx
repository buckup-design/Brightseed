import { Badge, type BadgeProps } from "@/components/ui/badge"

/**
 * Tag, Brightseed Quill design system.
 *
 * A tight, INFORMATIONAL badge for tag-dense Hummingbird surfaces (cr=2, 4px
 * horizontal padding, hugs content). Static by design: NO hover and NO focus
 * state, Tag is not interactive. Don't wire a click handler onto a Tag; reach
 * for `Chip` if you need an interactive pill.
 *
 * One of the three public badge components, alongside `Chip` and `NumberBadge`,
 * all thin wrappers over the shared `Badge` styling engine (see
 * components/ui/badge.tsx). Tag is `Badge` with `kind="tag"`.
 *
 * Renamed from the old Badge `kind="secondary"` (June 5, 2026).
 */

export type TagProps = Omit<BadgeProps, "kind">

function Tag(props: TagProps) {
  return <Badge kind="tag" {...props} />
}

export { Tag }
