import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { toast } from "sonner";

import {
  ResultDetailSheet,
  type ResultDetail,
} from "@/components/hummingbird/result-detail";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

/* ─────────────────────────────────────────────────────────────────────────
 * ResultDetailSheet — the detail slide-over a ResultCard opens into, and where
 * "Generate report" bridges to the Reports tab. One component serves a single
 * compound and a combination (predicted results don't open a detail).
 *
 * A fixed header (glyph + name, benefit, the ScoreMeter + evidence, Generate
 * report + Pin) over a scrolling body: five always-on sections, then seven
 * accordions (How it works open by default). Scroll the body, expand an
 * accordion, toggle the Pin, and "Generate report" fires a toast.
 * ───────────────────────────────────────────────────────────────────────── */

const RESVERATROL: ResultDetail = {
  type: "single",
  name: "Resveratrol",
  benefit: "Longevity & Cellular",
  score: 0.85,
  evidence: "clinical",
  healthBenefit:
    "A stilbenoid polyphenol associated with healthy cellular aging and metabolic resilience. Human trials report improved insulin sensitivity and endothelial function, most consistently in metabolically stressed populations.",
  pathways: [
    "AMPK → SIRT1 → PGC-1α — mitochondrial biogenesis",
    "NF-κB inhibition — lowered inflammatory signaling",
    "Nrf2 activation — antioxidant response element",
  ],
  targets: ["SIRT1", "AMPK", "PGC-1α", "NF-κB", "mTOR", "NQO1"],
  biomarkers: ["Fasting glucose", "HbA1c", "hs-CRP", "LDL-C"],
  claims: [
    "Supports healthy cellular aging",
    "Helps maintain metabolic health",
    "Promotes the body's antioxidant defenses",
  ],
  howItWorks:
    "Resveratrol activates SIRT1 and AMPK, converging on PGC-1α to raise mitochondrial biogenesis and fatty-acid oxidation — the same axis engaged by caloric restriction. It secondarily dampens NF-κB-driven inflammation.",
  confidenceNote:
    "85% reflects multiple randomized human trials with consistent direction of effect on glycemic and inflammatory markers, tempered by heterogeneity in dose and low oral bioavailability.",
  naturalSources: [
    { species: "Vitis vinifera", common: "Grape", gras: true },
    { species: "Polygonum cuspidatum", common: "Japanese knotweed" },
    { species: "Arachis hypogaea", common: "Peanut", gras: true },
  ],
  dosage: [
    { label: "Typical dose", value: "150–500 mg / day" },
    { label: "HED (from animal)", value: "~5 mg / kg" },
    { label: "Delivery format", value: "Capsule" },
  ],
  adme: [
    { label: "Oral bioavailability", value: "Low (<1%)" },
    { label: "Half-life", value: "1–3 h" },
    { label: "Metabolism", value: "Hepatic glucuronidation" },
    { label: "Solubility", value: "Lipophilic" },
  ],
  ipNote:
    "Composition-of-matter space is crowded around resveratrol formulations, but delivery systems that raise bioavailability (e.g. co-crystals, micellar dispersions) show open white space worth a freedom-to-operate review.",
  references: [
    { authors: "Baur JA, et al.", year: "2006", journal: "Nature", ref: "PMID: 17086191" },
    { authors: "Timmers S, et al.", year: "2011", journal: "Cell Metabolism", ref: "PMID: 22055504" },
    { authors: "Berman AY, et al.", year: "2017", journal: "npj Precision Oncology", ref: "PMID: 29218234" },
  ],
};

const COMBO: ResultDetail = {
  type: "combo",
  name: "Berberine + Sulforaphane",
  benefit: "Metabolic & Weight",
  score: 0.88,
  evidence: "clinical",
  healthBenefit:
    "A complementary pair for glucose control: berberine drives AMPK-dependent glucose uptake while sulforaphane restrains hepatic gluconeogenesis via Nrf2, together covering both peripheral and hepatic arms of dysglycemia.",
  pathways: [
    "Berberine: AMPK activation — GLUT4 translocation",
    "Sulforaphane: Nrf2 → suppressed hepatic gluconeogenesis",
    "Shared: reduced oxidative and inflammatory tone",
  ],
  targets: ["AMPK", "Nrf2", "PCSK9", "DPP-4", "G6Pase", "PEPCK"],
  biomarkers: ["Fasting glucose", "HbA1c", "HOMA-IR", "ALT"],
  claims: [
    "Supports healthy blood-sugar management",
    "Complements diet for metabolic health",
    "Helps maintain healthy lipid levels",
  ],
  howItWorks:
    "Berberine activates AMPK to increase insulin-independent glucose uptake; sulforaphane induces Nrf2, which transcriptionally suppresses the gluconeogenic genes G6Pase and PEPCK. The two act on distinct nodes, so their glucose-lowering effects are additive rather than redundant.",
  confidenceNote:
    "88% reflects independent clinical evidence for each compound on glycemic endpoints plus a mechanistic rationale for additivity; direct head-to-head combination trials remain limited.",
  naturalSources: [
    { species: "Berberis vulgaris", common: "Barberry" },
    { species: "Brassica oleracea", common: "Broccoli", gras: true },
    { species: "Coptis chinensis", common: "Goldthread" },
  ],
  dosage: [
    { label: "Berberine", value: "500 mg × 2 / day" },
    { label: "Sulforaphane", value: "10–30 mg / day" },
    { label: "Delivery format", value: "Capsule" },
  ],
  adme: [
    { label: "Berberine bioavailability", value: "Low (~5%)" },
    { label: "Sulforaphane half-life", value: "~2 h" },
    { label: "Interaction", value: "None flagged" },
    { label: "Metabolism", value: "Hepatic / gut microbial" },
  ],
  ipNote:
    "No patent we found claims this specific pairing for glycemic control. The combination may be defensible as a composition-of-matter or method-of-use claim, pending a full freedom-to-operate analysis.",
  references: [
    { authors: "Yin J, et al.", year: "2008", journal: "Metabolism", ref: "PMID: 18387376" },
    { authors: "Axelsson AS, et al.", year: "2017", journal: "Science Translational Medicine", ref: "PMID: 28615356" },
  ],
};

function DetailHost({ detail }: { detail: ResultDetail }) {
  const [open, setOpen] = React.useState(true);
  const [favorited, setFavorited] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        View details
      </Button>
      <ResultDetailSheet
        detail={detail}
        open={open}
        onOpenChange={setOpen}
        favorited={favorited}
        onFavorite={setFavorited}
        onGenerateReport={() => toast(`Generating report for “${detail.name}”…`)}
      />
      <Toaster />
    </>
  );
}

const meta = {
  title: "WORK IN PROGRESS/Result Detail",
  component: ResultDetailSheet,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ResultDetailSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A single compound — orange glyph, Confidence %, an inline evidence chip. */
export const Single: Story = { render: () => <DetailHost detail={RESVERATROL} /> };

/** A combination — lime glyph, Synergy %, a two-name title. */
export const Combination: Story = { render: () => <DetailHost detail={COMBO} /> };
