import ontologyData from "../data/benefitOntology.json";
import type { FilterOption } from "../types";
import type { FacetSelection } from "./facets";
import {
  findChildId as findChildIdGeneric,
  getDynamicChildOptions as getDynamicChildOptionsGeneric,
  matchesDrilldownScope as matchesDrilldownScopeGeneric,
  type OntologyTree,
  type PathEntry,
} from "./ontologyDrilldown";

export type { PathEntry } from "./ontologyDrilldown";

// Anything taggable against this tree — Compound and NaturalSource both
// carry `benefit`/`assignedTarget` with identical meaning (see the field
// comments on each in types.ts), so this stays generic over both rather
// than hardcoding Compound and forcing a second near-duplicate module for
// Natural Sources' own Benefit drill-down.
interface BenefitTaggable {
  benefit?: string;
  assignedTarget?: string;
}

/**
 * Real Brightseed health/benefit ontology (health_area → benefit →
 * sub_benefit → target), generated once from a DAG export Anna provided
 * (`ontology-reference.html`, not checked in — see the generation notes in
 * mockData.ts). The tree structure (labels, parent/child relationships) is
 * real throughout; chip *counts* shown to the user come from
 * `getDynamicChildOptions` below (live, reflecting whatever other filters
 * are currently active), not from this JSON's own static `count` field.
 */
const tree = ontologyData as OntologyTree;

export function findChildId(parentId: string | null, label: string): string | undefined {
  return findChildIdGeneric(tree, parentId, label);
}

/** `items` should be the set matching every *other* currently-active filter — see App.tsx. */
export function getDynamicChildOptions(parentId: string | null, items: BenefitTaggable[]): FilterOption[] {
  const values = items.map((item) => ({ coarseValue: item.benefit, exactValue: item.assignedTarget }));
  return getDynamicChildOptionsGeneric(tree, parentId, values);
}

/**
 * Does this item fall within the currently drilled-into Benefit scope? An
 * explicit Target selection (the deepest level) is authoritative; short of
 * that, navigating the breadcrumb down to a Health Area/Benefit/Sub-benefit
 * is itself the filter — see matchesDrilldownScope in ontologyDrilldown.ts.
 */
export function matchesDrilldownScope(path: PathEntry[], selected: FacetSelection, item: BenefitTaggable): boolean {
  return matchesDrilldownScopeGeneric(tree, path, selected, {
    coarseValue: item.benefit,
    exactValue: item.assignedTarget,
  });
}
