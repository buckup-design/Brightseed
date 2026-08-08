"use client";

import * as React from "react";
import { ArrowLeft, FlaskConical, Pencil, Scale, ShieldCheck } from "lucide-react";

import { CompoundMultiple, CompoundSingle } from "@/components/ui/badge-icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DescriptionList, type DescriptionRow } from "@/components/ui/description-list";
import { PageHeading } from "@/components/ui/page-heading";
import { ScoreMeter } from "@/components/ui/score-meter";
import { Separator } from "@/components/ui/separator";
import { StatusBadge, type Status } from "@/components/ui/status-badge";
import { Tag } from "@/components/ui/tag";
import {
  Marker,
  NaturalSourceItem,
  Pills,
  Prose,
  ReferenceList,
  Section,
  type Citation,
  type NaturalSource,
} from "@/components/hummingbird/document-parts";
import type { ResultDetailType } from "@/components/hummingbird/result-detail";
import { cn } from "@/lib/utils";

/**
 * ReportDocument — the long-form concept brief ("/report/{uuid}" in the live
 * Hummingbird app), the read-view payoff of the detail sheet's "Generate report".
 *
 * A publication, not a form: a slim sticky utility bar (Back · Continue edit)
 * over a single centred max-w-3xl column of always-open sections — no accordions
 * (that was a symptom of the 512px slide-over rail, not a property of the
 * content). The combination-first live brief breaks Formulation, mechanism,
 * pathways and sources down PER INGREDIENT with a Shared bucket and a
 * Synergistic Action capstone, so the report carries its OWN per-ingredient
 * `ReportDocument` data model — it does NOT route through the flat `ResultDetail`.
 * Only the leaf renderers (Section/Pills/Prose/Marker/NaturalSourceItem/
 * ReferenceList + the promoted ui/ DescriptionList) are shared with the sheet.
 *
 * A leaf app surface: reads --ds-* directly; the ui/ primitives it embeds carry
 * their own --c-*. Renders inside the app-shell inset, which supplies the
 * surface-canvas background and the scroll the sticky bar sticks within. Back,
 * Continue edit and Run Full IP Analysis are the app's to own.
 *
 * Scope: the IP section is the pre-run CTA only. The generated Full IP Analysis
 * appendix (FTO 9-dimension grid + Patentability gauges) is a separate build.
 */

// ─── Types (the report's own per-ingredient model) ───────────────────────────

export type ReportNaturalSource = NaturalSource & {
  family: string;
  tissue: string;
  /** Relative-abundance percentile within the analyzed set, 0–100. */
  abundancePct: number;
};

export type MechanismCard = {
  title: string;
  text: string;
  /** Evidence strength, normalized 0–1. */
  evidenceStrength: number;
};

export type ReportClaim = {
  text: string;
  fdaCompliant?: boolean;
  clinicalStudy?: boolean;
};

export type IngredientBrief = {
  name: string;
  formulation: {
    dosage: string;
    /** Human-equivalent dose — badges the dose when efficacy evidence is animal. */
    hed: boolean;
    delivery: string;
    source: string;
    extraction: string;
  };
  mechanism: MechanismCard;
  pathways: string[];
  sources: { shown: number; total: number; items: ReportNaturalSource[] };
};

export type ReportDocument = {
  id: string;
  /** Human-facing colophon ID, e.g. "RPT-2026-0142" (distinct from the route id). */
  displayId: string;
  type: ResultDetailType;
  /** Must equal the reports-list entry's title. */
  title: string;
  subtitle?: string;
  status: Status;
  /** Human-readable date, e.g. "Jul 20, 2026". */
  created: string;
  /** A still-generating / thin report renders header-only. */
  pending?: boolean;
  ingredients: string[];
  rationale: string;
  ingredientBriefs: IngredientBrief[];
  /** Combo only. */
  synergy?: MechanismCard;
  /** Combo only; sources shared by both ingredients (often legitimately empty). */
  sharedSources?: ReportNaturalSource[];
  ipNote: string;
  claims: ReportClaim[];
  targets: string[];
  biomarkers: string[];
  references: Citation[];
};

// ─── Small local helpers ─────────────────────────────────────────────────────

/** "96th", "91st", "72nd", "63rd" — ordinal suffix for the abundance percentile. */
function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
}

function formulationRows(f: IngredientBrief["formulation"]): DescriptionRow[] {
  return [
    {
      label: "Dosage",
      value: f.hed ? (
        <span className="inline-flex items-center gap-2">
          {f.dosage}
          <Marker
            tone="neutral"
            title="Human-equivalent dose (scaled from animal studies by body-surface-area)"
          >
            HED
            <span className="sr-only"> — human-equivalent dose</span>
          </Marker>
        </span>
      ) : (
        f.dosage
      ),
    },
    { label: "Delivery format", value: f.delivery },
    { label: "Source", value: f.source },
    { label: "Extraction method", value: f.extraction },
  ];
}

