import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { StatusBadge } from "@/components/ui/status-badge";

/* ─────────────────────────────────────────────────────────────────────────
 * StatusBadge — a small status indicator (dot + label). Status is signalled by
 * composing a glyph with text, per the system's status rule, NOT by a
 * decorative Tag color. "Draft" is a neutral tone — an in-progress lifecycle
 * label, not a success/warning/critical signal — so it stays quiet. Used on the
 * Reports list and report detail. Extend `statusConfig` as the product surfaces
 * new states.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "WORK IN PROGRESS/Status Badge",
  component: StatusBadge,
  parameters: { layout: "centered" },
  args: { status: "draft" },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Draft: Story = {};

export const Completed: Story = {
  args: { status: "completed" },
};
