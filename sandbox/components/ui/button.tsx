import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Button — Brightseed Forager design system.
 *
 * Spec: see CLAUDE.md "Locked-in decisions (Apr 2026)" sections and BrightseedDS.md §4.
 * Mirrors the canonical "Components - Quill" matrix in Figma (node 26465:249160):
 * 6 variants × 10 sizes × 6 states.
 *
 * Variants
 *   default      Lime fill (brand action). Surface ladder: lime-300 → 400 → 500.
 *                Text ladder: forest-800 → forest-900 → forest-950 (active state
 *                requires the third step to pass WCAG AA on the deeper lime-500).
 *   secondary    Faint sand fill, no border. Flat-step ladder sand-100 → 200 → 300.
 *   outline      Hairline border, transparent surface. Hovers to surface-alt.
 *   ghost        No surface; hovers to surface-alt.
 *   destructive  Soft red. red-100 surface + red-600 text (NOT solid red-500) —
 *                matches the Tag recipe pattern, reads as destructive without shouting.
 *   linktext     Button-shaped link. Lime text, never underlined. (Deeper step
 *                than the lime button surface — lime-700 light / lime-300 dark —
 *                so the text passes AA on page surfaces.) Distinct from the
 *                inline <a> Link component (blue, always underlined). See
 *                CLAUDE.md "Link vs Linktext" and "Brand-link uses lime, not
 *                forest" (May 2026) for why this isn't collapsed into one and
 *                why the scale moved from forest to lime.
 *
 * Sizes
 *   xs / sm / default / lg / xl   text sizes
 *   icon-xs / icon-sm / icon /
 *   icon-lg / icon-xl             square icon-only sizes
 *
 *   Corner radii: --shape-radius-md (8px) for everything except xl + icon-xl,
 *   which use --shape-radius-4xl (26px) — the "pronounced rounding for hero CTAs"
 *   step on the existing radius scale.
 *
 * Hover behavior
 *   1. Surface and text both step "more pronounced" (one shade darker in light,
 *      one shade lighter in dark — same direction conceptually).
 *   2. Font weight bumps from Medium (500) to SemiBold (600) over 120ms. Geist
 *      is a variable font, so font-weight interpolates smoothly along the wght axis.
 *
 *   Width reservation: SemiBold glyphs are wider than Medium. Without mitigation,
 *   the button would grow on hover, causing layout shift in adjacent content.
 *   Fix: render the label TWICE in a CSS grid stack — an invisible always-SemiBold
 *   ghost copy reserves width, the visible copy on top transitions weight smoothly.
 *
 *   Skipped when (a) `asChild` is true (Slot expects exactly one child) or (b) the
 *   size is icon-only (no text → no weight bump matters).
 *
 * Disabled
 *   Surface uses --color-action-{variant}-disabled (a color-mix overlay computed
 *   per variant — see semantics.css). Label and icon stay at the variant's normal
 *   foreground color but fade to --disabled-text-opacity (0.55). Opacity is
 *   applied at exactly one DOM level (`[data-slot=button-content]`) so it never
 *   stacks. Disabled UI is exempt from WCAG 1.4.3 contrast.
 *
 * Loading
 *   Sets `disabled` (HTML-level, blocks clicks + keyboard activation),
 *   `aria-busy="true"` (screen readers announce in-progress), and
 *   `data-loading="true"`. The `disabled-state` Tailwind variant explicitly
 *   excludes `[data-loading="true"]` (see globals.css), so loading buttons
 *   keep their default surface — they read as "in progress", not "inactive".
 *   Visually: spinner takes the leading-icon slot, text stays at full opacity.
 *
 * Story / matrix support
 *   `data-force-state="hover|focus|active|disabled|loading"` renders the button
 *   in that state without real interaction. The `hovered`, `focused`, `pressed`,
 *   `disabled-state`, and `loading-state` Tailwind variants (declared in
 *   sandbox/app/globals.css) match both the real pseudo-class AND the data
 *   attribute, so the cva stays single-declaration.
 */

