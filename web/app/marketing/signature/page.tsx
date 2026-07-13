import { CircleArrowRight } from "lucide-react";

import { BrightseedLogo } from "@/components/brand/BrightseedLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeroPreview } from "../_components/hero-preview";
import { BrandGraphicPanel } from "../_components/brand-graphic";
import { SocialIcon } from "../_components/social-icons";
import { hero, testimonials, footer } from "../content";

/**
 * Marketing landing — SIGNATURE direction, echoing the BrightseedLogin
 * aesthetic (Auth/BrightseedLogin): the lime line-art brand graphic, Geist
 * Mono uppercase eyebrows, mixed-size Tiempos Fine italic display, pill
 * (rounded-full) buttons with an all-caps CTA + CircleArrowRight, and
 * rounded-xl bordered cards. Same content as the other two directions.
 */

/* Geist Mono uppercase eyebrow — the login's label treatment. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-[var(--ds-color-text-brand)]">
      {children}
    </p>
  );
}

export default function SignaturePage() {
  return (
    <div className="min-h-dvh bg-[var(--ds-color-surface-alt)] text-[var(--ds-color-text-default)]">
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-default)]/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <BrightseedLogo variant="lockup" className="h-6" />
          <Button variant="secondary" size="sm" className="rounded-full">
            {hero.login}
          </Button>
        </nav>
      </header>

      {/* ── Hero: two-pane card (copy + brand graphic) ──────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-16">
        <div className="grid overflow-hidden rounded-2xl border border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-default)] shadow-sm md:grid-cols-2">
          {/* Copy pane */}
          <div className="flex flex-col justify-center gap-6 p-8 md:p-14">
            <Eyebrow>{hero.eyebrow}</Eyebrow>
            <h1 className="font-display italic text-[var(--ds-color-text-brand)] leading-[0.95] tracking-[-0.02em] text-[clamp(3rem,7vw,5rem)]">
              {hero.product}
              <sup className="align-super text-[0.3em] not-italic">{hero.trademark}</sup>
            </h1>
            <p className="max-w-md text-base leading-relaxed text-[var(--ds-color-text-subtle)]">
              {hero.lede}
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button size="xl" className="rounded-full uppercase tracking-wide">
                {hero.requestDemo}
              </Button>
              <Button variant="secondary" size="xl" className="rounded-full">
                {hero.login}
              </Button>
            </div>
          </div>

          {/* Brand graphic pane */}
          <BrandGraphicPanel className="min-h-[22rem] md:min-h-full" />
        </div>
      </section>

      {/* ── Product preview ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-6">
          <Eyebrow>The interface</Eyebrow>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-default)] shadow-sm">
          <HeroPreview />
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-10">
          <Eyebrow>In their words</Eyebrow>
          <h2 className="mt-3 font-display italic text-[var(--ds-color-text-default)] text-display-h2">
            Scientific rigor, startup speed
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <figure
              key={t.role}
              className="flex flex-col rounded-xl border border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-default)] p-8 shadow-sm"
            >
              <p className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[var(--ds-color-text-brand)]">
                {t.role}
              </p>
              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-[var(--ds-color-text-default)]">
                {t.quote}
              </blockquote>
            </figure>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-default)]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
            {/* Signup */}
            <div>
              <BrightseedLogo variant="lockup" className="h-6" />
              <div className="mt-6">
                <Eyebrow>{footer.signup.heading}</Eyebrow>
              </div>
              <p className="mt-3 max-w-sm text-sm text-[var(--ds-color-text-subtle)]">
                {footer.signup.body}
              </p>
              <form className="mt-5 flex max-w-md flex-col gap-2.5 sm:flex-row">
                <Input
                  type="email"
                  placeholder={footer.signup.emailPlaceholder}
                  aria-label={footer.signup.emailPlaceholder}
                  className="h-11 rounded-full"
                />
                <Button type="submit" className="shrink-0 gap-2 rounded-full">
                  {footer.signup.submit}
                  <CircleArrowRight className="size-4" />
                </Button>
              </form>
              <div className="mt-6 flex gap-4 text-[var(--ds-color-text-brand)]">
                {footer.social.map((s) => (
                  <a
                    key={s}
                    href="#"
                    aria-label={s}
                    className="transition-opacity hover:opacity-70"
                  >
                    <SocialIcon name={s} className="size-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Menus */}
            {footer.menus.map((m) => (
              <div key={m.heading}>
                <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-[var(--ds-color-text-brand)]">
                  {m.heading}
                </p>
                <ul className="mt-4 space-y-3">
                  {m.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-sm text-[var(--ds-color-text-subtle)] transition-colors hover:text-[var(--ds-color-text-default)]"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Legal */}
          <div className="mt-12 flex flex-col gap-4 border-t border-[var(--ds-color-border-subtle)] pt-6 text-xs text-[var(--ds-color-text-subtle)] sm:flex-row sm:items-center sm:justify-between">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {footer.legal.map((l) => (
                <li key={l}>
                  <a href="#" className="transition-colors hover:text-[var(--ds-color-text-default)]">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
            <span>{footer.copyright}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
