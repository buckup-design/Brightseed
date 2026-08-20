import ontologyData from "../data/benefitOntology.json";
import type { Compound, FilterOption } from "../types";
import type { FacetSelection } from "./facets";

/**
 * Real Brightseed health/benefit ontology (health_area → benefit →
 * sub_benefit → target), generated once from a DAG export Anna provided
 * (`ontology-reference.html`, not checked in — see the generation notes in
 * mockData.ts). `count` on every node is the number of distinct real
 * (PubChem-linked) compounds reachable under it in the full ontology — not
 * derived from this app's own `compounds` list, which only covers a slice of
 * the Muscle Health branch. `childIds` are pre-sorted by count desc, then
 * label, matching `buildFilterGroup`'s existing sort convention.
 */
export interface OntologyNode {
  level: "health_area" | "benefit" | "sub_benefit" | "target";
  label: string;
  count: number;
  childIds: string[];
  /** Target-tier nodes only: every benefit-tier label reachable by walking up the DAG from this target. */
  ancestorBenefitLabels?: string[];
}

interface OntologyData {
  rootIds: string[];
  nodes: Record<string, OntologyNode>;
}

const { rootIds, nodes } = ontologyData as OntologyData;

/** Root = the 22 health areas when `parentId` is `null`; otherwise `parentId`'s own children. */
export function getChildOptions(parentId: string | null): FilterOption[] {
  const childIds = parentId === null ? rootIds : nodes[parentId]?.childIds ?? [];
  return childIds.map((id) => ({ label: nodes[id].label, count: nodes[id].count }));
}

/** Resolves a child's id from its label within a given parent (or the root health areas when `parentId` is `null`). */
export function findChildId(parentId: string | null, label: string): string | undefined {
  const childIds = parentId === null ? rootIds : nodes[parentId]?.childIds ?? [];
  return childIds.find((id) => nodes[id].label === label);
}

/** One step of the drill-down path — the chosen health_area/benefit/sub_benefit id + its display label. */
export interface PathEntry {
  id: string;
  label: string;
}

const targetNodesByLabel: Record<string, OntologyNode> = {};
for (const node of Object.values(nodes)) {
  if (node.level === "target") targetNodesByLabel[node.label] = node;
}

/**
 * Pristine (null) → matches everything, same convention as every other
 * facet. Otherwise a compound matches if its own `benefit` is among the
 * real ancestor-benefit labels of *any* selected target — the finest
 * granularity `Compound.benefit` can actually confirm, since compounds in
 * this app aren't individually tagged with a specific sub_benefit/target.
 */
export function matchesSelectedTargets(compound: Compound, selected: FacetSelection): boolean {
  if (selected === null) return true;
  for (const targetLabel of selected) {
    if (targetNodesByLabel[targetLabel]?.ancestorBenefitLabels?.includes(compound.benefit)) {
      return true;
    }
  }
  return false;
}
