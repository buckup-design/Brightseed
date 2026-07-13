import type { CSSProperties } from "react";

import { BrightseedLogo } from "@/components/brand/BrightseedLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeroPreview } from "../_components/hero-preview";
import { SocialIcon } from "../_components/social-icons";
import { hero, testimonials, footer } from "../content";

/**
 * Marketing landing — RESTRAINED direction (clean SaaS).
 *
 * Geist-forward, tighter grid, lighter neutral surfaces, a two-column hero
 * with the product framed in browser chrome. Same content as /marketing/minimal.
 *
 * CTAs: forest green, 8px radius (Figma concepts board 2019:1485). Colors are
 * brand-exploration values, applied by overriding the primary-button tokens at
 * the page root so every CTA on the page adopts them.
 */
const CTA_THEME = {
  "--c-button-action-primary": "#3e6646",
  "--c-button-action-primary-hover": "color-mix(in srgb, #3e6646 90%, #000)",
  "--c-button-action-primary-active": "color-mix(in srgb, #3e6646 82%, #000)",
  "--c-button-text-on-action-primary": "#ffffff",
  "--c-button-text-on-action-primary-hover": "#ffffff",
  "--c-button-text-on-action-primary-active": "#ffffff",
} as CSSProperties;

export default function RestrainedPage() {
  return (
    <div
      style={CTA_THEME}
      className="min-h-dvh bg-[var(--ds-color-surface-default)] text-[var(--ds-color-text-default)]"
    >
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-default)]/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <BrightseedLogo variant="lockup" className="h-6" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              {hero.login}
            </Button>
            <Button size="sm">{hero.requestDemo}</Button>
          </div>
        </nav>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--ds-color-surface-alt)]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
          {/* Copy */}
          <div>
            <span className="inline-flex items-center rounded-full border border-[var(--ds-color-border-default)] bg-[var(--ds-color-surface-default)] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[var(--ds-color-text-brand)]">
              {hero.eyebrow}
            </span>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-[var(--ds-color-text-default)] sm:text-6xl">
              {hero.product}
              <sup className="align-super text-[0.32em] font-normal">{hero.trademark}</sup>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--ds-color-text-subtle)]">
              {hero.lede}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg">{hero.requestDemo}</Button>
            </div>
          </div>

          {/* Product in browser chrome */}
          <div className="overflow-hidden rounded-xl border border-[var(--ds-color-border-default)] bg-[var(--ds-color-surface-default)] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-2 border-b border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-alt)] px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-[var(--ds-color-border-default)]" />
              <span className="size-2.5 rounded-full bg-[var(--ds-color-border-default)]" />
              <span className="size-2.5 rounded-full bg-[var(--ds-color-border-default)]" />
              <span className="ml-3 flex-1 truncate rounded-md bg-[var(--ds-color-surface-default)] px-3 py-1 text-center text-xs text-[var(--ds-color-text-subtle)]">
                https://www.brightseed.ai
              </span>
            </div>
            <HeroPreview showLede={false} />
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--ds-color-text-default)]">
          Scientific rigor, startup speed
        </h2>
        <p className="mt-3 max-w-xl text-base text-[var(--ds-color-text-subtle)]">
          Why R&D and product teams reach for Hummingbird.
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {testimonials.map((t) => (
            <figure
              key={t.role}
              className="flex flex-col rounded-xl border border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-default)] p-6"
            >
              <span
                aria-hidden
                className="h-1 w-10 rounded-full bg-[var(--ds-color-action-primary)]"
              />
              <blockquote className="mt-5 flex-1 text-base leading-relaxed text-[var(--ds-color-text-default)]">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-[var(--ds-color-border-subtle)] pt-5 text-sm text-[var(--ds-color-text-subtle)]">
                {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-alt)]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
            {/* Signup */}
            <div>
              <BrightseedLogo variant="lockup" className="h-6" />
              <h3 className="mt-6 text-xl font-semibold text-[var(--ds-color-text-default)]">
                {footer.signup.heading}
              </h3>
              <p className="mt-2 max-w-sm text-sm text-[var(--ds-color-text-subtle)]">
                {footer.signup.body}
              </p>
              <form className="mt-5 flex max-w-md flex-col gap-2.5 sm:flex-row">
                <Input
                  type="email"
                  placeholder={footer.signup.emailPlaceholder}
                  aria-label={footer.signup.emailPlaceholder}
                />
                <Button type="submit" className="shrink-0">
                  {footer.signup.submit}
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
                <div className="text-sm font-semibold text-[var(--ds-color-text-default)]">
                  {m.heading}
                </div>
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