/** The 11px uppercase eyebrow, used where a bare <Section> can't (needs a
 *  right-aligned count beside it). */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold tracking-[0.06em] text-[var(--ds-color-text-subtle)] uppercase">
      {children}
    </h3>
  );
}

function MechanismCardView({
  index,
  card,
  synergy = false,
}: {
  index?: number;
  card: MechanismCard;
  synergy?: boolean;
}) {
  return (
    <Card className="gap-3 p-4">
      <div className="flex items-center gap-3">
        {synergy ? (
          <CompoundMultiple
            className="size-6 shrink-0 text-[var(--ds-color-icon-brand)]"
            strokeWidth={1.5}
          />
        ) : (
          // -raised-alt, not -alt: this circle is inside a Card, and surface-alt
          // is a rung BELOW the card in dark — it rendered as a dent.
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--ds-color-surface-raised-alt)] text-[13px] font-semibold text-[var(--ds-color-text-default)]">
            {index}
          </span>
        )}
        <h3 className="min-w-0 flex-1 font-semibold text-[var(--ds-color-text-default)]">
          {card.title}
        </h3>
      </div>
      <Prose>{card.text}</Prose>
      <ScoreMeter
        value={card.evidenceStrength}
        label="Evidence"
        format="score"
        threshold={null}
      />
    </Card>
  );
}

