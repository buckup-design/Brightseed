import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { Tag } from "@/components/ui/tag";
import { CowBadge, CompoundBadge, PlantBadge, RatBadge } from "@/components/ui/badge-icons";

/* ─────────────────────────────────────────────────────────────────────────
 * Tag stories, parity with Figma "Quill Components > Tag" (the component set
 * formerly named "Badge Secondary", 26480:628051).
 *
 * Tag is the tight, INFORMATIONAL badge for tag-dense Hummingbird surfaces
 * (cr=2, 4px horizontal padding, hugs content). It is STATIC by design: no
 * hover and no focus state, never interactive. It is a thin wrapper over the
 * shared Badge engine (kind="tag"); the 12-color `variant` axis and token
 * recipe live there (components/ui/badge.tsx). Its siblings are Chip
 * (interactive) and Badge Number (counts).
 *
 * Because Tag has no other states, the matrix below shows the Default state
 * only. Light + dark modes are toggled via the Storybook toolbar.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Components/Tag",
  component: Tag,
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
    statusDot: { control: { type: "boolean" } },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

const PlantGlyph = () => <PlantBadge />;
const CowGlyph = () => <CowBadge />;
const CompoundGlyph = () => <CompoundBadge />;
const RatGlyph = () => <RatBadge />;

export const Default: Story = {
  args: { variant: "forest", children: "Compound" },
};

/* All 12 variants, confirms the cr=2 + 4px padding layout. Static, no hover
 * or focus. */
export const AllVariants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Tag variant="default">Default</Tag>
      <Tag variant="outline">Outline</Tag>
      <Tag variant="ghost">Ghost</Tag>
      <Tag variant="red">Red</Tag>
      <Tag variant="forest">Forest</Tag>
      <Tag variant="lime">Lime</Tag>
      <Tag variant="cyan">Cyan</Tag>
      <Tag variant="blue">Blue</Tag>
      <Tag variant="yellow">Yellow</Tag>
      <Tag variant="orange">Orange</Tag>
      <Tag variant="lavender">Lavender</Tag>
      <Tag variant="orchid">Orchid</Tag>
    </div>
  ),
};

/* Tag-dense row, the Hummingbird use case. Short labels pack into a column
 * without wrapping. */
export const DenseRow: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-3 max-w-sm">
      <div className="flex flex-wrap items-center gap-1">
        <Tag variant="forest">AkT</Tag>
        <Tag variant="cyan">Liver</Tag>
        <Tag variant="lavender">Phase II</Tag>
        <Tag variant="orange">Hit</Tag>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <Tag variant="forest">GPx1</Tag>
        <Tag variant="blue">Heart</Tag>
        <Tag variant="yellow">Phase I</Tag>
      </div>
    </div>
  ),
};

/* Hummingbird entity tags with the badge-icon vocabulary. Decorative, color
 * does not imply status. */
export const HummingbirdEntities: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap items-center gap-1">
      <Tag variant="forest" iconLeading={<PlantGlyph />}>
        Foeniculum vulgare
      </Tag>
      <Tag variant="lime" iconLeading={<CompoundGlyph />}>
        Transanethole
      </Tag>
      <Tag variant="cyan" iconLeading={<CowGlyph />}>
        Rumen model
      </Tag>
      <Tag variant="blue" iconLeading={<RatGlyph />}>
        Pre-clinical
      </Tag>
    </div>
  ),
};

/* ─────────────────────────────────────────────────────────────────────
 * Quill matrix, 12 variants. Tag is static (informational), so there is a
 * single Default column, no hover/focus.
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

export const Matrix: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <section className="flex flex-col gap-3">
      <h3 className="font-mono text-sm text-[var(--ds-color-text-default)]">
        Tag, 12 variants (static — informational, no hover/focus; cr=2, 4px padding)
      </h3>
      <div className="grid grid-cols-[auto_minmax(120px,1fr)] gap-y-1 border border-dashed border-[var(--ds-color-border-subtle)] p-2">
        <div />
        <div className="flex items-center justify-center pb-2 font-mono text-xs text-[var(--ds-color-text-subtle)]">
          Default
        </div>
        {VARIANTS.map((v) => (
          <React.Fragment key={v}>
            <div className="flex items-center justify-end pr-3 font-mono text-xs text-[var(--ds-color-text-subtle)]">
              {v}
            </div>
            <div className="flex items-center justify-center px-2 py-2 border border-dashed border-[var(--ds-color-border-subtle)]">
              <Tag variant={v}>AkT</Tag>
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  ),
};
