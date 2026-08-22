import FilterCard from "./FilterCard";
import OntologyDrilldownCard from "./OntologyDrilldownCard";
import ScoreFilterCard from "./ScoreFilterCard";
import Switch from "./Switch";
import * as benefitOntology from "../lib/benefitOntology";
import * as compoundClassOntology from "../lib/compoundClassOntology";
import type { PathEntry } from "../lib/ontologyDrilldown";
import type { FacetSelection } from "../lib/facets";
import type { FilterGroup, NaturalSource } from "../types";

// Same level labels as the Compounds tab's two ontology drill-downs — see
// FilterDrawer.tsx's BENEFIT_LEVEL_LABELS/COMPOUND_CLASS_LEVEL_LABELS. Kept
// as a separate copy rather than a shared export: these two files' constants
// are one-line literals, not worth a cross-file dependency for.
const BENEFIT_LEVEL_LABELS = ["All Health Areas", "Benefits", "Sub-benefits", "Targets"];
const COMPOUND_CLASS_LEVEL_LABELS = ["All Pathways", "Superclasses", "Classes"];

// Biological Targets + Biomarkers has no real Natural Sources dataset field
// to drive it yet, so it stays a static, non-reactive placeholder (out of
// scope for the Benefit/Compound Classes/Safety wiring below). Intentionally
// includes one extra option beyond what's visible (TNF-α) so FilterCard's
// real overflow measurement naturally triggers "More".
const TARGETS_GROUP: FilterGroup = {
  id: "source-targets",
  title: "Biological Targets + Biomarkers",
  options: [
    { label: "AMPK", count: 12 },
    { label: "PTP1B", count: 8 },
    { label: "PPAR-gamma", count: 9 },
    { label: "Nrf2", count: 1 },
    { label: "NF-kB", count: 1 },
    { label: "TNF-α", count: 1 },
  ],
};

/** One ontology drill-down's full controlled state, owned by App.tsx — same shape for both Benefit and Compound Classes. */
export interface SourceDrilldown {
  path: PathEntry[];
  onPathChange: (path: PathEntry[]) => void;
  selected: FacetSelection;
  onToggle: (label: string) => void;
  onReset: () => void;
  /** Sources matching every *other* currently-active filter — drives this drill-down's live chip counts. */
  sources: NaturalSource[];
}

interface NaturalSourcesFilterDrawerProps {
  benefitDrilldown: SourceDrilldown;
  compoundClassDrilldown: SourceDrilldown;
  selectedTargets: FacetSelection;
  onToggleTarget: (label: string) => void;
  requiresGras: boolean;
  onRequiresGrasChange: (value: boolean) => void;
  requiresNonNovel: boolean;
  onRequiresNonNovelChange: (value: boolean) => void;
}

export default function NaturalSourcesFilterDrawer({
  benefitDrilldown,
  compoundClassDrilldown,
  selectedTargets,
  onToggleTarget,
  requiresGras,
  onRequiresGrasChange,
  requiresNonNovel,
  onRequiresNonNovelChange,
}: NaturalSourcesFilterDrawerProps) {
  return (
    <div className="flex flex-col gap-3 bg-white px-4 py-3">
      <div className="grid grid-cols-3 gap-x-6 gap-y-2">
        <OntologyDrilldownCard
          id="source-benefit-drilldown"
          levelLabels={BENEFIT_LEVEL_LABELS}
          getChildOptions={(parentId) =>
            benefitOntology.getDynamicChildOptions(parentId, benefitDrilldown.sources)
          }
          findChildId={benefitOntology.findChildId}
          path={benefitDrilldown.path}
          onPathChange={benefitDrilldown.onPathChange}
          selectedLeaves={benefitDrilldown.selected}
          onToggleLeaf={benefitDrilldown.onToggle}
          onResetLeaves={benefitDrilldown.onReset}
        />
        <OntologyDrilldownCard
          id="source-compound-class-drilldown"
          levelLabels={COMPOUND_CLASS_LEVEL_LABELS}
          getChildOptions={(parentId) =>
            compoundClassOntology.getDynamicChildOptions(parentId, compoundClassDrilldown.sources)
          }
          findChildId={compoundClassOntology.findChildId}
          path={compoundClassDrilldown.path}
          onPathChange={compoundClassDrilldown.onPathChange}
          selectedLeaves={compoundClassDrilldown.selected}
          onToggleLeaf={compoundClassDrilldown.onToggle}
          onResetLeaves={compoundClassDrilldown.onReset}
        />
        <FilterCard group={TARGETS_GROUP} selected={selectedTargets} onToggle={onToggleTarget} />
      </div>

      <hr className="border-border" />
      <div className="grid grid-cols-3 gap-x-6 gap-y-2">
        <ScoreFilterCard title="Safety">
          <Switch label="(US) GRAS" checked={requiresGras} onChange={onRequiresGrasChange} />
          <Switch label="(EU) non-novel food" checked={requiresNonNovel} onChange={onRequiresNonNovelChange} />
        </ScoreFilterCard>
      </div>
    </div>
  );
}
