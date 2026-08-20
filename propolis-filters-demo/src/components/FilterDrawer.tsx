import OntologyDrilldownCard from "./OntologyDrilldownCard";
import FilterCard from "./FilterCard";
import ScoreFilterCard from "./ScoreFilterCard";
import Slider from "./Slider";
import Switch from "./Switch";
import type { Compound, FilterGroup } from "../types";
import type { FacetSelection } from "../lib/facets";
import type { PathEntry } from "../lib/ontologyDrilldown";
import * as benefitOntology from "../lib/benefitOntology";
import * as compoundClassOntology from "../lib/compoundClassOntology";
import {
  FEASIBILITY_LABELS,
  SCORE_RANGES,
  scoreLabelFormatter,
  SOLUBILITY_LABELS,
  THREE_POINT_LABELS,
  TOXICITY_LABELS,
} from "../lib/scoreFilters";

export interface FilterFacet {
  group: FilterGroup;
  selected: FacetSelection;
  onToggle: (label: string) => void;
}

export interface BenefitDrilldown {
  path: PathEntry[];
  onPathChange: (path: PathEntry[]) => void;
  selectedTargets: FacetSelection;
  onToggleTarget: (label: string) => void;
  onResetTargets: () => void;
  /** Compounds matching every *other* currently-active filter — drives this card's live chip counts. */
  compounds: Compound[];
}

export interface CompoundClassDrilldown {
  path: PathEntry[];
  onPathChange: (path: PathEntry[]) => void;
  selectedClasses: FacetSelection;
  onToggleClass: (label: string) => void;
  onResetClasses: () => void;
  /** Compounds matching every *other* currently-active filter — drives this card's live chip counts. */
  compounds: Compound[];
}

const BENEFIT_LEVEL_LABELS = ["All Health Areas", "Benefits", "Sub-benefits", "Targets"];
const COMPOUND_CLASS_LEVEL_LABELS = ["All Pathways", "Superclasses", "Classes"];

export interface ScorePanel {
  productFormatOptions: string[];
  productFormat: string;
  onProductFormatChange: (value: string) => void;
  requiresNoDeliveryTech: boolean;
  onRequiresNoDeliveryTechChange: (value: boolean) => void;
  formulationScore: number;
  onFormulationScoreChange: (value: number) => void;
  solubilityScore: number;
  onSolubilityScoreChange: (value: number) => void;
  ftoScore: number;
  onFtoScoreChange: (value: number) => void;
  patentabilityScore: number;
  onPatentabilityScoreChange: (value: number) => void;
  admetScore: number;
  onAdmetScoreChange: (value: number) => void;
  noGhsHazard: boolean;
  onNoGhsHazardChange: (value: boolean) => void;
  requiresGras: boolean;
  onRequiresGrasChange: (value: boolean) => void;
  requiresNonNovel: boolean;
  onRequiresNonNovelChange: (value: boolean) => void;
}

interface FilterDrawerProps {
  benefitDrilldown: BenefitDrilldown;
  compoundClassDrilldown: CompoundClassDrilldown;
  facets: FilterFacet[];
  scorePanel: ScorePanel;
  /**
   * True when Evidence Type is filtered to "Predicted" — predicted compounds
   * carry no product-format, delivery-tech, formulation, novelty, or GHS
   * hazard data, so those controls are inapplicable and disabled rather than
   * silently ignored. Solubility, toxicity, GRAS, and non-novel-food stay
   * live since predicted compounds do carry that data.
   */
  disabledForPredicted?: boolean;
}

