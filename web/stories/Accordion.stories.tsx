import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "radio" },
      options: ["single", "multiple"],
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { type: "single", collapsible: true, defaultValue: "benefit" },
  render: (args) => (
    <div className="w-[520px]">
      <Accordion {...args}>
        <AccordionItem value="benefit">
          <AccordionTrigger>Health benefit</AccordionTrigger>
          <AccordionContent>
            Supports metabolic health. Berberine activates AMPK, improving
            insulin sensitivity and glucose uptake in skeletal muscle.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="pathways">
          <AccordionTrigger>Biological pathways</AccordionTrigger>
          <AccordionContent>
            AMPK activation · Insulin receptor signalling · Hepatic
            gluconeogenesis suppression
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="references">
          <AccordionTrigger>References</AccordionTrigger>
          <AccordionContent>
            12 clinical, 4 animal, 9 in vitro studies.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const Multiple: Story = {
  name: "Multiple open at once",
  args: { type: "multiple", defaultValue: ["benefit", "pathways"] },
  render: (args) => (
    <div className="w-[520px]">
      <Accordion {...args}>
        <AccordionItem value="benefit">
          <AccordionTrigger>Health benefit</AccordionTrigger>
          <AccordionContent>
            Supports metabolic health via AMPK activation.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="pathways">
          <AccordionTrigger>Biological pathways</AccordionTrigger>
          <AccordionContent>
            AMPK activation · Insulin receptor signalling
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="sources">
          <AccordionTrigger>Natural sources</AccordionTrigger>
          <AccordionContent>
            Berberis vulgaris (root, 94th percentile) · Coptis chinensis
            (rhizome, 89th percentile)
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const Disabled: Story = {
  name: "Disabled section",
  args: { type: "single", collapsible: true },
  render: (args) => (
    <div className="w-[520px]">
      <Accordion {...args}>
        <AccordionItem value="benefit">
          <AccordionTrigger>Health benefit</AccordionTrigger>
          <AccordionContent>
            Supports metabolic health via AMPK activation.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="ip">
          <AccordionTrigger disabled>
            IP assessment — run analysis to unlock
          </AccordionTrigger>
          <AccordionContent>Not reachable.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const CompoundDetail: Story = {
  name: "Compound detail slide-over",
  args: { type: "multiple", defaultValue: ["benefit"] },
  render: (args) => (
    <div className="w-[400px]">
      <h3 className="mb-1 text-lg font-semibold">Berberine</h3>
      <p className="mb-4 text-sm text-[var(--ds-color-text-subtle)]">
        SINGLE · 87% confidence
      </p>
      <Accordion {...args}>
        <AccordionItem value="benefit">
          <AccordionTrigger>Health benefit</AccordionTrigger>
          <AccordionContent>
            Supports metabolic health. Activates AMPK, improving insulin
            sensitivity and glucose uptake.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="targets">
          <AccordionTrigger>Targets &amp; biomarkers</AccordionTrigger>
          <AccordionContent>
            HbA1c · Fasting glucose · HOMA-IR
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="sources">
          <AccordionTrigger>Natural sources</AccordionTrigger>
          <AccordionContent>
            Berberis vulgaris (root) · Coptis chinensis (rhizome)
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="references">
          <AccordionTrigger>References</AccordionTrigger>
          <AccordionContent>12 clinical, 4 animal, 9 in vitro.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
