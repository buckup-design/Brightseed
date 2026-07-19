import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ScoreMeter } from "@/components/ui/score-meter";

/* ─────────────────────────────────────────────────────────────────────────
 * ScoreMeter — the shared 0–1 magnitude meter behind every Hummingbird score
 * (result cards' Confidence / Synergy / Bioactivity, and later the detail
 * slide-over + IP gauges). Fill LENGTH is the value; the tier only darkens the
 * same forest hue (never a traffic-light). WCAG-safe on the sand card footer —
 * fill floor is forest-600 (3.81:1). role="meter", so the value is announced.
 *
 * `value` is always 0–1; `format` picks the unit ("85%" vs ".85").
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "WORK IN PROGRESS/Score Meter",
  component: ScoreMeter,
  parameters: { layout: "centered" },
  args: { value: 0.85, label: "Confidence", format: "percent" },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScoreMeter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The bioactivity score for a predicted compound: a raw 0–1 decimal. */
export const ScoreFormat: Story = {
  args: { value: 0.72, label: "Bioactivity", format: "score" },
};

/** The three tiers only darken the one forest hue — low / med / high. */
export const Tiers: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-5">
      <ScoreMeter value={0.35} label="Low" />
      <ScoreMeter value={0.62} label="Medium" />
      <ScoreMeter value={0.91} label="High" />
    </div>
  ),
};

/** No threshold notch, and the bare bar (no label row) for tight inline use. */
export const Variants: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-5">
      <ScoreMeter value={0.68} label="No threshold" threshold={null} />
      <ScoreMeter value={0.68} label="Bare bar" showLabel={false} />
    </div>
  ),
};

/**
 * Contrast check: the meter must clear 3:1 on both the white card body and the
 * sand-100 footer it actually sits in. Compare the two backdrops side by side.
 */
export const OnBackdrops: Story = {
  render: () => (
    <div className="flex gap-4">
      <div className="w-56 rounded-[var(--ds-shape-radius-md)] border border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-default)] p-4">
        <ScoreMeter value={0.85} label="On white" />
      </div>
      <div className="w-56 rounded-[var(--ds-shape-radius-md)] border border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-alt)] p-4">
        <ScoreMeter value={0.85} label="On footer" />
      </div>
    </div>
  ),
};
