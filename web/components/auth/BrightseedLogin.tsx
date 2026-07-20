"use client";
import * as React from "react";
import { CircleArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { BrightseedLogo } from "@/components/brand/BrightseedLogo";

/**
 * BrightseedLogin, translation of the Figma `Brightseed / Login / 1`
 * COMPONENT_SET (Mode={light, dark}) into React.
 *
 * Layout: 2-column grid. Left = form pane, right = marketing pane (Image Slot).
 * Both panes are 50% on md+ breakpoints; collapses to single column on mobile.
 *
 * Customizations vs stock shadcn login-04:
 *   1. Logo: Brightseed Mark (variant="mark"), centered above headline
 *   2. Welcome back: simple Geist headline (no subhead about "Acme Inc")
 *   3. OAuth: Google + Email-me-a-link only (no Apple); full-width Quill
 *      Secondary buttons; pill-shaped via xl size class
 *   4. "or" divider with horizontal lines on each side
 *   5. Inputs: visually labelless (sr-only labels for a11y); 48px height
 *      matches the Brightseed Input Size=lg variant from Figma
 *   6. SIGN IN: Quill Default xl, all-caps text, trailing CircleArrowRight
 *   7. Forgot your password: Quill Linktext (no underline ever; lime-300 →
 *      lime-200 color step on hover in dark mode via variant="linktext")
 *   8. Sign up row: "Don't have an account? Sign up", body + Linktext footer
 *   9. Image Slot: brand graphic from brand/graphic_login.bg.webp
 *      (mirrored to /public/brand/) with Tiempos Fine Italic "6x faster"
 *      text overlay positioned on top of the image.
 */

/**
 * Concept variants (Figma concepts board 2019:1485). `bold` is the original,
 * shipped direction and renders exactly as before. `minimal` and `restrained`
 * re-skin the same markup: only the form surface, the CTA, and the marketing
 * pane (graphic + text overlay) change.
 *
 * The concept palettes are brand-EXPLORATION values, not yet in the token
 * system, so they are pinned here as literals and applied by overriding the
 * component-scoped Button tokens at the login root — the same pattern the
 * sibling marketing pages use (app/marketing/{minimal,restrained}/page.tsx).
 * Promote them to real tokens if a direction is chosen.
 */
export type LoginVariant = "bold" | "minimal" | "restrained";

interface VariantSpec {
  /** Form-pane surface (Figma `login screen` frame fill). */
  formSurface: string;
  /** Marketing-pane background art, text baked out (exported from Figma). */
  graphic: string;
  /** CTA label + shape (Figma `Rectangle 96`, 401×48). */
  cta: { label: string; uppercase: boolean; icon: boolean; radius: string };
  /** Overrides for the Button component tokens, scoped to the login root. */
  theme: React.CSSProperties;
  Overlay: () => React.ReactElement;
}

const VARIANTS: Record<LoginVariant, VariantSpec> = {
  // Lime pill CTA (#c5e368 / forest text), vivid green gradient + line art.
  bold: {
    formSurface: "bg-card",
    graphic: "/brand/graphic_login.bg.webp",
    cta: { label: "Sign in", uppercase: true, icon: true, radius: "rounded-full" },
    theme: {},
    Overlay: BoldOverlay,
  },
  // Mint pill CTA (#9bd097 / black text), white + geometric dot arc, no serif.
  minimal: {
    formSurface: "bg-white",
    graphic: "/brand/graphic_login_minimal.webp",
    cta: { label: "Sign in", uppercase: true, icon: true, radius: "rounded-full" },
    theme: {
      "--c-button-action-primary": "#9bd097",
      "--c-button-action-primary-hover": "color-mix(in srgb, #9bd097 90%, #000)",
      "--c-button-action-primary-active": "color-mix(in srgb, #9bd097 82%, #000)",
      "--c-button-text-on-action-primary": "#000000",
      "--c-button-text-on-action-primary-hover": "#000000",
      "--c-button-text-on-action-primary-active": "#000000",
      "--c-button-text-link-brand": "#4f834b",
      "--c-button-text-link-brand-hover": "#3d6a3a",
      // Focus affordance on the inputs picks up the same mint as the CTA.
      // Input focuses off the shadcn --ring var (border-ring + ring-ring/50).
      "--ring": "#9bd097",
    } as React.CSSProperties,
    Overlay: MinimalOverlay,
  },
  // Forest CTA (#3e6646 / white text) at 8px radius, cream surfaces.
  restrained: {
    formSurface: "bg-[#f9f8f3]",
    graphic: "/brand/graphic_login_restrained.webp",
    cta: { label: "Sign in", uppercase: false, icon: false, radius: "rounded-md" },
    theme: {
      "--c-button-action-primary": "#3e6646",
      "--c-button-action-primary-hover": "color-mix(in srgb, #3e6646 90%, #000)",
      "--c-button-action-primary-active": "color-mix(in srgb, #3e6646 82%, #000)",
      "--c-button-text-on-action-primary": "#ffffff",
      "--c-button-text-on-action-primary-hover": "#ffffff",
      "--c-button-text-on-action-primary-active": "#ffffff",
      "--c-button-text-link-brand": "#305536",
      "--c-button-text-link-brand-hover": "#1f3a24",
    } as React.CSSProperties,
    Overlay: RestrainedOverlay,
  },
};

interface BrightseedLoginProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: LoginVariant;
}

