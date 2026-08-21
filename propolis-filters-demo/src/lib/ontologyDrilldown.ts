import type { FilterOption } from "../types";
import type { FacetSelection } from "./facets";

/**
 * Tree-agnostic core for ontology-driven drill-down filters (Benefit's
 * health_area→benefit→sub_benefit→target, Compound Classes'
 * pathway→superclass→class). Both trees share the same shape once reduced
 * to what the UI/matching actually need: a generic numeric `level` (tier
 * names differ per tree), a real distinct-compound `count`, `childIds`
 * (structural — the `count`/order shown to the user now comes from
 * `getDynamicChildOptions` below, not this static field or order), and —
 * on leaf/deepest-tier nodes only — `ancestorLabels`: the real tier-1
 * label(s) reachable by walking up from that leaf, which is what a
 * compound's own coarse field (`benefit` / `classification`) can be
 * checked against.
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

export interface CompoundFieldValues {
  /** The compound's own tier-1 field value (`benefit` / `classification`) — checked against a node's real `ancestorLabels`/coverage. */
  coarseValue: string | undefined;
  /** A specific real leaf-tier label assigned directly to this compound, if any — checked against a node's own label (leaf) or subtree membership (non-leaf). */
  exactValue: string | undefined;
}

/**
 * Does this one leaf node match a compound's field values? If the compound
 * has a precise `exactValue`, match ONLY by exact leaf-label equality —
 * falling back to the coarser ancestor check too would let it match under
 * *every* leaf sharing its tier-1 ancestor, defeating the point of having a
 * precise assignment. Only compounds with no `exactValue` at all fall back
 * to the coarser check: does `coarseValue` appear in this leaf's real
 * `ancestorLabels`? Shared by the real filter predicate
 * (`matchesSelectedLeaves`) and the live-count computation
 * (`getDynamicChildOptions`) so the two can't drift apart.
 */
function matchesLeafNode(tree: OntologyTree, leafId: string, { coarseValue, exactValue }: CompoundFieldValues): boolean {
  const leaf = tree.nodes[leafId];
  if (!leaf) return false;
  if (exactValue !== undefined) return exactValue === leaf.label;
  if (coarseValue === undefined) return false;
  return leaf.ancestorLabels?.includes(coarseValue) ?? false;
}

/**
 * Pristine (null) → matches everything, same convention as every other
 * facet. Otherwise: does this compound match *any* of the selected leaf
 * labels, per `matchesLeafNode` above?
 */
export function matchesSelectedLeaves(
  tree: OntologyTree,
  selected: FacetSelection,
  values: CompoundFieldValues
): boolean {
  if (selected === null) return true;
  const leafIndex = getLeafIndex(tree);
  for (const leafLabel of selected) {
    const leafId = leafIndex[leafLabel];
    if (leafId && matchesLeafNode(tree, leafId, values)) return true;
  }
  return false;
}

/**
 * Does this one item fall under a given node — leaf or not? For a leaf,
 * identical to `matchesLeafNode`. For a non-leaf, real leaf-descendant
 * reachability (exact match) or tier-1 coverage (coarse match) — the same
 * per-item check `countCompoundsUnderNode` below sums over a whole list,
 * factored out so a single boolean predicate (for real filtering) and a
 * count (for chip display) can't drift apart.
 */
function matchesNode(tree: OntologyTree, nodeId: string, values: CompoundFieldValues): boolean {
  const node = tree.nodes[nodeId];
  if (!node) return false;
  if (node.childIds.length === 0) return matchesLeafNode(tree, nodeId, values);

  const { coarseValue, exactValue } = values;
  if (exactValue !== undefined) {
    const leafId = getLeafIndex(tree)[exactValue];
    return leafId !== undefined && getLeafDescendantIds(tree, nodeId).has(leafId);
  }
  return coarseValue !== undefined && getCoarseCoverageLabels(tree, nodeId).includes(coarseValue);
}

// --- Live (reactive) counting for drill-down chips ---
//
// Both of the below are pure structural facts about a tree — computed once
// per tree (WeakMap-cached on the tree object's identity, which is stable
// since each tree module's JSON import is a singleton) and reused across
// every render/filter change, not recomputed per call.

/** Every node's set of leaf-descendant ids (DFS down through `childIds`; a leaf's own set is just itself). Handles the DAG's real multi-parent nodes correctly — it's plain reachability, not a tree-shape assumption. */
const leafDescendantsCache = new WeakMap<OntologyTree, Map<string, Set<string>>>();

function getLeafDescendantIds(tree: OntologyTree, nodeId: string): Set<string> {
  let byNode = leafDescendantsCache.get(tree);
  if (!byNode) {
    byNode = new Map<string, Set<string>>();
    const memo = byNode;
    function visit(id: string): Set<string> {
      const cached = memo.get(id);
      if (cached) return cached;
      const node = tree.nodes[id];
      if (!node) return new Set();
      if (node.childIds.length === 0) {
        const own = new Set([id]);
        memo.set(id, own);
        return own;
      }
      const result = new Set<string>();
      memo.set(id, result); // placeholder first, guards against any accidental cycle
      for (const childId of node.childIds) {
        for (const leafId of visit(childId)) result.add(leafId);
      }
      return result;
    }
    for (const id of Object.keys(tree.nodes)) visit(id);
    leafDescendantsCache.set(tree, byNode);
  }
  return byNode.get(nodeId) ?? new Set();
}

