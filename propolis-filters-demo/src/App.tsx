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
import NaturalSourcesFilterDrawer, { type SourceDrilldown } from "./components/NaturalSourcesFilterDrawer";
import CardGrid from "./components/CardGrid";
import NaturalSourceCardGrid from "./components/NaturalSourceCardGrid";
import { compounds as baseCompounds } from "./data/mockData";
import { combinations } from "./data/combinationsMockData";
import { naturalSources } from "./data/naturalSourcesMockData";

// Combination (combo) cards are a third `cardType` in the same Compounds
// results set, not a separate tab — see CompoundCard.tsx's 3-way branch.
const compounds: Compound[] = [...baseCompounds, ...combinations];
import type { Compound, NaturalSource } from "./types";
import { countEvidenceTypes, matchesEvidenceType, type EvidenceTypeValue } from "./lib/evidenceType";
import * as benefitOntology from "./lib/benefitOntology";
import * as compoundClassOntology from "./lib/compoundClassOntology";
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
  // Natural Sources' "sorted by" dropdown — display only for now (see
  // FilterToolbar's sortDropdown prop doc): no relative-abundance data
  // exists yet, and per Anna even "A → Z" shouldn't reorder cards in this
  // pass, so this state drives the control's selected value only.
  const [sourceSortOrder, setSourceSortOrder] = useState("A → Z");
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
  // Natural Sources' own favorites — separate id namespace from compounds',
  // mirrors the same pattern exactly.
  const [sourceFavorites, setSourceFavorites] = useState<Set<string>>(new Set());
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

  // Natural Sources' own Benefit/Compound Classes drill-downs and Safety
  // switches — same shape as the Compounds tab's equivalents above, now
  // that there's a real (tagged) dataset to actually filter with. Kept as
  // separate state rather than reusing the Compounds tab's vars: the two
  // tabs' filters are independent (switching tabs shouldn't cross-pollute).
  const [sourceBenefitPath, setSourceBenefitPath] = useState<PathEntry[]>([]);
  const [selectedSourceBenefitTargets, setSelectedSourceBenefitTargets] = useState<FacetSelection>(null);
  const [sourceCompoundClassPath, setSourceCompoundClassPath] = useState<PathEntry[]>([]);
  const [selectedSourceCompoundClasses, setSelectedSourceCompoundClasses] = useState<FacetSelection>(null);
  const [sourceRequiresGras, setSourceRequiresGras] = useState(false);
  const [sourceRequiresNonNovel, setSourceRequiresNonNovel] = useState(false);
  // Biological Targets + Biomarkers stays a static, non-reactive placeholder
  // facet (no real per-source field backs it yet) — its selection is lifted
  // here anyway, not because it filters anything, but so "Reset filters"
  // can still clear it now that the drawer's no longer remounted to reset.
  const [selectedSourceTargets, setSelectedSourceTargets] = useState<FacetSelection>(null);

  const toggleFavorite = (id: string) => {
    setFavorites((current) => toggleSetValue(current, id));
  };

  const toggleSourceFavorite = (id: string) => {
    setSourceFavorites((current) => toggleSetValue(current, id));
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

  const resetSourceFilters = () => {
    setSourceBenefitPath([]);
    setSelectedSourceBenefitTargets(null);
    setSourceCompoundClassPath([]);
    setSelectedSourceCompoundClasses(null);
    setSourceRequiresGras(false);
    setSourceRequiresNonNovel(false);
    setSelectedSourceTargets(null);
  };

  // Static regardless of filters — the product format select's own options
  // aren't part of the reactive-counts scope (no visible count to keep
  // consistent, per Anna: just the four count-bearing facets below).
  const productFormatOptions = useMemo(() => buildProductFormatOptions(compounds), []);

  // Predicted compounds carry no product-format, delivery-tech, formulation,
  // novelty, or GHS hazard data — those controls are disabled in the drawer
  // (see FilterDrawer's disabledForPredicted), and the filters they drive are
  // forced back to their ANY/off default here so a leftover non-default
  // position from a prior evidence-type selection can't zero out results.
  const isPredictedOnly = evidenceType === "predicted";

  // Named per filter "dimension" rather than one big chain, so each of the
  // four reactive facets below can compute "every filter except my own" —
  // standard faceted-search behavior: a facet's counts should reflect what
  // you'd get by applying every *other* active filter, not itself (Anna).
  // `scores` bundles every threshold/switch control together since none of
  // them have their own reactive counts to protect from self-exclusion —
  // they always apply as "other active filters" for the four that do.
  const predicates: Record<string, (compound: Compound) => boolean> = {
    evidenceType: (c) => matchesEvidenceType(c, evidenceType),
    // Navigating the breadcrumb down the tree is itself a filter, not just
    // the deepest level's leaf toggle — see matchesDrilldownScope's own
    // comment in ontologyDrilldown.ts (Anna: drilling into Muscle Health →
    // Prevents Muscle Protein Degradation And Atrophy should narrow the
    // result set to that scope on its own, before any Target is picked).
    benefit: (c) => benefitOntology.matchesDrilldownScope(benefitPath, selectedBenefitTargets, c),
    compoundClass: (c) => compoundClassOntology.matchesDrilldownScope(compoundClassPath, selectedCompoundClasses, c),
    biologicalTargets: (c) => matchesAnySelected(c, selectedTargets, (t) => t.targets),
    scores: (c) =>
      matchesProductFormat(c, isPredictedOnly ? "" : productFormat) &&
      matchesFlag(c.requiresDeliveryTechnology, isPredictedOnly ? false : requiresNoDeliveryTech, "no") &&
      matchesMinScore(
        c,
        "easeOfFormulation",
        isPredictedOnly ? SCORE_RANGES.easeOfFormulation.min : formulationScore
      ) &&
      matchesMinScore(c, "solubility", solubilityScore) &&
      matchesMinScore(c, "fto", isPredictedOnly ? SCORE_RANGES.fto.min : ftoScore) &&
      matchesMinScore(
        c,
        "patentability",
        isPredictedOnly ? SCORE_RANGES.patentability.min : patentabilityScore
      ) &&
      matchesMaxToxicity(c, admetScore) &&
      matchesFlag(c.ghsHazardCode, isPredictedOnly ? false : noGhsHazard, "no") &&
      matchesFlag(c.grasSource, requiresGras, "yes") &&
      matchesFlag(c.nonNovelSource, requiresNonNovel, "yes"),
  };

  type PredicateKey = keyof typeof predicates;
  const predicateKeys = Object.keys(predicates) as PredicateKey[];
  // Filtering ~179 compounds five times per render is trivially fast — not
  // memoized on purpose, so there's no five-way dependency array to keep in
  // sync by hand every time a new filter field is added (a real footgun for
  // no measurable benefit at this data scale).
  const applyExcept = (excludeKey?: PredicateKey) =>
    compounds.filter((c) => predicateKeys.every((key) => key === excludeKey || predicates[key](c)));

  // Sorted by confidence score (descending) regardless of card type, so
  // combo and single cards interleave by how confident the result is
  // instead of grouping by type. Predicted cards carry no confidenceScore
  // at all — treated as lowest so they settle at the end rather than
  // throwing off real-score ordering.
  const filteredCompounds = [...applyExcept()].sort(
    (a, b) => (b.confidenceScore ?? -1) - (a.confidenceScore ?? -1)
  );
  const compoundsForBenefit = applyExcept("benefit");
  const compoundsForCompoundClass = applyExcept("compoundClass");
  const compoundsForBiologicalTargets = applyExcept("biologicalTargets");
  const compoundsForEvidenceType = applyExcept("evidenceType");

  const evidenceTypeCounts = countEvidenceTypes(compoundsForEvidenceType);

  // Same "named predicate + applyExcept" pattern as the Compounds tab above,
  // scoped to Natural Sources' two reactive facets (Benefit, Compound
  // Classes) plus its Safety switches. Biological Targets + Biomarkers
  // stays out of this — it's still a static placeholder facet with no real
  // per-source field backing it, so there's nothing to filter by.
  const sourcePredicates: Record<string, (source: NaturalSource) => boolean> = {
    benefit: (s) => benefitOntology.matchesDrilldownScope(sourceBenefitPath, selectedSourceBenefitTargets, s),
    compoundClass: (s) =>
      compoundClassOntology.matchesDrilldownScope(sourceCompoundClassPath, selectedSourceCompoundClasses, s),
    safety: (s) =>
      matchesFlag(s.grasSource, sourceRequiresGras, "yes") && matchesFlag(s.nonNovelSource, sourceRequiresNonNovel, "yes"),
  };
  type SourcePredicateKey = keyof typeof sourcePredicates;
  const sourcePredicateKeys = Object.keys(sourcePredicates) as SourcePredicateKey[];
  const applySourceExcept = (excludeKey?: SourcePredicateKey) =>
    naturalSources.filter((s) => sourcePredicateKeys.every((key) => key === excludeKey || sourcePredicates[key](s)));

  const filteredSources = applySourceExcept();
  const sourcesForBenefit = applySourceExcept("benefit");
  const sourcesForCompoundClass = applySourceExcept("compoundClass");

  const biologicalTargetGroup = buildFilterGroup(
    compoundsForBiologicalTargets,
    "biological-targets",
    "Biological Targets + Biomarkers",
    (c) => c.targets
  );

  const facets: FilterFacet[] = [
    { group: biologicalTargetGroup, selected: selectedTargets, onToggle: (label) => setSelectedTargets((c) => toggleFacetSelection(c, label)) },
  ];

  const benefitDrilldown: BenefitDrilldown = {
    path: benefitPath,
    onPathChange: setBenefitPath,
    selectedTargets: selectedBenefitTargets,
    onToggleTarget: (label) => setSelectedBenefitTargets((c) => toggleFacetSelection(c, label)),
    onResetTargets: () => setSelectedBenefitTargets(null),
    compounds: compoundsForBenefit,
  };

  const compoundClassDrilldown: CompoundClassDrilldown = {
    path: compoundClassPath,
    onPathChange: setCompoundClassPath,
    selectedClasses: selectedCompoundClasses,
    onToggleClass: (label) => setSelectedCompoundClasses((c) => toggleFacetSelection(c, label)),
    onResetClasses: () => setSelectedCompoundClasses(null),
    compounds: compoundsForCompoundClass,
  };

  const sourceBenefitDrilldown: SourceDrilldown = {
    path: sourceBenefitPath,
    onPathChange: setSourceBenefitPath,
    selected: selectedSourceBenefitTargets,
    onToggle: (label) => setSelectedSourceBenefitTargets((c) => toggleFacetSelection(c, label)),
    onReset: () => setSelectedSourceBenefitTargets(null),
    sources: sourcesForBenefit,
  };

  const sourceCompoundClassDrilldown: SourceDrilldown = {
    path: sourceCompoundClassPath,
    onPathChange: setSourceCompoundClassPath,
    selected: selectedSourceCompoundClasses,
    onToggle: (label) => setSelectedSourceCompoundClasses((c) => toggleFacetSelection(c, label)),
    onReset: () => setSelectedSourceCompoundClasses(null),
    sources: sourcesForCompoundClass,
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

  const resultCount = activeTab === "compounds" ? filteredCompounds.length : filteredSources.length;

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
                sortSuffix="sorted by confidence"
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
              <FilterToolbar
                resultCount={resultCount}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortDropdown={{
                  value: sourceSortOrder,
                  options: ["A → Z", "Relative abundance"],
                  onChange: setSourceSortOrder,
                }}
              />

              {filtersVisible && (
                <NaturalSourcesFilterDrawer
                  benefitDrilldown={sourceBenefitDrilldown}
                  compoundClassDrilldown={sourceCompoundClassDrilldown}
                  selectedTargets={selectedSourceTargets}
                  onToggleTarget={(label) => setSelectedSourceTargets((c) => toggleFacetSelection(c, label))}
                  requiresGras={sourceRequiresGras}
                  onRequiresGrasChange={setSourceRequiresGras}
                  requiresNonNovel={sourceRequiresNonNovel}
                  onRequiresNonNovelChange={setSourceRequiresNonNovel}
                />
              )}

              <FilterToggleBar
                visible={filtersVisible}
                onToggle={() => setFiltersVisible((value) => !value)}
                onReset={resetSourceFilters}
              />

              <NaturalSourceCardGrid
                sources={filteredSources}
                favorites={sourceFavorites}
                onToggleFavorite={toggleSourceFavorite}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
