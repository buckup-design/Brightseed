import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import {
  badgeIcons,
  type BadgeIconName,
  BADGE_ICON_STROKE,
  HummingbirdLine,
  HummingbirdFill,
  Cow,
} from "@/components/ui/badge-icons";

/* ─────────────────────────────────────────────────────────────────────────
 * Foundations / Icons — the curated badge-icon set + conventions.
 *
 * This page is the visible contract for icons in Forager badges. It documents
 * the named set, where each glyph comes from (Lucide vs Brightseed custom), the
 * house stroke-width, and how color-tracking works — so the rules live here,
 * not in someone's head. See components/ui/badge-icons.tsx for the source.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Foundations/Icons",
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type BadgeVariant = React.ComponentProps<typeof Badge>["variant"];

/** Documentation descriptor for each entry in the curated set. */
const BADGE_ICON_DOCS: {
  name: BadgeIconName;
  label: string;
  source: string;
  custom?: boolean;
  demoVariant: BadgeVariant;
}[] = [
  { name: "plantSource", label: "Plant Source", source: "Lucide · Leaf", demoVariant: "forest" },
  {
    name: "compound",
    label: "Compound",
    source: "Lucide · Hexagon — placeholder",
    demoVariant: "lavender",
  },
  { name: "animalStudy", label: "Animal study", source: "Custom · Cow", custom: true, demoVariant: "cyan" },
  { name: "rat", label: "Rodent study", source: "Lucide · Rat", demoVariant: "orange" },
  { name: "potency", label: "Potency / score", source: "Lucide · BarChart3", demoVariant: "blue" },
  { name: "safety", label: "Safety (GRAS)", source: "Lucide · ShieldCheck", demoVariant: "forest" },
  { name: "risk", label: "Risk / caution", source: "Lucide · ShieldAlert", demoVariant: "red" },
  { name: "save", label: "Save to project", source: "Lucide · Star", demoVariant: "yellow" },
];

/* ── small presentational helpers ─────────────────────────────────────── */

function SourceTag({ custom }: { custom?: boolean }) {
  return (
    <span
      className="rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide"
      style={{
        background: custom
          ? "var(--color-surface-tag-orchid)"
          : "var(--color-surface-alt)",
        color: custom
          ? "var(--color-text-tag-orchid)"
          : "var(--color-text-subtle)",
      }}
    >
      {custom ? "Custom" : "Lucide"}
    </span>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="font-mono text-sm text-[var(--color-text-default)]">{title}</h3>
      {children}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Gallery — the full curated set, one tile per concept.
 * ───────────────────────────────────────────────────────────────────────── */

export const Gallery: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-3xl">
      <p className="text-sm text-[var(--color-text-subtle)] max-w-prose">
        The curated badge-icon set. Reach for a <strong>named concept</strong> from{" "}
        <code className="font-mono text-xs">badgeIcons</code> — not an arbitrary
        Lucide import and never a hand-drawn SVG. Lucide is the default source;
        Brightseed custom glyphs fill the gaps Lucide can&rsquo;t.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {BADGE_ICON_DOCS.map((d) => {
          const Icon = badgeIcons[d.name];
          return (
            <div
              key={d.name}
              className="flex flex-col items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4 text-center"
            >
              <div className="flex h-9 w-9 items-center justify-center text-[var(--color-text-default)]">
                <Icon className="size-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-[var(--color-text-default)]">
                  {d.label}
                </span>
                <span className="font-mono text-[10px] text-[var(--color-text-subtle)]">
                  {d.name}
                </span>
              </div>
              <SourceTag custom={d.custom} />
            </div>
          );
        })}
      </div>
    </div>
  ),
};

/* ─────────────────────────────────────────────────────────────────────────
 * In badges — proves color-tracking: each icon inherits its badge's text color
 * via currentColor, no per-icon color binding (the React equivalent of the
 * Figma tag/active-color cascade). Toggle the Storybook theme to confirm dark.
 * ───────────────────────────────────────────────────────────────────────── */

