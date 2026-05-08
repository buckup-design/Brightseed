import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { PlantCard } from "@/components/forager/plant-card"
import { PLANTS } from "@/components/forager/data"

const meta = {
  title: "Forager/PlantCard",
  component: PlantCard,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: { plant: PLANTS[0] },
  argTypes: {
    saved: { control: { type: "boolean" } },
  },
} satisfies Meta<typeof PlantCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Saved: Story = { args: { saved: true } }

export const Hover: Story = {
  parameters: { layout: "centered" },
  args: { "data-force-state": "hover" } as Partial<typeof meta.args>,
}

export const FullGrid: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid max-w-[1100px] grid-cols-1 gap-4 md:grid-cols-2">
      {PLANTS.map((p) => (
        <PlantCard key={p.id} plant={p} />
      ))}
    </div>
  ),
}
