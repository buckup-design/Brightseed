/**
 * Real-shaped placeholder data for Hummingbird surfaces.
 *
 * Vocabulary stays consistent across Strategies / Compounds / Plants so the
 * three views read as one project. All numbers are invented; all names,
 * species, gene targets, and IP signals are real biotech vocabulary.
 *
 * Anchored in Anna's mocks (4-29-26):
 *   Goal:     "Help individuals on GLP-1 weight-loss drugs retain lean muscle mass"
 *   Strategy: "Shift microbiome towards propionate producers"
 */

import {
  displayName,
  resultKey,
  type ComboResult,
  type Result,
  type SingleResult,
} from "@/components/hummingbird/cards/result-card"
import type { ResultDetail } from "@/components/hummingbird/result-detail"

// Pillar evaluation status for a strategy's evidence / feasibility / legal axes.
// (Was imported from the now-removed ui/strategy-card; defined locally here.)
export type PillarStatus = {
  status: "positive" | "caution" | "negative"
  label: string
}

// ── Project + strategy ─────────────────────────────────────────────────────

export const PROJECT = {
  name: "GLP-1 + Lean Muscle",
  goal: "Help individuals on GLP-1 weight-loss drugs retain lean muscle mass",
  audience: "Women over 50",
  team: ["JE", "CV", "MX"],
}

export type Strategy = {
  id: string
  title: string
  mechanism: string
  evidence: PillarStatus
  feasibility: PillarStatus
  legal: PillarStatus
  isLead?: boolean
}

export const STRATEGIES: Strategy[] = [
  {
    id: "shift-propionate",
    title: "Shift microbiome towards propionate producers",
    mechanism:
      "Rumen-to-portal propionate flux drives hepatic gluconeogenesis and amino acid sparing.",
    evidence: { status: "positive", label: "Strong literature support" },
    feasibility: { status: "positive", label: "GRAS botanicals available" },
    legal: { status: "positive", label: "Open IP landscape" },
    isLead: true,
  },
  {
    id: "mtor-igf1",
    title: "Stimulate mTOR / IGF-1 signaling",
    mechanism: "Amino acid sensing increases casein synthesis and lean tissue retention.",
    evidence: { status: "positive", label: "Significant evidence" },
    feasibility: { status: "caution", label: "Doubtful at dose" },
    legal: { status: "negative", label: "Crowded patent space" },
  },
  {
    id: "rumen-nitrogen",
    title: "Improve rumen nitrogen efficiency",
    mechanism:
      "Shift fermentation to capture ammonia as microbial protein for downstream uptake.",
    evidence: { status: "caution", label: "Mixed clinical readouts" },
    feasibility: { status: "positive", label: "Well-characterized" },
    legal: { status: "caution", label: "Some white space" },
  },
  {
    id: "metabolic-stress",
    title: "Reduce metabolic stress around calving",
    mechanism:
      "Lower oxidative load during transition window; protect lean tissue from catabolic state.",
    evidence: { status: "caution", label: "Limited human data" },
    feasibility: { status: "positive", label: "Multiple candidates" },
    legal: { status: "positive", label: "Novel combination" },
  },
]

// ── Compounds ──────────────────────────────────────────────────────────────

export type CompoundSourceClass =
  | "Animal · cow"
  | "Animal · ruminant"
  | "Plant · botanical"
  | "Plant · spice"
  | "Microbial"

export type IpSignal = "IP Landscape" | "Open IP" | "Crowded IP"

export type Compound = {
  id: string
  name: string
  /** 0–100 confidence/match score. */
  score: number
  /** One-line mechanism summary. */
  mechanism: string
  /** Source taxonomy classification. */
  sourceClass: CompoundSourceClass
  /** IP situation. */
  ip: IpSignal
  /** Plant or organism the compound was first sourced from. */
  primarySource: string
  /** Gene targets the compound is predicted to modulate. */
  geneTargets: string[]
  /** Total target count beyond what's listed (e.g. "+5 more"). */
  additionalTargets?: number
}

