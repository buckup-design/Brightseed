import { useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatPanel from "./components/ChatPanel";
import Header, { type TabId } from "./components/Header";
import FilterToolbar, { type ViewMode } from "./components/FilterToolbar";
import FilterToggleBar from "./components/FilterToggleBar";
import FilterDrawer, { type FilterFacet, type ScorePanel } from "./components/FilterDrawer";
import NaturalSourcesFilterDrawer from "./components/NaturalSourcesFilterDrawer";
import CardGrid from "./components/CardGrid";
import EmptyState from "./components/EmptyState";
import { compounds } from "./data/mockData";
import { countEvidenceTypes, matchesEvidenceType, type EvidenceTypeValue } from "./lib/evidenceType";
import {
  buildFilterGroup,
  matchesAnySelected,
  toggleFacetSelection,
  toggleSetValue,
  type FacetSelection,
} from "./lib/facets";
import {
  SCORE_RANGES,
  buildProductFormatOptions,
  matchesFlag,
  matchesMaxToxicity,
  matchesMinScore,
  matchesProductFormat,
} from "./lib/scoreFilters";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("compounds");
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedBenefits, setSelectedBenefits] = useState<FacetSelection>(null);
  const [selectedClasses, setSelectedClasses] = useState<FacetSelection>(null);
  const [selectedTargets, setSelectedTargets] = useState<FacetSelection>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [evidenceType, setEvidenceType] = useState<EvidenceTypeValue>("any");

  // Feasibility / Novelty / Safety panel — sliders default to each field's
  // floor (ANY, no filter applied, dot far left); switches default off.
  const [productFormat, setProductFormat] = useState("");
  const [requiresNoDeliveryTech, setRequiresNoDeliveryTech] = useState(false);
  const [formulationScore, setFormulationScore] = useState(SCORE_RANGES.easeOfFormulation.min);
  const [solubilityScore, setSolubilityScore] = useState(SCORE_RANGES.solubility.min);
  const [ftoScore, setFtoScore] = useState(SCORE_RANGES.fto.min);
  const [patentabilityScore, setPatentabilityScore] = useState(SCORE_RANGES.patentability.min);
  const [admetScore, setAdmetScore] = useState(SCORE_RANGES.admet.min);
  const [noGhsHazard, setNoGhsHazard] = useState(false);
  const [requiresGras, setRequiresGras] = useState(false);
  const [requiresNonNovel, setRequiresNonNovel] = useState(false);

  const toggleFavorite = (id: string) => {
    setFavorites((current) => toggleSetValue(current, id));
  };

  const evidenceTypeCounts = useMemo(() => countEvidenceTypes(compounds), []);

  const benefitGroup = useMemo(
    () => buildFilterGroup(compounds, "benefit", "Benefit", (c) => c.benefit),
    []
  );
  const compoundClassGroup = useMemo(
    () => buildFilterGroup(compounds, "compound-classes", "Compound Classes", (c) => c.classification),
    []
  );
  const biologicalTargetGroup = useMemo(
    () =>
      buildFilterGroup(compounds, "biological-targets", "Biological Targets + Biomarkers", (c) => c.targets),
    []
  );
  const productFormatOptions = useMemo(() => buildProductFormatOptions(compounds), []);

  const facets: FilterFacet[] = [
    { group: benefitGroup, selected: selectedBenefits, onToggle: (label) => setSelectedBenefits((c) => toggleFacetSelection(c, label)) },
    { group: compoundClassGroup, selected: selectedClasses, onToggle: (label) => setSelectedClasses((c) => toggleFacetSelection(c, label)) },
    { group: biologicalTargetGroup, selected: selectedTargets, onToggle: (label) => setSelectedTargets((c) => toggleFacetSelection(c, label)) },
  ];

  const scorePanel: ScorePanel = {
    productFormatOptions,
    productFormat,
    onProductFormatChange: setProductFormat,
    requiresNoDeliveryTech,
    onRequiresNoDeliveryTechChange: setRequiresNoDeliveryTech,
    formulationScore,
    onFormulationScoreChange: setFormulationScore,
    solubilityScore,
    onSolubilityScoreChange: setSolubilityScore,
    ftoScore,
    onFtoScoreChange: setFtoScore,
    patentabilityScore,
    onPatentabilityScoreChange: setPatentabilityScore,
    admetScore,
    onAdmetScoreChange: setAdmetScore,
    noGhsHazard,
    onNoGhsHazardChange: setNoGhsHazard,
    requiresGras,
    onRequiresGrasChange: setRequiresGras,
    requiresNonNovel,
    onRequiresNonNovelChange: setRequiresNonNovel,
  };

  const filteredCompounds = useMemo(
    () =>
      compounds.filter(
        (compound) =>
          matchesEvidenceType(compound, evidenceType) &&
          matchesAnySelected(compound, selectedBenefits, (c) => c.benefit) &&
          matchesAnySelected(compound, selectedClasses, (c) => c.classification) &&
          matchesAnySelected(compound, selectedTargets, (c) => c.targets) &&
          matchesProductFormat(compound, productFormat) &&
          matchesFlag(compound.requiresDeliveryTechnology, requiresNoDeliveryTech, "no") &&
          matchesMinScore(compound, "easeOfFormulation", formulationScore) &&
          matchesMinScore(compound, "solubility", solubilityScore) &&
          matchesMinScore(compound, "fto", ftoScore) &&
          matchesMinScore(compound, "patentability", patentabilityScore) &&
          matchesMaxToxicity(compound, admetScore) &&
          matchesFlag(compound.ghsHazardCode, noGhsHazard, "no") &&
          matchesFlag(compound.grasSource, requiresGras, "yes") &&
          matchesFlag(compound.nonNovelSource, requiresNonNovel, "yes")
      ),
    [
      evidenceType,
      selectedBenefits,
      selectedClasses,
      selectedTargets,
      productFormat,
      requiresNoDeliveryTech,
      formulationScore,
      solubilityScore,
      ftoScore,
      patentabilityScore,
      admetScore,
      noGhsHazard,
      requiresGras,
      requiresNonNovel,
    ]
  );

  // Natural Sources has no dataset yet — results area is intentionally empty.
  const resultCount = activeTab === "compounds" ? filteredCompounds.length : 0;

  return (
    <div className="flex h-screen w-full bg-white text-foreground">
      <Sidebar />

      <div className="flex min-w-0 flex-1">
        <div className="flex w-[400px] shrink-0 flex-col border-r border-border">
          <ChatPanel />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <Header activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "compounds" ? (
            <>
              <FilterToolbar
                evidenceType={{ value: evidenceType, onChange: setEvidenceType, counts: evidenceTypeCounts }}
                resultCount={resultCount}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />

              {filtersVisible && <FilterDrawer facets={facets} scorePanel={scorePanel} />}

              <FilterToggleBar
                visible={filtersVisible}
                onToggle={() => setFiltersVisible((value) => !value)}
              />

              <CardGrid
                compounds={filteredCompounds}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            </>
          ) : (
            <>
              <FilterToolbar resultCount={resultCount} viewMode={viewMode} onViewModeChange={setViewMode} />

              {filtersVisible && <NaturalSourcesFilterDrawer />}

              <FilterToggleBar
                visible={filtersVisible}
                onToggle={() => setFiltersVisible((value) => !value)}
              />

              {/* No Natural Sources dataset exists yet, so this is always empty for now. */}
              <EmptyState message="No matching sources found." />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
