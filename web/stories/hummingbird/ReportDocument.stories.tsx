import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { expect, waitFor } from "storybook/test";
import { toast } from "sonner";

import {
  ReportDocument,
  type ReportDocument as ReportDoc,
} from "@/components/hummingbird/report-document";
import { REPORT_DOCUMENTS, resolveReportDocument } from "@/components/hummingbird/data";
import { Toaster } from "@/components/ui/sonner";

/* ─────────────────────────────────────────────────────────────────────────
 * ReportDocument — the long-form concept brief at /report/{uuid}, the read-view
 * payoff of the detail sheet's "Generate report". A publication (always-open
 * sections on a centred max-w-3xl column), NOT the slide-over's accordions.
 *
 * The flagship is reports-list entry r1 "Berberine + Biochanin A" (favorited,
 * top of list, live-captured) — so App Shell Quill's Reports → View → this doc
 * is a real navigation. Its Berberine half matches the Berberine slide-over
 * fixture verbatim (one source of truth). The IP section is the pre-run CTA
 * only; the generated Full IP Analysis appendix is a separate build.
 *
 * In the app this renders inside the app-shell inset (surface-canvas + scroll);
 * the stories supply that frame so the sticky utility bar has something to stick
 * within.
 * ───────────────────────────────────────────────────────────────────────── */

/** A single-compound report, derived from r1's Berberine half — exercises the
 *  adaptations: "Recommendation" (not "Recommended Combination"), the orange
 *  single glyph, no Synergistic Action card, no Shared sources group. */
const SINGLE_DOC: ReportDoc = {
  ...REPORT_DOCUMENTS.r1,
  id: "r1-single",
  displayId: "RPT-2026-0143",
  type: "single",
  title: "Berberine",
  subtitle: "Metabolic Health · Women 35–50",
  ingredients: ["Berberine"],
  rationale:
    "Berberine was selected as a single-agent lead for metabolic support in women aged 35–50. It activates AMPK to improve glucose disposal and steer hepatic metabolism away from lipogenesis, with a secondary lipid benefit through PCSK9 down-regulation.",
  ingredientBriefs: [REPORT_DOCUMENTS.r1.ingredientBriefs[0]],
  // Single-agent IP prose — the inherited r1 ipNote names biochanin A / "this
  // combination", which would contradict a Berberine-only report.
  ipNote:
    "A preliminary landscape scan found no blocking prior art for a berberine metabolic-support formulation. Run the full analysis for a formal freedom-to-operate and patentability assessment across composition-of-matter, dose, and method-of-use claims for berberine in metabolic and weight-management indications.",
  synergy: undefined,
  sharedSources: undefined,
  targets: ["AMPK", "PCSK9", "GLUT4", "PTP1B"],
  biomarkers: ["Fasting glucose", "HbA1c", "LDL-C"],
  references: REPORT_DOCUMENTS.r1.references.slice(0, 2),
};

function DocHost({ doc }: { doc: ReportDoc }) {
  return (
    <div
      data-report-scroller
      className="h-svh overflow-y-auto bg-[var(--ds-color-surface-canvas)]"
    >
      <ReportDocument
        doc={doc}
        onBack={() => toast("Back to Reports")}
        onContinueEdit={() => toast("Continue edit")}
        onRunIpAnalysis={() =>
          toast("Running full IP analysis… (generated appendix out of scope)")
        }
      />
      <Toaster />
    </div>
  );
}

const meta = {
  title: "WORK IN PROGRESS/Report Document",
  component: ReportDocument,
  parameters: { layout: "fullscreen", previewPadding: false },
} satisfies Meta<typeof ReportDocument>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The flagship: the fully-authored "Berberine + Biochanin A" combination brief. */
export const Flagship: Story = {
  render: () => <DocHost doc={resolveReportDocument("r1")} />,
};

/** A single-compound report — the combo-only sections adapt or drop away. */
export const SingleCompound: Story = {
  render: () => <DocHost doc={SINGLE_DOC} />,
};

/** An unauthored / still-generating report renders header-only, no dangling
 *  section bodies (the resolver's pending fallback). */
export const Pending: Story = {
  render: () => <DocHost doc={resolveReportDocument("r2")} />,
};

/** Dark theme — the intent markers (GRAS/FDA/Clinical) and the sticky bar must
 *  stay legible. Set via the theme global, never a hand-set data-theme. */
export const Dark: Story = {
  globals: { theme: "dark" },
  render: () => <DocHost doc={resolveReportDocument("r1")} />,
};

const MOBILE_VIEWPORT = {
  mobile: {
    name: "Mobile (390×844)",
    styles: { width: "390px", height: "844px" },
    type: "mobile" as const,
  },
};

/**
 * A reading document must never scroll sideways. Locks the preview to 390px and
 * asserts the scroll container's content width doesn't exceed its client width —
 * the Formulation rows wrap, the mechanism cards stack, nothing overflows.
 */
export const Mobile: Story = {
  parameters: { viewport: { options: MOBILE_VIEWPORT } },
  globals: { viewport: { value: "mobile" } },
  render: () => <DocHost doc={resolveReportDocument("r1")} />,
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(window.innerWidth).toBeLessThan(768));
    const scroller = canvasElement.querySelector<HTMLElement>(
      "[data-report-scroller]"
    );
    await waitFor(() => {
      expect(scroller).not.toBeNull();
      // +1 for sub-pixel rounding; a real horizontal overflow is many px.
      expect(scroller!.scrollWidth).toBeLessThanOrEqual(scroller!.clientWidth + 1);
    });
  },
};