export const COMPOUNDS: Compound[] = [
  {
    id: "carvacrol",
    name: "Carvacrol",
    score: 92,
    mechanism:
      "Selectively inhibits methanogens and gram-positive bacteria; enriches Prevotella spp.",
    sourceClass: "Animal · cow",
    ip: "IP Landscape",
    primarySource: "Origanum vulgare, Thymus vulgaris",
    geneTargets: ["IGF-1R", "PI3K", "Akt", "Ras", "Raf"],
    additionalTargets: 5,
  },
  {
    id: "cinnamaldehyde",
    name: "Cinnamaldehyde",
    score: 89,
    mechanism:
      "Inhibits hyper ammonia-producing bacteria; shifts toward propionate producers.",
    sourceClass: "Animal · ruminant",
    ip: "IP Landscape",
    primarySource: "Cinnamomum spp.",
    geneTargets: ["MUC2", "TFF3", "ZO-1", "Claudin-1"],
    additionalTargets: 5,
  },
  {
    id: "trans-anethole",
    name: "Trans-anethole",
    score: 87,
    mechanism: "Modulates Firmicutes:Bacteroidetes ratio; supports propionate fermentation.",
    sourceClass: "Animal · cow",
    ip: "Open IP",
    primarySource: "Foeniculum vulgare, Illicium verum",
    geneTargets: ["NF-kB", "PI3K", "Akt", "Ras", "Raf"],
    additionalTargets: 6,
  },
  {
    id: "berberine",
    name: "Berberine",
    score: 85,
    mechanism: "Reduces methanogenesis; shifts VFA profile toward propionate.",
    sourceClass: "Animal · ruminant",
    ip: "IP Landscape",
    primarySource: "Berberis spp., Hydrastis canadensis",
    geneTargets: ["MLCK", "HIF-1a", "Akt", "ZO-1"],
    additionalTargets: 5,
  },
  {
    id: "thymol",
    name: "Thymol",
    score: 82,
    mechanism:
      "Rumen microbiome modulation; typically co-occurs with carvacrol in essential oil blends.",
    sourceClass: "Plant · spice",
    ip: "Open IP",
    primarySource: "Thymus, Origanum",
    geneTargets: ["TLR4", "NF-kB", "iNOS"],
    additionalTargets: 4,
  },
  {
    id: "linalool",
    name: "Linalool",
    score: 78,
    mechanism: "Reduces oxidative stress markers in transitional period; complements primary effect.",
    sourceClass: "Plant · botanical",
    ip: "Open IP",
    primarySource: "Coriandrum sativum, Lavandula spp.",
    geneTargets: ["Nrf2", "HO-1", "Keap1"],
    additionalTargets: 3,
  },
]

// ── Plant sources ──────────────────────────────────────────────────────────

export type Plant = {
  id: string
  scientificName: string
  commonName: string
  mechanism: string
  /** Compounds this plant carries that are relevant to the strategy. */
  compoundsPresent: string[]
  additionalCompounds?: number
  /** Predicted bioactives identified by Forager's models. */
  predictedBioactives: string[]
  additionalBioactives?: number
  isGras: boolean
  ip: IpSignal
}

export const PLANTS: Plant[] = [
  {
    id: "foeniculum",
    scientificName: "Foeniculum vulgare",
    commonName: "Fennel",
    mechanism: "Shifts rumen microbiome towards propionate producers.",
    compoundsPresent: ["Trans-anethole", "Fenchone"],
    additionalCompounds: 2,
    predictedBioactives: ["NF-kB", "HIF-1a", "Akt", "ZO-1", "MUC2"],
    additionalBioactives: 12,
    isGras: true,
    ip: "Open IP",
  },
  {
    id: "illicium",
    scientificName: "Illicium verum",
    commonName: "Star Anise",
    mechanism:
      "Trans-anethole modulates Firmicutes:Bacteroidetes ratio; estragole reduces methane.",
    compoundsPresent: ["Trans-anethole", "Estragole", "Alpha-pinene"],
    predictedBioactives: ["MLCK", "HIF-1a", "Akt", "ZO-1", "MUC2"],
    additionalBioactives: 12,
    isGras: true,
    ip: "IP Landscape",
  },
  {
    id: "pimpinella",
    scientificName: "Pimpinella anisum",
    commonName: "Anise",
    mechanism:
      "Trans-anethole modulates Firmicutes:Bacteroidetes ratio; pseudoisoeugenol supports gut barrier.",
    compoundsPresent: ["Trans-anethole", "Pseudoisoeugenol", "Anisaldehyde"],
    predictedBioactives: ["MLCK", "HIF-1a", "Akt", "ZO-1", "MUC2"],
    additionalBioactives: 12,
    isGras: true,
    ip: "Open IP",
  },
  {
    id: "trachyspermum",
    scientificName: "Trachyspermum ammi",
    commonName: "Ajwain",
    mechanism: "Thymol-rich profile; predicted synergy with Foeniculum across rumen targets.",
    compoundsPresent: ["Thymol", "Carvacrol", "Para-cymene"],
    predictedBioactives: ["TLR4", "NF-kB", "iNOS", "Nrf2"],
    additionalBioactives: 9,
    isGras: true,
    ip: "Open IP",
  },
]

