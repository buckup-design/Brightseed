import type { FilterOption } from "../types";
import type { FacetSelection } from "./facets";

/**
 * Tree-agnostic core for ontology-driven drill-down filters (Benefit's
 * health_area→benefit→sub_benefit→target, Compound Classes'
 * pathway→superclass→class). Both trees share the same shape once reduced
 * to what the UI/matching actually need: a generic numeric `level` (tier
 * names differ per tree), a real distinct-compound `count`, `childIds`
 * (pre-sorted by count desc, then label — matches `buildFilterGroup`'s
 * existing convention), and — on leaf/deepest-tier nodes only —
 * `ancestorLabels`: the real tier-1 label(s) reachable by walking up from
 * that leaf, which is what a compound's own coarse field (`benefit` /
 * `classification`) can be checked against.
 */
export interface OntologyNode {
  level: number;
  label: string;
  count: number;
  childIds: string[];
  ancestorLabels?: string[];
}

export interface OntologyTree {
  rootIds: string[];
  nodes: Record<string, OntologyNode>;
}

/** One step of a drill-down path — the chosen node's id + its display label. */
export interface PathEntry {
  id: string;
  label: string;
}

/** Root = the tree's top-level nodes when `parentId` is `null`; otherwise `parentId`'s own children. */
export function getChildOptions(tree: OntologyTree, parentId: string | null): FilterOption[] {
  const childIds = parentId === null ? tree.rootIds : tree.nodes[parentId]?.childIds ?? [];
  return childIds.map((id) => ({ label: tree.nodes[id].label, count: tree.nodes[id].count }));
}

/** Resolves a child's id from its label within a given parent (or the tree's roots when `parentId` is `null`). */
export function findChildId(tree: OntologyTree, parentId: string | null, label: string): string | undefined {
  const childIds = parentId === null ? tree.rootIds : tree.nodes[parentId]?.childIds ?? [];
  return childIds.find((id) => tree.nodes[id].label === label);
}

// Label → node id, built once per tree (keyed by object identity — each
// tree module's JSON import is a stable singleton) rather than re-scanning
// every node on every match check.
const leafIndexCache = new WeakMap<OntologyTree, Record<string, string>>();

function getLeafIndex(tree: OntologyTree): Record<string, string> {
  let index = leafIndexCache.get(tree);
  if (!index) {
    index = {};
    for (const [id, node] of Object.entries(tree.nodes)) {
      index[node.label] = id;
    }
    leafIndexCache.set(tree, index);
  }
  return index;
}

interface CompoundFieldValues {
  /** The compound's own tier-1 field value (`benefit` / `classification`) — checked against a selected leaf's `ancestorLabels`. */
  coarseValue: string | undefined;
  /** A specific real leaf-tier label assigned directly to this compound, if any — checked against a selected leaf's own label for an exact match. */
  exactValue: string | undefined;
}

/**
 * Pristine (null) → matches everything, same convention as every other
 * facet. Otherwise: if this compound has a precise `exactValue` (a specific
 * leaf-tier assignment), match ONLY by exact leaf-label equality — falling
 * back to the coarser ancestor check too would let it match under *every*
 * leaf sharing its tier-1 ancestor, defeating the point of having a precise
 * assignment (every compound under a benefit/superclass would clump
 * together at the deepest level again). Only compounds with no `exactValue`
 * at all fall back to the coarser check: does `coarseValue` appear in the
 * selected leaf's real `ancestorLabels`?
 */
export function matchesSelectedLeaves(
  tree: OntologyTree,
  selected: FacetSelection,
  { coarseValue, exactValue }: CompoundFieldValues
): boolean {
  if (selected === null) return true;
  if (exactValue !== undefined) return selected.has(exactValue);
  if (coarseValue === undefined) return false;
  const leafIndex = getLeafIndex(tree);
  for (const leafLabel of selected) {
    const leafId = leafIndex[leafLabel];
    const ancestorLabels = leafId ? tree.nodes[leafId].ancestorLabels : undefined;
    if (ancestorLabels?.includes(coarseValue)) return true;
  }
  return false;
}
