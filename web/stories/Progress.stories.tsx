import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Progress } from "@/components/ui/progress";

/* Progress fills with --ds-color-action-primary (brand lime) on a
 * --ds-color-surface-alt track. That is right for UI state like the Getting
 * Started bar. Score meters plot data, so per the chart rule in CLAUDE.md they
 * take the --chart-* namespace rather than brand lime — compose those on top
 * rather than restyling Progress. */

const meta = {
  title: "Components/Progress",
  component: Progress,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 60 },
  render: (args) => (
    <div className="w-[420px]">
      <Progress {...args} />
    </div>
  ),
};

export const Steps: Story = {
  name: "Value steps",
  render: () => (
    <div className="flex w-[420px] flex-col gap-4">
      {[0, 25, 50, 75, 100].map((v) => (
        <div key={v} className="flex items-center gap-3">
          <span className="w-10 shrink-0 text-sm text-[var(--ds-color-text-subtle)]">
            {v}%
          </span>
          <Progress value={v} />
        </div>
      ))}
    </div>
  ),
};

export const GettingStarted: Story = {
  name: "Getting Started panel",
  render: () => (
    <div className="w-[360px] rounded-lg border border-[var(--ds-color-border-subtle)] p-4">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-sm font-medium">Getting started</h3>
        <span className="text-sm text-[var(--ds-color-text-subtle)]">
          2 of 4
        </span>
      </div>
      <Progress value={50} />
      <ul className="mt-3 flex flex-col gap-1 text-sm text-[var(--ds-color-text-subtle)]">
        <li>Start your first conversation</li>
        <li>Create a formula brief</li>
        <li>Generate a report</li>
        <li>Run an IP analysis</li>
      </ul>
    </div>
  ),
};

export const InCard: Story = {
  name: "Inline in a list row",
  render: () => (
    <div className="flex w-[460px] flex-col gap-4">
      {[
        { label: "Berberine", value: 87 },
        { label: "Biochanin A", value: 64 },
        { label: "Quercetin", value: 41 },
      ].map((row) => (
        <div key={row.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-sm">{row.label}</span>
          <Progress value={row.value} />
          <span className="w-10 shrink-0 text-right text-sm text-[var(--ds-color-text-subtle)]">
            {row.value}%
          </span>
        </div>
      ))}
    </div>
  ),
};