export const InBadges: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-3xl">
      <Panel title="Primary — icon inherits the variant's text color">
        <div className="flex flex-wrap items-center gap-2">
          {BADGE_ICON_DOCS.map((d) => {
            const Icon = badgeIcons[d.name];
            return (
              <Badge key={d.name} variant={d.demoVariant} iconLeading={<Icon />}>
                {d.label}
              </Badge>
            );
          })}
        </div>
      </Panel>

      <Panel title="Secondary — tight tag scale (cr=2, 4px padding)">
        <div className="flex flex-wrap items-center gap-1">
          {BADGE_ICON_DOCS.map((d) => {
            const Icon = badgeIcons[d.name];
            return (
              <Badge
                key={d.name}
                variant={d.demoVariant}
                kind="secondary"
                iconLeading={<Icon />}
              >
                {d.label}
              </Badge>
            );
          })}
        </div>
      </Panel>
    </div>
  ),
};

/* ─────────────────────────────────────────────────────────────────────────
 * App-scale custom glyphs — 24px, NOT badge-slot icons. The Hummingbird is
 * Forager's AI assistant mark; Cow has a 24px form for non-badge surfaces.
 * Separate tier from brand illustration (the 300 KB+ hummingbird vectors).
 * ───────────────────────────────────────────────────────────────────────── */

export const AppScaleGlyphs: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-3xl">
      <p className="text-sm text-[var(--color-text-subtle)] max-w-prose">
        Custom glyphs at app scale (24px) for chat headers, nav, and cards — not
        badge slots. Prefer the line variant (honors the line-art house style).
      </p>
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Hummingbird (line)", node: <HummingbirdLine className="size-6" /> },
          { label: "Hummingbird (fill)", node: <HummingbirdFill className="size-6" /> },
          { label: "Cow", node: <Cow className="size-6" /> },
        ].map((g) => (
          <div
            key={g.label}
            className="flex flex-col items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4 text-[var(--color-text-default)]"
          >
            {g.node}
            <span className="text-xs font-medium">{g.label}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

/* ─────────────────────────────────────────────────────────────────────────
 * Conventions — the rules, written down.
 * ───────────────────────────────────────────────────────────────────────── */

export const Conventions: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-prose text-sm text-[var(--color-text-default)]">
      <Panel title="Conventions">
        <ul className="flex list-disc flex-col gap-2 pl-5 text-[var(--color-text-subtle)]">
          <li>
            <strong className="text-[var(--color-text-default)]">Name the concept.</strong>{" "}
            Use <code className="font-mono text-xs">badgeIcons.&lt;concept&gt;</code>. Don&rsquo;t
            import a raw Lucide icon into feature code, and never hand-draw an SVG.
            To add a concept, add a row to the registry (and the matching Figma
            instance-swap target).
          </li>
          <li>
            <strong className="text-[var(--color-text-default)]">Lucide first.</strong>{" "}
            If Lucide has it, use it (wrapped at the house stroke). Reserve custom
            glyphs for what Lucide genuinely can&rsquo;t cover — currently Cow and
            Hummingbird.
          </li>
          <li>
            <strong className="text-[var(--color-text-default)]">
              House stroke = {BADGE_ICON_STROKE}.
            </strong>{" "}
            Lucide draws at stroke 2 for a 24px box, which reads heavy at 10–12px.
            The registry binds {BADGE_ICON_STROKE} so badge-scale line weight stays
            refined.
          </li>
          <li>
            <strong className="text-[var(--color-text-default)]">currentColor only.</strong>{" "}
            Glyphs use stroke/fill=currentColor and inherit the badge variant&rsquo;s
            text color automatically. No per-icon color binding — the CSS-native
            equivalent of the Figma tag/active-color cascade.
          </li>
          <li>
            <strong className="text-[var(--color-text-default)]">Two tiers, kept apart.</strong>{" "}
            Functional UI glyphs (this page) are 10–24px, single-color. Brand
            illustration (the hummingbird/bird vectors in /brand and
            /vector-pipeline) is illustration scale and never goes in a badge slot.
          </li>
        </ul>
      </Panel>
    </div>
  ),
};
