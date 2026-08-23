export interface FilterOption {
  label: string;
  count: number;
  /** True when this option's live count is 0 given every other currently-active filter — greyed out, unclickable, matching EvidenceTypeFilter's existing zero-count treatment. */
  disabled?: boolean;
}

export interface FilterGroup {
  id: string;
  title: string;
  /** Shown next to the title once results have been narrowed, e.g. "32 pathways found" */
  resultLabel?: string;
  options: FilterOption[];
}

export interface Compound {
  id: string;
  name: string;
  healthArea?: string; // "Health Area" — future filter field, not rendered on the card
  benefit: string; // "Benefit"
  description: string; // "Description of mechanism of action"
  classification?: string; // "Classification" — future filter field
  requiresDeliveryTechnology?: string; // "requires delivery technology"
  productFormat?: string; // "product format"
  easeOfFormulation?: string; // "ease of formulation (1 to 3)" — kept as string, sheet has non-numeric "unknown" cells
  solubility?: string; // "solubility (1 to 5)"
  fto?: string; // "FTO (1 to 3)"
  patentability?: string; // "patentability (1 to 3)"
  admet?: string; // "ADMET (1 to 3)"
  ghsHazardCode?: string; // "GHS hazard code"
  nonNovelSource?: string; // "non-novel source"
  grasSource?: string; // "GRAS source"
  sampleNumbers?: string; // "sample numbers" — intentionally blank today, not rendered
  targets: string[]; // split from the newline-separated "targets" cell — future filter field
  confidenceScore?: number; // "confidence score", e.g. 83
  evidenceType?: string; // "evidence type", e.g. "animal" → displayed capitalized
  cardType: "predicted" | "single"; // derived from the compound-name pattern
  favorited?: boolean;
  // Real PubChem CID, set on compounds sourced from the Brightseed ontology
  // DAG (the 8 original real singles + the 140 real Muscle Health compounds
  // added alongside the Benefit drill-down feature) — a traceable link back
  // to the same real ontology data source. Not rendered anywhere yet.
  pubchemCid?: string;
  // Exact deepest-tier assignments enabling precise matching at the bottom
  // of each ontology drill-down, on top of the coarser tier-1 match every
  // compound already gets via `benefit`/`classification`. `assignedTarget`
  // is a real Target-tier label (health ontology, matches `benefit`'s
  // subtree); `assignedClass` is a real Class-tier label (NPClassifier,
  // matches `classification`'s subtree). Set on every compound except the
  // 8 original real singles, which only get `assignedClass` (independently
  // verified real chemistry, see mockData.ts) — no confidently-verifiable
  // real `assignedTarget` exists for those, so they keep the coarser
  // benefit-level match only. See matchesSelectedLeaves in
  // lib/ontologyDrilldown.ts for how these combine with the coarse fields.
  assignedTarget?: string;
  assignedClass?: string;
}

export interface NaturalSource {
  id: string;
  name: string;
  // Common name, shown in parentheses after `name` on the card per Figma
  // (node 74:17248). Derived from the scraped description text (each one
  // opens "<Common Name> may contain compounds..."), not itself scraped as
  // a distinct field — omitted (not fabricated) for the handful of sources
  // whose description came back empty.
  commonName?: string;
  // Drives which icon renders in the card header (leaf vs. mushroom).
  sourceType: "plant" | "fungus";
  description: string;
  knownCompounds: string[];
  // 0 → the "Forager predicted bioactives" row is omitted entirely.
  predictedCompoundCount: number;
  targets: string[];
  // "yes"/"no" strings, matching Compound.grasSource/nonNovelSource's
  // convention exactly (raw spreadsheet-cell values, not booleans) — see
  // matchesFlag in lib/scoreFilters.ts.
  grasSource?: string;
  nonNovelSource?: string;
  // Same Benefit/Compound Classes ontology tagging as Compound (see the
  // field comments above `Compound.assignedTarget`/`assignedClass`) — reused
  // here, same field names, so the Benefit and Compound Classes drill-downs
  // carried over from the Compounds tab can drive their live counts off
  // Natural Sources too via the same generic matching/counting helpers in
  // lib/ontologyDrilldown.ts, with zero changes to that shared code.
  benefit?: string;
  classification?: string;
  assignedTarget?: string;
  assignedClass?: string;
}
