"use client";

import * as React from "react";
import { FileText } from "lucide-react";

import { CompoundMultiple, CompoundSingle } from "@/components/ui/badge-icons";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { ScoreMeter } from "@/components/ui/score-meter";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { EvidenceClass } from "@/components/hummingbird/cards/result-card";

/**
 * ResultDetailSheet — the Workspace detail slide-over.
 *
 * The panel a ResultCard opens into (a right-side Sheet), and where "Generate
 * report" bridges the Workspace to the Reports tab. Identical for a single
 * compound and a combination (the live product; predicted results are unstudied
 * and don't open a detail), so one component serves both `type`s.
 *
 * A Block — it composes Sheet + Accordion + ScoreMeter + EvidenceTag +
 * FavoriteButton + Button over the reconciled result model. Like the result
 * cards it's a leaf app surface and reads --ds-* directly; the primitives it
 * embeds carry their own --c-* tokens.
 *
 * Structure mirrors the live panel: a fixed header (glyph + name, benefit,
 * the confidence/synergy ScoreMeter + evidence, and the Generate report / Pin
 * actions) over a scrolling body of five always-on sections (Health benefit ·
 * Biological pathways · Targets & biomarkers · Clinically measurable biomarkers
 * · Example claims) and seven accordions (How it works · Confidence score ·
 * Natural sources · Dosage guidance · ADME properties · IP considerations ·
 * References). Open state, Pin and Generate report are the app's to own.
 */

export type ResultDetailType = "single" | "combo";

export type NaturalSource = {
  /** Binomial, e.g. "Vitis vinifera". Rendered italic. */
  species: string;
  common: string;
  gras?: boolean;
};

export type Citation = {
  authors: string;
  year: string;
  journal: string;
  /** PMID / DOI, e.g. "PMID: 17086191". */
  ref: string;
};

export type DataPoint = { label: string; value: string };

export type ResultDetail = {
  type: ResultDetailType;
  /** One compound, or the pair pre-joined as "Berberine + Sulforaphane". */
  name: string;
  /** Short intent line, e.g. "Longevity & Cellular". */
  benefit: string;
  /** Confidence (single) / synergy (combo), 0–1. */
  score: number;
  evidence: Exclude<EvidenceClass, "predicted">;
  // ── Always-visible ──
  healthBenefit: string;
  pathways: string[];
  targets: string[];
  biomarkers: string[];
  claims: string[];
  // ── Accordions ──
  howItWorks: string;
  confidenceNote: string;
  naturalSources: NaturalSource[];
  dosage: DataPoint[];
  adme: DataPoint[];
  ipNote: string;
  references: Citation[];
};

const TYPE_CONFIG = {
  single: {
    Icon: CompoundSingle,
    iconClass: "text-[var(--ds-color-icon-data-orange)]",
    scoreLabel: "Confidence",
  },
  combo: {
    Icon: CompoundMultiple,
    iconClass: "text-[var(--ds-color-icon-brand)]",
    scoreLabel: "Synergy",
  },
} as const;

const EVIDENCE_LABEL: Record<Exclude<EvidenceClass, "predicted" | "none">, string> = {
  clinical: "Clinical",
  animal: "Animal",
  "in-vitro": "In Vitro",
};

// ─── Section + row helpers ───────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-[var(--ds-color-text-subtle)] uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Pills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex h-6 items-center rounded-[var(--ds-shape-radius-md)] bg-[var(--ds-color-surface-alt)] px-2 text-[13px] leading-none text-[var(--ds-color-text-default)]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function DataRows({ rows }: { rows: DataPoint[] }) {
  return (
    <dl className="flex flex-col">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-baseline justify-between gap-4 border-b border-[var(--ds-color-border-subtle)] py-2 last:border-b-0"
        >
          <dt className="text-[var(--ds-color-text-subtle)]">{row.label}</dt>
          <dd className="text-right font-medium text-[var(--ds-color-text-default)]">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm leading-relaxed text-[var(--ds-color-text-default)]">
      {children}
    </p>
  );
}

// ─── ResultDetailSheet ───────────────────────────────────────────────────────

