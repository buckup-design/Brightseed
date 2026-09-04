"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ResultTableCard } from "@/components/hummingbird/tables/result-table-card";
import { StageBar } from "@/components/hummingbird/project/stage-bar";
import {
  combinationColumns,
  compoundEvidenceColumns,
  naturalSourceColumns,
  predictedCompoundColumns,
  sourceMeterMax,
} from "@/components/hummingbird/tables/columns";
import { useTriage } from "@/hooks/use-triage";
import { partition, type TriageState, type TriageVerdict } from "@/lib/triage";
import type {
  CombinationRow,
  EvidencedCompound,
  MatrixCompound,
  NaturalSourceRow,
  PredictedCompound,
} from "@/components/hummingbird/project-data";

/**
 * FormulationStage — turning a chosen strategy into a formulation plan.
 *
 * A formulation plan is compounds + sources + mixture, so those are the tabs.
 * The two triaged sets are independent — a compound and a source are different
 * decisions — which is why each owns its own triage rather than sharing one.
 *
 * THE COUPLING IS THE POINT. The natural-sources matrix generates its columns
 * from the compounds still in consideration, so eliminating a compound removes
 * its column from the matrix and drops the affected sources' Direct counts. That
 * is the previous decision made visible, and it is the reason the table engine
 * takes a column ARRAY rather than JSX children.
 *
 * Presence is keyed by compound id, never by position: the surviving set is both
 * smaller than and ordered differently from the row's own fields, so an index
 * would shift every check mark sideways with no error.
 *
 * hummingbird/ tier: reads global --ds-* directly (see document-parts.tsx).
 */

/**
 * The model's own starting split, as a predicate.
 *
 * Exported so the stage and anything reading its survivors share ONE definition
 * of the rule — stating it twice is how the screen and the hand-off drift into
 * disagreeing about what the user decided.
 */
export function preEliminated<T extends { id: string }>(eliminated: T[]) {
  const ids = new Set(eliminated.map((r) => r.id));
  return (row: T): TriageVerdict | undefined =>
    ids.has(row.id) ? "eliminated" : undefined;
}

/** What survived each of the three sets, given the lifted triage state. */
export function formulationSurvivors(
  data: FormulationData,
  states: {
    compounds?: TriageState;
    sources?: TriageState;
    mixture?: TriageState;
  },
) {
  const allCompounds = [...data.compounds.candidates, ...data.compounds.eliminated];
  const allSources = [...data.sources.candidates, ...data.sources.eliminated];
  return {
    compounds: partition(
      allCompounds,
      (r) => r.id,
      states.compounds ?? {},
      preEliminated(data.compounds.eliminated),
    ).inConsideration,
    sources: partition(
      allSources,
      (r) => r.id,
      states.sources ?? {},
      preEliminated(data.sources.eliminated),
    ).inConsideration,
    formulations: partition(data.combinations, (r) => r.id, states.mixture ?? {})
      .inConsideration,
  };
}

export type FormulationData = {
  compounds: { candidates: EvidencedCompound[]; eliminated: EvidencedCompound[] };
  predicted: PredictedCompound[];
  sources: { candidates: NaturalSourceRow[]; eliminated: NaturalSourceRow[] };
  combinations: CombinationRow[];
  referencesLabel?: React.ReactNode;
};

