import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { CowBadge, CompoundBadge, PlantBadge, RatBadge } from "@/components/ui/badge-icons";

/* ─────────────────────────────────────────────────────────────────────────
 * Badge stories, parity with Figma "Quill Components > Primary Badges"
 * (26480:627833 — the "Chip" kind) and "Secondary Badges" (26480:628051 —
 * the "Tag" kind).
 *
 * Two prop axes:
 *   variant, color treatment (12: default / outline / ghost / red /
 *             forest / lime / cyan / blue / yellow / orange / lavender / orchid)
 *   kind   , visual treatment (3: chip / tag / number)
 *
 * Interactivity differs by kind:
 *   chip, number  interactive, carry hover + focus states.
 *   tag           informational/static, NO hover and NO focus, by design.
 *
 * The Quill matrix renders chip + number across 3 states (default / hover /
 * focus); tag renders default only, since it has no other states. Hover and
 * focus are forced via `data-force-state`, mapped by the `hovered` and
 * `focused` custom Tailwind variants in web/app/globals.css, the same
 * dual-trigger pattern Button uses.
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
      options: ["chip", "tag", "number"],
    },
    statusDot: { control: { type: "boolean" } },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Inline glyphs for slot-prop demos ────────────────────────────────────
 * All Brightseed custom badge-scale icons, no Lucide placeholders here.
 * PlantBadge is the React equivalent of Figma's Leaf-badge (node 26485:632020),
 * the default inline-slot icon for the Chip kind's Inline Start/End swap.
 * Full icon inventory lives on the Foundations/Icons Storybook page. */
const PlantGlyph = () => <PlantBadge />;
const CowGlyph = () => <CowBadge />;
const CompoundGlyph = () => <CompoundBadge />;
const RatGlyph = () => <RatBadge />;

/* ─────────────────────────────────────────────────────────────────────
 * Spotlight stories, quick scans for individual aspects of the spec.
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

/* All 12 variants at chip kind, quickest visual diff across light/dark. */
export const AllVariantsChip: Story = {
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

/* All 12 variants at tag kind, confirms the cr=2 + 4px padding layout from
 * the May 7 tightening. Tags are informational/static, no hover or focus. */
export const AllVariantsTag: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default" kind="tag">
        Default
      </Badge>
      <Badge variant="outline" kind="tag">
        Outline
      </Badge>
      <Badge variant="ghost" kind="tag">
        Ghost
      </Badge>
      <Badge variant="red" kind="tag">
        Red
      </Badge>
      <Badge variant="forest" kind="tag">
        Forest
      </Badge>
      <Badge variant="lime" kind="tag">
        Lime
      </Badge>
      <Badge variant="cyan" kind="tag">
        Cyan
      </Badge>
      <Badge variant="blue" kind="tag">
        Blue
      </Badge>
      <Badge variant="yellow" kind="tag">
        Yellow
      </Badge>
      <Badge variant="orange" kind="tag">
        Orange
      </Badge>
      <Badge variant="lavender" kind="tag">
        Lavender
      </Badge>
      <Badge variant="orchid" kind="tag">
        Orchid
      </Badge>
    </div>
  ),
};

/* Tag-dense row, Hummingbird use case. Three short labels per row,
 * showing how the tag kind packs more badges into the same column. */
export const TagDenseRow: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-3 max-w-sm">
      <div className="flex flex-wrap items-center gap-1">
        <Badge variant="forest" kind="tag">
          AkT
        </Badge>
        <Badge variant="cyan" kind="tag">
          Liver
        </Badge>
        <Badge variant="lavender" kind="tag">
          Phase II
        </Badge>
        <Badge variant="orange" kind="tag">
          Hit
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <Badge variant="forest" kind="tag">
          GPx1
        </Badge>
        <Badge variant="blue" kind="tag">
          Heart
        </Badge>
        <Badge variant="yellow" kind="tag">
          Phase I
        </Badge>
      </div>
    </div>
  ),
};

