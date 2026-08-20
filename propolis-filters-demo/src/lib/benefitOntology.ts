import ontologyData from "../data/benefitOntology.json";
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
 * Real Brightseed health/benefit ontology (health_area → benefit →
 * sub_benefit → target), generated once from a DAG export Anna provided
 * (`ontology-reference.html`, not checked in — see the generation notes in
 * mockData.ts). `count` on every node is the number of distinct real
 * (PubChem-linked) compounds reachable under it in the full ontology — not
 * derived from this app's own `compounds` list, which only covers a slice of
 * the Muscle Health branch.
 */
const tree = ontologyData as OntologyTree;

export function getChildOptions(parentId: string | null): FilterOption[] {
  return getChildOptionsGeneric(tree, parentId);
}

export function findChildId(parentId: string | null, label: string): string | undefined {
  return findChildIdGeneric(tree, parentId, label);
}

export function matchesSelectedTargets(compound: Compound, selected: FacetSelection): boolean {
  return matchesSelectedLeaves(tree, selected, {
    coarseValue: compound.benefit,
    exactValue: compound.assignedTarget,
  });
}