function SourceGroup({
  label,
  shown,
  total,
  sources,
}: {
  label: string;
  shown?: number;
  total?: number;
  sources: ReportNaturalSource[];
}) {
  if (sources.length === 0) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-4">
        <Eyebrow>{label}</Eyebrow>
        {shown != null && total != null && (
          <span className="shrink-0 text-[13px] text-[var(--ds-color-text-subtle)]">
            Showing {shown} of {total}
          </span>
        )}
      </div>
      <ul className="space-y-2.5">
        {sources.map((s) => (
          <li key={s.species}>
            <div className="flex items-baseline gap-2">
              <NaturalSourceItem source={s} />
            </div>
            <div className="mt-0.5 text-[13px] text-[var(--ds-color-text-subtle)]">
              {s.family} · {s.tissue} · {ordinal(s.abundancePct)} pct
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── ReportDocument ──────────────────────────────────────────────────────────

export function ReportDocument({
  doc,
  onBack,
  onContinueEdit,
  onRunIpAnalysis,
}: {
  doc: ReportDocument;
  onBack?: () => void;
  onContinueEdit?: () => void;
  /** Mints the on-demand Full IP Analysis. No-op in the demo (out of scope). */
  onRunIpAnalysis?: () => void;
}) {
  const isCombo = doc.type === "combo";
  const Glyph = isCombo ? CompoundMultiple : CompoundSingle;
  const glyphClass = isCombo
    ? "text-[var(--ds-color-icon-brand)]"
    : "text-[var(--ds-color-icon-data-orange)]";

  const briefs = doc.ingredientBriefs;
  const hasSources =
    (doc.sharedSources?.length ?? 0) > 0 ||
    briefs.some((b) => b.sources.items.length > 0);
  const hasPathways = briefs.some((b) => b.pathways.length > 0);

  return (
    <article className="flex flex-col">
      {/* ── Sticky utility bar (app chrome, not the document) ──────────────── */}
      <div className="sticky top-0 z-10 border-b border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-default)]">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft />
            Reports
          </Button>
          <Button variant="outline" onClick={onContinueEdit}>
            <Pencil />
            Continue edit
          </Button>
        </div>
      </div>

      {/* ── Document column ────────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        {/* Masthead: the glyph + name carry identity, so section 1 needn't shout it. */}
        <header className="flex items-start gap-3">
          <Glyph className={cn("mt-1 size-8 shrink-0", glyphClass)} strokeWidth={1.5} />
          <div className="min-w-0 flex-1">
            <PageHeading as="h1" size="md" title={doc.title} description={doc.subtitle} />
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <StatusBadge status={doc.status} />
              <span className="text-sm text-[var(--ds-color-text-subtle)]">
                Created {doc.created}
              </span>
            </div>
          </div>
        </header>

        {doc.pending ? (
          <div className="mt-10 flex flex-col items-center gap-2 rounded-[var(--ds-shape-radius-md)] border border-dashed border-[var(--ds-color-border-subtle)] py-16 text-center">
            <p className="font-medium text-[var(--ds-color-text-default)]">
              This concept brief is still generating.
            </p>
            <p className="max-w-sm text-sm text-[var(--ds-color-text-subtle)]">
              Hummingbird is assembling the formulation, mechanism, and evidence for
              this report. Check back in a moment.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-10">
            {/* 1 · Recommended Combination */}
            {doc.ingredients.length > 0 && (
              <Section
                as="h2"
                size="heading"
                title={isCombo ? "Recommended Combination" : "Recommendation"}
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {doc.ingredients.map((name) => (
                      <Tag key={name}>{name}</Tag>
                    ))}
                  </div>
                  {doc.rationale && (
                    <div className="max-w-[65ch]">
                      <Prose>{doc.rationale}</Prose>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* 2 · Formulation */}
            {briefs.length > 0 && (
              <Section as="h2" size="heading" title="Formulation">
                <div className="space-y-5">
                  {briefs.map((ing) => (
                    <Section key={ing.name} as="h3" size="eyebrow" title={ing.name}>
                      <DescriptionList rows={formulationRows(ing.formulation)} />
                    </Section>
                  ))}
                </div>
              </Section>
            )}

            {/* 3 · Intellectual Property Assessment (pre-run CTA only) */}
            {doc.ipNote && (
              <Section as="h2" size="heading" title="Intellectual Property Assessment">
                <div className="rounded-[var(--ds-shape-radius-md)] border border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-alt)] p-5">
                  <div className="max-w-[65ch] space-y-4">
                    <Prose>{doc.ipNote}</Prose>
                    <Button onClick={onRunIpAnalysis}>
                      <Scale />
                      Run Full IP Analysis
                    </Button>
                  </div>
                </div>
              </Section>
            )}

            {/* 4 · How it works */}
            {(briefs.some((b) => b.mechanism) || doc.synergy) && (
              <Section as="h2" size="heading" title="How it works">
                <div className="space-y-3">
                  {briefs.map((ing, i) => (
                    <MechanismCardView key={ing.name} index={i + 1} card={ing.mechanism} />
                  ))}
                  {isCombo && doc.synergy && (
                    <MechanismCardView card={doc.synergy} synergy />
                  )}
                </div>
              </Section>
            )}

            {/* 5 · Natural Sources */}
            {hasSources && (
              <Section as="h2" size="heading" title="Natural Sources">
                <div className="space-y-6">
                  {isCombo && doc.sharedSources && doc.sharedSources.length > 0 && (
                    <SourceGroup label="Shared" sources={doc.sharedSources} />
                  )}
                  {briefs.map((ing) => (
                    <SourceGroup
                      key={ing.name}
                      label={ing.name}
                      shown={ing.sources.shown}
                      total={ing.sources.total}
                      sources={ing.sources.items}
                    />
                  ))}
                </div>
              </Section>
            )}

            {/* 6 · Biological Pathways */}
            {hasPathways && (
              <Section as="h2" size="heading" title="Biological Pathways">
                <div className="space-y-5">
                  {briefs.map(
                    (ing) =>
                      ing.pathways.length > 0 && (
                        <Section key={ing.name} as="h3" size="eyebrow" title={ing.name}>
                          <ul className="space-y-1.5">
                            {ing.pathways.map((p) => (
                              <li
                                key={p}
                                className="text-sm leading-snug text-[var(--ds-color-text-default)]"
                              >
                                {p}
                              </li>
                            ))}
                          </ul>
                        </Section>
                      )
                  )}
                </div>
              </Section>
            )}

            {/* 7 · Claims */}
            {doc.claims.length > 0 && (
              <Section as="h2" size="heading" title="Claims">
                <ul className="space-y-2.5">
                  {doc.claims.map((claim) => (
                    <li
                      key={claim.text}
                      className="flex flex-wrap items-center gap-x-3 gap-y-1.5"
                    >
                      <span className="text-sm text-[var(--ds-color-text-default)]">
                        {claim.text}
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5">
                        {claim.fdaCompliant && (
                          <Marker tone="success">
                            <ShieldCheck className="size-3" />
                            FDA-compliant
                          </Marker>
                        )}
                        {claim.clinicalStudy && (
                          <Marker tone="info">
                            <FlaskConical className="size-3" />
                            Clinical Study
                          </Marker>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* 8 · Biological Targets & Biomarkers */}
            {doc.targets.length > 0 && (
              <Section
                as="h2"
                size="heading"
                title={`Biological targets & biomarkers · ${doc.targets.length}`}
              >
                <div className="space-y-4">
                  <Pills items={doc.targets} />
                  {doc.biomarkers.length > 0 && (
                    <div className="space-y-2">
                      <Eyebrow>Clinically measurable biomarkers</Eyebrow>
                      <Pills items={doc.biomarkers} />
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* 9 · References (a publication never collapses its citations) */}
            <Separator />
            <Section as="h2" size="heading" title="References">
              {doc.references.length > 0 ? (
                <ReferenceList references={doc.references} />
              ) : (
                <Prose>Citations pending.</Prose>
              )}
            </Section>

            {/* Colophon */}
            <footer className="border-t border-[var(--ds-color-border-subtle)] pt-6 text-sm text-[var(--ds-color-text-subtle)]">
              <p>Generated by Hummingbird AI on {doc.created}</p>
              <p className="mt-1">
                Report ID <span className="font-mono">{doc.displayId}</span>
              </p>
            </footer>
          </div>
        )}
      </div>
    </article>
  );
}
