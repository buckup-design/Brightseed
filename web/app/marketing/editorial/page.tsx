import { Lock } from "lucide-react";

import { BrightseedLogo } from "@/components/brand/BrightseedLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HeroPreview } from "../_components/hero-preview";
import { SocialIcon } from "../_components/social-icons";
import { hero, testimonials, footer } from "../content";

/**
 * Marketing landing — EDITORIAL direction (brand-forward).
 *
 * Tiempos Fine italic display, deep-forest + lime, airy whitespace, a soft
 * lime radial glow behind a floating product preview. The "refined biotech"
 * look, closest to the Figma draft. Same content as /marketing/product.
 */
export default function EditorialPage() {
  return (
    <div className="min-h-dvh bg-[var(--ds-color-surface-default)] text-[var(--ds-color-text-default)]">
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-[var(--ds-color-border-subtle)]/60 bg-[var(--ds-color-surface-default)]/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <BrightseedLogo variant="lockup" className="h-6" />
          <Button variant="secondary" size="sm">
            {hero.primaryCta}
          </Button>
        </nav>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Soft lime radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[42rem]"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 20%, var(--p-color-lime-100) 0%, var(--p-color-lime-50) 35%, var(--ds-color-surface-default) 78%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-10 text-center sm:pt-28">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--ds-color-text-brand)]">
            {hero.eyebrow}
          </p>
          <h1 className="mt-6 font-display italic text-[var(--ds-color-text-brand)] leading-[0.95] tracking-[-0.02em] text-[clamp(3.5rem,11vw,8.5rem)]">
            {hero.product}
            <sup className="align-super text-[0.3em] tracking-normal not-italic">
              {hero.trademark}
            </sup>
          </h1>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg">{hero.primaryCta}</Button>
            <Button variant="outline" size="lg">
              <Lock />
              {hero.secondaryCta}
            </Button>
          </div>

          {/* Floating product preview */}
          <div className="mx-auto mt-16 max-w-3xl rounded-[1.75rem] border border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-default)] shadow-[0_40px_80px_-32px_rgba(48,85,54,0.35)]">
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--ds-color-text-brand)]">
            In their words
          </p>
          <h2 className="mt-4 font-display italic text-[var(--ds-color-text-default)] text-display-h2">
            Built for real scientific decisions
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name + t.role}
              className="flex flex-col rounded-2xl border border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-default)] p-7 shadow-sm"
            >
              <blockquote className="flex-1 font-display text-lg italic leading-relaxed text-[var(--ds-color-text-default)]">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback>{initials(t.name)}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="text-sm font-semibold text-[var(--ds-color-text-default)]">
                    {t.name}
                  </div>
                  <div className="text-xs text-[var(--ds-color-text-subtle)]">
                    {t.role}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-brand-subtle)]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Signup */}
            <div>
              <BrightseedLogo variant="lockup" className="h-6" />
              <h3 className="mt-8 font-display italic text-[var(--ds-color-text-default)] text-display-h3">
                {footer.signup.heading}
              </h3>
              <p className="mt-3 max-w-sm text-sm text-[var(--ds-color-text-subtle)]">
                {footer.signup.body}
              </p>
              <form className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  placeholder={footer.signup.emailPlaceholder}
                  aria-label={footer.signup.emailPlaceholder}
                />
                <Button type="submit" className="shrink-0">
                  {footer.signup.submit}
                </Button>
              </form>
              <div className="mt-8 flex gap-4 text-[var(--ds-color-text-brand)]">
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
            <div className="grid grid-cols-2 gap-8 md:justify-items-end">
              {footer.menus.map((m) => (
                <div key={m.heading}>
                  <div className="text-sm font-semibold text-[var(--ds-color-text-brand)]">
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
          </div>

          {/* Legal */}
          <div className="mt-14 flex flex-col gap-4 border-t border-[var(--ds-color-border-subtle)] pt-6 text-xs text-[var(--ds-color-text-subtle)] sm:flex-row sm:items-center sm:justify-between">
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

function initials(name: string) {
  if (name === "Anonymous") return "A";
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
