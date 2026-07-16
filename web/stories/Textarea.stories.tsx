import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/* ─────────────────────────────────────────────────────────────────────────
 * Textarea, the multi-line input behind the prompt composer, the feedback
 * widget, and the report composer's editable sections.
 *
 * Auto-grows: `field-sizing-content` sizes the box to its content from a
 * min-h-16 floor, so the composer expands as you type instead of scrolling.
 * Pass `rows` only when a fixed height is wanted.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: { type: "boolean" } },
    placeholder: { control: { type: "text" } },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: "Ask Forager about a health benefit…" },
  render: (args) => (
    <div className="w-96">
      <Textarea {...args} />
    </div>
  ),
};

export const WithLabel: Story = {
  name: "With label",
  render: () => (
    <div className="flex w-96 flex-col gap-1.5">
      <Label htmlFor="ta-details">Details</Label>
      <Textarea id="ta-details" placeholder="What happened?" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "Locked while the report is generating.",
  },
  render: (args) => (
    <div className="w-96">
      <Textarea {...args} />
    </div>
  ),
};

export const Invalid: Story = {
  name: "Invalid (aria-invalid)",
  render: () => (
    <div className="flex w-96 flex-col gap-1.5">
      <Label htmlFor="ta-invalid">Mechanism</Label>
      <Textarea
        id="ta-invalid"
        aria-invalid
        defaultValue=""
        placeholder="Required"
      />
      <p className="text-sm text-[var(--ds-color-text-critical)]">
        A mechanism is required before the section can be saved.
      </p>
    </div>
  ),
};

export const AutoGrow: Story = {
  name: "Auto-grow (field-sizing-content)",
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex w-[520px] flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ta-short">Short value</Label>
        <Textarea id="ta-short" defaultValue="One line." />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ta-long">Long value — the box grows to fit</Label>
        <Textarea
          id="ta-long"
          defaultValue={
            "Berberine activates AMPK, improving insulin sensitivity and glucose uptake in skeletal muscle. It also reshapes the bile acid pool and shifts short-chain fatty acid output, which together support metabolic health across several biomarkers including HbA1c, fasting glucose and HOMA-IR."
          }
        />
      </div>
    </div>
  ),
};

export const PromptComposer: Story = {
  name: "Prompt composer",
  render: () => (
    <div className="flex w-[520px] flex-col gap-3 rounded-lg border border-[var(--ds-color-border-subtle)] p-4">
      <Textarea
        placeholder="Ask Forager about a health benefit…"
        aria-label="Prompt"
      />
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--ds-color-text-subtle)]">
          Forager can make mistakes. Verify important results.
        </p>
        <Button size="sm">Send</Button>
      </div>
    </div>
  ),
};
