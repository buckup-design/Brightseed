/**
 * Viral-infection project fixtures — the dataset behind Anna's v2 prototype.
 *
 * Transcribed mechanically out of `anna mocks 8-28-26/index.html` so the tables
 * are exercised against real shapes rather than invented ones: tri-state GRAS,
 * missing common names, bioavailability as a RANGE STRING with a footnote
 * marker, and a compound matrix whose columns come from the user's kept set.
 *
 * Deliberately a NEW file rather than an edit to data.ts — that file's GLP-1
 * PROJECT/STRATEGIES are wired into shipped StrategyCard and ReportDocument
 * stories, and this direction should not be able to break them.
 *
 * hummingbird/ tier: this file is data only and carries no tokens.
 */

export const PROJECT_VIRAL = {
  id: "immunity-supplement",
  name: "Immunity supplement",
  goal: "support resistance to viral infection",
  constraints: "none",
  referencesLabel: "view all 23 papers reviewed",
  referenceCount: 23,
} as const;

/** GRAS is tri-state, not boolean: listed | no-entry | pending. */
export type GrasStatus = "listed" | "no-entry" | "pending";

// ── Compounds with direct evidence ─────────────────────────────────────────

export type EvidencedCompound = {
  id: string;
  compoundName: string;
  /** Short form for a narrow matrix column head ("EGCG", not the full name). */
  shortName: string;
  predictedAssociation: string;
  evidenceContextLabel: string;
  foodGrade: boolean;
  drink: boolean;
  gummy: boolean;
};

/** The model's starting split. A user verdict overrides it. */
export const COMPOUND_CANDIDATES: EvidencedCompound[] = [
  { id: "rosmarinic-acid", compoundName: "Rosmarinic acid", shortName: "Rosmarinic acid", predictedAssociation: "Fusion inhibition", evidenceContextLabel: "In-vitro / mouse-associated record; 2019", foodGrade: true, drink: true, gummy: false },
  { id: "egcg", compoundName: "Epigallocatechin gallate (EGCG)", shortName: "EGCG", predictedAssociation: "Fusion inhibition", evidenceContextLabel: "In-vitro record; 2021", foodGrade: true, drink: false, gummy: true },
  { id: "tangeretin", compoundName: "Tangeretin", shortName: "Tangeretin", predictedAssociation: "Fusion inhibition", evidenceContextLabel: "In-vitro / mouse-associated record; 2018", foodGrade: true, drink: true, gummy: true },
  { id: "beta-sitosterol", compoundName: "Beta-sitosterol", shortName: "Beta-sitosterol", predictedAssociation: "Polymerase inhibition", evidenceContextLabel: "Animal record, 2022; 50 mg/kg reported", foodGrade: true, drink: false, gummy: false },
  { id: "fisetin", compoundName: "Fisetin", shortName: "Fisetin", predictedAssociation: "Polymerase inhibition", evidenceContextLabel: "In-vitro record, 2025", foodGrade: true, drink: true, gummy: false },
];

export const COMPOUND_ELIMINATED: EvidencedCompound[] = [
  { id: "oleanolic-acid", compoundName: "Oleanolic acid", shortName: "Oleanolic acid", predictedAssociation: "Fusion inhibition", evidenceContextLabel: "In-vitro record; 2013", foodGrade: false, drink: false, gummy: false },
  { id: "berberine", compoundName: "Berberine", shortName: "Berberine", predictedAssociation: "Fusion inhibition", evidenceContextLabel: "In-vitro record; 2020", foodGrade: false, drink: true, gummy: false },
];

export const COMPOUND_REFERENCES_LABEL = "view 6 relevant papers";

// ── Top predicted compounds ────────────────────────────────────────────────

export type PredictedCompound = {
  id: string;
  structuralIdentifier: string;
  predictedAssociation: string;
  fingerprintScore: number;
  chemicalGrouping: string;
  /** A RANGE string ("0.37–0.78"), sometimes carrying a footnote "*". */
  predictedBioavailability: string;
  highlightBioavailability?: boolean;
};

