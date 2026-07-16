import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

/* ─────────────────────────────────────────────────────────────────────────
 * Collapsible — behaviour only, no styling of its own. It ships zero classes;
 * every visual here comes from what you compose around it. That is the point:
 * it is the open/close primitive, not a look.
 *
 * Reach for Collapsible for a SINGLE independent disclosure ("show more").
 * For a set of sibling sections where one or many open — the compound detail
 * slide-over — use Accordion instead: it brings the roving arrow-key nav and
 * single/multiple modes that a stack of Collapsibles would not.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Components/Collapsible",
  component: Collapsible,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Collapsible className="w-[420px]">
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm">
          Toggle
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="pt-3 text-sm text-[var(--ds-color-text-subtle)]">
          Berberine activates AMPK, improving insulin sensitivity.
        </p>
      </CollapsibleContent>
    </Collapsible>
  ),
};

function ShowMorePanel() {
  const [open, setOpen] = React.useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="w-[480px] rounded-lg border border-[var(--ds-color-border-subtle)] p-4"
    >
      <h3 className="text-sm font-medium">Mechanism</h3>
      <p className="mt-1 text-sm text-[var(--ds-color-text-subtle)]">
        Berberine activates AMPK, improving insulin sensitivity and glucose
        uptake in skeletal muscle.
      </p>

      <CollapsibleContent>
        <p className="mt-2 text-sm text-[var(--ds-color-text-subtle)]">
          It also reshapes the bile acid pool and shifts short-chain fatty acid
          output. Downstream, this moves HbA1c, fasting glucose and HOMA-IR
          across the clinical studies in the evidence set.
        </p>
      </CollapsibleContent>

      <CollapsibleTrigger asChild>
        <Button variant="linktext" size="sm" className="mt-2 px-0">
          {open ? "Show less" : "Show more"}
          <ChevronDownIcon
            className={open ? "rotate-180 transition-transform" : "transition-transform"}
          />
        </Button>
      </CollapsibleTrigger>
    </Collapsible>
  );
}

export const ShowMore: Story = {
  name: "Show more / show less",
  render: () => <ShowMorePanel />,
};

export const DefaultOpen: Story = {
  name: "Open by default",
  render: () => (
    <Collapsible defaultOpen className="w-[420px]">
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm">
          Advanced options
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="mt-3 flex flex-col gap-1 text-sm text-[var(--ds-color-text-subtle)]">
          <li>Include predicted compounds</li>
          <li>Include in-vitro evidence</li>
          <li>Expand to related benefits</li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const Unstyled: Story = {
  name: "Unstyled (what you actually get)",
  render: () => (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-[var(--ds-color-text-subtle)]">
        With no classes applied at all — Collapsible contributes behaviour, not
        appearance.
      </p>
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    </div>
  ),
};