// ── Chat thread (placeholder for the chat panel) ───────────────────────────

export type ChatMessage =
  | { role: "user"; text: string }
  | { role: "assistant"; text: string; meta?: string; results?: Result[] }
  | { role: "user-yes" }

export const SAMPLE_THREAD: ChatMessage[] = [
  {
    role: "assistant",
    text:
      "What's interesting here: Trans-anethole from fennel has the lowest IP activity of any compound on the list, and one of the cattle studies showed a statistically significant increase in milk protein percentage (+0.18%). The fennel plant itself is GRAS. There's almost no prior art on fennel-derived feed supplements for rumen modulation specifically.",
  },
  {
    role: "assistant",
    text:
      "Would you like to see what fennel-containing or anethole-rich plants are in the dataset, and do any also contain secondary compounds that could strengthen the rumen microbiome effect?",
  },
  { role: "user-yes" },
  {
    role: "assistant",
    text:
      "Foeniculum vulgare + Illicium verum together cover trans-anethole at high dose plus fenchone, which has separate antimethanogenic evidence. No patent we found claims this specific combination for ruminant feed application. The combination may be patentable as a feed additive composition. I've saved this project for you.",
  },
]

// ── Workspace results (the signature canvas fixture) ────────────────────────
//
// A weight-management result set matching the live product's canonical query
// ("compounds that encourage fat loss in women aged 35-50"). A deliberate mix
// across the discriminated union and every EvidenceClass so the Evidence Filter
// Bar counts are interesting: 4 clinical · 4 animal · 2 in-vitro · 3 predicted,
// plus one 'none'-evidence single (Lipoic acid) that matches NO evidence pill —
// so the four class pills correctly sum to 13 < 14 (the gap is the 'none' row).
// Scores are normalized 0–1; single = confidence, combo = synergy, predicted =
// bioactivity. Names are real biotech vocabulary; numbers are invented.

export const SAMPLE_WORKSPACE_RESULTS: Result[] = [
  {
    type: "single",
    name: "Epigallocatechin gallate",
    benefit: "Weight Management",
    score: 0.88,
    evidence: "clinical",
    targets: ["AMPK", "PPARα", "UCP1", "COMT"],
    categories: ["Catechin", "Polyphenol"],
  },
  {
    type: "single",
    name: "Capsaicin",
    benefit: "Thermogenesis",
    score: 0.84,
    evidence: "clinical",
    targets: ["TRPV1", "UCP1", "PPARα"],
    categories: ["Alkaloid", "Thermogenic"],
  },
  {
    type: "single",
    name: "Genistein",
    benefit: "Lipid Metabolism",
    score: 0.79,
    evidence: "clinical",
    targets: ["PPARγ", "ERβ", "FASN"],
    categories: ["Isoflavone", "Soy"],
  },
  {
    type: "single",
    name: "Berberine",
    benefit: "Glucose Metabolism",
    score: 0.86,
    evidence: "animal",
    isFavorited: true,
    targets: ["AMPK", "PCSK9", "GLUT4"],
    categories: ["Alkaloid"],
  },
  {
    type: "single",
    name: "o-Coumaric acid",
    benefit: "Weight Management",
    score: 0.82,
    evidence: "animal",
    targets: ["FASN", "SREBP-1c"],
    categories: ["Phenolic", "Antioxidant"],
  },
  {
    type: "single",
    name: "Puerarin",
    benefit: "Weight Management",
    score: 0.74,
    evidence: "animal",
    targets: ["PPARα", "GLUT4", "ACC"],
    categories: ["Isoflavone", "Kudzu"],
  },
  {
    type: "single",
    name: "Myricetin",
    benefit: "Lipid Metabolism",
    score: 0.68,
    evidence: "in-vitro",
    targets: ["FASN", "ACC", "SCD1"],
    categories: ["Flavonoid", "Antioxidant"],
  },
  {
    type: "single",
    name: "Syringic acid",
    benefit: "Adipogenesis",
    score: 0.61,
    evidence: "in-vitro",
    targets: ["PPARγ"],
    categories: ["Phenolic"],
  },
  {
    type: "single",
    name: "Lipoic acid",
    benefit: "Metabolic Health",
    score: 0.66,
    evidence: "none",
    targets: ["AMPK", "Nrf2"],
    categories: ["Antioxidant", "Coenzyme"],
  },
  {
    type: "combo",
    names: ["Epigallocatechin gallate", "Capsaicin"],
    benefit: "Thermogenesis",
    score: 0.81,
    evidence: "clinical",
    targets: ["UCP1", "TRPV1", "PPARα"],
    categories: ["Synergy"],
  },
  {
    type: "combo",
    names: ["Berberine", "Sulforaphane"],
    benefit: "Glucose Metabolism",
    score: 0.77,
    evidence: "animal",
    targets: ["AMPK", "Nrf2"],
    categories: ["Synergy"],
  },
  {
    type: "predicted",
    name: "Brightseed-HBPB0049946",
    benefit: "Weight Management",
    score: 0.85,
    evidence: "predicted",
    targets: ["PPARα", "AMPK", "FGF21"],
    categories: ["Polyphenol"],
  },
  {
    type: "predicted",
    name: "Brightseed-HBPB0102277",
    benefit: "Lipid Metabolism",
    score: 0.72,
    evidence: "predicted",
    targets: ["FASN", "SREBP-1c"],
    categories: ["Flavonoid"],
  },
  {
    type: "predicted",
    name: "Brightseed-HBPB0088120",
    benefit: "Adipogenesis",
    score: 0.69,
    evidence: "predicted",
    targets: ["PPARγ", "C/EBPα"],
    categories: ["Terpenoid"],
  },
]