export const PREDICTED_COMPOUNDS: PredictedCompound[] = [
  { id: "ulsuxbhsysgdt", structuralIdentifier: "ULSUXBHSYSGDT", predictedAssociation: "Fusion inhibition", fingerprintScore: 5, chemicalGrouping: "Flavonoids", predictedBioavailability: "0.85", highlightBioavailability: true },
  { id: "kzjwdpnrjallns", structuralIdentifier: "KZJWDPNRJALLNS", predictedAssociation: "Decreases polymerase", fingerprintScore: 5, chemicalGrouping: "Steroids", predictedBioavailability: "0.37–0.78" },
  { id: "mijyxulnpsfwek", structuralIdentifier: "MIJYXULNPSFWEK", predictedAssociation: "Fusion inhibition", fingerprintScore: 5, chemicalGrouping: "Triterpenoids", predictedBioavailability: "0.54–0.74" },
  { id: "ybhilyktiriute", structuralIdentifier: "YBHILYKTIRIUTE", predictedAssociation: "Fusion inhibition", fingerprintScore: 5, chemicalGrouping: "Tyrosine alkaloids", predictedBioavailability: "0.51–0.65" },
  { id: "xhefdibzljxqhf", structuralIdentifier: "XHEFDIBZLJXQHF", predictedAssociation: "Polymerase inhibition", fingerprintScore: 5, chemicalGrouping: "Flavonoids", predictedBioavailability: "0.37–0.48" },
  { id: "doumfzqkyfqntf", structuralIdentifier: "DOUMFZQKYFQNTF", predictedAssociation: "Fusion inhibition", fingerprintScore: 5, chemicalGrouping: "Phenylpropanoids", predictedBioavailability: "0.38–0.42*" },
  { id: "wmbwrepuvvbilr", structuralIdentifier: "WMBWREPUVVBILR", predictedAssociation: "Fusion inhibition", fingerprintScore: 5, chemicalGrouping: "Flavonoids", predictedBioavailability: "0.31–0.37" },
  { id: "vkjgbajnnalvav", structuralIdentifier: "VKJGBAJNNALVAV", predictedAssociation: "Fusion inhibition", fingerprintScore: 3.2, chemicalGrouping: "Tyrosine alkaloids", predictedBioavailability: "0.46–0.68" },
  { id: "lshvyafmtmfkba", structuralIdentifier: "LSHVYAFMTMFKBA", predictedAssociation: "Fusion inhibition", fingerprintScore: 3.083, chemicalGrouping: "Flavonoids", predictedBioavailability: "0.34–0.41" },
  { id: "sgnbvlswzmbqth", structuralIdentifier: "SGNBVLSWZMBQTH", predictedAssociation: "Decreases polymerase", fingerprintScore: 2.583, chemicalGrouping: "Steroids", predictedBioavailability: "0.38–0.71" },
  { id: "oselkochbmdkej", structuralIdentifier: "OSELKOCHBMDKEJ", predictedAssociation: "Decreases polymerase", fingerprintScore: 2.558, chemicalGrouping: "Steroids", predictedBioavailability: "0.34–0.78" },
  { id: "hcxvjbmsmiarin", structuralIdentifier: "HCXVJBMSMIARIN", predictedAssociation: "Decreases polymerase", fingerprintScore: 2.45, chemicalGrouping: "Steroids", predictedBioavailability: "0.32–0.72" },
  { id: "sdzpynmxguhfmz", structuralIdentifier: "SDZPYNMXGUHFMZ", predictedAssociation: "Fusion inhibition", fingerprintScore: 2.283, chemicalGrouping: "Flavonoids", predictedBioavailability: "0.39–0.41" },
  { id: "ghgkplpbpgysoo", structuralIdentifier: "GHGKPLPBPGYSOO", predictedAssociation: "Decreases polymerase", fingerprintScore: 2.081, chemicalGrouping: "Steroids", predictedBioavailability: "0.70–0.71" },
  { id: "jzfsmvxquwrsiw", structuralIdentifier: "JZFSMVXQUWRSIW", predictedAssociation: "Fusion inhibition", fingerprintScore: 2.023, chemicalGrouping: "Triterpenoids", predictedBioavailability: "0.62–0.66" },
  { id: "qgosjbzftwgwdu", structuralIdentifier: "QGOSJBZFTWGWDU", predictedAssociation: "Fusion inhibition", fingerprintScore: 2.011, chemicalGrouping: "Triterpenoids", predictedBioavailability: "0.63" },
  { id: "hvywmomldimfja", structuralIdentifier: "HVYWMOMLDIMFJA", predictedAssociation: "Decreases polymerase", fingerprintScore: 1.972, chemicalGrouping: "Steroids", predictedBioavailability: "0.37–0.79" },
  { id: "mriaqlrqzppods", structuralIdentifier: "MRIAQLRQZPPODS", predictedAssociation: "Fusion inhibition", fingerprintScore: 1.946, chemicalGrouping: "Flavonoids", predictedBioavailability: "0.88", highlightBioavailability: true },
  { id: "xhalvrqbzgzhfe", structuralIdentifier: "XHALVRQBZGZHFE", predictedAssociation: "Fusion inhibition", fingerprintScore: 1.867, chemicalGrouping: "Phenylpropanoids", predictedBioavailability: "0.40–0.55" },
  { id: "bxpbsbbfpntfft", structuralIdentifier: "BXPBSBBFPNTFFT", predictedAssociation: "Polymerase inhibition", fingerprintScore: 1.813, chemicalGrouping: "Flavonoids", predictedBioavailability: "0.39–0.49" },
];

