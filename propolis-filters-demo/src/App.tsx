import { useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatPanel from "./components/ChatPanel";
import Header, { type TabId } from "./components/Header";
import FilterToolbar, { type ViewMode } from "./components/FilterToolbar";
import FilterToggleBar from "./components/FilterToggleBar";
import FilterDrawer, {
  type BenefitDrilldown,
  type CompoundClassDrilldown,
  type FilterFacet,
  type ScorePanel,
} from "./components/FilterDrawer";
import NaturalSourcesFilterDrawer from "./components/NaturalSourcesFilterDrawer";
import CardGrid from "./components/CardGrid";
import EmptyState from "./components/EmptyState";
import { compounds } from "./data/mockData";
import { countEvidenceTypes, matchesEvidenceType, type EvidenceTypeValue } from "./lib/evidenceType";
import { matchesSelectedTargets } from "./lib/benefitOntology";
import { matchesSelectedClasses } from "./lib/compoundClassOntology";
import type { PathEntry } from "./lib/ontologyDrilldown";
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
  // Benefit drill-down (Health Area → Benefit → Sub-benefit → Targets, see
  // BenefitDrilldownCard). `benefitPath` is the chosen non-terminal steps
  // (0–3 entries); `selectedBenefitTargets` is the deepest level's real
  // multi-select, same FacetSelection convention as every other facet.
  const [benefitPath, setBenefitPath] = useState<PathEntry[]>([]);
  const [selectedBenefitTargets, setSelectedBenefitTargets] = useState<FacetSelection>(null);
  // Compound Classes drill-down (Pathway → Superclass → Classes), same
  // shape as the Benefit one above — see OntologyDrilldownCard.
  const [compoundClassPath, setCompoundClassPath] = useState<PathEntry[]>([]);
  const [selectedCompoundClasses, setSelectedCompoundClasses] = useState<FacetSelection>(null);
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

  // Natural Sources' filter state is local to NaturalSourcesFilterDrawer
  // (it has no dataset yet to drive filtering from App). Bumping this key
  // remounts that drawer, which resets its local useState back to defaults —
  // simplest way to reset a subtree's state without lifting it all up here.
  const [naturalSourcesResetKey, setNaturalSourcesResetKey] = useState(0);

  const toggleFavorite = (id: string) => {
    setFavorites((current) => toggleSetValue(current, id));
  };

  const resetCompoundFilters = () => {
    setEvidenceType("any");
    setBenefitPath([]);
    setSelectedBenefitTargets(null);
    setCompoundClassPath([]);
    setSelectedCompoundClasses(null);
    setSelectedTargets(null);
    setProductFormat("");
    setRequiresNoDeliveryTech(false);
    setFormulationScore(SCORE_RANGES.easeOfFormulation.min);
    setSolubilityScore(SCORE_RANGES.solubility.min);
    setFtoScore(SCORE_RANGES.fto.min);
    setPatentabilityScore(SCORE_RANGES.patentability.min);
    setAdmetScore(SCORE_RANGES.admet.min);
    setNoGhsHazard(false);
    setRequiresGras(false);
    setRequiresNonNovel(false);
  };

  const evidenceTypeCounts = useMemo(() => countEvidenceTypes(compounds), []);

  const biologicalTargetGroup = useMemo(
    () =>
      buildFilterGroup(compounds, "biological-targets", "Biological Targets + Biomarkers", (c) => c.targets),
    []
  );
  const productFormatOptions = useMemo(() => buildProductFormatOptions(compounds), []);

  const facets: FilterFacet[] = [
    { group: biologicalTargetGroup, selected: selectedTargets, onToggle: (label) => setSelectedTargets((c) => toggleFacetSelection(c, label)) },
  ];

  const benefitDrilldown: BenefitDrilldown = {
    path: benefitPath,
    onPathChange: setBenefitPath,
    selectedTargets: selectedBenefitTargets,
    onToggleTarget: (label) => setSelectedBenefitTargets((c) => toggleFacetSelection(c, label)),
    onResetTargets: () => setSelectedBenefitTargets(null),
  };

  const compoundClassDrilldown: CompoundClassDrilldown = {
    path: compoundClassPath,
    onPathChange: setCompoundClassPath,
    selectedClasses: selectedCompoundClasses,
    onToggleClass: (label) => setSelectedCompoundClasses((c) => toggleFacetSelection(c, label)),
    onResetClasses: () => setSelectedCompoundClasses(null),
  };

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

  // Predicted compounds carry no product-format, delivery-tech, formulation,
  // novelty, or GHS hazard data — those controls are disabled in the drawer
  // (see FilterDrawer's disabledForPredicted), and the filters they drive are
  // forced back to their ANY/off default here so a leftover non-default
  // position from a prior evidence-type selection can't zero out results.
  const isPredictedOnly = evidenceType === "predicted";

  const filteredCompounds = useMemo(
    () =>
      compounds.filter(
        (compound) =>
          matchesEvidenceType(compound, evidenceType) &&
          matchesSelectedTargets(compound, selectedBenefitTargets) &&
          matchesSelectedClasses(compound, selectedCompoundClasses) &&
          matchesAnySelected(compound, selectedTargets, (c) => c.targets) &&
          matchesProductFormat(compound, isPredictedOnly ? "" : productFormat) &&
          matchesFlag(compound.requiresDeliveryTechnology, isPredictedOnly ? false : requiresNoDeliveryTech, "no") &&
          matchesMinScore(
            compound,
            "easeOfFormulation",
            isPredictedOnly ? SCORE_RANGES.easeOfFormulation.min : formulationScore
          ) &&
          matchesMinScore(compound, "solubility", solubilityScore) &&
          matchesMinScore(compound, "fto", isPredictedOnly ? SCORE_RANGES.fto.min : ftoScore) &&
          matchesMinScore(
            compound,
            "patentability",
            isPredictedOnly ? SCORE_RANGES.patentability.min : patentabilityScore
          ) &&
          matchesMaxToxicity(compound, admetScore) &&
          matchesFlag(compound.ghsHazardCode, isPredictedOnly ? false : noGhsHazard, "no") &&
          matchesFlag(compound.grasSource, requiresGras, "yes") &&
          matchesFlag(compound.nonNovelSource, requiresNonNovel, "yes")
      ),
    [
      evidenceType,
      isPredictedOnly,
      selectedBenefitTargets,
      selectedCompoundClasses,
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

              {filtersVisible && (
                <FilterDrawer
                  benefitDrilldown={benefitDrilldown}
                  compoundClassDrilldown={compoundClassDrilldown}
                  facets={facets}
                  scorePanel={scorePanel}
                  disabledForPredicted={isPredictedOnly}
                />
              )}

              <FilterToggleBar
                visible={filtersVisible}
                onToggle={() => setFiltersVisible((value) => !value)}
                onReset={resetCompoundFilters}
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

              {filtersVisible && <NaturalSourcesFilterDrawer key={naturalSourcesResetKey} />}

              <FilterToggleBar
                visible={filtersVisible}
                onToggle={() => setFiltersVisible((value) => !value)}
                onReset={() => setNaturalSourcesResetKey((key) => key + 1)}
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