const buttonVariants = cva(
  cn(
    // ── Layout / typography (size-invariant) ────────────────────────────
    "relative inline-flex shrink-0 items-center justify-center",
    "whitespace-nowrap text-sm font-medium",
    "rounded-[var(--shape-radius-md)]",
    "outline-none cursor-pointer select-none",
    // ── Transitions ─────────────────────────────────────────────────────
    // 120ms is the value cited in the spec for the weight bump. transition-all
    // covers bg/color/border/box-shadow; font-weight is animatable on variable
    // fonts and uses the same duration.
    "transition-all duration-[120ms]",
    // ── Pointer / cursor ────────────────────────────────────────────────
    "disabled-state:cursor-not-allowed",
    "disabled-state:pointer-events-none",
    "loading-state:cursor-wait",
    "loading-state:pointer-events-none",
    // ── Icon defaults ───────────────────────────────────────────────────
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
    // ── Disabled fade ───────────────────────────────────────────────────
    // Apply opacity to the content wrapper only, at exactly one DOM level so
    // it never stacks. The disabled-state variant excludes [data-loading="true"]
    // (see globals.css), so loading buttons keep their content at full opacity
    // even though they're HTML-disabled — the spinner stays clearly visible.
    "disabled-state:[&_[data-slot=button-content]]:opacity-[var(--disabled-text-opacity)]",
    // ── Focus ring: 3px outer, 50% alpha for softness. Variant sets color. ──
    "focused:ring-[3px] focused:ring-offset-0",
  ),
  {
    variants: {
      variant: {
        // ── Default (lime — brand action) ───────────────────────────────
        default: cn(
          "bg-[var(--color-action-primary)] text-[var(--color-text-on-action-primary)]",
          "hovered:bg-[var(--color-action-primary-hover)]",
          "hovered:text-[var(--color-text-on-action-primary-hover)]",
          "hovered:font-semibold",
          "pressed:bg-[var(--color-action-primary-active)]",
          "pressed:text-[var(--color-text-on-action-primary-active)]",
          "focused:ring-[var(--color-border-focus)]/50",
          "disabled-state:bg-[var(--color-action-primary-disabled)]"
        ),
        // ── Secondary (faint sand) ──────────────────────────────────────
        secondary: cn(
          "bg-[var(--color-action-secondary)] text-[var(--color-text-default)]",
          "hovered:bg-[var(--color-action-secondary-hover)]",
          "hovered:text-[var(--color-text-default-hover)]",
          "hovered:font-semibold",
          "pressed:bg-[var(--color-action-secondary-active)]",
          "focused:ring-[var(--color-border-focus-secondary)]/50",
          "disabled-state:bg-[var(--color-action-secondary-disabled)]"
        ),
        // ── Outline (hairline border, transparent surface) ──────────────
        outline: cn(
          "border border-[var(--color-border-default)] bg-transparent",
          "text-[var(--color-text-default)]",
          "hovered:bg-[var(--color-action-secondary-hover)]",
          "hovered:text-[var(--color-text-default-hover)]",
          "hovered:font-semibold",
          "pressed:bg-[var(--color-action-secondary-active)]",
          "focused:ring-[var(--color-border-focus)]/50"
        ),
        // ── Ghost (no surface, no border) ───────────────────────────────
        ghost: cn(
          "bg-transparent text-[var(--color-text-default)]",
          "hovered:bg-[var(--color-action-secondary)]",
          "hovered:text-[var(--color-text-default-hover)]",
          "hovered:font-semibold",
          "pressed:bg-[var(--color-action-secondary-hover)]",
          "focused:ring-[var(--color-border-focus)]/50"
        ),
        // ── Destructive (soft red) ──────────────────────────────────────
        destructive: cn(
          "bg-[var(--color-action-critical)] text-[var(--color-text-on-action-critical)]",
          "hovered:bg-[var(--color-action-critical-hover)]",
          "hovered:text-[var(--color-text-on-action-critical-hover)]",
          "hovered:font-semibold",
          "pressed:bg-[var(--color-action-critical-active)]",
          "focused:ring-[var(--color-border-focus-destructive)]/50",
          "disabled-state:bg-[var(--color-action-critical-disabled)]"
        ),
        // ── Linktext (button-shaped link, never underlined) ─────────────
        linktext: cn(
          "bg-transparent text-[var(--color-text-link-brand)]",
          "hovered:text-[var(--color-text-link-brand-hover)]",
          "hovered:font-semibold",
          "pressed:text-[var(--color-text-link-brand-hover)]",
          "focused:ring-[var(--color-border-focus-link-brand)]/50"
        ),
      },
      size: {
        xs: cn(
          "h-6 px-2 text-xs",
          // Per-size gap is set as a CSS var so the inner ghost-label and
          // live-label spans can both consume it without the size variant
          // having to know about that structure.
          "[--btn-gap:0.25rem]",
          "[&_svg:not([class*='size-'])]:size-3"
        ),
        sm: "h-8 px-3 [--btn-gap:0.375rem]",
        default: "h-9 px-4 [--btn-gap:0.5rem]",
        lg: "h-10 px-6 [--btn-gap:0.5rem]",
        xl: "h-12 px-8 text-base [--btn-gap:0.5rem] rounded-[var(--shape-radius-4xl)] [&_svg:not([class*='size-'])]:size-5",
        // ── Icon sizes (square, no text) ─────────────────────────────────
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        icon: "size-9",
        "icon-lg": "size-10",
        "icon-xl": "size-12 rounded-[var(--shape-radius-4xl)] [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** When true, the Slot from Radix is used so styling applies to the child element (e.g. an `<a>`). */
    asChild?: boolean
    /** Replaces the leading icon with a spinner and HTML-disables the button (clicks blocked). */
    loading?: boolean
  }

/** Inline spinner. Uses currentColor so it picks up each variant's text color. */
function ButtonSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button"

  const isIconOnly =
    size === "icon" ||
    size === "icon-xs" ||
    size === "icon-sm" ||
    size === "icon-lg" ||
    size === "icon-xl"

  const isDisabled = disabled || loading

  // asChild: the user passed a complete element (typically an <a>). Pass
  // through unchanged — Slot expects exactly one child, and we don't own
  // its internal structure enough to inject a ghost-label wrapper.
  if (asChild) {
    return (
      <Comp
        data-slot="button"
        data-variant={variant}
        data-size={size}
        data-loading={loading || undefined}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </Comp>
    )
  }

  // Icon-only: spinner replaces the icon entirely when loading. No text,
  // no ghost-label width reservation needed.
  if (isIconOnly) {
    return (
      <Comp
        data-slot="button"
        data-variant={variant}
        data-size={size}
        data-loading={loading || undefined}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        <span
          data-slot="button-content"
          className="inline-flex items-center justify-center"
        >
          {loading ? <ButtonSpinner /> : children}
        </span>
      </Comp>
    )
  }

  // Text-bearing button: spinner takes the leading-icon slot when loading.
  // Both the ghost (width-reservation) and live copies receive the spinner so
  // width stays consistent in either state.
  const liveContent = loading ? (
    <>
      <ButtonSpinner />
      {children}
    </>
  ) : (
    children
  )

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      <span
        data-slot="button-content"
        className="grid items-center justify-items-center"
      >
        {/* Ghost label — invisible, always SemiBold. Reserves width so the
            visible label can transition weight on hover without layout shift. */}
        <span
          aria-hidden="true"
          data-slot="button-ghost"
          className="invisible col-start-1 row-start-1 inline-flex items-center gap-[var(--btn-gap)] font-semibold whitespace-nowrap"
        >
          {liveContent}
        </span>
        {/* Live label — sits on top of the ghost in the same grid cell.
            Inherits font-weight from the button (Medium → SemiBold on hover). */}
        <span
          data-slot="button-live"
          className="col-start-1 row-start-1 inline-flex items-center gap-[var(--btn-gap)] whitespace-nowrap"
        >
          {liveContent}
        </span>
      </span>
    </Comp>
  )
}

export { Button, buttonVariants }
