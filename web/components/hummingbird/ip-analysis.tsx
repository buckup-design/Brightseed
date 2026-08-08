"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DescriptionList } from "@/components/ui/description-list";
import { ScoreMeter } from "@/components/ui/score-meter";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tag } from "@/components/ui/tag";
import { Eyebrow, Prose } from "@/components/hummingbird/document-parts";

/**
 * ip-analysis — the generated Full IP Analysis appendix that replaces the
 * report's section-3 CTA once "Run full IP analysis" completes (~25s in the
 * live product). Two graded assessments: Freedom-to-Operate (9-dimension
 * framework) and Patentability (§102 / §103 + guidance) — an AI starting point
 * for patent counsel, never legal advice, so the disclaimer leads.
 *
 * A leaf app surface: reads --ds-* directly (document-parts convention); the
 * ui/ primitives it embeds (StatusBadge, ScoreMeter, Alert, Tag,
 * DescriptionList) carry their own --c-*.
 *
 * Data honesty rules carried from the capture:
 * - Grade label AND tone arrive as data — the UI never derives either from a
 *   score or a label string (tier cuts + grade vocabulary are open for Becky;
 *   the Weak→critical mapping lives visibly in the fixture, not here).
 * - §103 non-obviousness has NO score in the capture, so it renders as an
 *   assessment line, never an empty gauge.
 * - Statuses and grades never rely on color alone: the words carry, dots are
 *   decorative, and every score is printed.
 */

// ─── Types (imported by report-document.tsx; one-way, no cycle) ──────────────

export type IpTone = "neutral" | "success" | "warning" | "critical";

/** Grade label + tone travel together as data. */
export type IpGrade = { label: string; tone: IpTone };

/** The tight FTO subset of StatusBadge's status union. */
export type FtoDimensionStatus = "clear" | "restricted" | "blocked";

export type FtoDimension = {
  /** Product vocabulary ("Source", "Synergy", …), rendered as given. */
  name: string;
  status: FtoDimensionStatus;
  /** One-line basis for the status when the product supplies one. */
  note?: string;
  /** Cited publication numbers; empty when clear. */
  patents: string[];
};

export type FtoAssessment = {
  grade: IpGrade;
  /** 0–1, rendered "50/100" via ScoreMeter format="fraction". */
  score: number;
  /** "Moderate" — printed verbatim, never derived from the score. */
  scoreQualifier: string;
  scope: {
    compounds: string;
    targetUse: string;
    formulationType: string;
    jurisdiction: string;
  };
  executiveSummary: string;
  methodology: string;
  /** Exactly 9 in the product's framework. */
  dimensions: FtoDimension[];
};

export type PatentabilityAssessment = {
  grade: IpGrade;
  verdict: { score: number; qualifier: string };
  /** §102. */
  novelty: { score: number; note: string };
  /** §103 — no score in the capture, so none in the model. */
  nonObviousness: { assessment: string; note: string };
  guidance: {
    biggestRisk: string;
    strongestOpportunity: string;
    mostPromisingClaimAngle: string;
    nextStep: string;
  };
};

export type IpAnalysis = {
  /** Human-readable date, e.g. "Jul 20, 2026". */
  generated: string;
  disclaimer: string;
  /** The related-patent corpus, e.g. "US8367121B2". */
  patentsAnalyzed: string[];
  fto: FtoAssessment;
  patentability: PatentabilityAssessment;
};

// ─── GradeBadge ──────────────────────────────────────────────────────────────

/** The headline grade pill beside each assessment's h3. Base step-50 intent
 *  surfaces (not -active: no `-strong` text partners exist outside success);
 *  dark rides the token swap — text goes neutral, signal stays in
 *  surface + border. Uppercase under the DESIGN.md eyebrow exemption. */
const gradeToneClasses: Record<IpTone, string> = {
  neutral:
    "bg-[var(--ds-color-surface-alt)] text-[var(--ds-color-text-subtle)] border-[var(--ds-color-border-subtle)]",
  success:
    "bg-[var(--ds-color-surface-success)] text-[var(--ds-color-text-success)] border-[var(--ds-color-border-success-default)]",
  warning:
    "bg-[var(--ds-color-surface-warning)] text-[var(--ds-color-text-warning)] border-[var(--ds-color-border-warning-default)]",
  critical:
    "bg-[var(--ds-color-surface-critical)] text-[var(--ds-color-text-critical)] border-[var(--ds-color-border-critical-default)]",
};

export function GradeBadge({ grade }: { grade: IpGrade }) {
  return (
    <span
      data-slot="grade-badge"
      className={`inline-flex h-6 items-center rounded-full border px-2.5 text-[11px] font-semibold tracking-[0.06em] uppercase ${gradeToneClasses[grade.tone]}`}
    >
      {grade.label}
    </span>
  );
}

