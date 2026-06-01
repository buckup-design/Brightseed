"use client";
import * as React from "react";
import { CircleArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrightseedLogo } from "@/components/brand/BrightseedLogo";

/**
 * BrightseedLogin — translation of the Figma `Brightseed / Login / 1`
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
 *   8. Sign up row: "Don't have an account? Sign up" — body + Linktext footer
 *   9. Image Slot: brand graphic from brand/graphic_login.bg.webp
 *      (mirrored to /public/brand/) with Tiempos Fine Italic "6x faster"
 *      text overlay positioned on top of the image.
 */

interface BrightseedLoginProps extends React.HTMLAttributes<HTMLDivElement> {}

export function BrightseedLogin({ className, ...props }: BrightseedLoginProps) {
  return (
    <div
      className={cn(
        "grid w-full overflow-hidden rounded-xl border bg-card shadow-sm",
        "md:grid-cols-2",
        className,
      )}
      {...props}
    >
      <FormPane />
      <ImageSlot />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Form Pane
 * ───────────────────────────────────────────────────────────────────────── */

function FormPane() {
  return (
    <form
      className="flex flex-col items-center justify-between gap-8 p-8 md:px-12 md:py-16"
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

        <div className="flex w-full flex-col gap-3">
          <div>
            <Label htmlFor="brightseed-login-email" className="sr-only">
              Email
            </Label>
            <Input
              id="brightseed-login-email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              required
              className="h-12"
            />
          </div>
          <div>
            <Label htmlFor="brightseed-login-password" className="sr-only">
              Password
            </Label>
            <Input
              id="brightseed-login-password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              required
              className="h-12"
            />
          </div>
        </div>

        <Button
          type="submit"
          size="xl"
          className="w-full justify-center gap-2 rounded-full uppercase tracking-wide"
        >
          Sign in
          <CircleArrowRight className="size-5" />
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
 * Image Slot — marketing pane
 * Background graphic sourced from brand/graphic_login.bg.webp
 * (copied to sandbox/public/brand/ at install time).
 * ───────────────────────────────────────────────────────────────────────── */

function ImageSlot() {
  return (
    <div
      className="relative hidden overflow-hidden md:block"
      style={{
        backgroundImage: "url('/brand/graphic_login.bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/*
       * Text overlay — CSS grid overlap pattern matching Figma node 28556:967152.
       * All 3 elements share col-start-1/row-start-1; vertical position is set
       * via top margin from the shared grid origin.
       *
       * Typography (from Figma):
       *   Label    — Geist Mono Medium, 32px / 36px lh, uppercase, forest-950
       *   Headline — Tiempos Fine italic: "6x" 120px / " faster" 100px, text-default
       *   Subtext  — Geist Regular, 24px / 49px lh, forest-950
       *
       * [CONCERN] Label + subtext use --color-surface-brand-active (forest-950)
       * as a text color — no dedicated --color-text-on-brand-graphic token exists
       * yet. Using the surface token matches Figma's --base/surface-brand-active
       * binding; add a proper text token when there's a second consumer.
       */}
      <div className="relative flex h-full items-center justify-center">
        <div className="inline-grid grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-none">

          {/* DISCOVER / NUTRACEUTICALS — Geist Mono Medium 32px */}
          <p
            className="col-start-1 row-start-1 ml-5 w-[284px] whitespace-pre-wrap uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 500,
              fontSize: "32px",
              lineHeight: "36px",
              color: "var(--color-surface-brand-active)",
            }}
          >
            {"Discover \nnutraceuticals"}
          </p>

          {/* 6x faster — Tiempos Fine italic, two sizes in one line */}
          <p
            className="col-start-1 row-start-1 mt-[106px] w-[437px] text-[0px]"
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              color: "var(--color-text-default)",
            }}
          >
            <span style={{ fontSize: "120px", lineHeight: "49.06px" }}>6x</span>
            <span style={{ fontSize: "100px", lineHeight: "49.06px" }}> faster</span>
          </p>

          {/* than the industry average. — Geist Regular 24px */}
          <p
            className="col-start-1 row-start-1 ml-5 mt-[191px] w-[303px]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "24px",
              lineHeight: "49.06px",
              color: "var(--color-surface-brand-active)",
            }}
          >
            than the industry average.
          </p>

        </div>
      </div>
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