export function FormulationStage({
  data,
  compoundState,
  onCompoundStateChange,
  sourceState,
  onSourceStateChange,
  mixtureState,
  onMixtureStateChange,
  onBuildExperiment,
  className,
}: {
  data: FormulationData;
  /** Lift these when the stage can be navigated away from and back. */
  compoundState?: TriageState;
  onCompoundStateChange?: (next: TriageState) => void;
  sourceState?: TriageState;
  onSourceStateChange?: (next: TriageState) => void;
  mixtureState?: TriageState;
  onMixtureStateChange?: (next: TriageState) => void;
  /**
   * Called with the combinations kept as candidate formulations.
   *
   * ASSUMPTION worth confirming with Becky: a "formulation" is a combination
   * row. The brief says the stage ends when "a formulation or two have been
   * identified", and the combinations table is the only place a formulation is
   * named, so narrowing it is treated as making that choice.
   */
  onBuildExperiment?: (formulations: CombinationRow[]) => void;
  className?: string;
}) {
  const allCompounds = React.useMemo(
    () => [...data.compounds.candidates, ...data.compounds.eliminated],
    [data.compounds],
  );
  const compounds = useTriage(allCompounds, (r) => r.id, {
    initial: preEliminated(data.compounds.eliminated),
    state: compoundState,
    onStateChange: onCompoundStateChange,
  });

  const allSources = React.useMemo(
    () => [...data.sources.candidates, ...data.sources.eliminated],
    [data.sources],
  );
  const sources = useTriage(allSources, (r) => r.id, {
    initial: preEliminated(data.sources.eliminated),
    state: sourceState,
    onStateChange: onSourceStateChange,
  });

  const mixture = useTriage(data.combinations, (r) => r.id, {
    state: mixtureState,
    onStateChange: onMixtureStateChange,
  });

  /* The hand-off: the matrix's columns ARE the compounds still in play. */
  const matrixCompounds: MatrixCompound[] = compounds.partition.inConsideration.map(
    (c) => ({ id: c.id, label: c.shortName }),
  );
  const meterMax = sourceMeterMax(allSources);

  return (
    <Tabs defaultValue="compounds" className={className}>
      <TabsList variant="line" className="shrink-0">
        <TabsTrigger value="compounds">Compounds</TabsTrigger>
        <TabsTrigger value="sources">Natural sources</TabsTrigger>
        <TabsTrigger value="mixture">Mixture</TabsTrigger>
      </TabsList>

      {/* ── Compounds ─────────────────────────────────────────────────────── */}
      <TabsContent value="compounds" className="mt-4 flex flex-col gap-6">
        <StageBar counts={compounds.counts} noun="compound" />

        <ResultTableCard
          title="Compounds with direct evidence"
          references={data.referencesLabel}
        >
          <DataTable
            ariaLabel="Compounds with direct evidence"
            columns={compoundEvidenceColumns()}
            getRowId={(row: EvidencedCompound) => row.id}
            groups={[
              {
                id: "candidates",
                label: "Candidates",
                showCount: true,
                rows: compounds.partition.inConsideration,
                emptyLabel: "Every compound has been eliminated.",
                action: {
                  icon: X,
                  label: (row) => `Eliminate ${row.compoundName}`,
                  onAction: compounds.eliminate,
                  announce: (row) => `${row.compoundName} moved to Eliminated`,
                },
              },
              {
                id: "eliminated",
                label: "Eliminated",
                showCount: true,
                tone: "muted",
                rows: compounds.partition.eliminated,
                emptyLabel: "Nothing eliminated yet.",
                action: {
                  icon: Plus,
                  label: (row) => `Restore ${row.compoundName}`,
                  onAction: compounds.restore,
                  announce: (row) => `${row.compoundName} moved back to Candidates`,
                },
              },
            ]}
          />
        </ResultTableCard>

        <ResultTableCard
          title="Top predicted compounds"
          description="No direct evidence — model predictions, ranked by fingerprint score."
          footnote="* Bioavailability estimated from a single model run."
        >
          <DataTable
            ariaLabel="Top predicted compounds"
            columns={predictedCompoundColumns()}
            getRowId={(row) => row.id}
            rows={data.predicted}
            empty="No predicted compounds for this strategy."
          />
        </ResultTableCard>
      </TabsContent>

      {/* ── Natural sources ───────────────────────────────────────────────── */}
      <TabsContent value="sources" className="mt-4 flex flex-col gap-6">
        <StageBar counts={sources.counts} noun="source" />

        {matrixCompounds.length === 0 ? (
          /* Every column came from the compounds tab, so with none left the
           * matrix has nothing to say — and a bare source list would imply it
           * still does. */
          <Alert>
            <AlertDescription>
              Every compound has been eliminated, so there are no columns to match
              sources against. Restore a compound to rebuild this matrix.
            </AlertDescription>
          </Alert>
        ) : (
          <ResultTableCard
            eyebrow="Natural sources"
            description={`Matched against the ${matrixCompounds.length} compound${matrixCompounds.length === 1 ? "" : "s"} still in consideration.`}
            footnote="† GRAS status pending review."
          >
            <DataTable
              ariaLabel="Natural sources"
              columns={naturalSourceColumns(matrixCompounds, meterMax)}
              getRowId={(row) => row.id}
              groups={[
                {
                  id: "candidates",
                  label: "Candidates",
                  showCount: true,
                  rows: sources.partition.inConsideration,
                  emptyLabel: "Every source has been eliminated.",
                  action: {
                    icon: X,
                    label: (row) => `Eliminate ${row.scientificName}`,
                    onAction: sources.eliminate,
                    announce: (row) => `${row.scientificName} moved to Eliminated`,
                  },
                },
                {
                  id: "eliminated",
                  label: "Eliminated",
                  showCount: true,
                  tone: "muted",
                  rows: sources.partition.eliminated,
                  emptyLabel: "Nothing eliminated yet.",
                  action: {
                    icon: Plus,
                    label: (row) => `Restore ${row.scientificName}`,
                    onAction: sources.restore,
                    announce: (row) => `${row.scientificName} moved back to Candidates`,
                  },
                },
              ]}
            />
          </ResultTableCard>
        )}
      </TabsContent>

      {/* ── Mixture ───────────────────────────────────────────────────────── */}
      <TabsContent value="mixture" className="mt-4 flex flex-col gap-6">
        <StageBar
          counts={mixture.counts}
          noun="combination"
          converged={mixture.converged}
          advanceLabel="Build experiment plan"
          onAdvance={() => onBuildExperiment?.(mixture.partition.inConsideration)}
          advanceHint={
            mixture.counts.inConsideration === 0
              ? "Restore at least one combination to carry forward."
              : `Eliminate ${mixture.counts.inConsideration - 2} more to narrow this to one or two formulations.`
          }
        />

        <ResultTableCard
          eyebrow={`Best combinations — include all ${matrixCompounds.length} selected compound${matrixCompounds.length === 1 ? "" : "s"}`}
          description="Pairs of sources that together carry the most additional predicted bioactives. Narrowing these is choosing the formulation to take forward."
        >
          <DataTable
            ariaLabel="Best combinations"
            columns={combinationColumns()}
            getRowId={(row) => row.id}
            groups={[
              {
                id: "candidates",
                label: "Candidate formulations",
                showCount: true,
                rows: mixture.partition.inConsideration,
                emptyLabel: "Every combination has been ruled out.",
                action: {
                  icon: X,
                  label: (row) => `Rule out ${row.combinationLabel}`,
                  onAction: mixture.eliminate,
                  announce: (row) => `${row.combinationLabel} ruled out`,
                },
              },
              {
                id: "eliminated",
                label: "Ruled out",
                showCount: true,
                tone: "muted",
                rows: mixture.partition.eliminated,
                emptyLabel: "Nothing ruled out yet.",
                action: {
                  icon: Plus,
                  label: (row) => `Restore ${row.combinationLabel}`,
                  onAction: mixture.restore,
                  announce: (row) => `${row.combinationLabel} restored`,
                },
              },
            ]}
          />
        </ResultTableCard>
      </TabsContent>
    </Tabs>
  );
}