// ─── IpGeneratingNotice ──────────────────────────────────────────────────────

/**
 * The in-flight state that replaces the CTA's content while the ~25s run is
 * out. Deliberately NOT role="status": the host's persistent live region owns
 * every announcement (a status node mounted with its content already present
 * announces unreliably — and on the combos where it does fire, it would
 * double up with the region and the focus move). tabIndex={-1} lets the host
 * move focus here when the clicked button unmounts.
 */
export const IpGeneratingNotice = React.forwardRef<HTMLDivElement>(
  function IpGeneratingNotice(_props, ref) {
    return (
      <div
        ref={ref}
        data-slot="ip-generating"
        tabIndex={-1}
        className="flex items-start gap-3 outline-none"
      >
        <Spinner aria-hidden="true" className="mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="font-medium text-[var(--ds-color-text-default)]">
            Running full IP analysis
          </p>
          <p className="text-[13px] text-[var(--ds-color-text-subtle)]">
            Reviews related patents for composition, ratio and method-of-use
            claims. Takes about 25 seconds.
          </p>
        </div>
      </div>
    );
  }
);

// ─── Internals ───────────────────────────────────────────────────────────────

/** h3 + grade pill. tabIndex={-1} + scroll-mt clear the sticky bar so the
 *  completion focus rule can land here without hiding the heading. */
function SubsectionHeading({
  title,
  grade,
  headingRef,
}: {
  title: string;
  grade: IpGrade;
  headingRef?: React.Ref<HTMLHeadingElement>;
}) {
  return (
    <h3
      ref={headingRef}
      tabIndex={-1}
      className="flex scroll-mt-20 flex-wrap items-center gap-2.5 text-base font-semibold text-[var(--ds-color-text-default)] outline-none"
    >
      {title}
      <GradeBadge grade={grade} />
    </h3>
  );
}

/** The printed qualifier under a gauge — verbatim product language, the one
 *  place a score's word lives (never derived). */
function ScoreCaption({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 text-[13px] text-[var(--ds-color-text-subtle)]">
      {children}
    </p>
  );
}

function PatentChips({ patents }: { patents: string[] }) {
  if (patents.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {patents.map((p) => (
        <Tag key={p} className="font-mono">
          {p}
        </Tag>
      ))}
    </div>
  );
}

/** Severity rank for the renderer's sort. */
const SEVERITY: Record<FtoDimensionStatus, number> = {
  blocked: 0,
  restricted: 1,
  clear: 2,
};

