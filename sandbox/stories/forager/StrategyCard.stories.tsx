import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { StrategyCard } from "@/components/forager/cards/strategy-card";

/* ─────────────────────────────────────────────────────────────────────────
 * StrategyCard v2 — Forager Strategies view.
 *
 * Source mock:  anna's mocks 4-29-26/strategies view.png
 * Figma source: node 26585:379616 (StrategyCard v2 Components)
 *
 * v2 changes from v1:
 *   - Lightbulb icon replaces the bare header
 *   - Assessment table is now a bordered table (not free-floating rows)
 *   - Single "Explore compounds" Secondary CTA (removed "Tell me more" outline)
 *   - Hover state: deeper shadow + bolder border + row text steps to default
 *   - Favorite star ghost button fades in on hover; pins when isFavorited=true
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "DRAFT WIP/Cards/Strategy Card",
  component: StrategyCard,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    isFavorited: { control: "boolean" },
  },
} satisfies Meta<typeof StrategyCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    oneLiner: "Stimulate mTOR / IGF-1 signaling",
    description: "Amino acid sensing → increased casein synthesis.",
    evidence: [
      {
        label: "Evidence",
        detail: "Significant evidence",
        status: "success",
      },
      {
        label: "Feasibility",
        detail: "Probable",
        status: "success",
      },
      {
        label: "Legal",
        detail: "No existing patents",
        status: "success",
      },
    ],
  },
};

// ─── Favorited ──────────────────────────────────────────────────────────────
// Star is always visible (not hover-only) when a card is pinned.

export const Favorited: Story = {
  args: {
    ...Default.args,
    isFavorited: true,
  },
};

// ─── Mixed status ───────────────────────────────────────────────────────────

export const Mixed: Story = {
  args: {
    oneLiner: "Boost mitochondrial biogenesis via PGC-1α activators.",
    description:
      "Increases energy efficiency in muscle tissue to offset GLP-1-induced fatigue and lean mass loss.",
    evidence: [
      {
        label: "Evidence",
        detail: "Moderate literature, strong predicted signal",
        status: "warning",
      },
      {
        label: "Feasibility",
        detail: "GRAS ingredients, stable formulation",
        status: "success",
      },
      {
        label: "Legal",
        detail: "Two patents — workaround feasible",
        status: "warning",
      },
    ],
  },
};

// ─── Blocked ─────────────────────────────────────────────────────────────────

export const Blocked: Story = {
  args: {
    oneLiner: "Suppress satiety hormones via gut-bitter receptors.",
    description:
      "Counter the appetite-suppressing effect of GLP-1 by activating TAS2R receptors. Mechanism is plausible but blocked by IP and safety constraints.",
    evidence: [
      {
        label: "Evidence",
        detail: "Thin literature, low predictive signal",
        status: "critical",
      },
      {
        label: "Feasibility",
        detail: "Counters the drug's intended effect",
        status: "critical",
      },
      {
        label: "Legal",
        detail: "Core patents held by GLP-1 manufacturers",
        status: "critical",
      },
    ],
  },
};

// ─── AllGreen ────────────────────────────────────────────────────────────────

export const AllGreen: Story = {
  args: {
    oneLiner: "Block myostatin pathway via flavonoid combinations.",
    description:
      "Inhibits myostatin signaling to retain lean mass; well-documented in murine models and several human trials.",
    evidence: [
      {
        label: "Evidence",
        detail: "Strong literature support + matching predictions",
        status: "success",
      },
      {
        label: "Feasibility",
        detail: "GRAS ingredients, stable formulation",
        status: "success",
      },
      {
        label: "Legal",
        detail: "Clear freedom to operate",
        status: "success",
      },
    ],
  },
};

// ─── Grid ────────────────────────────────────────────────────────────────────
// Four cards on the sand background that the Strategies view uses.

export const Grid: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl bg-[var(--color-surface-alt)] p-6 rounded-lg">
      <StrategyCard
        oneLiner="Stimulate mTOR / IGF-1 signaling"
        description="Amino acid sensing → increased casein synthesis."
        evidence={[
          { label: "Evidence", detail: "Significant evidence", status: "success" },
          { label: "Feasibility", detail: "Probable", status: "success" },
          { label: "Legal", detail: "No existing patents", status: "success" },
        ]}
        isFavorited
      />
      <StrategyCard
        oneLiner="Block myostatin pathway via flavonoid combinations."
        description="Inhibits myostatin signaling to retain lean mass; well-documented in murine models."
        evidence={[
          { label: "Evidence", detail: "Strong literature support", status: "success" },
          { label: "Feasibility", detail: "GRAS ingredients", status: "success" },
          { label: "Legal", detail: "Clear freedom to operate", status: "success" },
        ]}
      />
      <StrategyCard
        oneLiner="Boost mitochondrial biogenesis via PGC-1α activators."
        description="Increases energy efficiency in muscle tissue to offset GLP-1-induced fatigue."
        evidence={[
          { label: "Evidence", detail: "Moderate literature, strong predicted signal", status: "warning" },
          { label: "Feasibility", detail: "GRAS ingredients, stable formulation", status: "success" },
          { label: "Legal", detail: "Two patents — workaround feasible", status: "warning" },
        ]}
      />
      <StrategyCard
        oneLiner="Suppress satiety hormones via gut-bitter receptors."
        description="Counter the appetite-suppressing effect of GLP-1. Blocked by IP and safety constraints."
        evidence={[
          { label: "Evidence", detail: "Thin literature, low signal", status: "critical" },
          { label: "Feasibility", detail: "Counters the drug's intended effect", status: "critical" },
          { label: "Legal", detail: "Core patents held by GLP-1 manufacturers", status: "critical" },
        ]}
      />
    </div>
  ),
};
