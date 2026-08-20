import ontologyData from "../data/compoundClassOntology.json";
import type { Compound, FilterOption } from "../types";
import type { FacetSelection } from "./facets";
import {
  findChildId as findChildIdGeneric,
  getDynamicChildOptions as getDynamicChildOptionsGeneric,
  matchesSelectedLeaves,
  type OntologyTree,
} from "./ontologyDrilldown";

export type { PathEntry } from "./ontologyDrilldown";

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

/** `compounds` should be the set matching every *other* currently-active filter — see App.tsx. */
export function getDynamicChildOptions(parentId: string | null, compounds: Compound[]): FilterOption[] {
  const values = compounds.map((c) => ({ coarseValue: c.classification, exactValue: c.assignedClass }));
  return getDynamicChildOptionsGeneric(tree, parentId, values);
}

export function matchesSelectedClasses(compound: Compound, selected: FacetSelection): boolean {
  return matchesSelectedLeaves(tree, selected, {
    coarseValue: compound.classification,
    exactValue: compound.assignedClass,
  });
}
