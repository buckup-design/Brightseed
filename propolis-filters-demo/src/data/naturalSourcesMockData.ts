import type { NaturalSource } from "../types";

// Placeholder data only — no real Natural Sources dataset exists yet (per
// Anna: she'll provide a real data file later). These entries are fabricated
// but structurally match the real shape (mirrors the Figma spec's own
// "Crambe tartarica" example), just to make NaturalSourceCard demoable/
// verifiable today. Swap this file's contents for the real one when it
// arrives — the NaturalSource shape in types.ts is designed to take it
// without changes.
//
// benefit/classification/assignedTarget/assignedClass are likewise
// fabricated *assignments* (per Anna: real ontology labels, not-necessarily-
// real pairings — same standing call as mockData.ts's compound tagging) so
// the Benefit and Compound Classes drill-downs carried over from the
// Compounds tab have real data to drill into here too.
export const naturalSources: NaturalSource[] = [
  {
    id: "crambe-tartarica",
    name: "Crambe tartarica",
    sourceType: "plant",
    description:
      "May contain compounds that modulate ↑AMPK, FXR agonist, ↓IL-6, ↓NF-kB, and ↑SIRT1 (and 1 more), mediating improved glycemic control, improvement in insulin resistance, prevents macular degeneration, prevents pulmonary scarring and fibrosis, and promotes pulmonary circulation.",
    knownCompounds: ["Spinosin", "citral b", "Dicaffeoylquinic Acids", "Rutin", "Quercetin", "Kaempferol", "Apigenin", "Luteolin", "Chlorogenic Acid", "Ferulic Acid"],
    predictedCompoundCount: 12,
    targets: ["NF-kB", "PI3K", "Akt", "ZO-1", "MUC2", "AMPK", "SIRT1", "FXR", "IL-6", "PPAR-gamma", "Nrf2", "TNF-α", "Caspase-3", "Bcl-2", "mTOR", "STAT3", "JNK"],
    grasSource: "yes",
    nonNovelSource: "yes",
    benefit: "Restores Mitochondrial Function And Quality",
    assignedTarget: "Increases SIRT1",
    classification: "Monoterpenoids",
    assignedClass: "Secoiridoid monoterpenoids",
  },
  {
    id: "antrodia-cinnamomea",
    name: "Antrodia cinnamomea",
    sourceType: "fungus",
    description:
      "Compounds in Antrodia cinnamomea also support sub-benefits including anti-bacterial, ↑growth of beneficial bacterial strain(s), increased mitochondrial function and resilience, reduced pro-inflammatory signaling for immune health, and reduced pro-inflammatory signaling for improved gut barrier function (and 3 more), contributing to anti-allergic, anti-inflammatory, anti-microbial:anti-bacterial, anti-microbial:anti-viral, and improved mitochondrial bioenergy.",
    knownCompounds: ["Antrodin C", "Antcin K", "Ergostatrien-3β-ol", "Zhankuic Acid A", "Dehydroeburicoic Acid"],
    predictedCompoundCount: 8,
    targets: ["Nrf2", "NF-kB", "TNF-α", "PGC-1α", "SIRT1", "IL-6", "COX-2"],
    grasSource: "no",
    nonNovelSource: "yes",
    benefit: "Prevents Muscle Protein Degradation And Atrophy",
    assignedTarget: "Decreases NF-kB",
    classification: "Flavonoids",
    assignedClass: "Flavonolignans",
  },
  {
    id: "withania-somnifera",
    name: "Withania somnifera",
    sourceType: "plant",
    description:
      "May contain compounds that modulate ↑BDNF, ↓cortisol, ↑GABA-A, and ↓ROS, mediating stress resilience, improved sleep quality, and cognitive performance under load.",
    knownCompounds: ["Withaferin A", "Withanolide A", "Withanoside IV"],
    predictedCompoundCount: 0,
    targets: ["BDNF", "GABA-A", "HPA Axis"],
    grasSource: "yes",
    nonNovelSource: "no",
    benefit: "Promotes Muscle Hypertrophy And Adaptive Growth",
    assignedTarget: "Increases AKT Phosphorylation",
    classification: "Triterpenoids",
    assignedClass: "Ursane and Taraxastane triterpenoids",
  },
];
