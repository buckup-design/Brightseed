import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { StrategyCard } from "@/components/forager/cards/strategy-card";

/* ─────────────────────────────────────────────────────────────────────────
 * StrategyCard — Forager Strategies view.
 * Source mock: anna's mocks 4-29-26/strategies view.png
 *
 * Anna's mocs use four identical placeholder strategy cards. The stories
 * below replace those placeholders with the kind of content the live
 * surface would carry (GLP-1 muscle retention goal, four strategy candidates).
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Forager/Cards/Strategy Card",
  component: StrategyCard,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof StrategyCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    oneLiner: "Activate mTOR via leucine-rich phytocompounds.",
    description:
      "Targets the leucine-mTOR axis to preserve muscle protein synthesis during GLP-1-induced caloric deficit.",
    evidence: [
      {
        label: "Evidence",
        detail: "what's in literature + predicted",
        status: "success",
      },
      {
        label: "Feasibility",
        detail: "formula and safety concerns",
        status: "warning",
      },
      {
        label: "Legal",
        detail: "freedom to operate",
        status: "critical",
      },
    ],
  },
};

export const AllGreen: Story = {
  args: {
    oneLiner: "Block myostatin pathway via flavonoid combinations.",
    description:
      "Inhibits myostatin signaling to retain lean mass; well-documented in murine models and several human trials.",
    evidence: [
      {
        label: "Evidence",
        detail: "strong literature support + matching predictions",
        status: "success",
      },
      {
        label: "Feasibility",
        detail: "GRAS ingredients, stable formulation",
        status: "success",
      },
      {
        label: "Legal",
        detail: "clear freedom to operate",
        status: "success",
      },
    ],
  },
};

export const Mixed: Story = {
  args: {
    oneLiner: "Boost mitochondrial biogenesis via PGC-1α activators.",
    description:
      "Increases energy efficiency in muscle tissue to offset GLP-1-induced fatigue and lean mass loss.",
    evidence: [
      {
        label: "Evidence",
        detail: "moderate literature, strong predictive signal",
        status: "warning",
      },
      {
        label: "Feasibility",
        detail: "GRAS ingredients, stable formulation",
        status: "success",
      },
      {
        label: "Legal",
        detail: "two relevant patents — workaround feasible",
        status: "warning",
      },
    ],
  },
};

export const Blocked: Story = {
  args: {
    oneLiner: "Suppress satiety hormones via gut-bitter receptors.",
    description:
      "Counter the appetite-suppressing effect of GLP-1 by activating TAS2R receptors. Mechanism is plausible but blocked by IP and safety constraints.",
    evidence: [
      {
        label: "Evidence",
        detail: "thin literature, low predictive signal",
        status: "critical",
      },
      {
        label: "Feasibility",
        detail: "would directly counter the drug's intended effect",
        status: "critical",
      },
      {
        label: "Legal",
        detail: "core patents held by GLP-1 manufacturers",
        status: "critical",
      },
    ],
  },
};

export const Grid: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl bg-[var(--color-surface-alt)] p-6 rounded-lg">
      <StrategyCard
        oneLiner="Activate mTOR via leucine-rich phytocompounds."
        description="Targets the leucine-mTOR axis to preserve muscle protein synthesis during GLP-1-induced caloric deficit."
        evidence={[
          { label: "Evidence", detail: "what's in literature + predicted", status: "success" },
          { label: "Feasibility", detail: "formula and safety concerns", status: "warning" },
          { label: "Legal", detail: "freedom to operate", status: "critical" },
        ]}
      />
      <StrategyCard
        oneLiner="Block myostatin pathway via flavonoid combinations."
        description="Inhibits myostatin signaling to retain lean mass; well-documented in murine models."
        evidence={[
          { label: "Evidence", detail: "strong literature support", status: "success" },
          { label: "Feasibility", detail: "GRAS ingredients", status: "success" },
          { label: "Legal", detail: "clear freedom to operate", status: "success" },
        ]}
      />
      <StrategyCard
        oneLiner="Boost mitochondrial biogenesis via PGC-1α activators."
        description="Increases energy efficiency in muscle tissue to offset GLP-1-induced fatigue."
        evidence={[
          { label: "Evidence", detail: "moderate literature, strong predicted signal", status: "warning" },
          { label: "Feasibility", detail: "GRAS ingredients", status: "success" },
          { label: "Legal", detail: "two patents — workaround feasible", status: "warning" },
        ]}
      />
      <StrategyCard
        oneLiner="Suppress satiety hormones via gut-bitter receptors."
        description="Counter the appetite-suppressing effect of GLP-1. Blocked by IP and safety constraints."
        evidence={[
          { label: "Evidence", detail: "thin literature, low signal", status: "critical" },
          { label: "Feasibility", detail: "counters the drug's intended effect", status: "critical" },
          { label: "Legal", detail: "core patents held by GLP-1 manufacturers", status: "critical" },
        ]}
      />
    </div>
  ),
};
