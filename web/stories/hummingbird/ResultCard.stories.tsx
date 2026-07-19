import type { Decorator, Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import {
  ResultCard,
  type ComboResult,
  type PredictedResult,
  type Result,
  type SingleResult,
} from "@/components/hummingbird/cards/result-card";

/* ─────────────────────────────────────────────────────────────────────────
 * ResultCard — a Workspace result card, in its three types. The reconciled
 * successor to the retired CompoundCard: the live benefit + biomarker +
 * confidence model, with the shared ScoreMeter in the footer.
 *
 *   single     one compound · orange glyph · CONFIDENCE % · inline evidence chip
 *   combo      a synergy pair · lime glyph · SYNERGY % · coloured left border
 *              (green clinical / amber animal) + the same chip
 *   predicted  ML-predicted · lavender glyph · a 0–1 BIOACTIVITY score · green
 *              "Predicted" badge + faint forest body tint
 *
 * The card body reads --ds-* (leaf app-surface convention); the embedded
 * ScoreMeter is the strict --c-* reused atom. Click name/targets to route (a
 * no-op here). Hover a card to reveal the favorite star — it's fully
 * controlled, so these stories own the favorite state.
 * ───────────────────────────────────────────────────────────────────────── */

const SINGLE: SingleResult = {
  type: "single",
  name: "Resveratrol",
  benefit: "Longevity & Cellular",
  score: 0.85,
  targets: ["SIRT1", "AMPK", "NF-κB"],
  categories: ["Polyphenol", "Antioxidant"],
  evidence: "clinical",
};

const COMBO: ComboResult = {
  type: "combo",
  names: ["Berberine", "Sulforaphane"],
  benefit: "Metabolic & Weight",
  score: 0.88,
  targets: ["AMPK", "Nrf2", "PCSK9", "DPP-4"],
  evidence: "clinical",
};

const PREDICTED: PredictedResult = {
  type: "predicted",
  name: "Brightseed-HBPB0049946",
  benefit: "Cognitive & Mental",
  score: 0.82,
  targets: ["BDNF", "TrkB"],
  categories: ["Alkaloid"],
  evidence: "predicted",
};

/** The card is fully controlled; a real app owns favorite state (as ReportsList
 * does). This wrapper plays that part so the star toggles in the stories. */
function Favoritable({ result }: { result: Result }) {
  const [isFavorited, setIsFavorited] = React.useState(result.isFavorited ?? false);
  return (
    <ResultCard result={{ ...result, isFavorited }} onFavorite={setIsFavorited} />
  );
}

const meta = {
  title: "WORK IN PROGRESS/Result Card",
  component: ResultCard,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ResultCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A single card sits at its real grid-cell width (~320px), not full-bleed. */
const cardWidth: Decorator = (Story) => (
  <div className="w-[320px]">
    <Story />
  </div>
);

export const Single: Story = {
  decorators: [cardWidth],
  render: () => <Favoritable result={SINGLE} />,
};

/** A synergy pair — green left border for clinical evidence, plus the chip. */
export const Combo: Story = {
  decorators: [cardWidth],
  render: () => <Favoritable result={COMBO} />,
};

/** Animal evidence turns the COMBO border amber. */
export const ComboAnimal: Story = {
  decorators: [cardWidth],
  render: () => (
    <Favoritable
      result={{
        type: "combo",
        names: ["Quercetin", "Fisetin"],
        benefit: "Longevity & Cellular",
        score: 0.71,
        targets: ["SIRT1", "mTOR"],
        evidence: "animal",
      }}
    />
  ),
};

/** ML-predicted — a raw 0–1 bioactivity score, green badge, faint forest tint. */
export const Predicted: Story = {
  decorators: [cardWidth],
  render: () => <Favoritable result={PREDICTED} />,
};

const GRID_RESULTS: Result[] = [
  SINGLE,
  COMBO,
  PREDICTED,
  {
    type: "single",
    name: "Berberine",
    benefit: "Metabolic & Weight",
    score: 0.62,
    targets: ["AMPK", "PCSK9"],
    evidence: "animal",
  },
  {
    type: "single",
    name: "Sulforaphane",
    benefit: "Immune & Anti-inflammatory",
    score: 0.44,
    targets: ["Nrf2", "NF-κB", "HO-1"],
    categories: ["Isothiocyanate"],
    evidence: "in-vitro",
  },
  {
    type: "predicted",
    name: "Brightseed-HBPB0102338",
    benefit: "Gut & Digestive",
    score: 0.59,
    targets: ["ZO-1", "MUC2"],
    evidence: "predicted",
  },
];

/**
 * A mixed 3-across grid — the real test. Every region reserves its slot and the
 * footer pins to the bottom, so the cards stay the same height whether or not
 * they carry categories or a full target row. Scan the ScoreMeter fills across
 * the row to compare scores.
 */
export const Grid: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {GRID_RESULTS.map((result, i) => (
        <Favoritable key={i} result={result} />
      ))}
    </div>
  ),
};