// ── Workspace chat thread ───────────────────────────────────────────────────
//
// Mirrors the live product's thread for the fat-loss query: a user prompt, an
// agent answer that surfaces the top results inline, a follow-up offer, a "Yes",
// and a combination answer. The inline `results` reuse the SAMPLE_WORKSPACE_
// RESULTS objects, so a card favorited in chat and in the grid stay in sync.

export const SAMPLE_WORKSPACE_THREAD: ChatMessage[] = [
  {
    role: "user",
    text: "I'm looking for compounds that encourage fat loss in women aged 35–50",
  },
  {
    role: "assistant",
    meta: 'Found 132 results via Search Ingredients, "weight management"',
    text:
      "I searched for compounds that support weight management — including fat loss — in women ages 35–50. Our database returned 132 compounds: 32 previously studied and 100 predicted in silico. Here are the strongest studied leads:",
    results: [
      SAMPLE_WORKSPACE_RESULTS[0],
      SAMPLE_WORKSPACE_RESULTS[1],
      SAMPLE_WORKSPACE_RESULTS[3],
    ],
  },
  {
    role: "assistant",
    text:
      "Would you like to see compound combinations that could strengthen the thermogenic effect, and whether any pairing has open IP?",
  },
  { role: "user-yes" },
  {
    role: "assistant",
    text:
      "Epigallocatechin gallate + Capsaicin is the standout pairing: EGCG sustains fat oxidation while capsaicin drives acute thermogenesis through TRPV1, and a clinical crossover study showed additive energy-expenditure gains. No patent we found claims this specific combination for a weight-management formulation.",
    results: [SAMPLE_WORKSPACE_RESULTS[9]],
  },
]

// ── Result detail fixtures + resolver ───────────────────────────────────────
//
// Three fully-authored details (one clinical single, one animal single, one
// clinical combo) show the detail slide-over at full richness. resolveWorkspace
// Detail() returns the authored entry when present, else synthesizes a coherent
// minimal detail from the result itself — so every single/combo card opens a
// sensible sheet in the demo. It returns undefined for predicted results, which
// have no detail (ResultDetailType is single | combo); the canvas guards on that.
//
// Invariant the favorite/pin sync depends on: every detail's `name` equals
// resultKey(result) (= displayName). The authored entries below and the
// synthesized fallback both hold to it.

