import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Spinner } from "@/components/ui/spinner";

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Spinner />,
};

export const Sizes: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner className="size-3" />
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
      <Spinner className="size-12" />
    </div>
  ),
};

export const InlineWithText: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex items-center gap-2 text-sm">
      <Spinner />
      <span>Loading compounds…</span>
    </div>
  ),
};

export const Muted: Story = {
  render: () => <Spinner className="text-muted-foreground" />,
};
