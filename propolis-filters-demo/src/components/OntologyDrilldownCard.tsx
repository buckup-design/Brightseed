import FilterCard from "./FilterCard";
import type { PathEntry } from "../lib/ontologyDrilldown";
import type { FacetSelection } from "../lib/facets";
import type { FilterGroup, FilterOption } from "../types";

interface OntologyDrilldownCardProps {
  id: string;
  /** Plain-text label for the category currently shown, one per drill depth (index 0 = root). Last entry is the deepest, multi-select level. */
  levelLabels: string[];
  getChildOptions: (parentId: string | null) => FilterOption[];
  findChildId: (parentId: string | null, label: string) => string | undefined;
  path: PathEntry[];
  onPathChange: (path: PathEntry[]) => void;
  selectedLeaves: FacetSelection;
  onToggleLeaf: (label: string) => void;
  onResetLeaves: () => void;
}

/**
 * Generic ontology-driven drill-down filter card — navigate (single-choice,
 * replace the whole chip set, push a breadcrumb segment) until the deepest
 * level, where it becomes the real multi-select toggle every other facet
 * uses. Reused for both Benefit (health_area→benefit→sub_benefit→target)
 * and Compound Classes (pathway→superclass→class) — see benefitOntology.ts
 * and compoundClassOntology.ts for the tree-specific bindings passed in as
 * `getChildOptions`/`findChildId`.
 */
export default function OntologyDrilldownCard({
  id,
  levelLabels,
  getChildOptions,
  findChildId,
  path,
  onPathChange,
  selectedLeaves,
  onToggleLeaf,
  onResetLeaves,
}: OntologyDrilldownCardProps) {
  const depth = path.length;
  const isDeepest = depth === levelLabels.length - 1;
  const parentId = path.at(-1)?.id ?? null;
  const options = getChildOptions(parentId);

  // Levels before the deepest: a click drills forward one level (replace
  // the whole chip set, push a breadcrumb segment) — not a toggle, not
  // multi-select. Only the deepest level toggles/multi-selects, handled
  // below via the real onToggleLeaf instead of this.
  function drillInto(label: string) {
    const childId = findChildId(parentId, label);
    if (!childId) return;
    onPathChange([...path, { id: childId, label }]);
    // A stale leaf selection from a now-abandoned branch shouldn't keep
    // silently filtering once the user has navigated away from it — cheap
    // to call unconditionally since it's a no-op once already null.
    onResetLeaves();
  }

  // Clicking an underlined breadcrumb segment at index `i` jumps back to
  // right after that segment (keeps entries [0..i], drops everything past it).
  function navigateBackTo(index: number) {
    onPathChange(path.slice(0, index + 1));
    onResetLeaves();
  }

  const group: FilterGroup = {
    id,
    title: levelLabels[depth],
    options,
  };

  const titleContent = (
    <>
      {path.map((entry, index) => (
        <span key={entry.id}>
          <button
            type="button"
            className="underline hover:text-muted-foreground"
            onClick={() => navigateBackTo(index)}
          >
            {entry.label}
          </button>
          {" > "}
        </span>
      ))}
      {levelLabels[depth]}
    </>
  );

  return (
    <FilterCard
      group={group}
      titleContent={titleContent}
      selected={isDeepest ? selectedLeaves : null}
      onToggle={isDeepest ? onToggleLeaf : drillInto}
    />
  );
}
