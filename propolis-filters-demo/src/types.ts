export interface FilterOption {
  label: string;
  count: number;
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
}
