import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const meta = {
  title: "Components/Switch",
  component: Switch,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "radio" },
      options: ["sm", "default"],
    },
    disabled: { control: { type: "boolean" } },
    checked: { control: { type: "boolean" } },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true },
};

export const Sizes: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <Switch size="sm" id="sw-sm" />
        <Label htmlFor="sw-sm">Small</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch size="default" id="sw-default" />
        <Label htmlFor="sw-default">Default</Label>
      </div>
    </div>
  ),
};

export const WithLabel: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="email-notifications" defaultChecked />
      <Label htmlFor="email-notifications">Email notifications</Label>
    </div>
  ),
};

export const FormRow: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div className="flex items-center justify-between">
        <Label htmlFor="airplane">Airplane mode</Label>
        <Switch id="airplane" />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="wifi">Wi-Fi</Label>
        <Switch id="wifi" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="bluetooth">Bluetooth</Label>
        <Switch id="bluetooth" defaultChecked />
      </div>
      <div className="flex items-center justify-between opacity-50">
        <Label htmlFor="hotspot">Personal hotspot</Label>
        <Switch id="hotspot" disabled />
      </div>
    </div>
  ),
};