export const WORKSPACE_DETAILS: Record<string, ResultDetail> = {
  "Epigallocatechin gallate": {
    type: "single",
    name: "Epigallocatechin gallate",
    benefit: "Weight Management",
    score: 0.88,
    evidence: "clinical",
    healthBenefit:
      "EGCG, the principal catechin in green tea, supports weight management by sustaining fat oxidation and modestly raising resting energy expenditure. Effects are strongest when paired with caffeine and daily activity.",
    pathways: [
      "AMPK activation → increased fatty-acid β-oxidation",
      "Catechol-O-methyltransferase (COMT) inhibition → prolonged noradrenergic thermogenesis",
      "Down-regulation of lipogenic FASN / SREBP-1c",
    ],
    targets: ["AMPK", "PPARα", "UCP1", "COMT", "FASN"],
    biomarkers: ["Resting energy expenditure", "Respiratory quotient", "Fasting insulin"],
    claims: [
      "Supports healthy fat metabolism",
      "Helps maintain energy expenditure",
      "Antioxidant support for metabolic health",
    ],
    howItWorks:
      "By inhibiting COMT, EGCG slows the breakdown of noradrenaline, extending the sympathetic signal that mobilizes fat. In parallel it activates AMPK in muscle and liver, shifting cells toward fatty-acid oxidation over storage.",
    confidenceNote:
      "High confidence: multiple randomized human trials report small but consistent increases in 24-hour energy expenditure and fat oxidation, reinforced by a well-characterized mechanism.",
    naturalSources: [
      { species: "Camellia sinensis", common: "Green tea", gras: true },
      { species: "Camellia sinensis", common: "White tea", gras: true },
    ],
    dosage: [
      { label: "Typical study dose", value: "300–400 mg/day" },
      { label: "With caffeine", value: "Additive effect" },
      { label: "Upper intake (supplemental)", value: "≤ 800 mg/day EGCG" },
    ],
    adme: [
      { label: "Oral bioavailability", value: "Low (~0.1–0.3%)" },
      { label: "Tmax", value: "1.3–2.2 h" },
      { label: "Half-life", value: "3–5 h" },
      { label: "Metabolism", value: "Methylation, glucuronidation" },
    ],
    ipNote:
      "Composition-of-matter is long expired; open IP for the molecule itself. Formulation and delivery patents (enhanced-bioavailability EGCG) are active — a novel co-formulation may be defensible.",
    references: [
      {
        authors: "Dulloo AG, et al.",
        year: "1999",
        journal: "American Journal of Clinical Nutrition",
        ref: "PMID: 10584049",
      },
      {
        authors: "Hursel R, Westerterp-Plantenga MS",
        year: "2013",
        journal: "American Journal of Clinical Nutrition",
        ref: "PMID: 23235664",
      },
    ],
  },
  Berberine: {
    type: "single",
    name: "Berberine",
    benefit: "Glucose Metabolism",
    score: 0.86,
    evidence: "animal",
    healthBenefit:
      "Berberine, an isoquinoline alkaloid, improves glucose handling and lipid profiles largely through AMPK activation, with downstream effects on weight and adiposity in animal models.",
    pathways: [
      "AMPK activation → improved insulin sensitivity and glucose uptake",
      "PCSK9 down-regulation → increased LDL-receptor recycling",
      "Gut-microbiome shift favoring short-chain-fatty-acid producers",
    ],
    targets: ["AMPK", "PCSK9", "GLUT4", "PTP1B"],
    biomarkers: ["Fasting glucose", "HbA1c", "LDL cholesterol"],
    claims: [
      "Supports healthy glucose metabolism",
      "Supports healthy lipid levels",
    ],
    howItWorks:
      "Berberine raises the cellular AMP:ATP ratio, activating AMPK — the same energy-sensing switch that exercise engages — which promotes glucose uptake and suppresses hepatic gluconeogenesis and lipogenesis.",
    confidenceNote:
      "Moderate confidence for weight endpoints: robust animal and mechanistic data, with human trials concentrated on glycemic and lipid outcomes rather than fat loss directly.",
    naturalSources: [
      { species: "Berberis vulgaris", common: "Barberry", gras: false },
      { species: "Coptis chinensis", common: "Chinese goldthread", gras: false },
      { species: "Hydrastis canadensis", common: "Goldenseal", gras: false },
    ],
    dosage: [
      { label: "Typical study dose", value: "500 mg, 2–3×/day" },
      { label: "Timing", value: "With meals (GI tolerance)" },
    ],
    adme: [
      { label: "Oral bioavailability", value: "Very low (<1%)" },
      { label: "Metabolism", value: "CYP2D6, CYP1A2" },
      { label: "Note", value: "P-glycoprotein substrate" },
    ],
    ipNote:
      "Molecule is off-patent and widely available. Bioavailability-enhancing formulations and specific dihydroberberine derivatives carry active IP.",
    references: [
      {
        authors: "Yin J, Xing H, Ye J",
        year: "2008",
        journal: "Metabolism",
        ref: "PMID: 18442638",
      },
      {
        authors: "Hu Y, et al.",
        year: "2012",
        journal: "Phytomedicine",
        ref: "PMID: 22377320",
      },
    ],
  },
  "Epigallocatechin gallate + Capsaicin": {
    type: "combo",
    name: "Epigallocatechin gallate + Capsaicin",
    benefit: "Thermogenesis",
    score: 0.81,
    evidence: "clinical",
    healthBenefit:
      "Pairing EGCG with capsaicin combines two complementary thermogenic mechanisms — sustained catechin-driven fat oxidation and acute TRPV1-mediated energy expenditure — for an additive effect greater than either alone.",
    pathways: [
      "EGCG: COMT inhibition + AMPK activation → prolonged fat oxidation",
      "Capsaicin: TRPV1 agonism → sympathetic activation and UCP1 thermogenesis",
      "Convergent up-regulation of UCP1 in brown/beige adipose",
    ],
    targets: ["UCP1", "TRPV1", "PPARα", "AMPK"],
    biomarkers: ["24-h energy expenditure", "Fat oxidation rate", "Core temperature"],
    claims: [
      "Supports thermogenesis",
      "Supports healthy fat metabolism",
    ],
    howItWorks:
      "Capsaicin provides the acute spark — activating TRPV1 to trigger sympathetic, UCP1-driven heat production — while EGCG extends the burn by slowing noradrenaline breakdown and keeping AMPK-driven fat oxidation elevated between doses.",
    confidenceNote:
      "High confidence for the additive mechanism: a clinical crossover study reported greater energy expenditure for the pair than for either compound alone; long-term weight outcomes are less studied.",
    naturalSources: [
      { species: "Camellia sinensis", common: "Green tea", gras: true },
      { species: "Capsicum annuum", common: "Chili pepper", gras: true },
    ],
    dosage: [
      { label: "EGCG", value: "300–400 mg/day" },
      { label: "Capsaicin", value: "2–6 mg/day" },
      { label: "Form", value: "Encapsulated (palatability)" },
    ],
    adme: [
      { label: "EGCG bioavailability", value: "Low (~0.1–0.3%)" },
      { label: "Capsaicin Tmax", value: "~0.75 h" },
      { label: "Interaction", value: "No adverse PK interaction reported" },
    ],
    ipNote:
      "Both molecules are off-patent, but this specific weight-management combination and ratio appear to have open IP — a defensible composition-of-matter or use claim for a co-formulation may be available.",
    references: [
      {
        authors: "Yoshioka M, et al.",
        year: "2001",
        journal: "British Journal of Nutrition",
        ref: "PMID: 11430776",
      },
      {
        authors: "Janssens PLHR, et al.",
        year: "2013",
        journal: "PLoS ONE",
        ref: "PMID: 24391775",
      },
    ],
  },
}

