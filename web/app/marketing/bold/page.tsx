import type { CSSProperties } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { CircleArrowRight } from "lucide-react";

import { BrightseedLogo } from "@/components/brand/BrightseedLogo";
import { Button } from "@/components/ui/button";
import { GridTexture } from "../_components/grid-texture";
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

export const metadata: Metadata = { title: "Hummingbird — Bold" };

/**
 * Marketing landing — BOLD concept (Figma "Concept: bold", 2036:4130).
 *
 * Sand neutrals, vivid green gradients, a sage blueprint grid, and lime pill
 * CTAs. Geist for the wordmark/body, Geist Mono for eyebrow labels, Tiempos
 * Fine italic for industry names + the demo emphasis. Same sections as the
 * other two concepts — Hero · Industries · Testimonials · Request a Demo ·
 * Footer — reskinned.
 *
 * All concept-specific colors live in the one SKIN object below (the --mk and
 * --c-button vars) as brand-exploration values mirroring the mock; the markup
 * only references the vars, so the skin is greppable in one place.
 */
const SKIN = {
  // Concept CTA — lime pill, forest text (mock #d2e589 / #4f7046).
  "--c-button-action-primary": "#d2e589",
  "--c-button-action-primary-hover": "#c8de74",
  "--c-button-action-primary-active": "#bdd45d",
  "--c-button-text-on-action-primary": "#3f6947",
  "--c-button-text-on-action-primary-hover": "#3f6947",
  "--c-button-text-on-action-primary-active": "#3f6947",
  // Concept palette
  "--mk-eyebrow": "#4b9e68",
  "--mk-wordmark": "var(--p-color-forest-900)",
  "--mk-label": "#545454",
  "--mk-industry-icon": "#4ea169",
  "--mk-industry-name": "var(--p-color-forest-900)",
  "--mk-industry-body": "var(--p-color-sand-800)",
  "--mk-quote": "#272421",
  "--mk-muted": "var(--p-color-sand-700)",
  "--mk-dot-active": "#52a359",
  "--mk-dot": "#d9d9d9",
  // Shared footer contract
  "--mk-footer-surface": "#ffffff",
  "--mk-footer-border": "var(--p-color-sand-200)",
  "--mk-text": "var(--p-color-sand-900)",
  "--mk-brand": "var(--p-color-forest-900)",
} as CSSProperties;

// Signature Bold gradient (mock Ellipse 435): dark plum → teal → lime.
const DEMO_GRADIENT =
  "linear-gradient(118deg, #301922 0%, #124e51 46%, #4f8a45 74%, #b8d258 100%)";

function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-xs font-medium uppercase tracking-[0.2em] ${className}`}>{children}</p>
  );
}

export default function BoldPage() {
  return (
    <div style={SKIN} className="min-h-dvh bg-white text-[var(--p-color-sand-900)]">
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-[var(--p-color-sand-200)] bg-white/85 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <BrightseedLogo variant="lockup" className="h-6 text-[var(--p-color-forest-900)]" />
          <Button asChild variant="secondary" size="sm" className="rounded-full px-8">
            <Link href="/marketing/bold/login">{hero.login}</Link>
          </Button>
        </nav>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* soft green radial glow (mock Ellipse 7) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[46rem]"
          style={{
            background:
              "radial-gradient(70% 60% at 50% 22%, rgba(137,209,143,0.30) 0%, rgba(192,223,122,0.16) 45%, rgba(255,255,255,0) 74%)",
          }}
        />
        <GridTexture className="-z-0 h-[46rem]" color="rgba(167,188,135,0.35)" />
        <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-14 text-center sm:pt-20">
          <Eyebrow className="text-[var(--mk-eyebrow)]">{hero.eyebrow}</Eyebrow>
          <h1 className="mt-5 font-semibold leading-[0.9] tracking-[-0.03em] text-[var(--mk-wordmark)] text-[clamp(3.5rem,9vw,7rem)]">
            {hero.product}
            <sup className="align-super text-[0.28em] font-normal">{hero.trademark}</sup>
          </h1>
          <div className="mt-8 flex justify-center">
            <Button size="lg" className="gap-2 rounded-full px-6">
              {hero.requestDemo}
              <CircleArrowRight className="size-5" />
            </Button>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/marketing/hero-bold.png"
            alt="Hummingbird interface"
            className="mx-auto mt-14 block w-full max-w-5xl rounded-2xl border border-[var(--p-color-sand-200)] shadow-[0_40px_80px_-40px_rgba(48,85,54,0.4)]"
          />
        </div>
      </section>

      {/* ── Industries ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Eyebrow className="text-center text-[var(--mk-label)]">{industriesLabel}</Eyebrow>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((it) => (
            <div
              key={it.key}
              className="relative flex min-h-[19rem] flex-col justify-between overflow-hidden rounded-2xl p-7"
              style={{ background: "linear-gradient(150deg, #eaf6e3 0%, #d5ecd1 58%, #c2e3be 100%)" }}
            >
              <GridTexture color="rgba(120,160,110,0.28)" />
              <span className="relative grid size-14 place-items-center rounded-full bg-[var(--p-color-lime-100)]">
                <IndustryIcon name={it.icon} className="size-7 text-[var(--mk-industry-icon)]" />
              </span>
              <div className="relative">
                <h3 className="font-display text-[1.55rem] italic leading-tight text-[var(--mk-industry-name)]">
                  {it.name.replace(" and ", " & ")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--mk-industry-body)]">{it.blurb}</p>
              </div>
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

      {/* ── Request a Demo ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div
          className="relative grid overflow-hidden rounded-3xl md:grid-cols-2"
          style={{ background: DEMO_GRADIENT }}
        >
          <GridTexture color="rgba(255,255,255,0.08)" />
          <UiScreenshot
            src="/marketing/demo-bold.jpg"
            label="UI Screenshot hero"
            className="min-h-[16rem] md:min-h-full"
          />
          <div className="relative flex flex-col justify-center gap-7 p-10 md:p-14">
            <p className="text-2xl leading-snug text-white sm:text-3xl">
              {requestDemo.lead}{" "}
              <span className="font-display italic">{requestDemo.emphasis}</span>
            </p>
            <div>
              <Button size="lg" className="gap-2 rounded-full px-6">
                {requestDemo.cta}
                <CircleArrowRight className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
