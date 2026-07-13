import Link from "next/link";

import { BrightseedLogo } from "@/components/brand/BrightseedLogo";
import { hero } from "./content";

/**
 * Marketing review index — entry point for the client to compare the two
 * re-skin directions of the same content (hero / testimonials / footer).
 */
const directions = [
  {
    href: "/marketing/minimal",
    name: "Minimal",
    tag: "Brand-forward",
    blurb:
      "Tiempos Fine italic display, deep-forest + lime, airy whitespace, a floating product preview. The refined biotech look.",
  },
  {
    href: "/marketing/product",
    name: "Product",
    tag: "Clean SaaS",
    blurb:
      "Geist-forward, tighter grid, lighter surfaces, lime accents, a two-column hero framed in browser chrome.",
  },
  {
    href: "/marketing/signature",
    name: "Signature",
    tag: "Brand graphic",
    blurb:
      "The login aesthetic: lime line-art brand graphic, Geist Mono eyebrows, mixed-size Tiempos italic, pill buttons.",
  },
];

export default function MarketingIndex() {
  return (
    <main className="min-h-dvh bg-[var(--ds-color-surface-alt)] text-[var(--ds-color-text-default)]">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <BrightseedLogo variant="lockup" className="h-6" />
        <h1 className="mt-10 font-display italic text-[var(--ds-color-text-default)] text-display-h2">
          {hero.product}
          <sup className="align-super text-[0.3em] not-italic">{hero.trademark}</sup> — landing
          directions
        </h1>
        <p className="mt-3 max-w-xl text-sm text-[var(--ds-color-text-subtle)]">
          Three re-skins of the same draft content for review. Open each to compare.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {directions.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="group rounded-2xl border border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-default)] p-7 transition-shadow hover:shadow-md"
            >
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--ds-color-text-brand)]">
                {d.tag}
              </div>
              <div className="mt-2 text-2xl font-semibold text-[var(--ds-color-text-default)]">
                {d.name}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ds-color-text-subtle)]">
                {d.blurb}
              </p>
              <span className="mt-5 inline-block text-sm font-medium text-[var(--ds-color-text-brand)] group-hover:underline">
                View direction →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