export default function FilterDrawer({
  benefitDrilldown,
  compoundClassDrilldown,
  facets,
  scorePanel,
  disabledForPredicted,
}: FilterDrawerProps) {
  const predictedTitle = disabledForPredicted
    ? "Not applicable — predicted compounds don't carry this data"
    : undefined;
  return (
    <div className="flex flex-col gap-3 bg-white px-4 py-3">
      <div className="grid grid-cols-3 gap-x-6 gap-y-2">
        <OntologyDrilldownCard
          id="benefit-drilldown"
          levelLabels={BENEFIT_LEVEL_LABELS}
          getChildOptions={(parentId) => benefitOntology.getDynamicChildOptions(parentId, benefitDrilldown.compounds)}
          findChildId={benefitOntology.findChildId}
          path={benefitDrilldown.path}
          onPathChange={benefitDrilldown.onPathChange}
          selectedLeaves={benefitDrilldown.selectedTargets}
          onToggleLeaf={benefitDrilldown.onToggleTarget}
          onResetLeaves={benefitDrilldown.onResetTargets}
        />
        <OntologyDrilldownCard
          id="compound-class-drilldown"
          levelLabels={COMPOUND_CLASS_LEVEL_LABELS}
          getChildOptions={(parentId) =>
            compoundClassOntology.getDynamicChildOptions(parentId, compoundClassDrilldown.compounds)
          }
          findChildId={compoundClassOntology.findChildId}
          path={compoundClassDrilldown.path}
          onPathChange={compoundClassDrilldown.onPathChange}
          selectedLeaves={compoundClassDrilldown.selectedClasses}
          onToggleLeaf={compoundClassDrilldown.onToggleClass}
          onResetLeaves={compoundClassDrilldown.onResetClasses}
        />
        {facets.map((facet) => (
          <FilterCard
            key={facet.group.id}
            group={facet.group}
            selected={facet.selected}
            onToggle={facet.onToggle}
          />
        ))}
      </div>

      <hr className="border-border" />
      <div className="grid grid-cols-3 gap-x-6 gap-y-2">
        <ScoreFilterCard title="Feasibility">
          <div className={`flex flex-col gap-2 ${disabledForPredicted ? "opacity-50" : ""}`} title={predictedTitle}>
            <p className="text-sm font-medium text-foreground">Product format</p>
            <select
              value={scorePanel.productFormat}
              onChange={(event) => scorePanel.onProductFormatChange(event.target.value)}
              disabled={disabledForPredicted}
              className="h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 disabled:cursor-not-allowed"
            >
              <option value="">Any</option>
              {scorePanel.productFormatOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div title={predictedTitle}>
            <Switch
              label="Does not require delivery technology"
              checked={scorePanel.requiresNoDeliveryTech}
              onChange={scorePanel.onRequiresNoDeliveryTechChange}
              disabled={disabledForPredicted}
            />
          </div>

          <div title={predictedTitle}>
            <Slider
              label="Acceptable formulation score"
              min={SCORE_RANGES.easeOfFormulation.min}
              max={SCORE_RANGES.easeOfFormulation.max}
              value={scorePanel.formulationScore}
              onChange={scorePanel.onFormulationScoreChange}
              formatValue={scoreLabelFormatter(FEASIBILITY_LABELS)}
              disabled={disabledForPredicted}
            />
          </div>

          <Slider
            label="Minimum solubility score"
            min={SCORE_RANGES.solubility.min}
            max={SCORE_RANGES.solubility.max}
            value={scorePanel.solubilityScore}
            onChange={scorePanel.onSolubilityScoreChange}
            formatValue={scoreLabelFormatter(SOLUBILITY_LABELS)}
          />
        </ScoreFilterCard>

        <ScoreFilterCard title="Novelty">
          <div className="flex flex-col gap-3" title={predictedTitle}>
            <Slider
              label="Minimum FTO score"
              min={SCORE_RANGES.fto.min}
              max={SCORE_RANGES.fto.max}
              value={scorePanel.ftoScore}
              onChange={scorePanel.onFtoScoreChange}
              formatValue={scoreLabelFormatter(THREE_POINT_LABELS)}
              disabled={disabledForPredicted}
            />

            <Slider
              label="Minimum patentability score"
              min={SCORE_RANGES.patentability.min}
              max={SCORE_RANGES.patentability.max}
              value={scorePanel.patentabilityScore}
              onChange={scorePanel.onPatentabilityScoreChange}
              formatValue={scoreLabelFormatter(THREE_POINT_LABELS)}
              disabled={disabledForPredicted}
            />
          </div>
        </ScoreFilterCard>

        <ScoreFilterCard title="Safety">
          <Slider
            label="Acceptable toxicity score"
            min={SCORE_RANGES.admet.min}
            max={SCORE_RANGES.admet.max}
            value={scorePanel.admetScore}
            onChange={scorePanel.onAdmetScoreChange}
            formatValue={scoreLabelFormatter(TOXICITY_LABELS)}
          />

          <div title={predictedTitle}>
            <Switch
              label="No GHS hazard code"
              checked={scorePanel.noGhsHazard}
              onChange={scorePanel.onNoGhsHazardChange}
              disabled={disabledForPredicted}
            />
          </div>

          <Switch
            label="(US) available in a GRAS source"
            checked={scorePanel.requiresGras}
            onChange={scorePanel.onRequiresGrasChange}
          />

          <Switch
            label="(EU) available in non-novel food"
            checked={scorePanel.requiresNonNovel}
            onChange={scorePanel.onRequiresNonNovelChange}
          />
        </ScoreFilterCard>
      </div>
    </div>
  );
}