export function ResultDetailSheet({
  detail,
  open,
  onOpenChange,
  favorited = false,
  onFavorite,
  onGenerateReport,
}: {
  detail: ResultDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pin state — controlled, owned by the app (as the results grid owns it). */
  favorited?: boolean;
  onFavorite?: (favorited: boolean) => void;
  /** Mints a report from this result — the bridge to the Reports tab. */
  onGenerateReport?: () => void;
}) {
  const { Icon, iconClass, scoreLabel } = TYPE_CONFIG[detail.type];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-lg">
        {/* ── Header (fixed) ─────────────────────────────────────────────── */}
        <SheetHeader className="shrink-0 gap-3 border-b border-[var(--ds-color-border-subtle)] pr-12">
          <div className="flex items-start gap-3">
            <Icon className={cn("mt-0.5 size-6 shrink-0", iconClass)} strokeWidth={1.5} />
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-base leading-tight">{detail.name}</SheetTitle>
              <SheetDescription>{detail.benefit}</SheetDescription>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <ScoreMeter value={detail.score} label={scoreLabel} format="percent" />
            </div>
            {/* A static evidence label — not the interactive EvidenceTag: in the
                detail there's nothing to navigate to (we're already here), so the
                chip must not carry the card chip's hover/focus affordance. The
                inline `!== "none"` narrows the union so EVIDENCE_LABEL is safely
                indexable (clinical | animal | in-vitro). */}
            {detail.evidence !== "none" && (
              <span className="inline-flex h-6 shrink-0 items-center rounded-[var(--ds-shape-radius-md)] border border-[var(--ds-color-border-default)] px-2 text-[13px] leading-none text-[var(--ds-color-text-default)]">
                {EVIDENCE_LABEL[detail.evidence]}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={onGenerateReport} className="flex-1">
              <FileText />
              Generate report
            </Button>
            <FavoriteButton
              favorited={favorited}
              onToggle={() => onFavorite?.(!favorited)}
              label={detail.name}
            />
          </div>
        </SheetHeader>

        {/* ── Body (scrolls) ─────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          {/* Every section is guarded — a sparse result (no biomarkers, no
              sources…) must not render a dangling header over nothing. */}
          <div className="flex flex-col gap-5 p-4">
            {detail.healthBenefit && (
              <Section title="Health benefit">
                <Prose>{detail.healthBenefit}</Prose>
              </Section>
            )}

            {detail.pathways.length > 0 && (
              <Section title="Biological pathways">
                <ul className="flex flex-col gap-1.5">
                  {detail.pathways.map((p) => (
                    <li
                      key={p}
                      className="text-sm leading-snug text-[var(--ds-color-text-default)]"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {detail.targets.length > 0 && (
              <Section
                title={`Biological targets & biomarkers · ${detail.targets.length}`}
              >
                <Pills items={detail.targets} />
              </Section>
            )}

            {detail.biomarkers.length > 0 && (
              <Section title="Clinically measurable biomarkers">
                <Pills items={detail.biomarkers} />
              </Section>
            )}

            {detail.claims.length > 0 && (
              <Section title="Example claims">
                <ul className="flex flex-col gap-2">
                  {detail.claims.map((c) => (
                    <li
                      key={c}
                      className="flex gap-2 text-sm leading-snug text-[var(--ds-color-text-default)]"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1.5 size-1 shrink-0 rounded-full bg-[var(--ds-color-text-subtle)]"
                      />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>

          {/* ── Accordions ──────────────────────────────────────────────── */}
          {/* Accordions are likewise guarded, so a clickable row never expands
              to nothing (and an empty howItWorks can't open blank on mount). */}
          <Accordion
            type="multiple"
            defaultValue={["how-it-works"]}
            className="border-t border-[var(--ds-color-border-subtle)] px-4"
          >
            {detail.howItWorks && (
              <AccordionItem value="how-it-works">
                <AccordionTrigger>How it works</AccordionTrigger>
                <AccordionContent>
                  <Prose>{detail.howItWorks}</Prose>
                </AccordionContent>
              </AccordionItem>
            )}

            {detail.confidenceNote && (
              <AccordionItem value="confidence">
                <AccordionTrigger>Confidence score</AccordionTrigger>
                <AccordionContent>
                  <Prose>{detail.confidenceNote}</Prose>
                </AccordionContent>
              </AccordionItem>
            )}

            {detail.naturalSources.length > 0 && (
            <AccordionItem value="sources">
              <AccordionTrigger>Natural sources</AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-2.5">
                  {detail.naturalSources.map((s) => (
                    <li key={s.species} className="flex items-baseline gap-2">
                      <span className="text-sm text-[var(--ds-color-text-default)]">
                        <span className="italic">{s.species}</span>
                        <span className="text-[var(--ds-color-text-subtle)]">
                          {" "}
                          · {s.common}
                        </span>
                      </span>
                      {s.gras && (
                        <span className="inline-flex h-5 shrink-0 items-center rounded-full bg-[var(--ds-color-surface-success-active)] px-2 text-[10px] font-semibold tracking-[0.04em] text-[var(--ds-color-text-success-strong)] uppercase">
                          GRAS
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            )}

            {detail.dosage.length > 0 && (
              <AccordionItem value="dosage">
                <AccordionTrigger>Dosage guidance</AccordionTrigger>
                <AccordionContent>
                  <DataRows rows={detail.dosage} />
                </AccordionContent>
              </AccordionItem>
            )}

            {detail.adme.length > 0 && (
              <AccordionItem value="adme">
                <AccordionTrigger>ADME properties</AccordionTrigger>
                <AccordionContent>
                  <DataRows rows={detail.adme} />
                </AccordionContent>
              </AccordionItem>
            )}

            {detail.ipNote && (
              <AccordionItem value="ip">
                <AccordionTrigger>Intellectual property considerations</AccordionTrigger>
                <AccordionContent>
                  <Prose>{detail.ipNote}</Prose>
                </AccordionContent>
              </AccordionItem>
            )}

            {detail.references.length > 0 && (
              <AccordionItem value="references">
                <AccordionTrigger>References</AccordionTrigger>
                <AccordionContent>
                  <ol className="flex flex-col gap-3">
                    {detail.references.map((r) => (
                      <li
                        key={r.ref}
                        className="text-[13px] leading-snug text-[var(--ds-color-text-subtle)]"
                      >
                        <span className="text-[var(--ds-color-text-default)]">
                          {r.authors}
                        </span>{" "}
                        ({r.year}). <span className="italic">{r.journal}</span>. {r.ref}
                      </li>
                    ))}
                  </ol>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
