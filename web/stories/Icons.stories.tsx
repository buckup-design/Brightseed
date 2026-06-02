import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import * as LucideIcons from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  BADGE_ICON_STROKE,
  Cow,
  CowBadge,
  Compound,
  CompoundBadge,
  HummingbirdLine,
  HummingbirdFill,
  PlantBadge,
  RatBadge,
} from "@/components/ui/badge-icons";

/* ─────────────────────────────────────────────────────────────────────────
 * Foundations / Icons, the full icon inventory.
 *
 * Exploratory reference, not a curated map. It records EVERY glyph available to
 * Hummingbird: the complete Lucide set (which is also the icon set the shadcn /
 * shadcndesign Pro Pack renders with) plus Brightseed custom additions. Each
 * glyph is labeled by what it IS, no purposeful concept names, no assigned uses.
 * Meaning gets assigned to specific surfaces later, in feature code.
 *
 * Two tiers, kept apart (see CLAUDE.md, the icon discussion):
 *   - Functional UI glyphs (this page): single-color via currentColor, line-art.
 *   - Brand illustration (NOT here): the 300 KB+ hummingbird/bird vectors in
 *     /brand and /vector-pipeline, illustration scale, never a badge slot.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Foundations/Icons",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Build the complete Lucide list once, at module scope ─────────────────
 * lucide-react exports every icon as a PascalCase named export, plus a few
 * non-icon utilities and `XIcon` aliases that point at the same component.
 * We dedupe by component identity (keeping the shorter name) so each glyph
 * appears once, and drop the known non-icon exports. */
const NON_ICON_EXPORTS = new Set([
  "createLucideIcon",
  "Icon",
  "icons",
  "LucideProvider",
  "default",
]);

type IconEntry = {
  name: string;
  Comp: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  /** "badge" icons are designed for 14px badge slots, render at size-3.5 in the inventory. */
  scale?: "app" | "badge";
};

const LUCIDE_ICONS: IconEntry[] = (() => {
  const byRef = new Map<unknown, string>();
  for (const [name, value] of Object.entries(LucideIcons as Record<string, unknown>)) {
    if (!/^[A-Z]/.test(name)) continue; // utilities are camelCase
    if (NON_ICON_EXPORTS.has(name)) continue;
    const isComponent =
      typeof value === "function" ||
      (typeof value === "object" && value !== null && "$$typeof" in (value as object));
    if (!isComponent) continue;
    const existing = byRef.get(value);
    if (!existing || name.length < existing.length) byRef.set(value, name);
  }
  return [...byRef.entries()]
    .map(([Comp, name]) => ({ name, Comp: Comp as IconEntry["Comp"] }))
    .sort((a, b) => a.name.localeCompare(b.name));
})();

/* ── Brightseed custom additions, Lucide has no equivalent ───────────────── */
const CUSTOM_ICONS: IconEntry[] = [
  { name: "Cow", Comp: Cow, scale: "app" },
  { name: "CowBadge", Comp: CowBadge, scale: "badge" },
  { name: "Compound", Comp: Compound, scale: "app" },
  { name: "CompoundBadge", Comp: CompoundBadge, scale: "badge" },
  { name: "HummingbirdLine", Comp: HummingbirdLine, scale: "app" },
  { name: "HummingbirdFill", Comp: HummingbirdFill, scale: "app" },
  { name: "PlantBadge", Comp: PlantBadge, scale: "badge" },
  { name: "RatBadge", Comp: RatBadge, scale: "badge" },
];

/* ── presentational helpers ───────────────────────────────────────────────── */

function SourceTag({ custom, badge }: { custom?: boolean; badge?: boolean }) {
  return (
    <div className="flex flex-wrap justify-center gap-1">
      <span
        className="rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide"
        style={{
          background: custom ? "var(--ds-color-surface-tag-orchid)" : "var(--ds-color-surface-alt)",
          color: custom ? "var(--ds-color-text-tag-orchid)" : "var(--ds-color-text-subtle)",
        }}
      >
        {custom ? "Custom" : "Lucide"}
      </span>
      {badge && (
        <span
          className="rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide"
          style={{
            background: "var(--ds-color-surface-tag-cyan)",
            color: "var(--ds-color-text-tag-cyan)",
          }}
        >
          Badge
        </span>
      )}
    </div>
  );
}

function IconTile({ entry, custom }: { entry: IconEntry; custom?: boolean }) {
  const { name, Comp, scale } = entry;
  const isBadge = scale === "badge";
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-default)] p-3 text-center">
      <div className="flex h-9 w-9 items-center justify-center text-[var(--ds-color-text-default)]">
        {/* badge-scale icons render at their intended 14px; app-scale at 24px */}
        <Comp className={isBadge ? "size-3.5" : "size-6"} />
      </div>
      <span
        className="w-full truncate font-mono text-[10px] text-[var(--ds-color-text-default)]"
        title={name}
      >
        {name}
      </span>
      <SourceTag custom={custom} badge={isBadge} />
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Inventory, the searchable record of every available glyph.
 * ───────────────────────────────────────────────────────────────────────── */