export function BrightseedLogin({
  className,
  variant = "bold",
  ...props
}: BrightseedLoginProps) {
  const spec = VARIANTS[variant];
  return (
    <div
      style={spec.theme}
      className={cn(
        "grid w-full overflow-hidden rounded-xl border border-[var(--ds-color-border-subtle)] bg-card shadow-sm",
        "md:grid-cols-2",
        className,
      )}
      {...props}
    >
      <FormPane spec={spec} />
      <ImageSlot spec={spec} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Form Pane
 * ───────────────────────────────────────────────────────────────────────── */

function FormPane({ spec }: { spec: VariantSpec }) {
  return (
    <form
      className={cn(
        "flex flex-col items-center justify-between gap-8 p-8 md:px-12 md:py-16",
        spec.formSurface,
      )}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <BrightseedLogo variant="mark" className="h-14 w-14" />
        <h1 className="text-2xl font-medium text-foreground">Welcome back</h1>

        <div className="flex w-full flex-col gap-3">
          <Button
            type="button"
            variant="secondary"
            size="xl"
            className="w-full justify-center gap-2 rounded-full"
          >
            <GoogleGlyph className="size-5" />
            Continue with Google
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="xl"
            className="w-full justify-center gap-2 rounded-full"
          >
            <MailGlyph className="size-5" />
            Email me a link
          </Button>
        </div>

        <OrDivider />

        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel htmlFor="brightseed-login-email" className="sr-only">
              Email
            </FieldLabel>
            <Input
              id="brightseed-login-email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              required
              className="h-12"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="brightseed-login-password" className="sr-only">
              Password
            </FieldLabel>
            <Input
              id="brightseed-login-password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              required
              className="h-12"
            />
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          size="xl"
          className={cn(
            "w-full justify-center gap-2",
            spec.cta.radius,
            spec.cta.uppercase && "uppercase tracking-wide",
          )}
        >
          {spec.cta.label}
          {spec.cta.icon ? <CircleArrowRight className="size-5" /> : null}
        </Button>

        <Button
          type="button"
          variant="linktext"
        >
          Forgot your password?
        </Button>
      </div>

      <p className="text-sm text-foreground">
        Don&apos;t have an account?{" "}
        <Button
          type="button"
          variant="linktext"
          className="h-auto p-0 align-baseline"
        >
          Sign up
        </Button>
      </p>
    </form>
  );
}

function OrDivider() {
  return (
    <div className="flex w-full items-center gap-3 text-xs text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      <span>or</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Image Slot, marketing pane
 * Background graphic sourced from brand/graphic_login.bg.webp
 * (copied to web/public/brand/ at install time).
 * ───────────────────────────────────────────────────────────────────────── */

function ImageSlot({ spec }: { spec: VariantSpec }) {
  const Overlay = spec.Overlay;
  return (
    <div
      // Fixed light context: the brand graphic is always a light surface, so it
      // opts out of app theming. Every descendant token (display text, body
      // text, line-art) resolves against light-mode values in both themes,
      // keeping "6x faster" (--ds-color-text-default) dark on light/dark alike.
      data-theme="light"
      className="relative hidden overflow-hidden md:block"
      style={{
        backgroundImage: `url('${spec.graphic}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        // Establish a query container so the overlay can scale to the panel
        // width instead of being pinned to absolute Figma px. 100cqw = the
        // rendered panel width; the overlay below is expressed in cqw at the
        // rate 640px (the Figma Image Slot width) = 100cqw, i.e. cqw = px / 6.4.
        // inline-size (not size) so the panel's height still flows from the
        // form column; size containment would collapse it.
        containerType: "inline-size",
      }}
    >
      <div className="relative flex h-full items-center justify-center">
        <Overlay />
      </div>
    </div>
  );
}

/**
 * BOLD overlay — unchanged from the original shipped component.
 *
 * Text overlay, CSS grid overlap pattern matching Figma node 28556:967152.
 * All 3 elements share col-start-1/row-start-1; vertical position is set
 * via top margin from the shared grid origin.
 *
 * Typography (from Figma, 640px-wide frame). Values are authored in cqw so
 * the composition reproduces the Figma proportions at any panel width.
 * Conversion: cqw = figmaPx / 6.4  (640px = 100cqw).
 *   Label   , Geist Mono Medium, 32/36px  -> 5 / 5.625cqw, uppercase, forest-950
 *   Headline, Tiempos Fine italic: "6x" 120 -> 18.75cqw / " faster" 100 -> 15.625cqw,
 *             display lh 49.06px -> 7.665cqw, text-default
 *   Subtext , Geist Regular, 24/49.06px -> 3.75 / 7.665cqw, forest-950
 * Offsets: ml 20 -> 3.125cqw; mt 106 -> 16.5625cqw; mt 191 -> 29.84cqw.
 * Widths : 284 -> 44.375cqw; 437 -> 68.28cqw; 303 -> 47.34cqw.
 *
 * [CONCERN] Label + subtext use --ds-color-surface-brand-active (forest-950)
 * as a text color, no dedicated --ds-color-text-on-brand-graphic token exists
 * yet. Using the surface token matches Figma's --base/surface-brand-active
 * binding; add a proper text token when there's a second consumer.
 */
function BoldOverlay() {
  return (
    <div className="inline-grid grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-none">
      {/* DISCOVER / NUTRACEUTICALS, Geist Mono Medium 32px -> 5cqw */}
      <p
        className="col-start-1 row-start-1 ml-[3.125cqw] w-[44.375cqw] whitespace-pre-wrap uppercase"
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 500,
          fontSize: "5cqw",
          lineHeight: "5.625cqw",
          color: "var(--ds-color-surface-brand-active)",
        }}
      >
        {"Discover \nnutraceuticals"}
      </p>

      {/* 6x faster, Tiempos Fine italic, two sizes in one line */}
      <p
        className="col-start-1 row-start-1 mt-[16.5625cqw] w-[68.28cqw] text-[0px]"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          color: "var(--ds-color-text-default)",
        }}
      >
        <span style={{ fontSize: "18.75cqw", lineHeight: "7.665cqw" }}>6x</span>
        <span style={{ fontSize: "15.625cqw", lineHeight: "7.665cqw" }}> faster</span>
      </p>

      {/* than the industry average., Geist Regular 24px -> 3.75cqw */}
      <p
        className="col-start-1 row-start-1 ml-[3.125cqw] mt-[29.84cqw] w-[47.34cqw]"
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 400,
          fontSize: "3.75cqw",
          lineHeight: "7.665cqw",
          color: "var(--ds-color-surface-brand-active)",
        }}
      >
        than the industry average.
      </p>
    </div>
  );
}

/**
 * RESTRAINED overlay — Figma `a. Restrained Login` > `graphic ` (2015:598),
 * text group 2015:605. Same three-element grid-overlap pattern as Bold.
 *
 * The graphic pane is 689px wide in this board, so cqw = figmaPx / 6.89.
 *   Label   , Geist Mono Medium 32/36 -> 4.644 / 5.225cqw, uppercase, #133019
 *   Headline, Tiempos Fine italic: "6x" 120 -> 17.416cqw / " faster" 100 -> 14.514cqw,
 *             lh 49.06 -> 7.121cqw, olive #8b9d15 (the concept's accent)
 *   Subtext , Geist Regular 24/49.06 -> 3.483 / 7.121cqw, #133019
 * Offsets: ml 29 -> 4.209cqw; mt 104 -> 15.094cqw; mt 191 -> 27.721cqw.
 */
function RestrainedOverlay() {
  return (
    <div className="inline-grid grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-none">
      <p
        className="col-start-1 row-start-1 ml-[4.209cqw] w-[45.283cqw] whitespace-pre-wrap uppercase"
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 500,
          fontSize: "4.644cqw",
          lineHeight: "5.225cqw",
          color: "#133019",
        }}
      >
        {"Discover \nnutraceuticals"}
      </p>

      <p
        className="col-start-1 row-start-1 mt-[15.094cqw] w-[66.764cqw] text-[0px]"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          color: "#8b9d15",
        }}
      >
        <span style={{ fontSize: "17.416cqw", lineHeight: "7.121cqw" }}>6x</span>
        <span style={{ fontSize: "14.514cqw", lineHeight: "7.121cqw" }}> faster</span>
      </p>

      <p
        className="col-start-1 row-start-1 ml-[4.209cqw] mt-[27.721cqw] w-[41.51cqw]"
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 400,
          fontSize: "3.483cqw",
          lineHeight: "7.121cqw",
          color: "#133019",
        }}
      >
        than the industry average.
      </p>
    </div>
  );
}

/**
 * MINIMAL overlay — Figma `C. Minimal Login` > `graphic ` (2016:963),
 * text group 2016:1260.
 *
 * No serif anywhere: the headline is Geist Black, not Tiempos — that is the
 * defining move of this direction. cqw = figmaPx / 6.89 (689px pane).
 *   Label   , Geist Medium 40/46 -> 5.806 / 6.677cqw, uppercase, #545454
 *   Headline, Geist Black: "6x" 97.19 -> 14.106cqw / " faster" 80.99 -> 11.755cqw,
 *             lh 39.73 -> 5.767cqw, mint #99cf95
 *   Subtext , Geist Regular 22/39.73 -> 3.193 / 5.767cqw, #868686
 * Offsets: ml 10 -> 1.451cqw; ml 13 -> 1.887cqw; mt 121 -> 17.562cqw; mt 190 -> 27.576cqw.
 */
function MinimalOverlay() {
  return (
    <div className="inline-grid grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-none">
      <p
        className="col-start-1 row-start-1 ml-[1.451cqw] w-[50.508cqw] whitespace-pre-wrap uppercase"
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 500,
          fontSize: "5.806cqw",
          lineHeight: "6.677cqw",
          color: "#545454",
        }}
      >
        {"Discover \nnutraceuticals"}
      </p>

      <p
        className="col-start-1 row-start-1 mt-[17.562cqw] w-[62.7cqw] text-[0px]"
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 900,
          color: "#99cf95",
        }}
      >
        <span style={{ fontSize: "14.106cqw", lineHeight: "5.767cqw" }}>6x</span>
        <span style={{ fontSize: "11.755cqw", lineHeight: "5.767cqw" }}> faster</span>
      </p>

      <p
        className="col-start-1 row-start-1 ml-[1.887cqw] mt-[27.576cqw] w-[38.171cqw]"
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 400,
          fontSize: "3.193cqw",
          lineHeight: "5.767cqw",
          color: "#868686",
        }}
      >
        than the industry average.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Inline SVG glyphs (kept inline so this component is one-file portable;
 * upstream icons via lucide-react where appropriate)
 * ───────────────────────────────────────────────────────────────────────── */

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.12A6.6 6.6 0 0 1 5.5 12c0-.74.13-1.45.34-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.96l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function MailGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  );
}


