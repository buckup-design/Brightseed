import { useState } from "react";
import FilterCard from "./FilterCard";
import ScoreFilterCard from "./ScoreFilterCard";
import Switch from "./Switch";
import { toggleFacetSelection, type FacetSelection } from "../lib/facets";
import type { FilterGroup } from "../types";

// Natural Sources has no real dataset yet (per Anna: "leave results area
// empty for now"), so these mirror mock placeholder values rather than being
// computed from data like the Compounds tab's facets are — swap for real
// data once a sources dataset exists. Benefit reuses the same values/rough
// counts as the Compounds tab's real Benefit facet (sources presumably tie
// to the same muscle-health benefit categories); Compounds/Biological
// Targets intentionally include one extra option beyond what's visible
// (Coumarins / TNF-α) so FilterCard's real overflow measurement naturally
// triggers "More".
const BENEFIT_GROUP: FilterGroup = {
  id: "source-benefit",
  title: "Benefit",
  options: [
    { label: "Restores Mitochondrial Function And Quality", count: 19 },
    { label: "Prevents Muscle Protein Degradation And Atrophy", count: 14 },
    { label: "Promotes Muscle Hypertrophy And Adaptive Growth", count: 5 },
    { label: "Supports Nutrient Dependent Muscle Growth", count: 1 },
  ],
};

const COMPOUNDS_GROUP: FilterGroup = {
  id: "source-compounds",
  title: "Compounds",
  options: [
    { label: "Flavonoids", count: 12 },
    { label: "Phenolic acids", count: 8 },
    { label: "Shikimates", count: 5 },
    { label: "Alkaloids", count: 4 },
    { label: "Terpenoids", count: 4 },
    { label: "Coumarins", count: 2 },
  ],
};

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

export default function NaturalSourcesFilterDrawer() {
  const [selectedBenefits, setSelectedBenefits] = useState<FacetSelection>(null);
  const [selectedCompounds, setSelectedCompounds] = useState<FacetSelection>(null);
  const [selectedTargets, setSelectedTargets] = useState<FacetSelection>(null);
  const [requiresGras, setRequiresGras] = useState(false);
  const [requiresNonNovel, setRequiresNonNovel] = useState(false);

  return (
    <div className="flex flex-col gap-3 bg-white px-4 py-3">
      <div className="grid grid-cols-3 gap-x-6 gap-y-2">
        <FilterCard
          group={BENEFIT_GROUP}
          selected={selectedBenefits}
          onToggle={(label) => setSelectedBenefits((current) => toggleFacetSelection(current, label))}
        />
        <FilterCard
          group={COMPOUNDS_GROUP}
          selected={selectedCompounds}
          onToggle={(label) => setSelectedCompounds((current) => toggleFacetSelection(current, label))}
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
