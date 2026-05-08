import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { CompoundCard } from "@/components/forager/compound-card"
import { COMPOUNDS } from "@/components/forager/data"

const meta = {
  title: "Forager/CompoundCard",
  component: CompoundCard,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {
    compound: COMPOUNDS[0],
  },
  argTypes: {
    saved: { control: { type: "boolean" } },
  },
} satisfies Meta<typeof CompoundCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Saved: Story = {
  args: { saved: true },
}

export const Hover: Story = {
  parameters: { layout: "centered" },
  args: { "data-force-state": "hover" } as Partial<typeof meta.args>,
}

export const SavedHover: Story = {
  parameters: { layout: "centered" },
  args: {
    saved: true,
    "data-force-state": "hover",
  } as Partial<typeof meta.args>,
}

export const OpenIp: Story = {
  args: { compound: COMPOUNDS.find((c) => c.ip === "Open IP")! },
}

export const Plant: Story = {
  args: { compound: COMPOUNDS.find((c) => c.sourceClass.startsWith("Plant"))! },
}

export const FullGrid: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid max-w-[1100px] grid-cols-1 gap-4 md:grid-cols-2">
      {COMPOUNDS.map((c) => (
        <CompoundCard key={c.id} compound={c} />
      ))}
    </div>
  ),
}
