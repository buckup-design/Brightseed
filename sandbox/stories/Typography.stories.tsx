import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

/* ─────────────────────────────────────────────────────────────────────────
 * Typography — two families, two roles.
 *
 *   Geist           Product UI scale. 309 Figma text styles, all wired to
 *                   text-{size}/leading-{*}/{weight} naming. Tailwind utility
 *                   classes (text-xs, text-sm, …) compose against --font-sans.
 *
 *   Tiempos Fine    Marketing display headlines (H1 / H2 / H3). Three Figma
 *                   text styles named display/h1, display/h2, display/h3 —
 *                   all set to Tiempos Fine RegularItalic (May 8, 2026 PM
 *                   decision, superseding the earlier same-day call to use
 *                   Tiempos Text Medium). Italic is intrinsic to the face,
 *                   not an applied modifier. Differentiation across the scale
 *                   comes from size and tracking, not weight or style.
 *
 *   Tiempos Text    Body emphasis (Medium / Semibold / Bold). Loaded but not
 *                   currently used in the display scale; available for inline
 *                   emphasis or future body patterns.
 *
 * All Tiempos WOFF2 files are loaded via @font-face in tokens/typography.css
 * from sandbox/public/fonts/tiempos/, served at /fonts/tiempos/* in both
 * Next.js (public/) and Storybook (.storybook/main.ts staticDirs). Source
 * .otf files (gitignored) live in /Brightseed brand assets from 2022/.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Foundations/Typography",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const DisplayScale: Story = {
  render: () => (
    <div className="flex flex-col gap-12 max-w-4xl">
      <section className="flex flex-col gap-3">
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
          .text-display-h1 — 56px / 60lh / Tiempos Fine RegularItalic
        </span>
        <h1 className="text-display-h1 text-[var(--ds-color-text-default)]">
          Discover the molecules that make plants powerful.
        </h1>
      </section>

      <section className="flex flex-col gap-3">
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
          .text-display-h2 — 40px / 44lh / Tiempos Fine RegularItalic
        </span>
        <h2 className="text-display-h2 text-[var(--ds-color-text-default)]">
          A platform for finding what nature already knows.
        </h2>
      </section>

      <section className="flex flex-col gap-3">
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
          .text-display-h3 — 28px / 34lh / Tiempos Fine RegularItalic
        </span>
        <h3 className="text-display-h3 text-[var(--ds-color-text-default)]">
          Forager screens 50,000 compounds against your target overnight.
        </h3>
      </section>
    </div>
  ),
};

export const DisplayVsBody: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <article className="max-w-2xl flex flex-col gap-6">
      <h1 className="text-display-h1 text-[var(--ds-color-text-default)]">
        From plants to compounds.
      </h1>
      <p className="text-base text-[var(--ds-color-text-subtle)] leading-relaxed">
        This block uses the body Geist scale (text-base / leading-relaxed) — the
        contrast with the Tiempos H1 above is the marketing rhythm we&apos;re
        designing for. Display type carries weight; body type carries detail.
      </p>
      <h2 className="text-display-h2 text-[var(--ds-color-text-default)]">
        How Forager works.
      </h2>
      <p className="text-base text-[var(--ds-color-text-subtle)] leading-relaxed">
        Geist again — and again the contrast does the work. Setting display in
        a serif and body in a sans is a marketing pattern with deep roots
        (think Linear, Stripe, Notion). For Brightseed it doubles as a brand
        signal: nature meets technology.
      </p>
      <h3 className="text-display-h3 text-[var(--ds-color-text-default)]">
        What we screen for.
      </h3>
      <p className="text-base text-[var(--ds-color-text-subtle)] leading-relaxed">
        Body. Calm. Readable. The display family is reserved — only at level-1,
        2, and 3 marketing entry points. Anything below H3 stays in Geist.
      </p>
    </article>
  ),
};
