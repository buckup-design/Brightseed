"use client";

import * as React from "react";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DescriptionList } from "@/components/ui/description-list";
import { Section, Pills, Prose } from "@/components/hummingbird/document-parts";
import type {
  CombinationRow,
  EvidencedCompound,
  NaturalSourceRow,
  ProjectStrategy,
} from "@/components/hummingbird/project-data";

/**
 * ExperimentStage — the last stage of the spine, DELIBERATELY A STUB.
 *
 * Becky's scope call (Sept 2026): build stages 1–3, stub stage 4 with a real
 * entry point. There is no mock and no spec for the experiment plan, and
 * inventing one here would be the worst outcome — a plausible-looking screen
 * nobody agreed to, which then gets treated as the design.
 *
 * So this stage does the one thing it honestly can: it shows what the previous
 * three stages decided and hands that to whoever specs it next. Everything on
 * screen is carried-forward data, not invented structure, and the open question
 * is stated on the surface rather than hidden in a comment.
 *
 * When it IS specced, the shape almost certainly repeats: a proposed set of
 * experiments, triaged down to a runnable few. The pieces for that already exist
 * (DataTable + useTriage + StageBar), which is why this file is small.
 *
 * hummingbird/ tier: reads global --ds-* directly (see document-parts.tsx).
 */

export function ExperimentStage({
  strategy,
  compounds,
  sources,
  formulations,
  onBack,
  className,
}: {
  strategy?: ProjectStrategy;
  /** Compounds still in consideration when the stage was entered. */
  compounds: EvidencedCompound[];
  sources: NaturalSourceRow[];
  /** The combinations kept as candidate formulations. */
  formulations: CombinationRow[];
  onBack?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex max-w-3xl flex-col gap-6", className)}>
      {onBack ? (
        <div>
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft />
            Back to formulation
          </Button>
        </div>
      ) : null}

      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-[var(--ds-color-text-default)]">
          Experiment plan
        </h2>
        <Prose>
          Everything below was decided in the previous stages. It is the input an
          experiment plan would be built from.
        </Prose>
      </div>

      {/* The honest part: say what is undefined, on the surface, in the place
        * someone will look for it. */}
      <Alert>
        <AlertTitle>This stage is not designed yet</AlertTitle>
        <AlertDescription>
          <span>
            What an experiment plan should contain — model systems, readouts, dose
            ranges, duration, sequencing — has not been specified. Once it is, the
            shape is likely the same as every other stage: a proposed set of
            experiments narrowed to a runnable few.
          </span>
        </AlertDescription>
      </Alert>

      <Section title="Strategy" size="eyebrow">
        {strategy ? (
          <div className="flex flex-col gap-3">
            {/* The approach is a sentence, so it reads as prose. DescriptionList
              * right-aligns its values, which turns a long sentence into a
              * ragged block against the wrong edge. */}
            <Prose>{strategy.approach}</Prose>
            <DescriptionList
              rows={[
                { label: "Chosen strategy", value: strategy.name },
                {
                  label: "Compounds with direct evidence",
                  value: strategy.evidencedCompounds.toLocaleString(),
                },
              ]}
            />
          </div>
        ) : (
          <Prose>No strategy carried forward.</Prose>
        )}
      </Section>

      <Section title="Compounds carried forward" size="eyebrow">
        {compounds.length > 0 ? (
          <Pills items={compounds.map((c) => c.shortName)} />
        ) : (
          <Prose>None — every compound was eliminated.</Prose>
        )}
      </Section>

      <Section title="Sources carried forward" size="eyebrow">
        {sources.length > 0 ? (
          <Pills items={sources.map((s) => s.commonName || s.scientificName)} />
        ) : (
          <Prose>None — every source was eliminated.</Prose>
        )}
      </Section>

      <Section title="Candidate formulations" size="eyebrow">
        {formulations.length > 0 ? (
          <DescriptionList
            rows={formulations.map((f) => ({
              label: f.combinationLabel,
              value: `${f.combinedPredicted.toLocaleString()} additional predicted bioactives`,
            }))}
          />
        ) : (
          <Prose>None chosen yet.</Prose>
        )}
      </Section>
    </div>
  );
}
