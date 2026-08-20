import ontologyData from "../data/compoundClassOntology.json";
import type { Compound, FilterOption } from "../types";
import type { FacetSelection } from "./facets";
import {
  findChildId as findChildIdGeneric,
  getChildOptions as getChildOptionsGeneric,
  matchesSelectedLeaves,
  type OntologyTree,
} from "./ontologyDrilldown";

export type { PathEntry } from "./ontologyDrilldown";

/**
 * Real NPClassifier natural-product classification tree (pathway →
 * superclass → class), generated once from a DAG export Anna provided
 * (`npclassifier-reference.html`, not checked in — see the generation
 * notes in mockData.ts). `count` is each node's real "singles" total
 * (global, across Brightseed's actual database — not derived from this
 * app's own `compounds` list) — the "predicted" count the source file also
 * carries is intentionally dropped, per Anna, to keep one number per chip
 * like every other facet. The source file's top-level `(Unclassified)`
 * bucket (no children, doesn't fit the drill-down model) was excluded when
 * this tree was generated.
 */
const tree = ontologyData as OntologyTree;

export function getChildOptions(parentId: string | null): FilterOption[] {
  return getChildOptionsGeneric(tree, parentId);
}

export function findChildId(parentId: string | null, label: string): string | undefined {
  return findChildIdGeneric(tree, parentId, label);
}

export function matchesSelectedClasses(compound: Compound, selected: FacetSelection): boolean {
  return matchesSelectedLeaves(tree, selected, {
    coarseValue: compound.classification,
    exactValue: compound.assignedClass,
  });
}
