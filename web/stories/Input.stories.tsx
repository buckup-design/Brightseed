import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "@/components/ui/input";

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: "Ask anything…" },
  render: (args) => (
    <div className="w-[360px]">
      <Input {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { placeholder: "Disabled", disabled: true },
  render: (args) => (
    <div className="w-[360px]">
      <Input {...args} />
    </div>
  ),
};
