import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * document-parts — the leaf renderers shared by Hummingbird's two long-form
 * surfaces: the detail slide-over (result-detail.tsx) and the Report Document
 * (report-document.tsx). Extracted once the report became a second consumer of
 * the same section / pill / prose / marker / source / citation shapes.
 *
 * These stay LEAF helpers reading --ds-* directly — the sanctioned convention
 * for hummingbird app surfaces, which are not reusable ui/ primitives. Only the
 * genuinely generic label→value list earned promotion to ui/ (DescriptionList);
 * everything here is document vocabulary shared across two hummingbird files, so
 * it lives with them and carries no --c-* ceremony. (The one ui/ primitive is
 * imported by both callers separately.)
 *
 * The NaturalSource + Citation TYPES live here too, so result-detail is no
 * longer the accidental owner of types the report also needs.
 */

// ─── Shared types ────────────────────────────────────────────────────────────

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

// ─── Section ─────────────────────────────────────────────────────────────────

/**
 * A titled section. `size="eyebrow"` (default) is the 11px uppercase label the
 * slide-over uses in its narrow rail; `size="heading"` is the document-scale
 * h2 anchor the full-page report needs across ~9 sections. `as` sets only the
 * element for outline correctness. The defaults (eyebrow + h3) reproduce
 * result-detail's original markup byte-for-byte.
 */
export function Section({
  title,
  size = "eyebrow",
  as: Heading = "h3",
  children,
}: {
  title: string;
  size?: "eyebrow" | "heading";
  as?: "h2" | "h3";
  children: React.ReactNode;
}) {
  return (
    <section>
      {size === "eyebrow" ? (
        <Heading className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-[var(--ds-color-text-subtle)] uppercase">
          {title}
        </Heading>
      ) : (
        <Heading className="mb-3 text-xl font-semibold text-[var(--ds-color-text-default)]">
          {title}
        </Heading>
      )}
      {children}
    </section>
  );
}

// ─── Pills ───────────────────────────────────────────────────────────────────

/** A wrapped row of neutral tag pills (targets, biomarkers). */
export function Pills({ items }: { items: string[] }) {
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

// ─── Prose ───────────────────────────────────────────────────────────────────

/** A body paragraph. */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm leading-relaxed text-[var(--ds-color-text-default)]">
      {children}
    </p>
  );
}

// ─── Marker ──────────────────────────────────────────────────────────────────

/**
 * A small uppercase status pill (GRAS, HED, FDA-compliant, Clinical Study). One
 * recipe, three tones, all on existing intent tokens — the word carries the
 * meaning, colour is redundant reinforcement (never the sole signal). The
 * `success` tone reproduces result-detail's original inline GRAS pixels exactly;
 * `gap-1` is a no-op for a single text child and only spaces an optional icon.
 * Theme-safe with no dark code: in dark, text-success-strong / text-info both
 * resolve to text-default (the documented dark intent recipe).
 */
export function Marker({
  tone,
  className,
  ...props
}: { tone: "success" | "info" | "neutral" } & React.ComponentProps<"span">) {
  const toneClass = {
    success: "bg-[var(--ds-color-surface-success-active)] text-[var(--ds-color-text-success-strong)]",
    info: "bg-[var(--ds-color-surface-info-active)] text-[var(--ds-color-text-info)]",
    neutral: "bg-[var(--ds-color-surface-alt)] text-[var(--ds-color-text-subtle)]",
  }[tone];
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center gap-1 rounded-full px-2 text-[10px] font-semibold tracking-[0.04em] uppercase",
        toneClass,
        className
      )}
      {...props}
    />
  );
}

// ─── NaturalSourceItem ───────────────────────────────────────────────────────

/**
 * The shared title line of a natural source: italic binomial · common name, and
 * a GRAS marker when the source is food-safe. Returns the name span + marker as
 * two SIBLINGS (a fragment) so a flex `gap-2` wrapper spaces them exactly as the
 * slide-over's original `<li>` did — a truly zero-change extraction. The report
 * reuses this title line and adds its own second meta line (family · tissue ·
 * abundance) around it.
 */
export function NaturalSourceItem({ source }: { source: NaturalSource }) {
  return (
    <>
      <span className="text-sm text-[var(--ds-color-text-default)]">
        <span className="italic">{source.species}</span>
        <span className="text-[var(--ds-color-text-subtle)]"> · {source.common}</span>
      </span>
      {source.gras && (
        <Marker tone="success" className="shrink-0">
          GRAS
        </Marker>
      )}
    </>
  );
}

// ─── ReferenceList ───────────────────────────────────────────────────────────

/** An ordered list of primary-literature citations. Lifted 1:1 from the sheet. */
export function ReferenceList({ references }: { references: Citation[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {references.map((r) => (
        <li
          key={r.ref}
          className="text-[13px] leading-snug text-[var(--ds-color-text-subtle)]"
        >
          <span className="text-[var(--ds-color-text-default)]">{r.authors}</span>{" "}
          ({r.year}). <span className="italic">{r.journal}</span>. {r.ref}
        </li>
      ))}
    </ol>
  );
}