/** Reverse of every node's `childIds` — id → its parent id(s). Built once per tree. */
const parentIndexCache = new WeakMap<OntologyTree, Record<string, string[]>>();

function getParentIndex(tree: OntologyTree): Record<string, string[]> {
  let index = parentIndexCache.get(tree);
  if (!index) {
    index = {};
    for (const [id, node] of Object.entries(tree.nodes)) {
      for (const childId of node.childIds) {
        (index[childId] ??= []).push(id);
      }
    }
    parentIndexCache.set(tree, index);
  }
  return index;
}

/** A node's real tier-1 (`level === 1`) ancestor label(s), reached by walking up through every real parent chain (the DAG can have more than one). Tier-0 (root) nodes have none — see `getCoarseCoverageLabels` for how roots are handled instead. */
const tier1AncestorCache = new WeakMap<OntologyTree, Map<string, string[]>>();

function getTier1AncestorLabels(tree: OntologyTree, nodeId: string): string[] {
  let cache = tier1AncestorCache.get(tree);
  if (!cache) {
    cache = new Map();
    tier1AncestorCache.set(tree, cache);
  }
  const cached = cache.get(nodeId);
  if (cached) return cached;

  const node = tree.nodes[nodeId];
  let result: string[];
  if (!node || node.level === 0) {
    result = [];
  } else if (node.level === 1) {
    result = [node.label];
  } else {
    const labels = new Set<string>();
    for (const parentId of getParentIndex(tree)[nodeId] ?? []) {
      for (const label of getTier1AncestorLabels(tree, parentId)) labels.add(label);
    }
    result = [...labels];
  }
  cache.set(nodeId, result);
  return result;
}

/**
 * The tier-1 label(s) a "coarse-only" compound (no precise leaf assignment)
 * would need to match to count as being under this node. For tier-0 (root)
 * nodes this is their own direct children's labels — a coarse compound
 * value is always a real tier-1 label by construction, so a root's
 * relevant scope is "which tier-1 children does it have", not "its own
 * ancestors" (roots have none). Every other node just uses its real tier-1
 * ancestor(s).
 */
function getCoarseCoverageLabels(tree: OntologyTree, nodeId: string): string[] {
  const node = tree.nodes[nodeId];
  if (!node) return [];
  if (node.level === 0) return node.childIds.map((id) => tree.nodes[id].label);
  return getTier1AncestorLabels(tree, nodeId);
}

function countCompoundsUnderNode(tree: OntologyTree, nodeId: string, compoundValues: CompoundFieldValues[]): number {
  let count = 0;
  for (const values of compoundValues) {
    if (matchesNode(tree, nodeId, values)) count++;
  }
  return count;
}

/**
 * Does this item fall within the scope the user has currently drilled into?
 * An explicit leaf selection (the deepest level's real multi-select toggle)
 * is authoritative once made. Short of that, navigating the breadcrumb
 * itself is the filter — per Anna, drilling down the tree (Health Area →
 * Benefit → Sub-benefit, say) progressively narrows the result set on its
 * own, node by node, not just once a leaf Target is finally picked. An
 * empty path (nothing navigated, still at the root) matches everything,
 * same pristine convention as every other facet.
 */
export function matchesDrilldownScope(
  tree: OntologyTree,
  path: PathEntry[],
  selected: FacetSelection,
  values: CompoundFieldValues
): boolean {
  if (selected !== null) return matchesSelectedLeaves(tree, selected, values);
  if (path.length === 0) return true;
  return matchesNode(tree, path[path.length - 1].id, values);
}

/**
 * Root = the tree's top-level nodes when `parentId` is `null`; otherwise
 * `parentId`'s own children. Each option's `count` reflects how many of
 * the given `compoundValues` (the live, other-filters-applied compound
 * list — see App.tsx) fall under that specific node right now, and
 * `disabled` marks the zero-count ones (per Anna, matching how
 * EvidenceTypeFilter already disables zero-count evidence types). Options
 * are re-sorted by count desc, label asc on every call — chip *order* has
 * to stay live too, not just the numbers, per Anna.
 */
export function getDynamicChildOptions(
  tree: OntologyTree,
  parentId: string | null,
  compoundValues: CompoundFieldValues[]
): FilterOption[] {
  const childIds = parentId === null ? tree.rootIds : tree.nodes[parentId]?.childIds ?? [];
  const options = childIds.map((id) => {
    const count = countCompoundsUnderNode(tree, id, compoundValues);
    return { label: tree.nodes[id].label, count, disabled: count === 0 };
  });
  options.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  return options;
}