/* Number badges in their natural habitat, counts/notifications. */
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
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)] w-32">
          children
        </span>
        <Badge variant="forest">
          <PlantGlyph /> Plant compound
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)] w-32">
          iconLeading prop
        </span>
        <Badge variant="cyan" iconLeading={<CowGlyph />}>
          Animal study
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)] w-32">
          iconTrailing prop
        </span>
        <Badge variant="orange" iconTrailing={<PlantGlyph />}>
          Active
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)] w-32">
          statusDot
        </span>
        <Badge variant="forest" statusDot>
          Live
        </Badge>
      </div>
    </div>
  ),
};

/* Hummingbird entity badges, the full badge-icon vocabulary as used in Hummingbird
 * compound and plant views. Each entity type gets its own glyph + color pairing.
 * These are decorative, not semantic, color does not imply status. */
export const HummingbirdEntityBadges: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
          chip kind
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
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
          tag kind (tag-dense rows)
        </span>
        <div className="flex flex-wrap items-center gap-1">
          <Badge variant="forest" kind="tag" iconLeading={<PlantGlyph />}>
            Foeniculum vulgare
          </Badge>
          <Badge variant="lime" kind="tag" iconLeading={<CompoundGlyph />}>
            Transanethole
          </Badge>
          <Badge variant="cyan" kind="tag" iconLeading={<CowGlyph />}>
            Rumen model
          </Badge>
          <Badge variant="blue" kind="tag" iconLeading={<RatGlyph />}>
            Pre-clinical
          </Badge>
        </div>
      </div>
    </div>
  ),
};

/* Three states of one variant, cheap sanity check before scrolling matrix. */
export const States: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-3">
      <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
        Default
      </span>
      <Badge variant="forest">Compound</Badge>

      <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
        Hover
      </span>
      <Badge variant="forest" data-force-state="hover">
        Compound
      </Badge>

      <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
        Focus
      </span>
      <Badge variant="forest" data-force-state="focus">
        Compound
      </Badge>
    </div>
  ),
};

/* ─────────────────────────────────────────────────────────────────────
 * Quill matrix, the canonical parity grid.
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

type Kind = "chip" | "tag" | "number";

const KIND_DEMO_LABEL: Record<Kind, string> = {
  chip: "Compound",
  tag: "AkT",
  number: "12",
};

/* Tag is informational/static: only a Default state exists. chip + number are
 * interactive, so they get the full Default / Hover / Focus sweep. */
function statesForKind(kind: Kind) {
  return kind === "tag" ? STATES.slice(0, 1) : STATES;
}

function MatrixRow({
  variant,
  kind,
}: {
  variant: (typeof VARIANTS)[number];
  kind: Kind;
}) {
  const label = KIND_DEMO_LABEL[kind];
  return (
    <>
      <div className="flex items-center justify-end pr-3 font-mono text-xs text-[var(--ds-color-text-subtle)]">
        {variant}
      </div>
      {statesForKind(kind).map((s) => (
        <div
          key={s.label}
          className="flex items-center justify-center px-2 py-2 border border-dashed border-[var(--ds-color-border-subtle)]"
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

function KindMatrix({ kind, title }: { kind: Kind; title: string }) {
  const states = statesForKind(kind);
  return (
    <section className="flex flex-col gap-3">
      <h3 className="font-mono text-sm text-[var(--ds-color-text-default)]">
        {title}
      </h3>
      <div
        className="grid gap-y-1 border border-dashed border-[var(--ds-color-border-subtle)] p-2"
        style={{
          gridTemplateColumns: `auto repeat(${states.length}, minmax(120px, 1fr))`,
        }}
      >
        {/* Header row */}
        <div />
        {states.map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-center pb-2 font-mono text-xs text-[var(--ds-color-text-subtle)]"
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
      <KindMatrix kind="chip" title="Chip, 12 variants × 3 states" />
      <KindMatrix
        kind="tag"
        title="Tag, 12 variants (static — informational, no hover/focus; cr=2, 4px padding)"
      />
      <KindMatrix kind="number" title="Number, 12 variants × 3 states" />
    </div>
  ),
};