// ── Natural sources (the presence matrix) ──────────────────────────────────

export type NaturalSourceRow = {
  id: string;
  scientificName: string;
  /** Empty for species with no common name — the entity cell must cope. */
  commonName: string;
  /**
   * Presence keyed by COMPOUND ID, not a positional array.
   *
   * The matrix's columns are generated from whichever compounds survive the
   * compounds tab, and that set both shrinks and is ordered differently from
   * this row's own field order. A positional boolean[] is only ever correct for
   * the complete original column order, so driving the matrix from a triaged set
   * would silently move every check mark one column left with no type error.
   */
  directCompounds: Record<string, boolean>;
  directCount: number;
  predictedCompoundsCount: number;
  grasStatus: GrasStatus;
};

/** A compound as a matrix column: the id keys the presence lookup, the label is
 * the short form that fits a narrow column head. */
export type MatrixCompound = { id: string; label: string };

/** The matrix's default columns. The formulation stage narrows this to whichever
 * compounds survive the compounds tab. */
export const MATRIX_COMPOUNDS: MatrixCompound[] = [
  { id: "beta-sitosterol", label: "Beta-sitosterol" },
  { id: "rosmarinic-acid", label: "Rosmarinic acid" },
  { id: "egcg", label: "EGCG" },
  { id: "fisetin", label: "Fisetin" },
  { id: "tangeretin", label: "Tangeretin" },
];

export const SOURCE_CANDIDATES: NaturalSourceRow[] = [
  { id: "mangifera-indica", scientificName: "Mangifera indica", commonName: "mango", directCompounds: { "beta-sitosterol": true, "rosmarinic-acid": true, "egcg": true, "fisetin": true, "tangeretin": false }, directCount: 4, predictedCompoundsCount: 63, grasStatus: "listed" },
  { id: "salvia-officinalis", scientificName: "Salvia officinalis", commonName: "sage", directCompounds: { "beta-sitosterol": true, "rosmarinic-acid": true, "egcg": false, "fisetin": false, "tangeretin": true }, directCount: 3, predictedCompoundsCount: 65, grasStatus: "listed" },
  { id: "petroselinum-crispum", scientificName: "Petroselinum crispum", commonName: "garden parsley", directCompounds: { "beta-sitosterol": true, "rosmarinic-acid": true, "egcg": false, "fisetin": false, "tangeretin": true }, directCount: 3, predictedCompoundsCount: 43, grasStatus: "listed" },
  { id: "cistus-incanus", scientificName: "Cistus incanus", commonName: "hairy rockrose", directCompounds: { "beta-sitosterol": true, "rosmarinic-acid": true, "egcg": true, "fisetin": false, "tangeretin": false }, directCount: 3, predictedCompoundsCount: 42, grasStatus: "listed" },
  { id: "citrus-aurantium", scientificName: "Citrus aurantium", commonName: "sour orange", directCompounds: { "beta-sitosterol": true, "rosmarinic-acid": false, "egcg": false, "fisetin": true, "tangeretin": true }, directCount: 3, predictedCompoundsCount: 120, grasStatus: "listed" },
  { id: "glycine-max", scientificName: "Glycine max", commonName: "soybean", directCompounds: { "beta-sitosterol": true, "rosmarinic-acid": false, "egcg": false, "fisetin": true, "tangeretin": true }, directCount: 3, predictedCompoundsCount: 79, grasStatus: "listed" },
  { id: "boerhavia-diffusa", scientificName: "Boerhavia diffusa", commonName: "red spiderling", directCompounds: { "beta-sitosterol": true, "rosmarinic-acid": true, "egcg": true, "fisetin": false, "tangeretin": false }, directCount: 3, predictedCompoundsCount: 44, grasStatus: "listed" },
  { id: "hypericum-perforatum", scientificName: "Hypericum perforatum", commonName: "common St. John's wort", directCompounds: { "beta-sitosterol": true, "rosmarinic-acid": true, "egcg": false, "fisetin": true, "tangeretin": false }, directCount: 3, predictedCompoundsCount: 35, grasStatus: "listed" },
  { id: "ephedra-nevadensis", scientificName: "Ephedra nevadensis", commonName: "green ephedra", directCompounds: { "beta-sitosterol": true, "rosmarinic-acid": true, "egcg": true, "fisetin": false, "tangeretin": false }, directCount: 3, predictedCompoundsCount: 33, grasStatus: "listed" },
  { id: "pogostemon-cablin", scientificName: "Pogostemon cablin", commonName: "patchouli", directCompounds: { "beta-sitosterol": true, "rosmarinic-acid": true, "egcg": false, "fisetin": false, "tangeretin": true }, directCount: 3, predictedCompoundsCount: 33, grasStatus: "listed" },
  { id: "salix-alba", scientificName: "Salix alba", commonName: "", directCompounds: { "beta-sitosterol": true, "rosmarinic-acid": true, "egcg": false, "fisetin": false, "tangeretin": false }, directCount: 2, predictedCompoundsCount: 36, grasStatus: "listed" },
];

