import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Badge, Brightseed Quill design system.
 *
 * Spec: see CLAUDE.md "Locked-in decisions", the Badge component recipe (Apr 2026)
 * and the Primary/Secondary/Number Badge architecture (May 7, 2026).
 *
 * Two prop axes:
 *
 *   `variant`, color treatment (12 values)
 *     default                      Neutral sand chip, surface=sand-100, text=sand-800.
 *                                  Distinct from page bg, calm enough for tag-dense rows.
 *     outline                      Hairline border, transparent surface, sand-900 text.
 *     ghost                        No surface, no border, sand-900 text.
 *     red                          Soft critical, red-100 surface, red-700 text.
 *     forest / lime / cyan /       Tag decorative palette. Color does NOT imply
 *     blue / yellow / orange /     status, for status meaning, compose icon + text
 *     lavender / orchid            instead of relying on hue. Recipe per hue:
 *                                    Default, surface=step-100, text=step-700
 *                                    Hover  , surface=step-200, text=step-700
 *                                    Focus  , ring=step-500 (hue-specific)
 *
 *   `kind`, visual treatment (3 values)
 *     chip       Standard pill. rounded-full, comfortable px-2 py-0.5, text-xs.
 *                Used in body content, table rows, chip-stacks of moderate density.
 *                Interactive: carries hover + focus states. (Renamed from "primary".)
 *     tag        Tight, INFORMATIONAL tag for tag-dense Hummingbird surfaces. cr=2
 *                (sharp corners, bound to --ds-shape-radius-xs), px-1 horizontal,
 *                hugs content. More tags fit per row without column wrapping.
 *                Static, NOT interactive: no hover, no focus state, by design.
 *                (Renamed from "secondary".)
 *     number     Compact numeric chip for counts/notifications. Round, tabular-nums,
 *                min-w to stay even when displaying single/double digit numbers.
 *                The shadcn-default Badge Number, rebound through Brightseed Mode,
 *                IS the Quill version (May 8 2026 decision). Unchanged.
 *
 * Inline slots, three composition paths, matching the Figma component_property
 * pattern (Show Inline Start/End booleans + Inline Start/End instance-swap):
 *
 *   1. Free composition (most idiomatic React):
 *        <Badge variant="forest"><LeafIcon /> Compound</Badge>
 *
 *   2. Explicit slot props (1:1 with the Figma master's properties):
 *        <Badge variant="forest" iconLeading={<LeafIcon />}>Compound</Badge>
 *
 *   3. Status dot (boolean, renders a small filled circle in currentColor):
 *        <Badge variant="forest" statusDot>Active</Badge>
 *
 * Icons (SVGs with stroke="currentColor") automatically track the variant's text
 * color via the cascade, same outcome as the Figma `tag/active-color` Variable Mode
 * cascade, just naturally with CSS instead of nested overrides.
 *
 * Story / matrix support: `data-force-state="hover|focus|disabled"` renders any
 * variant in that state without real interaction. The `hovered`, `focused`, and
 * `disabled-state` Tailwind variants (declared in web/app/globals.css) match
 * both the real pseudo-class AND the data attribute, so the cva stays
 * single-declaration. Same dual-trigger pattern Button uses.
 */

// All 12 color variants, used to generate the interactive compoundVariants.
const VARIANT_NAMES = [
  "default",
  "outline",
  "ghost",
  "red",
  "forest",
  "lime",
  "cyan",
  "blue",
  "yellow",
  "orange",
  "lavender",
  "orchid",
] as const

// Kinds that are interactive (carry hover + focus). `tag` is intentionally
// absent: it is informational/static and gets neither.
const INTERACTIVE_KINDS = ["chip", "number"] as const

// Focus ring geometry, 1px stroke + 1px offset (matches Figma Ring spec).
// Kind-specific (interactive only), so `tag` never paints a ring.
const RING_BASE =
  "focused:ring-1 focused:ring-offset-1 focused:ring-offset-[var(--ds-color-surface-default)]"

// Per-variant hover surface + focus ring color. Pulled out of the `variant`
// map so these states only attach to interactive kinds via compoundVariants.
const VARIANT_INTERACTIVE: Record<(typeof VARIANT_NAMES)[number], string> = {
  default:
    "hovered:bg-[var(--ds-color-action-secondary-hover)] focused:ring-[var(--ds-color-border-focus-secondary)]",
  outline:
    "hovered:bg-[var(--ds-color-action-secondary)] focused:ring-[var(--ds-color-border-focus-secondary)]",
  ghost:
    "hovered:bg-[var(--ds-color-action-secondary)] focused:ring-[var(--ds-color-border-focus-secondary)]",
  red: "hovered:bg-[var(--ds-color-surface-tag-red-hover)] focused:ring-[var(--ds-color-border-tag-red-focus)]",
  forest:
    "hovered:bg-[var(--ds-color-surface-tag-forest-hover)] focused:ring-[var(--ds-color-border-tag-forest-focus)]",
  lime: "hovered:bg-[var(--ds-color-surface-tag-lime-hover)] focused:ring-[var(--ds-color-border-tag-lime-focus)]",
  cyan: "hovered:bg-[var(--ds-color-surface-tag-cyan-hover)] focused:ring-[var(--ds-color-border-tag-cyan-focus)]",
  blue: "hovered:bg-[var(--ds-color-surface-tag-blue-hover)] focused:ring-[var(--ds-color-border-tag-blue-focus)]",
  yellow:
    "hovered:bg-[var(--ds-color-surface-tag-yellow-hover)] focused:ring-[var(--ds-color-border-tag-yellow-focus)]",
  orange:
    "hovered:bg-[var(--ds-color-surface-tag-orange-hover)] focused:ring-[var(--ds-color-border-tag-orange-focus)]",
  lavender:
    "hovered:bg-[var(--ds-color-surface-tag-lavender-hover)] focused:ring-[var(--ds-color-border-tag-lavender-focus)]",
  orchid:
    "hovered:bg-[var(--ds-color-surface-tag-orchid-hover)] focused:ring-[var(--ds-color-border-tag-orchid-focus)]",
}

// Cartesian product: every variant × every interactive kind → its hover/focus.
const interactiveCompoundVariants = INTERACTIVE_KINDS.flatMap((kind) =>
  VARIANT_NAMES.map((variant) => ({
    variant,
    kind,
    class: cn(RING_BASE, VARIANT_INTERACTIVE[variant]),
  }))
)

const badgeVariants = cva(
  cn(
    // ── Base layout / typography (kind-invariant) ────────────────────────
    "inline-flex w-fit shrink-0 items-center justify-center",
    "whitespace-nowrap font-medium select-none",
    "border border-transparent",
    "transition-all duration-[120ms]",
    // ── Icon defaults ────────────────────────────────────────────────────
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-3.5",
    // ── Disabled fade, single DOM level so opacity never stacks ─────────
    "disabled-state:cursor-not-allowed",
    "disabled-state:[&_[data-slot=badge-content]]:opacity-[var(--ds-disabled-text-opacity)]",
    // Focus ring + hover live in compoundVariants (interactive kinds only),
    // so the `tag` kind stays fully static. `outline-none` is kind-invariant.
    "outline-none",
  ),
  {
    variants: {
      // Resting colors only. Hover surface + focus ring live in
      // compoundVariants (interactive kinds), so `tag` stays static.
      variant: {
        // ── Neutral cohort (Default / Outline / Ghost) ──────────────────
        // These three share the "Neutral" tag-active-color mode in Figma,
        // icon and text track --ds-color-text-default, surface treatment varies.
        default: "bg-[var(--ds-color-action-secondary)] text-[var(--ds-color-text-default)]",
        outline: cn(
          "bg-transparent text-[var(--ds-color-text-default)]",
          "border-[var(--ds-color-border-default)]",
        ),
        ghost: "bg-transparent text-[var(--ds-color-text-default)]",
        // ── Critical (red, soft tint) ──────────────────────────────────
        red: "bg-[var(--ds-color-surface-tag-red)] text-[var(--ds-color-text-tag-red)]",
        // ── Tag decorative palette (8 hues) ─────────────────────────────
        forest: "bg-[var(--ds-color-surface-tag-forest)] text-[var(--ds-color-text-tag-forest)]",
        lime: "bg-[var(--ds-color-surface-tag-lime)] text-[var(--ds-color-text-tag-lime)]",
        cyan: "bg-[var(--ds-color-surface-tag-cyan)] text-[var(--ds-color-text-tag-cyan)]",
        blue: "bg-[var(--ds-color-surface-tag-blue)] text-[var(--ds-color-text-tag-blue)]",
        yellow: "bg-[var(--ds-color-surface-tag-yellow)] text-[var(--ds-color-text-tag-yellow)]",
        orange: "bg-[var(--ds-color-surface-tag-orange)] text-[var(--ds-color-text-tag-orange)]",
        lavender: "bg-[var(--ds-color-surface-tag-lavender)] text-[var(--ds-color-text-tag-lavender)]",
        orchid: "bg-[var(--ds-color-surface-tag-orchid)] text-[var(--ds-color-text-tag-orchid)]",
      },
      kind: {
        // Chip, standard pill, rounded-full. Interactive (hover + focus).
        chip: cn(
          "h-5 px-2 py-0.5 gap-1 text-xs",
          "rounded-full",
        ),
        // Tag, tight informational tag, cr=2 (--ds-shape-radius-xs), 4px horizontal
        // padding, hugs content. Static, no hover/focus. For dense rows where width
        // matters more than air.
        tag: cn(
          "h-[18px] px-1 gap-1 text-[11px] leading-none",
          "rounded-[var(--ds-shape-radius-xs)]",
        ),
        // Number, compact numeric. tabular-nums keeps "9" and "10" the same width.
        // min-w-5 prevents single-digit numbers from collapsing too narrow.
        number: cn(
          "h-5 min-w-5 px-1.5 text-[11px] tabular-nums",
          "rounded-full",
        ),
      },
    },
    compoundVariants: interactiveCompoundVariants,
    defaultVariants: {
      variant: "default",
      kind: "chip",
    },
  }
)

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** When true, the Slot from Radix is used so styling applies to the child element (e.g. an `<a>`). */
    asChild?: boolean
    /** Leading inline mark, typically a 14×14 SVG icon (stroke="currentColor"). */
    iconLeading?: React.ReactNode
    /** Trailing inline mark, typically a 14×14 SVG icon (stroke="currentColor"). */
    iconTrailing?: React.ReactNode
    /** Renders a small filled circle in currentColor as the leading mark. Convenience for status indicators. */
    statusDot?: boolean
  }

