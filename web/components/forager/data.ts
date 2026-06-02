/**
 * Real-shaped placeholder data for Forager surfaces.
 *
 * Vocabulary stays consistent across Strategies / Compounds / Plants so the
 * three views read as one project. All numbers are invented; all names,
 * species, gene targets, and IP signals are real biotech vocabulary.
 *
 * Anchored in Anna's mocks (4-29-26):
 *   Goal:     "Help individuals on GLP-1 weight-loss drugs retain lean muscle mass"
 *   Strategy: "Shift microbiome towards propionate producers"
 */

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
  | { role: "assistant"; text: string }
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
