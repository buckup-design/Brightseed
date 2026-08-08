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
  title: "Components/Status Badge",
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

/** The FTO dimension states (IP appendix): Clear / Restricted / Blocked on the
 *  success / warning / critical tones. The word carries; the dot reinforces. */
export const FtoStates: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <StatusBadge status="clear" />
      <StatusBadge status="restricted" />
      <StatusBadge status="blocked" />
    </div>
  ),
};

/** All five on the dark theme — text goes neutral, signal stays in the
 *  surface + dot (the dark intent recipe). */
export const FtoStatesDark: Story = {
  globals: { theme: "dark" },
  render: () => (
    <div className="flex items-center gap-3">
      <StatusBadge status="draft" />
      <StatusBadge status="completed" />
      <StatusBadge status="clear" />
      <StatusBadge status="restricted" />
      <StatusBadge status="blocked" />
    </div>
  ),
};
