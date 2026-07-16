"use client";

import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { StrategyCard, type AssessmentRow } from "@/components/hummingbird/cards/strategy-card";
import { CardGrid } from "@/components/hummingbird/card-grid";

/* ─────────────────────────────────────────────────────────────────────────
 * StrategyCard v2, Hummingbird Strategies view.
 *
 * Source mock:  anna's mocks 4-29-26/strategies view.png
 * Figma source: node 26585:379616 (StrategyCard v2 Components)
 *
 * v2 changes from v1:
 *   - Lightbulb icon replaces the bare header
 *   - Assessment table is now a bordered table (not free-floating rows)
 *   - Single "Explore compounds" Secondary CTA (removed "Tell me more" outline)
 *   - Hover state: deeper shadow + bolder border + row text steps to default
 *   - Favorite star ghost button fades in on hover; pins when favorited
 *
 * Favorite behavior (Grid story):
 *   - Clicking the star toggles immediately (visual confirmation only)
 *   - Favorites persist to localStorage under FAVORITES_STORAGE_KEY
 *   - On next page load / navigation, favorited cards sort to the top
 *   - No re-ordering during the current session
 * ───────────────────────────────────────────────────────────────────────── */

// ─── Demo data ───────────────────────────────────────────────────────────────

type StrategyDef = {
  id: string;
  oneLiner: string;
  description: string;
  evidence: AssessmentRow[];
};

const DEMO_STRATEGIES: StrategyDef[] = [
  {
    id: "strategy-mtOR",
    oneLiner: "Stimulate mTOR / IGF-1 signaling",
    description: "Amino acid sensing → increased casein synthesis.",
    evidence: [
      { label: "Evidence",    detail: "Significant evidence",  status: "success" },
      { label: "Feasibility", detail: "Probable",              status: "success" },
      { label: "Legal",       detail: "No existing patents",   status: "success" },
    ],
  },
  {
    id: "strategy-myostatin",
    oneLiner: "Block myostatin pathway via flavonoid combinations.",
    description: "Inhibits myostatin signaling to retain lean mass; well-documented in murine models.",
    evidence: [
      { label: "Evidence",    detail: "Strong literature support",   status: "success" },
      { label: "Feasibility", detail: "GRAS ingredients",            status: "success" },
      { label: "Legal",       detail: "Clear freedom to operate",    status: "success" },
    ],
  },
  {
    id: "strategy-pgc1a",
    oneLiner: "Boost mitochondrial biogenesis via PGC-1α activators.",
    description: "Increases energy efficiency in muscle tissue to offset GLP-1-induced fatigue.",
    evidence: [
      { label: "Evidence",    detail: "Moderate literature, strong predicted signal", status: "warning" },
      { label: "Feasibility", detail: "GRAS ingredients, stable formulation",         status: "success" },
      { label: "Legal",       detail: "Two patents, workaround feasible",             status: "warning" },
    ],
  },
  {
    id: "strategy-satiety",
    oneLiner: "Suppress satiety hormones via gut-bitter receptors.",
    description: "Counter the appetite-suppressing effect of GLP-1. Blocked by IP and safety constraints.",
    evidence: [
      { label: "Evidence",    detail: "Thin literature, low signal",                  status: "critical" },
      { label: "Feasibility", detail: "Counters the drug's intended effect",           status: "critical" },
      { label: "Legal",       detail: "Core patents held by GLP-1 manufacturers",     status: "critical" },
    ],
  },
];

// ─── Storybook meta ──────────────────────────────────────────────────────────

const meta = {
  title: "Components/Cards/Strategy",
  component: StrategyCard,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    isFavorited: { control: "boolean" },
  },
} satisfies Meta<typeof StrategyCard>;

export default meta;
type Story = StoryObj<typeof meta>;
// Gallery stories build their own set of cards, so there is no single instance
// for args to describe. They opt out of the args contract.
type GalleryStory = StoryObj;

// ─── Single-card stories ──────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    oneLiner:    "Stimulate mTOR / IGF-1 signaling",
    description: "Amino acid sensing → increased casein synthesis.",
    evidence: [
      { label: "Evidence",    detail: "Significant evidence", status: "success" },
      { label: "Feasibility", detail: "Probable",             status: "success" },
      { label: "Legal",       detail: "No existing patents",  status: "success" },
    ],
  },
};

