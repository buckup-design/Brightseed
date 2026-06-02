import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

const meta = {
  title: "Components/Select",
  component: Select,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select evidence type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Evidence</SelectLabel>
          <SelectItem value="animal">Animal</SelectItem>
          <SelectItem value="in-vitro">In vitro</SelectItem>
          <SelectItem value="clinical">Clinical</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};
