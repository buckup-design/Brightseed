import { useState } from "react";
import FilterCard from "./FilterCard";
import ScoreFilterCard from "./ScoreFilterCard";
import Slider from "./Slider";
import Switch from "./Switch";
import { toggleFacetSelection, type FacetSelection } from "../lib/facets";
import type { FilterGroup } from "../types";

// Natural Sources has no real dataset yet (per Anna: "leave results area
// empty for now"), so these mirror the Figma spec's own placeholder chip
// values rather than being computed from data like the Compounds tab's
// facets are — swap for real data once a sources dataset exists. Note this
// intentionally includes one extra option per group beyond what's visible
// (Coumarins / TNF-α) so FilterCard's real overflow measurement naturally
// triggers "More", matching the Figma reference.
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
  const [selectedCompounds, setSelectedCompounds] = useState<FacetSelection>(null);
  const [selectedTargets, setSelectedTargets] = useState<FacetSelection>(null);
  const [formulationScore, setFormulationScore] = useState(1);
  const [bioactivePotential, setBioactivePotential] = useState(1);
  const [ftoScore, setFtoScore] = useState(1);
  const [patentabilityScore, setPatentabilityScore] = useState(1);
  const [admetScore, setAdmetScore] = useState(1);
  const [noGhsHazard, setNoGhsHazard] = useState(false);
  const [requiresGras, setRequiresGras] = useState(false);
  const [requiresNonNovel, setRequiresNonNovel] = useState(false);

  return (
    <div className="flex flex-col gap-3 bg-white px-4 py-3">
      <div className="grid grid-cols-3 gap-x-6 gap-y-2">
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
        <ScoreFilterCard title="Feasibility">
          <Slider
            label="Minimum formulation feasibility score"
            min={1}
            max={3}
            value={formulationScore}
            onChange={setFormulationScore}
          />
          <Slider
            label="Bioactive potential"
            min={1}
            max={3}
            value={bioactivePotential}
            onChange={setBioactivePotential}
          />
        </ScoreFilterCard>
      </div>

      <hr className="border-border" />
      <div className="grid grid-cols-3 gap-x-6 gap-y-2">
        <ScoreFilterCard title="Novelty">
          <Slider label="Minimum FTO score" min={1} max={3} value={ftoScore} onChange={setFtoScore} />
          <Slider
            label="Minimum patentability score"
            min={1}
            max={3}
            value={patentabilityScore}
            onChange={setPatentabilityScore}
          />
        </ScoreFilterCard>

        <ScoreFilterCard title="Safety">
          <Slider
            label="Minimum ADMET score of compounds within"
            min={1}
            max={3}
            value={admetScore}
            onChange={setAdmetScore}
          />
          <Switch
            label="No GHS hazard code for compounds within"
            checked={noGhsHazard}
            onChange={setNoGhsHazard}
          />
          <Switch label="(US) GRAS" checked={requiresGras} onChange={setRequiresGras} />
          <Switch label="(EU) non-novel food" checked={requiresNonNovel} onChange={setRequiresNonNovel} />
        </ScoreFilterCard>
      </div>
    </div>
  );
}
