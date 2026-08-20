import type { CSSProperties } from "react";
import Link from "next/link";
import type { Metadata } from "next";

import { BrightseedLogo } from "@/components/brand/BrightseedLogo";
import { Button } from "@/components/ui/button";
import { IndustryIcon } from "../_components/industry-icons";
import { UiScreenshot } from "../_components/ui-screenshot";
import { TestimonialSpotlight } from "../_components/testimonial-spotlight";
import { SiteFooter } from "../_components/site-footer";
import { QuillGrid } from "../_components/quill-grid";
import {
  hero,
  industries,
  industriesLabel,
  testimonialsLabel,
  testimonialsHeadline,
  carouselTestimonials,
  requestDemo,
} from "../content";

export const metadata: Metadata = { title: "Hummingbird — Restrained" };

/**
 * Marketing landing — RESTRAINED concept (Figma "Concept: restrained",
 * 2036:4885).
 *
 * Warm sand surfaces, a sage blueprint grid, forest-green rounded-rect CTAs,
 * NO gradients. Geist + Geist Mono, with Tiempos Fine italic reserved for the
 * demo emphasis. Neutral (not green) eyebrow. Industries reorder Nutrition to
 * 2nd and flip the carrot horizontally, per the mock. Same five sections as the
 * other concepts.
 */
const SKIN = {
  // Concept CTA — forest rounded-rect (mock #476549 / white).
  "--c-button-action-primary": "#476549",
  "--c-button-action-primary-hover": "#3b5540",
  "--c-button-action-primary-active": "#324937",
  "--c-button-text-on-action-primary": "#ffffff",
  "--c-button-text-on-action-primary-hover": "#ffffff",
  "--c-button-text-on-action-primary-active": "#ffffff",
  // Concept palette
  "--mk-eyebrow": "#272421",
  "--mk-wordmark": "var(--p-color-forest-900)",
  "--mk-label": "#545454",
  "--mk-industry-icon": "#AEAB9E",
  // Matches the demo block's Tiempos emphasis green — one olive across the page.
  "--mk-industry-icon-hover": "var(--mk-emphasis)",
  "--mk-industry-name": "#46453f",
  "--mk-industry-body": "var(--p-color-sand-700)",
  "--mk-emphasis": "#8f9d35",
  "--mk-quote": "#272421",
  "--mk-muted": "var(--p-color-sand-700)",
  "--mk-dot-active": "#476549",
  "--mk-dot": "#d3d1c6",
  // Quill grid port (quill-grid.tsx) — sand-200 / sand-500 bases. Hero-only
  // now; cards + demo use the much-fainter -subtle pair below. Value is the
  // exact midpoint between the original 0.5/0.3 and -subtle's 0.15/0.08 —
  // the hero gets half the contrast cut the other surfaces got.
  "--mk-grid-line": "rgba(234,232,223,0.325)",
  "--mk-grid-accent": "rgba(174,171,158,0.19)",
  "--mk-grid-line-subtle": "rgba(234,232,223,0.15)",
  "--mk-grid-accent-subtle": "rgba(174,171,158,0.08)",
  // Shared footer contract
  "--mk-footer-surface": "#ffffff",
  "--mk-footer-border": "var(--p-color-sand-300)",
  "--mk-text": "var(--p-color-sand-900)",
  "--mk-brand": "var(--p-color-forest-900)",
} as CSSProperties;

// Restrained reorders Nutrition ahead of Personal Care (mock order).
const RESTRAINED_ORDER = ["food", "nutrition", "personal", "pharma"];
const restrainedIndustries = RESTRAINED_ORDER.map(
  (k) => industries.find((i) => i.key === k)!,
);

