import { Badge, type BadgeProps } from "@/components/ui/badge"

/**
 * NumberBadge, Brightseed Quill design system.
 *
 * A compact numeric chip for counts and notifications (round, tabular-nums,
 * min-width so single- and double-digit numbers stay even). One of the three
 * public badge components, alongside `Chip` and `Tag`, all thin wrappers over
 * the shared `Badge` styling engine (see components/ui/badge.tsx). NumberBadge
 * is `Badge` with `kind="number"`.
 *
 * Exported as `NumberBadge` (not `Number`) to avoid shadowing the JS global.
 * Unchanged in behavior from the prior Badge `kind="number"`.
 */

export type NumberBadgeProps = Omit<BadgeProps, "kind">

function NumberBadge(props: NumberBadgeProps) {
  return <Badge kind="number" {...props} />
}

export { NumberBadge }
