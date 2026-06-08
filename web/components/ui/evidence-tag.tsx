import { Badge, type BadgeProps } from "@/components/ui/badge"

/**
 * EvidenceTag, Brightseed Quill design system.
 *
 * The outlined data-validation tag used on the Compound card to show what kind
 * of study backs a compound's claims: "Animal" (animal trials) or "Clinical"
 * (human clinical data). Both render identically, an outlined rounded-md pill,
 * the value carries the meaning, not the color.
 *
 * A compound shows at most ONE evidence tag. Clinical evidence is stronger than
 * animal trials, so when both exist only "Clinical" is shown. That precedence
 * is a content decision made by the caller (see strongestEvidence in
 * compound-card.tsx); EvidenceTag itself just renders whatever label it is given.
 *
 * Built on the shared Badge engine (see components/ui/badge.tsx): the outlined
 * look is variant="outline" (border + transparent surface + default text) and
 * the rounded-md / 24px shape is kind="evidence". Interactive: it is clickable
 * on the card (routes to the compound detail), so it inherits the chip's
 * hover/focus from the engine.
 *
 * One of the public badge wrappers, alongside Chip, Tag, and NumberBadge.
 */

export type EvidenceTagProps = Omit<BadgeProps, "kind" | "variant">

function EvidenceTag(props: EvidenceTagProps) {
  return <Badge variant="outline" kind="evidence" {...props} />
}

export { EvidenceTag }
