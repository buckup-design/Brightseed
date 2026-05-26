import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { CowBadge, CompoundBadge, PlantBadge, RatBadge } from "@/components/ui/badge-icons";

/* ─────────────────────────────────────────────────────────────────────────
 * Badge stories — parity with Figma "Quill Components > Primary Badges"
 * (26480:627833) and "Secondary Badges" (26480:628051).
 *
 * Two prop axes:
 *   variant — color treatment (12: default / outline / ghost / red /
 *             forest / lime / cyan / blue / yellow / orange / lavender / orchid)
 *   kind    — visual treatment (3: primary / secondary / number)
 *
 * The Quill matrix renders all 12 variants × 3 states (default / hover / focus)
 * for each kind. Hover and focus are forced via `data-force-state`, mapped by
 * the `hovered` and `focused` custom Tailwind variants in
 * sandbox/app/globals.css — the same dual-trigger pattern Button uses.
 *
 * Light + dark modes are toggled via the Storybook toolbar.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: [
        "default",
        "outline",
        "ghost",
        "red",
        "forest",
        "lime",
        "cyan",
        "blue",
        "yellow",
        "orange",
        "lavender",
        "orchid",
      ],
    },
    kind: {
      control: { type: "select" },
      options: ["primary", "secondary", "number"],
    },
    statusDot: { control: { type: "boolean" } },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Inline glyphs for slot-prop demos ────────────────────────────────────
 * All Brightseed custom badge-scale icons — no Lucide placeholders here.
 * PlantBadge is the React equivalent of Figma's Leaf-badge (node 26485:632020),
 * the default inline-slot icon for Primary Badge's Inline Start/End swap.
 * Full icon inventory lives on the Foundations/Icons Storybook page. */
const PlantGlyph = () => <PlantBadge />;
const CowGlyph = () => <CowBadge />;
const CompoundGlyph = () => <CompoundBadge />;
const RatGlyph = () => <RatBadge />;

/* ─────────────────────────────────────────────────────────────────────
 * Spotlight stories — quick scans for individual aspects of the spec.
 * ───────────────────────────────────────────────────────────────────── */

export const Default: Story = {
  args: { variant: "default", children: "Badge" },
};

export const TagDecorative: Story = {
  args: { variant: "forest", children: "Compound" },
};

export const Critical: Story = {
  args: { variant: "red", children: "Failed" },
};

export const Number: Story = {
  args: { kind: "number", variant: "default", children: "12" },
};

/* All 12 variants at primary kind — quickest visual diff across light/dark. */
export const AllVariantsPrimary: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="red">Red</Badge>
      <Badge variant="forest">Forest</Badge>
      <Badge variant="lime">Lime</Badge>
      <Badge variant="cyan">Cyan</Badge>
      <Badge variant="blue">Blue</Badge>
      <Badge variant="yellow">Yellow</Badge>
      <Badge variant="orange">Orange</Badge>
      <Badge variant="lavender">Lavender</Badge>
      <Badge variant="orchid">Orchid</Badge>
    </div>
  ),
};

/* All 12 variants at secondary kind — confirms the cr=2 + 4px padding
 * layout from the May 7 Secondary Badge tightening. */
export const AllVariantsSecondary: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default" kind="secondary">
        Default
      </Badge>
      <Badge variant="outline" kind="secondary">
        Outline
      </Badge>
      <Badge variant="ghost" kind="secondary">
        Ghost
      </Badge>
      <Badge variant="red" kind="secondary">
        Red
      </Badge>
      <Badge variant="forest" kind="secondary">
        Forest
      </Badge>
      <Badge variant="lime" kind="secondary">
        Lime
      </Badge>
      <Badge variant="cyan" kind="secondary">
        Cyan
      </Badge>
      <Badge variant="blue" kind="secondary">
        Blue
      </Badge>
      <Badge variant="yellow" kind="secondary">
        Yellow
      </Badge>
      <Badge variant="orange" kind="secondary">
        Orange
      </Badge>
      <Badge variant="lavender" kind="secondary">
        Lavender
      </Badge>
      <Badge variant="orchid" kind="secondary">
        Orchid
      </Badge>
    </div>
  ),
};

/* Tag-dense row — Forager use case. Three short labels per row,
 * showing how secondary kind packs more badges into the same column. */
export const TagDenseRow: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-3 max-w-sm">
      <div className="flex flex-wrap items-center gap-1">
        <Badge variant="forest" kind="secondary">
          AkT
        </Badge>
        <Badge variant="cyan" kind="secondary">
          Liver
        </Badge>
        <Badge variant="lavender" kind="secondary">
          Phase II
        </Badge>
        <Badge variant="orange" kind="secondary">
          Hit
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <Badge variant="forest" kind="secondary">
          GPx1
        </Badge>
        <Badge variant="blue" kind="secondary">
          Heart
        </Badge>
        <Badge variant="yellow" kind="secondary">
          Phase I
        </Badge>
      </div>
    </div>
  ),
};

/* Number badges in their natural habitat — counts/notifications. */
export const NumberBadges: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex items-center gap-4">
      <span className="inline-flex items-center gap-2">
        Inbox <Badge kind="number" variant="default">3</Badge>
      </span>
      <span className="inline-flex items-center gap-2">
        Reviews <Badge kind="number" variant="red">12</Badge>
      </span>
      <span className="inline-flex items-center gap-2">
        Updates <Badge kind="number" variant="forest">99+</Badge>
      </span>
    </div>
  ),
};

