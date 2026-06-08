import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { EvidenceTag } from "@/components/ui/evidence-tag";

/* ─────────────────────────────────────────────────────────────────────────
 * EvidenceTag, the outlined data-validation tag used on the Compound card.
 *
 * New outlined Badge treatment (variant="outline" + kind="evidence"). Animal
 * and Clinical render identically; the value carries the meaning. A compound
 * shows at most one. Lives under WORK IN PROGRESS until promoted.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "WORK IN PROGRESS/Evidence Tag",
  component: EvidenceTag,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof EvidenceTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Clinical: Story = {
  args: { children: "Clinical" },
};

export const Animal: Story = {
  args: { children: "Animal" },
};

export const BothValues: Story = {
  name: "Both (identical styling)",
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <EvidenceTag>Clinical</EvidenceTag>
      <EvidenceTag>Animal</EvidenceTag>
    </div>
  ),
};
