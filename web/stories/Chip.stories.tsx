import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { Chip } from "@/components/ui/chip";
import { CowBadge, CompoundBadge, PlantBadge, RatBadge } from "@/components/ui/badge-icons";

/* ─────────────────────────────────────────────────────────────────────────
 * Chip stories, parity with Figma "Quill Components > Chip" (the component set
 * formerly named "Badge Primary", 26480:627833).
 *
 * Chip is the standard, INTERACTIVE badge pill (rounded-full, hover + focus).
 * It is a thin wrapper over the shared Badge engine (kind="chip"); the 12-color
 * `variant` axis and token recipe live there (components/ui/badge.tsx). Its
 * siblings are Tag (static) and Badge Number (counts).
 *
 * The matrix renders all 12 variants × 3 states (default / hover / focus).
 * Hover and focus are forced via `data-force-state`, mapped by the `hovered`
 * and `focused` custom Tailwind variants in web/app/globals.css. Light + dark
 * modes are toggled via the Storybook toolbar.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Components/Chip",
  component: Chip,
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
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Inline glyphs for slot-prop demos ──────────────────────────────────── */
const PlantGlyph = () => <PlantBadge />;
const CowGlyph = () => <CowBadge />;
const CompoundGlyph = () => <CompoundBadge />;
const RatGlyph = () => <RatBadge />;

export const Default: Story = {
  args: { variant: "default", children: "Badge" },
};

export const Decorative: Story = {
  args: { variant: "forest", children: "Compound" },
};

export const Critical: Story = {
  args: { variant: "red", children: "Failed" },
};

/* All 12 variants, quickest visual diff across light/dark. */
export const AllVariants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip variant="default">Default</Chip>
      <Chip variant="outline">Outline</Chip>
      <Chip variant="ghost">Ghost</Chip>
      <Chip variant="red">Red</Chip>
      <Chip variant="forest">Forest</Chip>
      <Chip variant="lime">Lime</Chip>
      <Chip variant="cyan">Cyan</Chip>
      <Chip variant="blue">Blue</Chip>
      <Chip variant="yellow">Yellow</Chip>
      <Chip variant="orange">Orange</Chip>
      <Chip variant="lavender">Lavender</Chip>
      <Chip variant="orchid">Orchid</Chip>
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
        <Chip variant="forest">
          <PlantGlyph /> Plant compound
        </Chip>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)] w-32">
          iconLeading prop
        </span>
        <Chip variant="cyan" iconLeading={<CowGlyph />}>
          Animal study
        </Chip>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)] w-32">
          iconTrailing prop
        </span>
        <Chip variant="orange" iconTrailing={<PlantGlyph />}>
          Active
        </Chip>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)] w-32">
          statusDot
        </span>
        <Chip variant="forest" statusDot>
          Live
        </Chip>
      </div>
    </div>
  ),
};

/* Hummingbird entity chips, the full badge-icon vocabulary as used in
 * Hummingbird compound and plant views. Decorative, color does not imply
 * status. */
export const HummingbirdEntities: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip variant="forest" iconLeading={<PlantGlyph />}>
        Plant source
      </Chip>
      <Chip variant="lime" iconLeading={<CompoundGlyph />}>
        Compound
      </Chip>
      <Chip variant="cyan" iconLeading={<CowGlyph />}>
        Bovine model
      </Chip>
      <Chip variant="blue" iconLeading={<RatGlyph />}>
        Rodent study
      </Chip>
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
      <Chip variant="forest">Compound</Chip>

      <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
        Hover
      </span>
      <Chip variant="forest" data-force-state="hover">
        Compound
      </Chip>

      <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
        Focus
      </span>
      <Chip variant="forest" data-force-state="focus">
        Compound
      </Chip>
    </div>
  ),
};

/* ─────────────────────────────────────────────────────────────────────
 * Quill matrix, 12 variants × 3 states.
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

export const Matrix: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <section className="flex flex-col gap-3">
      <h3 className="font-mono text-sm text-[var(--ds-color-text-default)]">
        Chip, 12 variants × 3 states
      </h3>
      <div className="grid grid-cols-[auto_repeat(3,minmax(120px,1fr))] gap-y-1 border border-dashed border-[var(--ds-color-border-subtle)] p-2">
        <div />
        {STATES.map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-center pb-2 font-mono text-xs text-[var(--ds-color-text-subtle)]"
          >
            {s.label}
          </div>
        ))}
        {VARIANTS.map((v) => (
          <React.Fragment key={v}>
            <div className="flex items-center justify-end pr-3 font-mono text-xs text-[var(--ds-color-text-subtle)]">
              {v}
            </div>
            {STATES.map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-center px-2 py-2 border border-dashed border-[var(--ds-color-border-subtle)]"
              >
                <Chip variant={v} data-force-state={s.forceState}>
                  Compound
                </Chip>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </section>
  ),
};
