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
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <BrightseedLogo variant="lockup" className="h-6 text-[var(--p-color-forest-900)]" />
          <Button asChild variant="secondary" size="sm" className="rounded-full px-8">
            <Link href="/marketing/restrained/login">{hero.login}</Link>
          </Button>
        </nav>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* inset-0 (no fixed height) so the grid fills the section to its bottom
            edge, where the Industries section crops the hero shot. */}
        <QuillGrid className="-z-0" />
        <div className="relative mx-auto max-w-6xl px-6 pt-16 text-center sm:pt-20">
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
              20px rounding + overflow-hidden + a sand-300 hairline, with a
              box-shadow replacing the old drop-shadow filter (which only worked by
              hugging the baked alpha). The negative bottom margin still bleeds the
              shot past the section box so the hero's overflow-hidden crops it to a
              straight bottom edge under the Industries section; only the top corners
              stay rounded. */}
          <div className="mx-auto mt-14 -mb-12 w-full max-w-5xl overflow-hidden rounded-t-[20px] border border-[var(--p-color-sand-300)] shadow-[0_22px_40px_rgba(53,56,38,0.35)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/marketing/hero-restrained-quill.png"
              alt="Hummingbird interface"
              className="block w-full"
            />
          </div>
        </div>
      </section>

      {/* Industries + Testimonials share one white full-width band (the rest of
          the page — hero, demo, footer — stays sand-50). */}
      <div className="bg-white">
      {/* ── Industries ──────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <Eyebrow className="text-center text-[var(--mk-label)]">{industriesLabel}</Eyebrow>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
      {/* pt-16 is this section's own gap above the cards, on top of Industries'
          py-20 bottom padding — widening it here rather than touching
          Industries keeps the hero-to-cards spacing untouched. */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
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
          it to one word per line on wide screens.) Stacks below xl so the
          single-line Tiempos emphasis always has room. */}
      <section className="relative overflow-hidden bg-[var(--p-color-sand-50)]">
        <QuillGrid lineColor="var(--mk-grid-line-subtle)" accentColor="var(--mk-grid-accent-subtle)" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:gap-14 md:py-24 xl:grid-cols-2 xl:gap-16">
          {/* Frame is deliberately local to this one image, not a system change:
              the capture's own chrome is sand-50, the exact page background, so
              with no edge it dissolved into the section. Arbitrary radius +
              shadow (same idiom as the hero shot above) rather than a radius
              token, to keep it clearly one-off. 6px instead of rounded-xl's
              14px — the corners read as a screen, not a pill. */}
          <UiScreenshot
            src="/marketing/demo-restrained-quill.png"
            label="UI Screenshot hero"
            className="aspect-[1136/716] w-full rounded-[6px] border border-[var(--p-color-sand-300)] shadow-[0_2px_4px_rgba(53,56,38,0.07),0_18px_38px_rgba(53,56,38,0.20)]"
          />
          <div className="flex flex-col justify-center gap-7">
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