function IconInventory() {
  const [q, setQ] = React.useState("");
  const query = q.trim().toLowerCase();
  const customs = query
    ? CUSTOM_ICONS.filter((i) => i.name.toLowerCase().includes(query))
    : CUSTOM_ICONS;
  const lucides = query
    ? LUCIDE_ICONS.filter((i) => i.name.toLowerCase().includes(query))
    : LUCIDE_ICONS;

  return (
    <div className="flex flex-col gap-5 p-6">
      <h2 className="text-base font-semibold text-[var(--ds-color-text-default)]">
        Icon inventory
      </h2>

      <div className="flex flex-col gap-1">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search icons by name…"
          className="w-full max-w-sm rounded-md border border-[var(--ds-color-border-default)] bg-[var(--ds-color-surface-default)] px-3 py-2 text-sm text-[var(--ds-color-text-default)] outline-none focus:border-[var(--ds-color-border-focus)]"
        />
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
          {customs.length} custom · {lucides.length} Lucide
        </span>
      </div>

      {customs.length > 0 && (
        <section className="flex flex-col gap-3">
          <h3 className="font-mono text-sm text-[var(--ds-color-text-default)]">
            Custom additions
          </h3>
          <Grid>
            {customs.map((entry) => (
              <IconTile key={`custom-${entry.name}`} entry={entry} custom />
            ))}
          </Grid>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <h3 className="font-mono text-sm text-[var(--ds-color-text-default)]">Lucide</h3>
        {lucides.length === 0 ? (
          <p className="text-sm text-[var(--ds-color-text-subtle)]">No Lucide icons match “{q}”.</p>
        ) : (
          <Grid>
            {lucides.map((entry) => (
              <IconTile key={`lucide-${entry.name}`} entry={entry} />
            ))}
          </Grid>
        )}
      </section>
    </div>
  );
}

export const Inventory: Story = {
  render: () => <IconInventory />,
};

/* ─────────────────────────────────────────────────────────────────────────
 * Color tracking, one glyph across the tag palette. Every icon uses
 * currentColor, so it inherits the badge's text color with no per-icon binding
 * (the CSS-native equivalent of the Figma tag/active-color cascade). Toggle the
 * Storybook theme to confirm dark. Labels name the COLOR, not a use.
 * ───────────────────────────────────────────────────────────────────────── */

const TAG_VARIANTS = [
  "forest",
  "lime",
  "cyan",
  "blue",
  "yellow",
  "orange",
  "lavender",
  "orchid",
  "red",
] as const;

export const ColorTracking: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      <p className="max-w-prose text-sm text-[var(--ds-color-text-subtle)]">
        The same glyph in every tag color, it inherits each badge&rsquo;s text color
        automatically via <code className="font-mono text-xs">currentColor</code>.
      </p>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {TAG_VARIANTS.map((v) => (
            <Badge key={`plant-${v}`} variant={v} iconLeading={<PlantBadge />}>
              {v}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {TAG_VARIANTS.map((v) => (
            <Badge key={`rat-${v}`} variant={v} iconLeading={<RatBadge />}>
              {v}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {TAG_VARIANTS.map((v) => (
            <Badge key={`cow-${v}`} variant={v} iconLeading={<CowBadge />}>
              {v}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {TAG_VARIANTS.map((v) => (
            <Badge key={`compound-${v}`} variant={v} iconLeading={<CompoundBadge />}>
              {v}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  ),
};

/* ─────────────────────────────────────────────────────────────────────────
 * App-scale custom glyphs, 24px, NOT badge-slot icons. Hummingbird is
 * the AI assistant mark. Separate tier from brand illustration.
 * ───────────────────────────────────────────────────────────────────────── */

export const AppScaleGlyphs: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-6">
      <p className="max-w-prose text-sm text-[var(--ds-color-text-subtle)]">
        Custom glyphs at app scale (24px) for chat headers, nav, and cards, not
        badge slots. Prefer the line variant (honors the line-art house style).
      </p>
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Hummingbird (line)", node: <HummingbirdLine className="size-6" /> },
          { label: "Hummingbird (fill)", node: <HummingbirdFill className="size-6" /> },
          { label: "Cow", node: <Cow className="size-6" /> },
          { label: "Compound", node: <Compound className="size-6" /> },
        ].map((g) => (
          <div
            key={g.label}
            className="flex flex-col items-center gap-2 rounded-lg border border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-default)] p-4 text-[var(--ds-color-text-default)]"
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
 * Conventions, the mechanics, written down (no purpose assigned).
 * ───────────────────────────────────────────────────────────────────────── */

export const Conventions: Story = {
  render: () => (
    <div className="flex max-w-prose flex-col gap-4 p-6 text-sm text-[var(--ds-color-text-default)]">
      <h3 className="font-mono text-sm">Conventions</h3>
      <ul className="flex list-disc flex-col gap-2 pl-5 text-[var(--ds-color-text-subtle)]">
        <li>
          <strong className="text-[var(--ds-color-text-default)]">Lucide first.</strong> If
          Lucide has the glyph, use it. Reserve custom additions for what Lucide
          genuinely can&rsquo;t cover, currently Cow and Hummingbird.
        </li>
        <li>
          <strong className="text-[var(--ds-color-text-default)]">
            House stroke = {BADGE_ICON_STROKE}.
          </strong>{" "}
          Lucide draws at stroke 2 for a 24px box, which reads heavy at 14px badge
          scale. Pass <code className="font-mono text-xs">strokeWidth={BADGE_ICON_STROKE}</code>{" "}
          for badge-scale line glyphs.
        </li>
        <li>
          <strong className="text-[var(--ds-color-text-default)]">currentColor only.</strong>{" "}
          Glyphs use stroke/fill=currentColor and inherit their context&rsquo;s text color
          automatically, no per-icon color binding.
        </li>
        <li>
          <strong className="text-[var(--ds-color-text-default)]">Identity, not use.</strong>{" "}
          This page names glyphs by what they are. Assigning a glyph to a Hummingbird
          concept happens later, in the surface that uses it, it&rsquo;s exploratory for now.
        </li>
        <li>
          <strong className="text-[var(--ds-color-text-default)]">Two tiers, kept apart.</strong>{" "}
          Functional UI glyphs (this page) vs. brand illustration (the hummingbird/bird
          vectors in /brand and /vector-pipeline, illustration scale, never a badge slot).
        </li>
      </ul>
    </div>
  ),
};
