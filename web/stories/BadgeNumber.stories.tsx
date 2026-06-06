import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { NumberBadge } from "@/components/ui/number-badge";

/* ─────────────────────────────────────────────────────────────────────────
 * Badge Number stories, parity with Figma "Quill Components > Badge Number"
 * (17100:10130). Unchanged by the June 5, 2026 badge rename.
 *
 * NumberBadge is the compact numeric chip for counts and notifications (round,
 * tabular-nums, min-width so single- and double-digit numbers stay even). It
 * is a thin wrapper over the shared Badge engine (kind="number"); the 12-color
 * `variant` axis and token recipe live there (components/ui/badge.tsx). Its
 * siblings are Chip (interactive) and Tag (static).
 *
 * Exported as `NumberBadge` to avoid shadowing the JS `Number` global.
 * Light + dark modes are toggled via the Storybook toolbar.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Components/Badge Number",
  component: NumberBadge,
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
  },
} satisfies Meta<typeof NumberBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: "default", children: "12" },
};

/* A spread of colors; tabular-nums keeps "9" and "10" the same width. */
export const AllVariants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <NumberBadge variant="default">3</NumberBadge>
      <NumberBadge variant="red">12</NumberBadge>
      <NumberBadge variant="forest">99+</NumberBadge>
      <NumberBadge variant="cyan">7</NumberBadge>
      <NumberBadge variant="blue">128</NumberBadge>
      <NumberBadge variant="orange">1</NumberBadge>
    </div>
  ),
};

/* Number badges in their natural habitat, counts/notifications. */
export const InContext: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex items-center gap-4">
      <span className="inline-flex items-center gap-2">
        Inbox <NumberBadge variant="default">3</NumberBadge>
      </span>
      <span className="inline-flex items-center gap-2">
        Reviews <NumberBadge variant="red">12</NumberBadge>
      </span>
      <span className="inline-flex items-center gap-2">
        Updates <NumberBadge variant="forest">99+</NumberBadge>
      </span>
    </div>
  ),
};