function FtoDimensionGrid({ dimensions }: { dimensions: FtoDimension[] }) {
  // Severity-first for counsel: blocked → restricted → clear, stable within
  // groups. Deliberately inverts the product's clear-first listing.
  const sorted = [...dimensions].sort(
    (a, b) => SEVERITY[a.status] - SEVERITY[b.status]
  );
  const count = (s: FtoDimensionStatus) =>
    dimensions.filter((d) => d.status === s).length;

  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-4">
        <Eyebrow as="h4">9-dimension framework</Eyebrow>
        <span className="shrink-0 text-[13px] text-[var(--ds-color-text-subtle)]">
          {count("blocked")} blocked · {count("restricted")} restricted ·{" "}
          {count("clear")} clear
        </span>
      </div>
      <ul>
        {sorted.map((d) => (
          <li
            key={d.name}
            data-slot="ip-dimension"
            className="border-b border-[var(--ds-color-border-subtle)] py-3 last:border-0"
          >
            <div className="flex items-center justify-between gap-3 sm:grid sm:grid-cols-[7.5rem_7.5rem_1fr] sm:items-baseline sm:gap-x-4">
              <span className="text-sm font-medium text-[var(--ds-color-text-default)]">
                {d.name}
              </span>
              <span>
                <StatusBadge status={d.status} />
              </span>
              {d.note && (
                <span className="hidden text-sm text-[var(--ds-color-text-subtle)] sm:block">
                  {d.note}
                </span>
              )}
            </div>
            {/* <sm: note drops below the name/badge row. */}
            {d.note && (
              <p className="mt-1.5 text-sm text-[var(--ds-color-text-subtle)] sm:hidden">
                {d.note}
              </p>
            )}
            {d.patents.length > 0 && (
              <div className="mt-1.5 sm:pl-[calc(7.5rem+7.5rem+2rem)]">
                <PatentChips patents={d.patents} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function GuidancePanel({
  guidance,
}: {
  guidance: PatentabilityAssessment["guidance"];
}) {
  const items: [string, string][] = [
    ["Biggest risk", guidance.biggestRisk],
    ["Strongest opportunity", guidance.strongestOpportunity],
    ["Most promising claim angle", guidance.mostPromisingClaimAngle],
    ["Next step", guidance.nextStep],
  ];
  return (
    // The deliberate bookend to the pre-run CTA box: same chrome, now holding
    // the answer instead of the question.
    <div className="rounded-[var(--ds-shape-radius-md)] border border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-alt)] p-5">
      <div className="space-y-4">
        <Eyebrow as="h4">Guidance</Eyebrow>
        {/* A <dl>, not four sibling h4s: the items are label→value pairs under
            the one "Guidance" heading, and the outline should say so. The <dt>
            wears the eyebrow's classes without its heading semantics. */}
        <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          {items.map(([label, text]) => (
            <div key={label} className="space-y-1.5">
              <dt className="text-[11px] font-semibold tracking-[0.06em] text-[var(--ds-color-text-subtle)] uppercase">
                {label}
              </dt>
              <dd>
                <Prose>{text}</Prose>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

// ─── IpAppendix ──────────────────────────────────────────────────────────────

export function IpAppendix({
  analysis,
  ftoHeadingRef,
}: {
  analysis: IpAnalysis;
  /** The completion focus target (report-document's generating→ready rule). */
  ftoHeadingRef?: React.Ref<HTMLHeadingElement>;
}) {
  const { fto, patentability } = analysis;
  return (
    <div data-slot="ip-appendix" className="space-y-8">
      {/* The framing precedes every grade. role="note", not alert: the host's
          live region already announces completion — an assertive alert here
          would double-fire. */}
      <Alert variant="info" role="note">
        <Info />
        <AlertTitle>An AI starting point, not legal advice</AlertTitle>
        <AlertDescription>{analysis.disclaimer}</AlertDescription>
      </Alert>

      <div className="space-y-3">
        <p className="text-[13px] text-[var(--ds-color-text-subtle)]">
          Generated {analysis.generated} · {analysis.patentsAnalyzed.length}{" "}
          related patents analyzed
        </p>
        <div className="space-y-2">
          {/* h3, not h4: this sits directly under the section h2 as a sibling
              of the two assessment h3s — an h4 here would skip a level. */}
          <Eyebrow>Patents analyzed</Eyebrow>
          <PatentChips patents={analysis.patentsAnalyzed} />
        </div>
      </div>

      {/* ── Freedom to operate ── */}
      <section className="space-y-5">
        <SubsectionHeading
          title="Freedom to operate"
          grade={fto.grade}
          headingRef={ftoHeadingRef}
        />
        <div>
          <ScoreMeter
            size="lg"
            format="fraction"
            value={fto.score}
            label="FTO score"
            threshold={null}
          />
          <ScoreCaption>{fto.scoreQualifier}</ScoreCaption>
        </div>
        <DescriptionList
          rows={[
            { label: "Compounds", value: fto.scope.compounds },
            { label: "Target use", value: fto.scope.targetUse },
            { label: "Formulation type", value: fto.scope.formulationType },
            { label: "Jurisdiction", value: fto.scope.jurisdiction },
          ]}
        />
        <div className="max-w-[65ch] space-y-2">
          <Eyebrow as="h4">Executive summary</Eyebrow>
          <Prose>{fto.executiveSummary}</Prose>
        </div>
        <FtoDimensionGrid dimensions={fto.dimensions} />
        <div className="max-w-[65ch] space-y-2">
          <Eyebrow as="h4">Methodology</Eyebrow>
          {/* Reference material — the quietest text on the page. */}
          <p className="text-sm leading-relaxed text-[var(--ds-color-text-subtle)]">
            {fto.methodology}
          </p>
        </div>
      </section>

      <Separator />

      {/* ── Patentability ── */}
      <section className="space-y-5">
        <SubsectionHeading title="Patentability" grade={patentability.grade} />
        <div>
          <ScoreMeter
            size="lg"
            format="fraction"
            value={patentability.verdict.score}
            label="Verdict"
            threshold={null}
          />
          <ScoreCaption>{patentability.verdict.qualifier}</ScoreCaption>
        </div>
        <div>
          <ScoreMeter
            format="fraction"
            value={patentability.novelty.score}
            label="§102 novelty"
            threshold={null}
          />
          <ScoreCaption>{patentability.novelty.note}</ScoreCaption>
        </div>
        <div className="max-w-[65ch] space-y-1.5">
          <Eyebrow as="h4">§103 non-obviousness</Eyebrow>
          {/* No score in the capture → no gauge, ever. */}
          <p className="text-sm font-medium text-[var(--ds-color-text-default)]">
            {patentability.nonObviousness.assessment}
          </p>
          <Prose>{patentability.nonObviousness.note}</Prose>
        </div>
        <GuidancePanel guidance={patentability.guidance} />
      </section>
    </div>
  );
}
