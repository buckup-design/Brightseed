import type { CSSProperties } from "react";
import Link from "next/link";
import type { Metadata } from "next";

import { BrightseedLogo } from "@/components/brand/BrightseedLogo";
import { Button } from "@/components/ui/button";
import { IndustryIcon } from "../_components/industry-icons";
import { UiScreenshot } from "../_components/ui-screenshot";
import { TestimonialCarousel } from "../_components/testimonial-carousel";
import { SiteFooter } from "../_components/site-footer";
import {
  hero,
  industries,
  industriesLabel,
  testimonialsLabel,
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
  "--mk-industry-name": "#46453f",
  "--mk-industry-body": "var(--p-color-sand-700)",
  "--mk-emphasis": "#8f9d35",
  "--mk-quote": "#272421",
  "--mk-muted": "var(--p-color-sand-700)",
  "--mk-dot-active": "#476549",
  "--mk-dot": "#d3d1c6",
  // Shared footer contract
  "--mk-footer-surface": "#ffffff",
  "--mk-footer-border": "var(--p-color-sand-300)",
  "--mk-text": "var(--p-color-sand-900)",
  "--mk-brand": "var(--p-color-forest-900)",
} as CSSProperties;

/** Client-supplied dashed sage grid (SVG): grid-large = hero/CTA, grid-square = cards. */
function GridOverlay({ src, className = "" }: { src: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat ${className}`}
      style={{ backgroundImage: `url('${src}')` }}
    />
  );
}

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
        <GridOverlay src="/marketing/grid-large.svg" className="-z-0" />
        <div className="relative mx-auto max-w-6xl px-6 pt-16 text-center sm:pt-20">
          <Eyebrow className="text-[var(--mk-eyebrow)]">{hero.eyebrow}</Eyebrow>
          <h1 className="mt-5 font-semibold leading-[0.9] tracking-[-0.03em] text-[var(--mk-wordmark)] text-[clamp(3.5rem,9vw,7rem)]">
            {hero.product}
            <sup className="align-super text-[0.28em] font-normal">{hero.trademark}</sup>
          </h1>
          <div className="mt-8 flex justify-center">
            <Button size="lg" className="px-6">
              {hero.requestDemo}
            </Button>
          </div>
          {/* Cropped interface frame (Figma clips it wide + short); the big
              wordmark above is the hero's, so the shot has none. The PNG carries
              its own rounded corners + stroke, so we DON'T re-clip it (that
              sliced the stroke at the corners) — the shadow is a drop-shadow
              filter that hugs the rounded alpha. The negative bottom margin
              bleeds the shot past the section box so the hero's overflow-hidden
              crops it to a straight bottom edge under the Industries section;
              only the top corners stay rounded. */}
          <div className="mx-auto mt-14 -mb-12 w-full max-w-5xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/marketing/hero-restrained.png"
              alt="Hummingbird interface"
              className="block w-full drop-shadow-[0_22px_40px_rgba(53,56,38,0.35)]"
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
              className="relative flex min-h-[17rem] flex-col overflow-hidden rounded-2xl border border-[var(--p-color-sand-200)] bg-[var(--p-color-sand-50)] p-7"
            >
              <GridOverlay src="/marketing/grid-square.svg" />
              <IndustryIcon
                name={it.icon}
                className={`relative size-14 text-[var(--mk-industry-icon)] ${it.icon === "carrot" ? "-scale-x-100" : ""}`}
              />
              <h3 className="relative mt-auto pt-14 font-mono text-[18px] font-bold text-[var(--mk-industry-name)]">
                {it.name}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-[var(--mk-industry-body)]">{it.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <Eyebrow className="text-[var(--mk-quote)]">{testimonialsLabel}</Eyebrow>
        <div className="mt-8 max-w-3xl">
          <TestimonialCarousel
            items={carouselTestimonials}
            quoteClassName="text-3xl font-medium leading-[1.25] tracking-tight text-[var(--mk-quote)] sm:text-4xl"
            roleClassName="mt-8 text-sm text-[var(--mk-muted)]"
            dotActiveClassName="bg-[var(--mk-dot-active)]"
            dotClassName="bg-[var(--mk-dot)] hover:bg-[var(--mk-dot-active)]/50"
          />
        </div>
      </section>
      </div>

      {/* ── Request a Demo ──────────────────────────────────────────────── */}
      {/* Full-width bleed section (sand + dashed grid span the page); the content
          sits in a centered max-w-6xl grid — screenshot left, copy right — so
          the copy keeps a readable measure. (The old calc-padding trick squeezed
          it to one word per line on wide screens.) Stacks below xl so the
          single-line Tiempos emphasis always has room. */}
      <section className="relative overflow-hidden bg-[var(--p-color-sand-50)]">
        <GridOverlay src="/marketing/grid-large.svg" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:gap-14 md:py-24 xl:grid-cols-2 xl:gap-16">
          <UiScreenshot
            src="/marketing/demo-restrained.png"
            label="UI Screenshot hero"
            className="aspect-[1136/716] w-full rounded-xl"
          />
          <div className="flex flex-col justify-center gap-7">
            <p className="text-3xl leading-snug text-[var(--p-color-sand-900)] sm:text-4xl">
              {leadHead}{" "}
              <span className="whitespace-nowrap">{leadTail}</span>{" "}
              <span className="whitespace-nowrap font-display italic text-[var(--mk-emphasis)]">{requestDemo.emphasis}</span>
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
