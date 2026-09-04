"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";

import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DescriptionList } from "@/components/ui/description-list";
import { Section, Prose } from "@/components/hummingbird/document-parts";
import { ResultTableCard } from "@/components/hummingbird/tables/result-table-card";
import { StageBar } from "@/components/hummingbird/project/stage-bar";
import { useTriage } from "@/hooks/use-triage";
import type { TriageState } from "@/lib/triage";
import type { ProjectStrategy } from "@/components/hummingbird/project-data";

/**
 * StrategiesStage — narrowing a project's strategies down to the one or two
 * worth pursuing.
 *
 * The first stage of the spine, and the one the whole project hinges on. A
 * TABLE, not a card grid: cards were the thing this direction replaces, and a
 * decision between five competing options is made by comparing them column by
 * column, which is exactly what a card board prevents.
 *
 * Strategies are judged here on evidence VOLUME — how many compounds carry
 * direct published evidence against how many the model merely predicts. The
 * predicted count is a meter so the five are comparable at a glance; the
 * evidenced count stays a plain number because seven versus nine papers is a
 * difference you read, not one you eyeball.
 *
 * Triage state is owned HERE and passed down. Nothing below keeps its own copy.
 *
 * hummingbird/ tier: reads global --ds-* directly (see document-parts.tsx).
 */

function strategyColumns(
  meterMax: number,
  onOpen: (row: ProjectStrategy) => void,
): ColumnDef<ProjectStrategy>[] {
  return [
    {
      id: "strategy",
      header: "Strategy",
      width: "34%",
      cell: (row) => ({
        kind: "entity",
        primary: row.name,
        secondary: row.approach,
      }),
    },
    {
      id: "evidenced",
      header: "Evidenced compounds",
      align: "end",
      width: "16%",
      cell: (row) => ({ kind: "number", value: row.evidencedCompounds }),
    },
    {
      id: "predicted",
      header: "Predicted compounds",
      width: "24%",
      cell: (row) => ({
        kind: "meter",
        value: row.predictedCompounds,
        max: meterMax,
      }),
    },
    {
      id: "references",
      header: "References",
      width: "18%",
      cell: (row) => ({
        kind: "link",
        label: row.referencesLabel,
        onClick: () => onOpen(row),
      }),
    },
  ];
}

export function StrategiesStage({
  strategies,
  state,
  onStateChange,
  onExplore,
  className,
}: {
  strategies: ProjectStrategy[];
  /**
   * Lift the triage state when this stage can be navigated away from and back —
   * it unmounts on drill-in, and uncontrolled state would take the user's
   * decisions with it.
   */
  state?: TriageState;
  onStateChange?: (next: TriageState) => void;
  /**
   * Called with the strategies still IN CONSIDERATION when the stage advances —
   * not with `kept`. Elimination is the only mechanic, so a survivor is normally
   * undecided rather than explicitly kept, and `kept` would hand the next stage
   * an empty set.
   */
  onExplore?: (survivors: ProjectStrategy[]) => void;
  className?: string;
}) {
  const triage = useTriage(strategies, (row) => row.id, { state, onStateChange });
  const [detail, setDetail] = React.useState<ProjectStrategy | null>(null);

  const meterMax = Math.max(1, ...strategies.map((s) => s.predictedCompounds));
  const columns = strategyColumns(meterMax, setDetail);

  return (
    <div className={className}>
      <StageBar
        counts={triage.counts}
        noun="strategy"
        pluralNoun="strategies"
        converged={triage.converged}
        advanceLabel="Explore formulations"
        onAdvance={() => onExplore?.(triage.partition.inConsideration)}
        advanceHint={
          /* Say what is actually missing, not just "unavailable" — the two
           * reasons need opposite actions. */
          triage.counts.inConsideration === 0
            ? "Restore at least one strategy to carry forward."
            : `Eliminate ${triage.counts.inConsideration - 2} more to narrow this to one or two strategies.`
        }
        className="mb-4"
      />

      <ResultTableCard title="Strategies for this goal">
        {/* An empty SET is not a triaged set: showing "In consideration 0 /
          * Eliminated 0" with "every strategy has been eliminated" would be a
          * lie about work nobody did. Ungrouped + `empty` says the true thing. */}
        {strategies.length === 0 ? (
          <DataTable
            ariaLabel="Strategies for this goal"
            columns={columns}
            getRowId={(row) => row.id}
            rows={[]}
            empty="No strategies for this goal yet."
          />
        ) : (
        <DataTable
          ariaLabel="Strategies for this goal"
          columns={columns}
          getRowId={(row) => row.id}
          groups={[
            {
              id: "in-consideration",
              label: "In consideration",
              showCount: true,
              rows: triage.partition.inConsideration,
              emptyLabel: "Every strategy has been eliminated.",
              action: {
                icon: X,
                label: (row) => `Eliminate ${row.name}`,
                onAction: triage.eliminate,
                announce: (row) => `${row.name} moved to Eliminated`,
              },
            },
            {
              id: "eliminated",
              label: "Eliminated",
              showCount: true,
              tone: "muted",
              rows: triage.partition.eliminated,
              emptyLabel: "Nothing eliminated yet.",
              action: {
                icon: Plus,
                label: (row) => `Restore ${row.name}`,
                onAction: triage.restore,
                announce: (row) => `${row.name} moved back to In consideration`,
              },
            },
          ]}
        />
        )}
      </ResultTableCard>

      <Sheet open={detail !== null} onOpenChange={(open) => !open && setDetail(null)}>
        <SheetContent side="right" className="overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{detail?.name}</SheetTitle>
            <SheetDescription>{detail?.approach}</SheetDescription>
          </SheetHeader>
          {detail ? (
            <div className="flex flex-col gap-6 px-4 pb-6">
              <Section title="Evidence" size="eyebrow">
                <DescriptionList
                  rows={[
                    {
                      label: "Compounds with direct evidence",
                      value: detail.evidencedCompounds.toLocaleString(),
                    },
                    {
                      label: "Predicted compounds",
                      value: detail.predictedCompounds.toLocaleString(),
                    },
                    { label: "Total", value: detail.totalCompounds.toLocaleString() },
                  ]}
                />
              </Section>
              <Section title="How to read this" size="eyebrow">
                <Prose>
                  A large predicted count widens the search but does not
                  strengthen the case. Weigh it against the compounds carrying
                  direct published evidence.
                </Prose>
              </Section>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
