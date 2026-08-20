import ontologyData from "../data/benefitOntology.json";
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

/** `compounds` should be the set matching every *other* currently-active filter — see App.tsx. */
export function getDynamicChildOptions(parentId: string | null, compounds: Compound[]): FilterOption[] {
  const values = compounds.map((c) => ({ coarseValue: c.benefit, exactValue: c.assignedTarget }));
  return getDynamicChildOptionsGeneric(tree, parentId, values);
}

export function matchesSelectedTargets(compound: Compound, selected: FacetSelection): boolean {
  return matchesSelectedLeaves(tree, selected, {
    coarseValue: compound.benefit,
    exactValue: compound.assignedTarget,
  });
}