export const SOURCE_ELIMINATED: NaturalSourceRow[] = [
  { id: "ulmus-campestris", scientificName: "Ulmus campestris", commonName: "elm family", directCompounds: { "beta-sitosterol": true, "rosmarinic-acid": true, "egcg": true, "fisetin": false, "tangeretin": false }, directCount: 3, predictedCompoundsCount: 28, grasStatus: "no-entry" },
  { id: "pistacia-chinensis", scientificName: "Pistacia chinensis", commonName: "Chinese pistache", directCompounds: { "beta-sitosterol": true, "rosmarinic-acid": false, "egcg": true, "fisetin": true, "tangeretin": false }, directCount: 3, predictedCompoundsCount: 30, grasStatus: "no-entry" },
  { id: "punica-granatum", scientificName: "Punica granatum", commonName: "pomegranate", directCompounds: { "beta-sitosterol": true, "rosmarinic-acid": false, "egcg": true, "fisetin": false, "tangeretin": true }, directCount: 3, predictedCompoundsCount: 50, grasStatus: "pending" },
  { id: "erythroxylum-vaccinifolium", scientificName: "Erythroxylum vaccinifolium", commonName: "", directCompounds: { "beta-sitosterol": true, "rosmarinic-acid": true, "egcg": true, "fisetin": false, "tangeretin": false }, directCount: 3, predictedCompoundsCount: 31, grasStatus: "no-entry" },
  { id: "setaria-reverchonii", scientificName: "Setaria reverchonii", commonName: "Reverchon's bristle grass", directCompounds: { "beta-sitosterol": true, "rosmarinic-acid": true, "egcg": true, "fisetin": false, "tangeretin": false }, directCount: 3, predictedCompoundsCount: 17, grasStatus: "no-entry" },
  { id: "vaccinium-vitis-idaea", scientificName: "Vaccinium vitis-idaea", commonName: "lingonberry", directCompounds: { "beta-sitosterol": true, "rosmarinic-acid": true, "egcg": false, "fisetin": false, "tangeretin": true }, directCount: 3, predictedCompoundsCount: 52, grasStatus: "no-entry" },
  { id: "quercus-ilex", scientificName: "Quercus ilex", commonName: "evergreen oak", directCompounds: { "beta-sitosterol": true, "rosmarinic-acid": true, "egcg": true, "fisetin": false, "tangeretin": false }, directCount: 3, predictedCompoundsCount: 20, grasStatus: "no-entry" },
  { id: "asplenium-trichomanes", scientificName: "Asplenium trichomanes", commonName: "maidenhair spleenwort", directCompounds: { "beta-sitosterol": true, "rosmarinic-acid": true, "egcg": false, "fisetin": false, "tangeretin": false }, directCount: 2, predictedCompoundsCount: 14, grasStatus: "no-entry" },
  { id: "maytenus-laevis", scientificName: "Maytenus laevis", commonName: "", directCompounds: { "beta-sitosterol": true, "rosmarinic-acid": false, "egcg": true, "fisetin": false, "tangeretin": false }, directCount: 2, predictedCompoundsCount: 20, grasStatus: "no-entry" },
];

