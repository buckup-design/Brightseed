import Link from "next/link";

import { BrightseedLogo } from "@/components/brand/BrightseedLogo";
import { hero } from "./content";

/**
 * Marketing review index — entry point for the client to compare the three
 * re-skin directions of the same content (hero / testimonials / footer).
 */
const directions = [
  {
    href: "/marketing/minimal",
    name: "Minimal",
    blurb:
      "Mostly white with a subtle mint gradient. All-Geist type — no serif — and mint-green pill CTAs. The most understated of the three.",
  },
  {
    href: "/marketing/restrained",
    name: "Restrained",
    blurb:
      "Restrained cream backgrounds with forest-green CTAs and occasional lime accents. Tiempos Fine italic headings over Geist body, a two-column hero framed in browser chrome.",
  },
  {
    href: "/marketing/bold",
    name: "Bold",
    blurb:
      "Vivid green with the line-art hummingbird, botanicals and blueprint-grid textures. Lime-green pill CTAs, Geist Mono eyebrows and mixed-size Tiempos italic.",
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
              <div className="text-2xl font-semibold text-[var(--ds-color-text-default)]">
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
