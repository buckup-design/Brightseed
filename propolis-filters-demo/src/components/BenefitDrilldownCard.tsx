import FilterCard from "./FilterCard";
import { findChildId, getChildOptions, type PathEntry } from "../lib/benefitOntology";
import type { FacetSelection } from "../lib/facets";
import type { FilterGroup } from "../types";

// Plain-text label for the category currently shown, one per drill depth
// (0 = root Health Area list, 3 = deepest Targets list). Matches the Figma
// spec's breadcrumb wording, except the deepest one is capitalized
// "Targets" — the design itself has it lowercase ("targets"), inconsistent
// with "Benefits"/"Sub-benefits" above it; fixing that inconsistency per
// Anna rather than mirroring it.
const LEVEL_LABELS = ["Health Area", "Benefits", "Sub-benefits", "Targets"];

interface BenefitDrilldownCardProps {
  path: PathEntry[];
  onPathChange: (path: PathEntry[]) => void;
  selectedTargets: FacetSelection;
  onToggleTarget: (label: string) => void;
  onResetTargets: () => void;
}

export default function BenefitDrilldownCard({
  path,
  onPathChange,
  selectedTargets,
  onToggleTarget,
  onResetTargets,
}: BenefitDrilldownCardProps) {
  const depth = path.length;
  const isDeepest = depth === 3;
  const parentId = path.at(-1)?.id ?? null;
  const options = getChildOptions(parentId);

  // Levels 0–2: a click drills forward one level (replace the whole chip
  // set, push a breadcrumb segment) — not a toggle, not multi-select, per
  // the Figma spec. Only the deepest (targets) level toggles/multi-selects,
  // handled below via the real onToggleTarget instead of this.
  function drillInto(label: string) {
    const childId = findChildId(parentId, label);
    if (!childId) return;
    onPathChange([...path, { id: childId, label }]);
    // A stale target selection from a now-abandoned branch shouldn't keep
    // silently filtering once the user has navigated away from it — cheap
    // to call unconditionally since it's a no-op once already null.
    onResetTargets();
  }

  // Clicking an underlined breadcrumb segment at index `i` jumps back to
  // right after that segment (keeps entries [0..i], drops everything past it).
  function navigateBackTo(index: number) {
    onPathChange(path.slice(0, index + 1));
    onResetTargets();
  }

  const group: FilterGroup = {
    id: "benefit-drilldown",
    title: LEVEL_LABELS[depth],
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
      {LEVEL_LABELS[depth]}
    </>
  );

  return (
    <FilterCard
      group={group}
      titleContent={titleContent}
      selected={isDeepest ? selectedTargets : null}
      onToggle={isDeepest ? onToggleTarget : drillInto}
    />
  );
}
