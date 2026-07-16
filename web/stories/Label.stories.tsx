import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

/* ─────────────────────────────────────────────────────────────────────────
 * Label — the caption for a form control. Carries no colour of its own; it
 * inherits, and contributes only type (text-sm / font-medium), layout, and
 * the two disabled reflections below.
 *
 * Always wire htmlFor to the control's id. That is what makes the label a
 * click target for the control and what a screen reader announces — a bare
 * <Label> next to an <Input> looks identical and is not connected.
 *
 * Disabled reflects the CONTROL's state, two ways:
 *   peer-disabled:*             — sibling control marked disabled (peer)
 *   group-data-[disabled=true]  — an ancestor group marked disabled
 * Label never sets disabled itself.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Components/Label",
  component: Label,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Target health benefit" },
};

export const WithInput: Story = {
  name: "With input",
  render: () => (
    <div className="flex w-80 flex-col gap-1.5">
      <Label htmlFor="lbl-name">Brief name</Label>
      <Input id="lbl-name" placeholder="Q3 metabolic concept" />
    </div>
  ),
};

export const WithTextarea: Story = {
  name: "With textarea",
  render: () => (
    <div className="flex w-80 flex-col gap-1.5">
      <Label htmlFor="lbl-notes">Notes</Label>
      <Textarea id="lbl-notes" placeholder="Anything to flag for review?" />
    </div>
  ),
};

export const WithCheckbox: Story = {
  name: "With checkbox",
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="lbl-gras" />
      <Label htmlFor="lbl-gras">GRAS sources only</Label>
    </div>
  ),
};

export const WithSwitch: Story = {
  name: "With switch",
  render: () => (
    <div className="flex w-72 items-center justify-between">
      <Label htmlFor="lbl-predicted">Include predicted compounds</Label>
      <Switch id="lbl-predicted" defaultChecked />
    </div>
  ),
};

export const Required: Story = {
  name: "Required field",
  render: () => (
    <div className="flex w-80 flex-col gap-1.5">
      <Label htmlFor="lbl-req">
        Target health benefit
        <span aria-hidden="true" className="text-[var(--ds-color-text-critical)]">
          *
        </span>
        <span className="sr-only">(required)</span>
      </Label>
      <Input id="lbl-req" required placeholder="Required" />
    </div>
  ),
};

export const DisabledPeer: Story = {
  name: "Disabled (reflects the control)",
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="lbl-on">Enabled control</Label>
        <Input id="lbl-on" className="peer" placeholder="Editable" />
      </div>
      <div className="flex flex-col gap-1.5">
        {/* Label follows its peer: the input below is disabled, so the label fades. */}
        <Input id="lbl-off" className="peer order-2" disabled placeholder="Locked" />
        <Label htmlFor="lbl-off" className="order-1">
          Disabled control — label fades with it
        </Label>
      </div>
    </div>
  ),
};
