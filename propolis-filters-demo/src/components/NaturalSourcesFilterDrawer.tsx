import { useState } from "react";
import FilterCard from "./FilterCard";
import OntologyDrilldownCard from "./OntologyDrilldownCard";
import ScoreFilterCard from "./ScoreFilterCard";
import Switch from "./Switch";
import * as benefitOntology from "../lib/benefitOntology";
import * as compoundClassOntology from "../lib/compoundClassOntology";
import type { PathEntry } from "../lib/ontologyDrilldown";
import { toggleFacetSelection, type FacetSelection } from "../lib/facets";
import type { FilterGroup, NaturalSource } from "../types";

// Same level labels as the Compounds tab's two ontology drill-downs — see
// FilterDrawer.tsx's BENEFIT_LEVEL_LABELS/COMPOUND_CLASS_LEVEL_LABELS. Kept
// as a separate copy rather than a shared export: these two files' constants
// are one-line literals, not worth a cross-file dependency for.
const BENEFIT_LEVEL_LABELS = ["All Health Areas", "Benefits", "Sub-benefits", "Targets"];
const COMPOUND_CLASS_LEVEL_LABELS = ["All Pathways", "Superclasses", "Classes"];

// Biological Targets + Biomarkers has no real Natural Sources dataset field
// to drive it yet (per Anna, out of scope for carrying the Benefit/Compound
// Classes drill-downs over) — stays a static placeholder. Intentionally
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

interface NaturalSourcesFilterDrawerProps {
  sources: NaturalSource[];
}

export default function NaturalSourcesFilterDrawer({ sources }: NaturalSourcesFilterDrawerProps) {
  // Same shape as the Compounds tab's benefitPath/compoundClassPath state in
  // App.tsx (see BenefitDrilldown/CompoundClassDrilldown in FilterDrawer.tsx)
  // — kept local here rather than lifted to App, matching how every other
  // Natural Sources filter already manages its own state (this drawer has
  // no dataset-backed reason yet to live in App, see naturalSourcesResetKey's
  // comment there).
  const [benefitPath, setBenefitPath] = useState<PathEntry[]>([]);
  const [selectedBenefitTargets, setSelectedBenefitTargets] = useState<FacetSelection>(null);
  const [compoundClassPath, setCompoundClassPath] = useState<PathEntry[]>([]);
  const [selectedCompoundClasses, setSelectedCompoundClasses] = useState<FacetSelection>(null);
  const [selectedTargets, setSelectedTargets] = useState<FacetSelection>(null);
  const [requiresGras, setRequiresGras] = useState(false);
  const [requiresNonNovel, setRequiresNonNovel] = useState(false);

  // Cross-reactive between just these two, same principle as the Compounds
  // tab (drilling into one narrows the other's live counts) — the other two
  // facets on this tab (Biological Targets, Safety) aren't backed by a real
  // NaturalSource field yet, so there's nothing for them to narrow by.
  const sourcesForBenefit = sources.filter((source) =>
    compoundClassOntology.matchesSelectedClasses(source, selectedCompoundClasses)
  );
  const sourcesForCompoundClass = sources.filter((source) =>
    benefitOntology.matchesSelectedTargets(source, selectedBenefitTargets)
  );

  return (
    <div className="flex flex-col gap-3 bg-white px-4 py-3">
      <div className="grid grid-cols-3 gap-x-6 gap-y-2">
        <OntologyDrilldownCard
          id="source-benefit-drilldown"
          levelLabels={BENEFIT_LEVEL_LABELS}
          getChildOptions={(parentId) => benefitOntology.getDynamicChildOptions(parentId, sourcesForBenefit)}
          findChildId={benefitOntology.findChildId}
          path={benefitPath}
          onPathChange={setBenefitPath}
          selectedLeaves={selectedBenefitTargets}
          onToggleLeaf={(label) => setSelectedBenefitTargets((current) => toggleFacetSelection(current, label))}
          onResetLeaves={() => setSelectedBenefitTargets(null)}
        />
        <OntologyDrilldownCard
          id="source-compound-class-drilldown"
          levelLabels={COMPOUND_CLASS_LEVEL_LABELS}
          getChildOptions={(parentId) =>
            compoundClassOntology.getDynamicChildOptions(parentId, sourcesForCompoundClass)
          }
          findChildId={compoundClassOntology.findChildId}
          path={compoundClassPath}
          onPathChange={setCompoundClassPath}
          selectedLeaves={selectedCompoundClasses}
          onToggleLeaf={(label) => setSelectedCompoundClasses((current) => toggleFacetSelection(current, label))}
          onResetLeaves={() => setSelectedCompoundClasses(null)}
        />
        <FilterCard
          group={TARGETS_GROUP}
          selected={selectedTargets}
          onToggle={(label) => setSelectedTargets((current) => toggleFacetSelection(current, label))}
        />
      </div>

      <hr className="border-border" />
      <div className="grid grid-cols-3 gap-x-6 gap-y-2">
        <ScoreFilterCard title="Safety">
          <Switch label="(US) GRAS" checked={requiresGras} onChange={setRequiresGras} />
          <Switch label="(EU) non-novel food" checked={requiresNonNovel} onChange={setRequiresNonNovel} />
        </ScoreFilterCard>
      </div>
    </div>
  );
}
