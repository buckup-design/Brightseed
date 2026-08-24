import ontologyData from "../data/compoundClassOntology.json";
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

// See the identical comment in benefitOntology.ts — generic over anything
// carrying `classification`/`assignedClass` (Compound and NaturalSource
// both do) rather than hardcoding Compound.
interface CompoundClassTaggable {
  classification?: string;
  assignedClass?: string;
}

/**
 * Real NPClassifier natural-product classification tree (pathway →
 * superclass → class), generated once from a DAG export Anna provided
 * (`npclassifier-reference.html`, not checked in — see the generation
 * notes in mockData.ts). The source file's top-level `(Unclassified)`
 * bucket (no children, doesn't fit the drill-down model) was excluded
 * when this tree was generated. The tree structure is real throughout;
 * chip *counts* shown to the user come from `getDynamicChildOptions`
 * below (live, reflecting whatever other filters are currently active),
 * not from this JSON's own static `count` field (which was itself only
 * ever the "singles" half of the source file's singles/predicted split —
 * see the generation notes for why).
 */
const tree = ontologyData as OntologyTree;

export function findChildId(parentId: string | null, label: string): string | undefined {
  return findChildIdGeneric(tree, parentId, label);
}

/** `items` should be the set matching every *other* currently-active filter — see App.tsx. */
export function getDynamicChildOptions(parentId: string | null, items: CompoundClassTaggable[]): FilterOption[] {
  const values = items.map((item) => ({ coarseValue: item.classification, exactValue: item.assignedClass }));
  return getDynamicChildOptionsGeneric(tree, parentId, values);
}

/**
 * Does this item fall within the currently drilled-into Compound Classes
 * scope? An explicit Class selection (the deepest level) is authoritative;
 * short of that, navigating the breadcrumb down to a Pathway/Superclass is
 * itself the filter — see matchesDrilldownScope in ontologyDrilldown.ts.
 */
export function matchesDrilldownScope(
  path: PathEntry[],
  selected: FacetSelection,
  item: CompoundClassTaggable
): boolean {
  return matchesDrilldownScopeGeneric(tree, path, selected, {
    coarseValue: item.classification,
    exactValue: item.assignedClass,
  });
}