function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-xs font-medium uppercase tracking-[0.2em] ${className}`}>{children}</p>
  );
}

export default function RestrainedPage() {
  // Keep "industry’s most advanced" together so the lead breaks after "the" —
  // per the mock, "industry’s" starts the second line instead of ending the first.
  const [leadHead, leadTail] = requestDemo.lead.split(/\s+(?=industry)/);
  return (
    <div style={SKIN} className="mk-page min-h-dvh bg-[var(--p-color-sand-50)] text-[var(--p-color-sand-900)]">
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-[var(--p-color-sand-200)] bg-[var(--p-color-sand-50)]/85 backdrop-blur">
        {/* Vertical rhythm is one clamp() family across the whole page (nav
            through footer), not a per-section guess. Both the nav's and the
            sections' clamps share the same floor breakpoint (400px, where
            `base + slope*vw` first clears the floor) so the system reads as
            one ladder even though the nav's range is much smaller than a
            section's — see the section clamp below for the full rationale.

            3xl:max-w-7xl (Phase C, item 10): the shell was pinned at 1152px
            (max-w-6xl) with nothing above it, so a 27" display showed a
            fixed column in a field of sand from 1280 up. 1280px (max-w-7xl)
            only applies past 1600px (--breakpoint-3xl), so nothing changes
            below that; the named 3xl variant safely overrides the base
            max-w-6xl here because there's no arbitrary min-[Npx]: on this
            same property to lose the cascade race to (see the industries
            grid comment below for that trap). py-7 at 3xl is one Tailwind
            step past the clamp's 1.5rem ceiling, matching the section
            rhythm bump below. */}
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-[clamp(0.875rem,0.75rem+0.5vw,1.5rem)] 3xl:max-w-7xl 3xl:py-7">
          <BrightseedLogo variant="lockup" className="h-6 text-[var(--p-color-forest-900)]" />
          <Button asChild variant="secondary" size="sm" className="rounded-full px-8">
            <Link href="/marketing/restrained/login">{hero.login}</Link>
          </Button>
        </nav>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden [--mk-hero-pad:clamp(3rem,2rem+4vw,7rem)] 3xl:[--mk-hero-pad:8rem]">
        {/* inset-0 (no fixed height) so the grid fills the section to its bottom
            edge, where the Industries section crops the hero shot.

            offsetY tracks the same --mk-hero-pad the content column is padded
            by, so the screenshot's top edge holds ONE phase in the lattice at
            every desktop width. Without it the edge slides 0.04px per px of
            viewport (the pad is fluid, the 16px/80px pitches are not) and
            periodically lands on a line or a plus arm: at 1440 the plus tips
            hit it within 0.4px, at 1920 a line within 0.8px. The +2.5rem puts
            the edge at phase 224.8 — 7.2px off the nearest line (8px is the
            most any phase can get) and 29.2px clear of a plus arm. Hoisting
            the pad into a var is what keeps the two from drifting apart; edit
            the value once, here on the section. */}
        <QuillGrid className="-z-0" offsetY="calc(var(--mk-hero-pad) + 2.5rem)" />
        {/* pt only: the bottom edge is owned by the -mb-12 bleed below, not by
            padding, so the fluid rhythm here only ever touches the top. Same
            clamp() as every other section (see the industries section below
            for the full rationale); floor 3rem/48px below ~400px viewport,
            ramping toward 7rem/112px past ~1450px, replacing the old
            pt-16 sm:pt-20 two-step guess. The value itself now lives in
            --mk-hero-pad on the section (the grid reads it too, see above);
            the 3xl step to 8rem is the same rhythm bump pt-32 used to apply,
            set alongside that var. 3xl:max-w-7xl matches the shell widening
            described on the nav above. */}
        <div className="relative mx-auto max-w-6xl px-6 pt-[var(--mk-hero-pad)] text-center 3xl:max-w-7xl">
          <Eyebrow className="text-[var(--mk-eyebrow)]">{hero.eyebrow}</Eyebrow>
          {/* Floor is 2.5rem (40px), not the old 3.5rem: at 3.5rem the wordmark
              stopped shrinking at 622px viewport while its box kept shrinking
              below that, clipping "hummingbird™" against the section's
              overflow-hidden from 622px down to 320px. 2.5rem fits 320px with
              padding to spare and the 11vw slope reaches 3.5rem again at 509px,
              so the ramp is continuous instead of flat-then-cliff. */}
          <h1 className="mt-5 font-semibold leading-[0.9] tracking-[-0.03em] text-[var(--mk-wordmark)] text-[clamp(2.5rem,11vw,7rem)]">
            {hero.product}
            <sup className="align-super text-[0.28em] font-normal">{hero.trademark}</sup>
          </h1>
          <div className="mt-8 flex justify-center">
            <Button size="lg" className="px-6">
              {hero.requestDemo}
            </Button>
          </div>
          {/* Cropped interface frame (Figma clips it wide + short); the big
              wordmark above is the hero's, so the shot has none. The capture is a raw
              square-cornered PNG (unlike the old art, which baked rounded corners +
              a 1px stroke into its alpha), so the WRAPPER owns the framing: top-only
              rounding + overflow-hidden + a sand-300 hairline, with a
              box-shadow replacing the old drop-shadow filter (which only worked by
              hugging the baked alpha). The negative bottom margin still bleeds the
              shot past the section box so the hero's overflow-hidden crops it to a
              straight bottom edge under the Industries section; only the top corners
              stay rounded. 3xl:max-w-6xl lets the shot follow the 3xl shell
              widening at roughly the same proportion it already holds against
              the 6xl/5xl pair below 1600 (89%).

              The radius is a ratio, not a constant: 20px reads as a screen
              bezel on the ~1024px desktop frame (1.95% of its width) but the
              frame is only 327px at 375 viewport, where the same 20px becomes
              11.4% of its HEIGHT and the arc eats ~55px of the mobile crop at
              each corner — enough to clip the sidebar wordmark. 6px holds the
              desktop proportion at phone width (327/1024 * 20 = 6.4) and
              matches the demo screenshot's radius further down the page. The
              switch rides the same 640px seam as the <source> art direction
              below, so the tighter crop and the tighter corner arrive
              together. */}
          <div className="mx-auto mt-14 -mb-12 w-full max-w-5xl overflow-hidden rounded-t-[6px] border border-[var(--p-color-sand-300)] shadow-[0_22px_40px_rgba(53,56,38,0.35)] sm:rounded-t-[20px] 3xl:max-w-6xl">
            {/* Art direction, not just a sizes hint (F9 / item 11): below 640
                the full 2800px empty-state capture read as illegible noise at
                phone width, so mobile gets its own crop rather than a scaled-
                down desktop shot. Recipe (restrained-responsive-plan.md
                section 7 item 2, Becky Aug 18 2026): cut from this SAME
                source (sidebar + composer, not the demo section's populated
                screen, so the two sections don't show the same app twice),
                trimming the empty right margin and top strip, then downscaled
                and palette-quantized. 900x481, 71KB against the desktop
                source's 2800x1342, 506KB. */}
            <picture>
              <source media="(max-width: 639px)" srcSet="/marketing/hero-restrained-quill-mobile.png" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/marketing/hero-restrained-quill.png"
                alt="Hummingbird interface"
                className="block w-full"
              />
            </picture>
          </div>
        </div>
      </section>

      {/* Industries + Testimonials share one white full-width band (the rest of
          the page — hero, demo, footer — stays sand-50). */}
      <div className="bg-white">
      {/* ── Industries ──────────────────────────────────────────────────── */}
      {/* Section rhythm: clamp(3rem, 2rem + 4vw, 7rem), the one formula every
          section (and, scaled down, the nav) now shares in place of the old
          per-section guesses (py-20 here, py-16 md:py-24 on demo, a flat
          py-16 on the footer, pt-16 sm:pt-20 on the hero). Floor 48px holds
          below ~400px viewport; the ramp reaches ~109px by 1920 without ever
          hard-stepping, capped at 7rem/112px past ~2000px.

          3xl:max-w-7xl + 3xl:py-32 (Phase C, item 10): the shell was pinned
          at max-w-6xl with no tier above 1280, so the page stopped growing
          entirely from 1280 to 2560. 1280px only engages past 1600px
          (--breakpoint-3xl); py-32/8rem is one Tailwind step past the
          clamp's own 7rem ceiling, a single modest bump rather than a new
          ramp, matching "restrained" — the clamp keeps doing the
          continuous work below 1600, this only raises the ceiling once. */}
      <section className="relative mx-auto max-w-6xl px-6 py-[clamp(3rem,2rem+4vw,7rem)] 3xl:max-w-7xl 3xl:py-32">
        <Eyebrow className="text-center text-[var(--mk-label)]">{industriesLabel}</Eyebrow>
        {/* 1 / 2 / 3 / 4 column ladder: 2-up at 640, a 3-up tier at 900, 4-up
            at 1180. The old sm-then-lg ladder skipped straight from 2 to 4
            columns, nearly halving the card at the lg boundary (407px at
            900 down to 222px at 1024). The added 900px tier splits that one
            big drop into two smaller ones.

            4-up moved from 1024 to 1180 (B-1, restrained-responsive-plan.md):
            at 1024 this tier landed on the exact same pixel as the demo
            split and the h1 clamp reaching its ceiling, stacking three
            unrelated layout changes into one 1259px docH collapse. The demo
            split stays at 1024 (lg:, below); staggering the industries tier
            to 1180 spreads that into two smaller steps instead of one large
            one.

            All four tiers use arbitrary min-[Npx]: variants, not sm:/lg::
            Tailwind 4 emits arbitrary-bracket variants as one group, sorted
            among themselves by pixel value, but that whole group lands
            BEFORE the named-breakpoint group in the compiled stylesheet
            regardless of value. Mixing sm:grid-cols-2 (640) with a bracket
            min-[900px]:grid-cols-3 meant sm's rule, being later in the file,
            silently beat the 900px rule at every width from 900 to 1023 —
            same specificity, later cascade position wins. Verified by
            grepping the compiled CSS for the three rules' byte offsets before
            trusting the layout. Keeping all four tiers in the arbitrary group
            keeps their file order matching their pixel order. */}
        <div className="mt-10 grid gap-6 min-[640px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1180px]:grid-cols-4">
          {restrainedIndustries.map((it) => (
            <div
              key={it.key}
              className="group relative flex min-h-[17rem] flex-col overflow-hidden rounded-2xl border border-[var(--p-color-sand-200)] bg-[var(--p-color-sand-50)] p-7 transition-shadow duration-200 ease-out hover:shadow-[0_8px_28px_rgba(53,56,38,0.14)] motion-reduce:transition-none"
            >
              <QuillGrid lineColor="var(--mk-grid-line-subtle)" accentColor="var(--mk-grid-accent-subtle)" />
              {/* Inner wrapper zooms as one unit on hover; the grid stays static outside it. */}
              <div className="relative flex flex-1 flex-col transition-transform duration-200 ease-out group-hover:scale-[1.02] motion-reduce:transition-none">
                <IndustryIcon
                  name={it.icon}
                  className={`size-14 text-[var(--mk-industry-icon)] transition-colors duration-200 ease-out group-hover:text-[var(--mk-industry-icon-hover)] motion-reduce:transition-none ${it.icon === "carrot" ? "-scale-x-100" : ""}`}
                />
                <h3 className="mt-auto pt-14 font-mono text-[18px] font-bold text-[var(--mk-industry-name)]">
                  {it.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--mk-industry-body)]">{it.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials — split spotlight ─────────────────────────────────── */}
      {/* Same section clamp as Industries above, on both edges now instead of
          the old fixed pt-16 pb-20. The old fixed pair was a workaround to
          avoid touching Industries' padding directly; now that both sections
          share one formula there's nothing special to protect, the gap
          between the last card and the quote is just two adjacent sections'
          padding, same as anywhere else on the page. 3xl:max-w-7xl +
          3xl:py-32 match the Industries shell/rhythm bump above; see the
          quote-column re-measurement note further down for what the wider
          shell does for B-2 at this width. */}
      <section className="mx-auto max-w-6xl px-6 py-[clamp(3rem,2rem+4vw,7rem)] 3xl:max-w-7xl 3xl:py-32">
        {/* Split delayed from lg (1024) to a page-specific min-[1120px]: at
            1024 the quote column dropped from 837px (still single-column, at
            900px viewport) to 598px (freshly split), because a full-width
            stacked quote is always wider than any fractional share of a
            split row — that gap can be pushed later or narrowed, but the
            single-breakpoint jump inherent to stack-to-split can't be
            eliminated outright. Pairing the later split with the quote's own
            font clamp (below, in testimonial-spotlight.tsx) means the font is
            already at its ceiling well before 1120px, so at least the jump
            isn't compounded by the type ALSO changing size at the same
            breakpoint, which is what produced the 153px page-jump in the
            original F2 measurements.

            Column share is [1fr_3fr], not [1fr_2fr] (B-2): at 2fr the quote
            column measured 662px post-split against 1056px pre-split, a 37%
            narrowing that made the block 150px TALLER right at the width
            meant to give it more room. 3fr puts the post-split column at
            ~745px and cuts the height jump to +75px (one extra wrapped
            line instead of two). Measured the line-wrap threshold directly:
            the quote needs ~900px to hold its pre-split line count, and
            max-w-6xl only leaves that much room if the headline column
            is squeezed under 150px (tried 4fr and 6fr, both plateau at the
            same +75px because both still land under 900px) — not a
            reasonable trade against the eyebrow + heading staying legible.
            The remaining 75px is a container-width ceiling, not a ratio
            problem; the Phase C 3xl shell (max-w-7xl) is what actually buys
            back the room, see the re-measurement note there. */}
        <div className="grid gap-10 min-[1120px]:grid-cols-[1fr_3fr] min-[1120px]:gap-16">
          <div>
            <Eyebrow className="text-[var(--mk-quote)]">{testimonialsLabel}</Eyebrow>
            {/* Same size/treatment as the demo block's lead (below): no
                font-semibold/tracking-tight, leading-snug, sand-900. */}
            <h2 className="mt-5 text-3xl leading-snug text-[var(--p-color-sand-900)] sm:text-4xl">
              {testimonialsHeadline}
            </h2>
          </div>
          <TestimonialSpotlight items={carouselTestimonials} />
        </div>
      </section>
      </div>

      {/* ── Request a Demo ──────────────────────────────────────────────── */}
      {/* Full-width bleed section (sand + grid span the page); the content
          sits in a centered max-w-6xl grid — screenshot left, copy right — so
          the copy keeps a readable measure. (The old calc-padding trick squeezed
          it to one word per line on wide screens.) Split moved from xl (1280)
          to lg (1024): it used to wait for xl only so the single-line Tiempos
          emphasis span always had room, but that's now handled directly by
          the min-[560px]: nowrap gate on the span itself, so the section no
          longer needs to hold the whole layout back for it. Section padding
          is the same clamp() every other section uses now, replacing the old
          py-16 md:py-24 two-step. 3xl:max-w-7xl + 3xl:py-32 match the shell
          and rhythm bump used everywhere else on the page. */}
      <section className="relative overflow-hidden bg-[var(--p-color-sand-50)]">
        <QuillGrid lineColor="var(--mk-grid-line-subtle)" accentColor="var(--mk-grid-accent-subtle)" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-[clamp(3rem,2rem+4vw,7rem)] md:gap-14 lg:grid-cols-2 lg:gap-16 3xl:max-w-7xl 3xl:py-32">
          {/* Frame is deliberately local to this one image, not a system change:
              the capture's own chrome is sand-50, the exact page background, so
              with no edge it dissolved into the section. Arbitrary radius +
              shadow (same idiom as the hero shot above) rather than a radius
              token, to keep it clearly one-off. 6px instead of rounded-xl's
              14px — the corners read as a screen, not a pill.

              mobileSrc (item 11): full frame, no recomposition — this is
              already what the section shows below lg, so the mobile asset is
              just a downscale + byte optimization (720x450, 45KB against the
              desktop source's 1440x900, 140KB), not a different crop like
              the hero's. */}
          <UiScreenshot
            src="/marketing/demo-restrained-quill.png"
            mobileSrc="/marketing/demo-restrained-quill-mobile.png"
            label="UI Screenshot hero"
            className="aspect-[1136/716] w-full rounded-[6px] border border-[var(--p-color-sand-300)] shadow-[0_2px_4px_rgba(53,56,38,0.07),0_18px_38px_rgba(53,56,38,0.20)]"
          />
          {/* max-w-[34ch] gives the copy a real measure instead of filling
              whatever width the column happens to have. Applied unconditionally
              (not just at the lg split) because the stacked band now runs all
              the way to 1023px, wide enough that an uncapped paragraph would
              stretch past a readable line length even before the two-column
              split kicks in. */}
          <div className="flex max-w-[34ch] flex-col justify-center gap-7">
            <p className="text-3xl leading-snug text-[var(--p-color-sand-900)] sm:text-4xl">
              {/* nowrap only kicks in at 560px+: below that the copy column is
                  narrower than these spans (up to 337px against a 257px column
                  at 320), so nowrap forced overflow that the section's
                  overflow-hidden then clipped. Above 560 the column has room and
                  nowrap keeps each phrase, and the Tiempos emphasis span, on one
                  line as intended. */}
              {leadHead}{" "}
              <span className="min-[560px]:whitespace-nowrap">{leadTail}</span>{" "}
              <span className="min-[560px]:whitespace-nowrap font-display italic text-[var(--mk-emphasis)]">{requestDemo.emphasis}</span>
            </p>
            <div>
              <Button size="lg" className="px-6">
                {requestDemo.cta}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
