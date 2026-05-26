import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Badge — Brightseed Forager design system.
 *
 * Spec: see CLAUDE.md "Locked-in decisions" — the Badge component recipe (Apr 2026)
 * and the Primary/Secondary/Number Badge architecture (May 7, 2026).
 *
 * Two prop axes:
 *
 *   `variant` — color treatment (12 values)
 *     default                      Neutral sand chip — surface=sand-100, text=sand-800.
 *                                  Distinct from page bg, calm enough for tag-dense rows.
 *     outline                      Hairline border, transparent surface, sand-900 text.
 *     ghost                        No surface, no border, sand-900 text.
 *     red                          Soft critical — red-100 surface, red-700 text.
 *     forest / lime / cyan /       Tag decorative palette. Color does NOT imply
 *     blue / yellow / orange /     status — for status meaning, compose icon + text
 *     lavender / orchid            instead of relying on hue. Recipe per hue:
 *                                    Default — surface=step-100, text=step-700
 *                                    Hover   — surface=step-200, text=step-700
 *                                    Focus   — ring=step-500 (hue-specific)
 *
 *   `kind` — visual treatment (3 values)
 *     primary    Standard pill. rounded-full, comfortable px-2 py-0.5, text-xs.
 *                Used in body content, table rows, chip-stacks of moderate density.
 *     secondary  Tight tag for tag-dense Forager surfaces. cr=2 (sharp corners,
 *                bound to --shape-radius-xs), px-1 horizontal, hugs content.
 *                More badges fit per row without column wrapping. Locked May 7.
 *     number     Compact numeric chip for counts/notifications. Round, tabular-nums,
 *                min-w to stay even when displaying single/double digit numbers.
 *                The shadcn-default Badge Number, rebound through Brightseed Mode,
 *                IS the Quill version (May 8 2026 decision).
 *
 * Inline slots — three composition paths, matching the Figma component_property
 * pattern (Show Inline Start/End booleans + Inline Start/End instance-swap):
 *
 *   1. Free composition (most idiomatic React):
 *        <Badge variant="forest"><LeafIcon /> Compound</Badge>
 *
 *   2. Explicit slot props (1:1 with the Figma master's properties):
 *        <Badge variant="forest" iconLeading={<LeafIcon />}>Compound</Badge>
 *
 *   3. Status dot (boolean — renders a small filled circle in currentColor):
 *        <Badge variant="forest" statusDot>Active</Badge>
 *
 * Icons (SVGs with stroke="currentColor") automatically track the variant's text
 * color via the cascade — same outcome as the Figma `tag/active-color` Variable Mode
 * cascade, just naturally with CSS instead of nested overrides.
 *
 * Story / matrix support: `data-force-state="hover|focus|disabled"` renders any
 * variant in that state without real interaction. The `hovered`, `focused`, and
 * `disabled-state` Tailwind variants (declared in sandbox/app/globals.css) match
 * both the real pseudo-class AND the data attribute, so the cva stays
 * single-declaration. Same dual-trigger pattern Button uses.
 */

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
    // ── Disabled fade — single DOM level so opacity never stacks ─────────
    "disabled-state:cursor-not-allowed",
    "disabled-state:[&_[data-slot=badge-content]]:opacity-[var(--disabled-text-opacity)]",
    // ── Focus ring — 1px stroke, 1px offset (matches Figma Ring spec) ────
    "outline-none",
    "focused:ring-1 focused:ring-offset-1 focused:ring-offset-[var(--color-surface-default)]",
  ),
  {
    variants: {
      variant: {
        // ── Neutral cohort (Default / Outline / Ghost) ──────────────────
        // These three share the "Neutral" tag-active-color mode in Figma —
        // icon and text track --color-text-default, surface treatment varies.
        default: cn(
          "bg-[var(--color-action-secondary)] text-[var(--color-text-default)]",
          "hovered:bg-[var(--color-action-secondary-hover)]",
          "focused:ring-[var(--color-border-focus-secondary)]",
        ),
        outline: cn(
          "bg-transparent text-[var(--color-text-default)]",
          "border-[var(--color-border-default)]",
          "hovered:bg-[var(--color-action-secondary)]",
          "focused:ring-[var(--color-border-focus-secondary)]",
        ),
        ghost: cn(
          "bg-transparent text-[var(--color-text-default)]",
          "hovered:bg-[var(--color-action-secondary)]",
          "focused:ring-[var(--color-border-focus-secondary)]",
        ),
        // ── Critical (red, soft tint) ──────────────────────────────────
        red: cn(
          "bg-[var(--color-surface-tag-red)] text-[var(--color-text-tag-red)]",
          "hovered:bg-[var(--color-surface-tag-red-hover)]",
          "focused:ring-[var(--color-border-tag-red-focus)]",
        ),
        // ── Tag decorative palette (8 hues) ─────────────────────────────
        forest: cn(
          "bg-[var(--color-surface-tag-forest)] text-[var(--color-text-tag-forest)]",
          "hovered:bg-[var(--color-surface-tag-forest-hover)]",
          "focused:ring-[var(--color-border-tag-forest-focus)]",
        ),
        lime: cn(
          "bg-[var(--color-surface-tag-lime)] text-[var(--color-text-tag-lime)]",
          "hovered:bg-[var(--color-surface-tag-lime-hover)]",
          "focused:ring-[var(--color-border-tag-lime-focus)]",
        ),
        cyan: cn(
          "bg-[var(--color-surface-tag-cyan)] text-[var(--color-text-tag-cyan)]",
          "hovered:bg-[var(--color-surface-tag-cyan-hover)]",
          "focused:ring-[var(--color-border-tag-cyan-focus)]",
        ),
        blue: cn(
          "bg-[var(--color-surface-tag-blue)] text-[var(--color-text-tag-blue)]",
          "hovered:bg-[var(--color-surface-tag-blue-hover)]",
          "focused:ring-[var(--color-border-tag-blue-focus)]",
        ),
        yellow: cn(
          "bg-[var(--color-surface-tag-yellow)] text-[var(--color-text-tag-yellow)]",
          "hovered:bg-[var(--color-surface-tag-yellow-hover)]",
          "focused:ring-[var(--color-border-tag-yellow-focus)]",
        ),
        orange: cn(
          "bg-[var(--color-surface-tag-orange)] text-[var(--color-text-tag-orange)]",
          "hovered:bg-[var(--color-surface-tag-orange-hover)]",
          "focused:ring-[var(--color-border-tag-orange-focus)]",
        ),
        lavender: cn(
          "bg-[var(--color-surface-tag-lavender)] text-[var(--color-text-tag-lavender)]",
          "hovered:bg-[var(--color-surface-tag-lavender-hover)]",
          "focused:ring-[var(--color-border-tag-lavender-focus)]",
        ),
        orchid: cn(
          "bg-[var(--color-surface-tag-orchid)] text-[var(--color-text-tag-orchid)]",
          "hovered:bg-[var(--color-surface-tag-orchid-hover)]",
          "focused:ring-[var(--color-border-tag-orchid-focus)]",
        ),
      },
      kind: {
        // Primary — standard pill, rounded-full
        primary: cn(
          "h-5 px-2 py-0.5 gap-1 text-xs",
          "rounded-full",
        ),
        // Secondary — tight tag, cr=2 (--shape-radius-xs), 4px horizontal padding,
        // hugs content. For dense rows where width matters more than air.
        secondary: cn(
          "h-[18px] px-1 gap-1 text-[11px] leading-none",
          "rounded-[var(--shape-radius-xs)]",
        ),
        // Number — compact numeric. tabular-nums keeps "9" and "10" the same width.
        // min-w-5 prevents single-digit numbers from collapsing too narrow.
        number: cn(
          "h-5 min-w-5 px-1.5 text-[11px] tabular-nums",
          "rounded-full",
        ),
      },
    },
    defaultVariants: {
      variant: "default",
      kind: "primary",
    },
  }
)

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** When true, the Slot from Radix is used so styling applies to the child element (e.g. an `<a>`). */
    asChild?: boolean
    /** Leading inline mark — typically a 14×14 SVG icon (stroke="currentColor"). */
    iconLeading?: React.ReactNode
    /** Trailing inline mark — typically a 14×14 SVG icon (stroke="currentColor"). */
    iconTrailing?: React.ReactNode
    /** Renders a small filled circle in currentColor as the leading mark. Convenience for status indicators. */
    statusDot?: boolean
  }

/**
 * Status dot — a 6×6 filled circle in currentColor. Mirrors Figma's
 * `Badge/Status/Dot-badge` component (a zero-length LINE with strokeCap=ROUND
 * at strokeWeight=4 produces the same visual). Implemented in React as a
 * plain span with bg-current — simpler given CSS box-shadow caveats.
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
  kind = "primary",
  asChild = false,
  iconLeading,
  iconTrailing,
  statusDot = false,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot.Root : "span"

  // Composition: explicit slot props win over inline children for the leading
  // mark. statusDot is mutually exclusive with iconLeading — if both are
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