// ── Best combinations (mixture info) ───────────────────────────────────────

export type CombinationRow = {
  id: string;
  rank: number;
  combinationLabel: string;
  combinedPredicted: number;
  grasStatusLabel: string;
};

export const COMBINATIONS: CombinationRow[] = [
  { id: "mango-sour-orange", rank: 1, combinationLabel: "Mango + Sour orange", combinedPredicted: 183, grasStatusLabel: "Both ✓ GRAS" },
  { id: "sour-orange-boerhavia-diffusa", rank: 2, combinationLabel: "Sour orange + Boerhavia diffusa", combinedPredicted: 164, grasStatusLabel: "Both ✓ GRAS" },
  { id: "sour-orange-cistus-incanus", rank: 3, combinationLabel: "Sour orange + Cistus incanus", combinedPredicted: 162, grasStatusLabel: "Both ✓ GRAS" },
  { id: "sour-orange-ephedra-nevadensis", rank: 4, combinationLabel: "Sour orange + Ephedra nevadensis", combinedPredicted: 153, grasStatusLabel: "Both ✓ GRAS" },
  { id: "mango-soybean", rank: 5, combinationLabel: "Mango + Soybean", combinedPredicted: 142, grasStatusLabel: "Both ✓ GRAS" },
];

// ── Strategies ─────────────────────────────────────────────────────────────

/**
 * A strategy: one approach to the business goal, to be confirmed or refuted.
 *
 * Deliberately NOT the `Strategy` in data.ts — that one carries
 * evidence/feasibility/legal PillarStatus, shaped for the StrategyCard this
 * direction replaces. The v2 data judges a strategy on evidence VOLUME instead:
 * how many compounds have direct evidence versus how many the model predicts.
 * That ratio is the thing a scientist actually triages on.
 */
export type ProjectStrategy = {
  id: string;
  name: string;
  /** One line on what the combination targets. */
  approach: string;
  /** Compounds with direct published evidence. */
  evidencedCompounds: number;
  /** Compounds the model predicts but that carry no direct evidence. */
  predictedCompounds: number;
  totalCompounds: number;
  referencesLabel: string;
};

export const STRATEGIES_VIRAL: ProjectStrategy[] = [
  { id: "fusion-polymerase", name: "Fusion inhibition + polymerase inhibition", approach: "Entry plus replication: targets viral genome replication after entry.", evidencedCompounds: 7, predictedCompounds: 1241, totalCompounds: 1248, referencesLabel: "view 6 relevant papers" },
  { id: "fusion-neuraminidase", name: "Fusion inhibition + neuraminidase inhibition", approach: "Entry plus release/spread: targets a viral life-cycle enzyme associated with viral release and spread.", evidencedCompounds: 6, predictedCompounds: 1085, totalCompounds: 1091, referencesLabel: "view 6 relevant papers" },
  { id: "fusion-protease", name: "Fusion inhibition + viral protease inhibition", approach: "Entry plus viral protein maturation: targets viral protein processing and maturation.", evidencedCompounds: 9, predictedCompounds: 1147, totalCompounds: 1156, referencesLabel: "view 6 relevant papers" },
  { id: "fusion-nfkb", name: "Fusion inhibition + NF-κB/cytokine modulation", approach: "Viral-life-cycle targeting plus a host inflammatory-response angle: may address infection-associated inflammatory signaling or tissue injury rather than directly blocking viral entry.", evidencedCompounds: 117, predictedCompounds: 6902, totalCompounds: 7019, referencesLabel: "view 6 relevant papers" },
  { id: "fusion-pi3k-ampk", name: "Fusion inhibition + PI3K/AKT/mTOR or AMPK modulation", approach: "A host-cell pathway hypothesis, but less virus-specific — linked to antiviral outcomes via host-cell signaling axes.", evidencedCompounds: 76, predictedCompounds: 4930, totalCompounds: 5006, referencesLabel: "view 6 relevant papers" },
];