/**
 * Resolve a studied result to its detail for the Workspace slide-over. Returns
 * the authored entry when one exists, else synthesizes a coherent minimal detail
 * from the result (keeping name === resultKey so favorite/pin stay in sync).
 * Predicted results have no detail → undefined (the canvas treats them as
 * non-navigating). This is the demo's stand-in for the app's real Result→detail
 * join; the WorkspaceCanvas `resolveDetail` prop is where an app swaps in a fetch.
 */
export function resolveWorkspaceDetail(
  result: SingleResult | ComboResult,
): ResultDetail {
  const authored = WORKSPACE_DETAILS[resultKey(result)]
  if (authored) return authored
  return {
    type: result.type,
    name: displayName(result),
    benefit: result.benefit,
    score: result.score,
    evidence: result.evidence,
    healthBenefit: `${displayName(result)} is an early lead for ${result.benefit.toLowerCase()}. A full evidence profile has not yet been compiled for this candidate.`,
    pathways: [],
    targets: result.targets ?? [],
    biomarkers: [],
    claims: [],
    howItWorks:
      "Mechanistic detail for this candidate is still being assembled from the literature and Forager's predictions.",
    confidenceNote: "",
    naturalSources: [],
    dosage: [],
    adme: [],
    ipNote: "",
    references: [],
  }
}