/**
 * Status dot, a 6×6 filled circle in currentColor. Mirrors Figma's
 * `Badge/Status/Dot-badge` component (a zero-length LINE with strokeCap=ROUND
 * at strokeWeight=4 produces the same visual). Implemented in React as a
 * plain span with bg-current, simpler given CSS box-shadow caveats.
 */
function StatusDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      data-slot="badge-status-dot"
      className={cn(
        "inline-block size-1.5 rounded-full bg-current",
        className
      )}
    />
  )
}

function Badge({
  className,
  variant = "default",
  kind = "chip",
  asChild = false,
  iconLeading,
  iconTrailing,
  statusDot = false,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot.Root : "span"

  // Composition: explicit slot props win over inline children for the leading
  // mark. statusDot is mutually exclusive with iconLeading, if both are
  // passed, iconLeading takes precedence (more specific intent).
  const leading = iconLeading ?? (statusDot ? <StatusDot /> : null)

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-kind={kind}
      className={cn(badgeVariants({ variant, kind }), className)}
      {...props}
    >
      <span
        data-slot="badge-content"
        className="inline-flex items-center gap-[inherit]"
      >
        {leading}
        {children}
        {iconTrailing}
      </span>
    </Comp>
  )
}

export { Badge, badgeVariants, StatusDot }
export type { BadgeProps }