/* Three composition paths for the inline slot architecture. */
export const InlineSlots: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-[var(--color-text-subtle)] w-32">
          children
        </span>
        <Badge variant="forest">
          <PlantGlyph /> Plant compound
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-[var(--color-text-subtle)] w-32">
          iconLeading prop
        </span>
        <Badge variant="cyan" iconLeading={<CowGlyph />}>
          Animal study
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-[var(--color-text-subtle)] w-32">
          iconTrailing prop
        </span>
        <Badge variant="orange" iconTrailing={<PlantGlyph />}>
          Active
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-[var(--color-text-subtle)] w-32">
          statusDot
        </span>
        <Badge variant="forest" statusDot>
          Live
        </Badge>
      </div>
    </div>
  ),
};

/* Forager entity badges — the full badge-icon vocabulary as used in Forager
 * compound and plant views. Each entity type gets its own glyph + color pairing.
 * These are decorative, not semantic — color does not imply status. */
export const ForagerEntityBadges: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-[var(--color-text-subtle)]">
          primary kind
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="forest" iconLeading={<PlantGlyph />}>
            Plant source
          </Badge>
          <Badge variant="lime" iconLeading={<CompoundGlyph />}>
            Compound
          </Badge>
          <Badge variant="cyan" iconLeading={<CowGlyph />}>
            Bovine model
          </Badge>
          <Badge variant="blue" iconLeading={<RatGlyph />}>
            Rodent study
          </Badge>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-[var(--color-text-subtle)]">
          secondary kind (tag-dense rows)
        </span>
        <div className="flex flex-wrap items-center gap-1">
          <Badge variant="forest" kind="secondary" iconLeading={<PlantGlyph />}>
            Foeniculum vulgare
          </Badge>
          <Badge variant="lime" kind="secondary" iconLeading={<CompoundGlyph />}>
            Transanethole
          </Badge>
          <Badge variant="cyan" kind="secondary" iconLeading={<CowGlyph />}>
            Rumen model
          </Badge>
          <Badge variant="blue" kind="secondary" iconLeading={<RatGlyph />}>
            Pre-clinical
          </Badge>
        </div>
      </div>
    </div>
  ),
};

/* Three states of one variant — cheap sanity check before scrolling matrix. */
export const States: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-3">
      <span className="font-mono text-xs text-[var(--color-text-subtle)]">
        Default
      </span>
      <Badge variant="forest">Compound</Badge>

      <span className="font-mono text-xs text-[var(--color-text-subtle)]">
        Hover
      </span>
      <Badge variant="forest" data-force-state="hover">
        Compound
      </Badge>

      <span className="font-mono text-xs text-[var(--color-text-subtle)]">
        Focus
      </span>
      <Badge variant="forest" data-force-state="focus">
        Compound
      </Badge>
    </div>
  ),
};

/* ─────────────────────────────────────────────────────────────────────
 * Quill matrix — the canonical parity grid.
 * 12 variants × 3 states × 3 kinds = 108 cells per pass.
 * ─────────────────────────────────────────────────────────────────── */

const VARIANTS = [
  "default",
  "outline",
  "ghost",
  "red",
  "forest",
  "lime",
  "cyan",
  "blue",
  "yellow",
  "orange",
  "lavender",
  "orchid",
] as const;

const STATES = [
  { label: "Default", forceState: undefined },
  { label: "Hover", forceState: "hover" as const },
  { label: "Focus", forceState: "focus" as const },
] as const;

const KIND_DEMO_LABEL: Record<string, string> = {
  primary: "Compound",
  secondary: "AkT",
  number: "12",
};

function MatrixRow({
  variant,
  kind,
}: {
  variant: (typeof VARIANTS)[number];
  kind: "primary" | "secondary" | "number";
}) {
  const label = KIND_DEMO_LABEL[kind];
  return (
    <>
      <div className="flex items-center justify-end pr-3 font-mono text-xs text-[var(--color-text-subtle)]">
        {variant}
      </div>
      {STATES.map((s) => (
        <div
          key={s.label}
          className="flex items-center justify-center px-2 py-2 border border-dashed border-[var(--color-border-subtle)]"
        >
          <Badge
            variant={variant}
            kind={kind}
            data-force-state={s.forceState}
          >
            {label}
          </Badge>
        </div>
      ))}
    </>
  );
}

function KindMatrix({
  kind,
  title,
}: {
  kind: "primary" | "secondary" | "number";
  title: string;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="font-mono text-sm text-[var(--color-text-default)]">
        {title}
      </h3>
      <div className="grid grid-cols-[auto_repeat(3,minmax(120px,1fr))] gap-y-1 border border-dashed border-[var(--color-border-subtle)] p-2">
        {/* Header row */}
        <div />
        {STATES.map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-center pb-2 font-mono text-xs text-[var(--color-text-subtle)]"
          >
            {s.label}
          </div>
        ))}
        {VARIANTS.map((v) => (
          <MatrixRow key={v} variant={v} kind={kind} />
        ))}
      </div>
    </section>
  );
}

export const QuillMatrix: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-10">
      <KindMatrix kind="primary" title="Primary — 12 variants × 3 states" />
      <KindMatrix
        kind="secondary"
        title="Secondary — 12 variants × 3 states (cr=2, 4px padding)"
      />
      <KindMatrix kind="number" title="Number — 12 variants × 3 states" />
    </div>
  ),
};