export const Favorited: Story = {
  args: {
    ...Default.args,
    isFavorited: true,
  },
};

export const Mixed: Story = {
  args: {
    oneLiner:    "Boost mitochondrial biogenesis via PGC-1α activators.",
    description: "Increases energy efficiency in muscle tissue to offset GLP-1-induced fatigue and lean mass loss.",
    evidence: [
      { label: "Evidence",    detail: "Moderate literature, strong predicted signal", status: "warning" },
      { label: "Feasibility", detail: "GRAS ingredients, stable formulation",         status: "success" },
      { label: "Legal",       detail: "Two patents, workaround feasible",             status: "warning" },
    ],
  },
};

export const Blocked: Story = {
  args: {
    oneLiner:    "Suppress satiety hormones via gut-bitter receptors.",
    description: "Counter the appetite-suppressing effect of GLP-1 by activating TAS2R receptors. Mechanism is plausible but blocked by IP and safety constraints.",
    evidence: [
      { label: "Evidence",    detail: "Thin literature, low predictive signal",       status: "critical" },
      { label: "Feasibility", detail: "Counters the drug's intended effect",           status: "critical" },
      { label: "Legal",       detail: "Core patents held by GLP-1 manufacturers",     status: "critical" },
    ],
  },
};

export const AllGreen: Story = {
  args: {
    oneLiner:    "Block myostatin pathway via flavonoid combinations.",
    description: "Inhibits myostatin signaling to retain lean mass; well-documented in murine models and several human trials.",
    evidence: [
      { label: "Evidence",    detail: "Strong literature support + matching predictions", status: "success" },
      { label: "Feasibility", detail: "GRAS ingredients, stable formulation",              status: "success" },
      { label: "Legal",       detail: "Clear freedom to operate",                          status: "success" },
    ],
  },
};

// ─── Grid story, deferred-sort favorites ─────────────────────────────────────
//
// Behavior:
//   • Star toggles immediately (visual confirmation, internal state in StrategyCard)
//   • Favorite state persists to localStorage on every toggle
//   • Card ORDER is frozen at mount, derived from localStorage at that moment
//   • Navigating away and back (or refreshing) re-reads localStorage → favorited
//     cards sort to the top of the grid
//
// To test: favorite a card, then navigate away from this story and back.

const FAVORITES_STORAGE_KEY = "hummingbird-strategy-favorites-demo";

function readFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? new Set<string>(JSON.parse(raw)) : new Set<string>();
  } catch {
    return new Set<string>();
  }
}

function StrategiesGrid() {
  // Live favorites Set, updates immediately on click so star reflects truth.
  const [favorites, setFavorites] = React.useState<Set<string>>(readFavorites);

  // Sort order is frozen at mount. On the next mount (navigate away → back, or
  // browser refresh), readFavorites() re-runs and the sorted order updates.
  // Within a session, cards never jump around.
  const [sortedStrategies] = React.useState<StrategyDef[]>(() => {
    const init = readFavorites();
    return [
      ...DEMO_STRATEGIES.filter((s) => init.has(s.id)),
      ...DEMO_STRATEGIES.filter((s) => !init.has(s.id)),
    ];
  });

  const handleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...next]));
      } catch { /* storage unavailable, star still toggles visually */ }
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[12px] font-mono text-[var(--ds-color-text-subtle)]">
        Favorite a card, then navigate away and back to see it sort to the top.
      </p>
      {/* Shared CardGrid: locked 300/420 bounds, cards fill left to right then
          down. overflow-hidden is a last-resort guard against cell escape. */}
      <CardGrid className="overflow-hidden rounded-lg bg-[var(--ds-color-surface-alt)] p-6">
        {sortedStrategies.map((strategy) => (
          <StrategyCard
            key={strategy.id}
            oneLiner={strategy.oneLiner}
            description={strategy.description}
            evidence={strategy.evidence}
            isFavorited={favorites.has(strategy.id)}
            onFavorite={() => handleFavorite(strategy.id)}
          />
        ))}
      </CardGrid>
    </div>
  );
}

export const Grid: GalleryStory = {
  parameters: { layout: "padded" },
  render: () => <StrategiesGrid />,
};
