import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, List } from "lucide-react";

const meta = {
  title: "Components/Toggle Group",
  component: ToggleGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ViewSwitcher: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="grid" variant="outline">
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <LayoutGrid />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view">
        <List />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};
