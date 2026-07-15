import "@fontsource-variable/instrument-sans";

import type { CSSProperties } from "react";
import Link from "next/link";
import type { Metadata } from "next";

import { BrightseedLogo } from "@/components/brand/BrightseedLogo";
import { Button } from "@/components/ui/button";
import { IndustryIcon } from "../_components/industry-icons";
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

export const metadata: Metadata = { title: "Hummingbird — Minimal" };

/**
 * Marketing landing — MINIMAL concept (Figma "Concept: minimal", 2035:2595).
 *
 * Cool greys (the `neutral` scale) + mint. Instrument Sans throughout — no
 * serif, no mono, no grid texture. Airy: a mint page-gradient and a soft radial
 * glow. The hero + demo blocks use Becky's composited interface screenshot
 * (`hero-minimal.png` — browser chrome + concentric dot graphic baked in). Same
 * five sections as the other concepts.
 */
const INSTRUMENT = "'Instrument Sans Variable', system-ui, sans-serif";
const SKIN = {
  // Instrument Sans for the whole concept. The app's globals.css uses Tailwind
  // `@theme inline`, so the `font-sans` utility inlines `var(--font-geist-sans)`
  // — overriding `--font-sans` alone has no effect. Override the geist var (what
  // `.font-sans` actually reads) so every sans element in the subtree switches.
  "--font-geist-sans": INSTRUMENT,
  "--font-sans": INSTRUMENT,
  fontFamily: INSTRUMENT,
  // Concept CTA — mint, near-black text (mock #89d18f / #231f20), rounded-rect.
  "--c-button-action-primary": "#89d18f",
  "--c-button-action-primary-hover": "#79c37f",
  "--c-button-action-primary-active": "#6bb571",
  "--c-button-text-on-action-primary": "#231f20",
  "--c-button-text-on-action-primary-hover": "#231f20",
  "--c-button-text-on-action-primary-active": "#231f20",
  // Concept palette
  "--mk-eyebrow": "#272421",
  "--mk-wordmark": "#89d18f",
  "--mk-label": "#545454",
  "--mk-accent": "#6aa16e",
  "--mk-emphasis": "#8f9d35",
  "--mk-industry-icon": "#89d18f",
  "--mk-industry-name": "var(--p-color-neutral-900)",
  "--mk-industry-body": "var(--p-color-neutral-600)",
  "--mk-quote": "var(--p-color-neutral-900)",
  "--mk-muted": "var(--p-color-neutral-600)",
  "--mk-dot-active": "#6aa16e",
  "--mk-dot": "var(--p-color-neutral-300)",
  // Shared footer contract
  "--mk-footer-surface": "#ffffff",
  "--mk-footer-border": "var(--p-color-neutral-200)",
  "--mk-text": "var(--p-color-neutral-900)",
  "--mk-brand": "#5fa568",
} as CSSProperties;

const PAGE_GRADIENT = "linear-gradient(180deg, #e9f1e2 0%, #ffffff 60%)";

export default function MinimalPage() {
  return (
    <div
      style={SKIN}
      className="mk-page min-h-dvh font-sans text-[var(--p-color-neutral-900)]"
    >
      <div style={{ background: PAGE_GRADIENT }}>
        {/* ── Nav ───────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-20 border-b border-[var(--p-color-neutral-200)]/70 bg-white/70 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <BrightseedLogo variant="lockup" className="h-6 text-[var(--p-color-neutral-900)]" />
            <Button asChild variant="secondary" size="sm" className="rounded-full px-8">
              <Link href="/marketing/minimal/login">{hero.login}</Link>
            </Button>
          </nav>
        </header>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* soft mint radial glow (mock Ellipse 7) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[42rem]"
            style={{
              background:
                "radial-gradient(58% 46% at 50% 24%, rgba(137,209,143,0.26) 0%, rgba(192,223,122,0.12) 42%, rgba(255,255,255,0) 72%)",
            }}
          />
          <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-10 text-center sm:pt-20">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--mk-eyebrow)]">
              {hero.eyebrow}
            </p>
            <h1 className="mt-5 font-bold leading-[0.9] tracking-[-0.03em] text-[var(--mk-wordmark)] text-[clamp(3.5rem,9vw,7rem)]">
              {hero.product}
              <sup className="align-super text-[0.28em] font-medium">{hero.trademark}</sup>
            </h1>
            <div className="mt-8 flex justify-center">
              <Button size="lg" className="rounded-xl px-6">
                {hero.requestDemo}
              </Button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/marketing/hero-minimal.png"
              alt="Hummingbird interface"
              className="mx-auto mt-10 block w-full max-w-4xl"
            />
          </div>
        </section>

        {/* ── Industries ────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-center text-xs font-medium uppercase tracking-[0.24em] text-[var(--mk-label)]">
            {industriesLabel}
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((it) => (
              <div
                key={it.key}
                className="flex min-h-[17rem] flex-col rounded-2xl border border-[var(--p-color-neutral-200)] p-7"
                style={{ background: "linear-gradient(160deg, #eef5e8 0%, #ffffff 100%)" }}
              >
                {/* Fixed-height icon band: centers the icon horizontally + vertically
                    in the space above the heading, and keeps every card's heading
                    at the same height regardless of body length. */}
                <div className="flex h-28 items-center justify-center">
                  <IndustryIcon name={it.icon} className="size-14 text-[var(--mk-industry-icon)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--mk-industry-name)]">{it.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--mk-industry-body)]">{it.blurb}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className="bg-[var(--p-color-neutral-50)]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--mk-accent)]">
            {testimonialsLabel}
          </p>
          <div className="mt-8 max-w-3xl">
            <TestimonialCarousel
              items={carouselTestimonials}
              quoteClassName="text-3xl font-semibold leading-[1.25] tracking-tight text-[var(--mk-quote)] sm:text-4xl"
              roleClassName="mt-8 text-sm text-[var(--mk-muted)]"
              dotActiveClassName="bg-[var(--mk-dot-active)]"
              dotClassName="bg-[var(--mk-dot)] hover:bg-[var(--mk-dot-active)]/50"
            />
          </div>
        </div>
      </section>

      {/* ── Request a Demo ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div
          className="relative overflow-hidden rounded-3xl md:min-h-[22rem]"
          style={{ background: "#eaf2e3" }}
        >
          {/* Desktop: interface enlarged, bleeding off the left + bottom edges. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/marketing/hero-minimal.png"
            alt="Hummingbird interface"
            className="pointer-events-none absolute left-0 top-[8%] hidden w-[58%] max-w-none -translate-x-[13%] md:block"
          />
          {/* Mobile: stacked, fully visible. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/marketing/hero-minimal.png"
            alt="Hummingbird interface"
            className="block w-full px-6 pt-8 md:hidden"
          />
          <div className="relative z-10 flex flex-col justify-center gap-7 p-8 md:ml-[55%] md:min-h-[22rem] md:py-14 md:pr-14 md:pl-4">
            <p className="text-2xl leading-snug text-[var(--p-color-neutral-900)] sm:text-3xl">
              {requestDemo.lead}{" "}
              {/* Tiempos Fine italic flourish (font-display), set large + green
                  per the Minimal mock — the one serif accent in an otherwise
                  Instrument-Sans concept. */}
              <span className="font-display text-[48px] italic leading-none text-[var(--mk-emphasis)]">
                {requestDemo.emphasis}
              </span>
            </p>
            <div>
              <Button size="lg" className="rounded-xl px-6">
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
