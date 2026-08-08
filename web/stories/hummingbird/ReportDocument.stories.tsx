import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { toast } from "sonner";

import {
  ReportDocument,
  type ReportDocument as ReportDoc,
} from "@/components/hummingbird/report-document";
import {
  IP_ANALYSIS_R1,
  REPORT_DOCUMENTS,
  resolveReportDocument,
} from "@/components/hummingbird/data";
import { Toaster } from "@/components/ui/sonner";

/* ─────────────────────────────────────────────────────────────────────────
 * ReportDocument — the long-form concept brief at /report/{uuid}, the read-view
 * payoff of the detail sheet's "Generate report". A publication (always-open
 * sections on a centred max-w-3xl column), NOT the slide-over's accordions.
 *
 * The flagship is reports-list entry r1 "Berberine + Biochanin A" (favorited,
 * top of list, live-captured) — so App Shell Quill's Reports → View → this doc
 * is a real navigation. Its Berberine half matches the Berberine slide-over
 * fixture verbatim (one source of truth). Section 3's three states are each
 * covered: Flagship = pre-run CTA, WithIpAnalysis = the generated appendix,
 * IpRunFlow = the CTA → generating → appendix ladder.
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
        onRunIpAnalysis={() => toast("Run full IP analysis")}
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

/** r1 with the generated appendix mounted — the post-run superset document. */
const WITH_IP_DOC: ReportDoc = {
  ...REPORT_DOCUMENTS.r1,
  ipAnalysis: IP_ANALYSIS_R1,
};

/** The flagship: the fully-authored "Berberine + Biochanin A" combination brief.
 *  Stays PRE-run, so the CTA state keeps its coverage. */
export const Flagship: Story = {
  render: () => <DocHost doc={resolveReportDocument("r1")} />,
};

/**
 * The generated Full IP Analysis appendix in place of the CTA. Locks the data
 * contract: 9 dimensions severity-sorted (Blocked first), the visible rollup,
 * float-safe fraction meters, and the disclaimer as a note (not an alert).
 */
export const WithIpAnalysis: Story = {
  render: () => <DocHost doc={WITH_IP_DOC} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      const rows = canvasElement.querySelectorAll("[data-slot=ip-dimension]");
      expect(rows).toHaveLength(9);
      // Severity-first sort: the first row is a Blocked dimension.
      expect(rows[0].textContent).toContain("Blocked");
    });
    expect(canvas.getByText("2 blocked · 3 restricted · 4 clear")).toBeVisible();
    const fto = canvas.getByRole("meter", { name: "FTO score" });
    expect(fto).toHaveAttribute("aria-valuetext", "50 out of 100");
    const verdict = canvas.getByRole("meter", { name: "Verdict" });
    expect(verdict).toHaveAttribute("aria-valuetext", "73.8 out of 100");
    // The disclaimer is a note — the live region owns the announcement.
    expect(canvas.getByRole("note")).toHaveTextContent("not legal advice");
    // No run affordance once generated.
    expect(
      canvas.queryByRole("button", { name: /run full ip analysis/i })
    ).toBeNull();
  },
};

/** A stateful host driving the CTA → generating → appendix ladder with a
 *  short fake run, so the flow is watchable and the focus rule is assertable. */
function IpRunHost() {
  const [generating, setGenerating] = React.useState(false);
  const [doc, setDoc] = React.useState<ReportDoc>(resolveReportDocument("r1"));
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  return (
    <div
      data-report-scroller
      className="h-svh overflow-y-auto bg-[var(--ds-color-surface-canvas)]"
    >
      <ReportDocument
        doc={doc}
        ipAnalysisGenerating={generating}
        onRunIpAnalysis={() => {
          setGenerating(true);
          timer.current = setTimeout(() => {
            setDoc((d) => ({ ...d, ipAnalysis: IP_ANALYSIS_R1 }));
            setGenerating(false);
          }, 1500);
        }}
      />
    </div>
  );
}

/**
 * The run flow: click → role="status" notice takes focus (the button under
 * focus unmounts) → appendix mounts in place, focus lands on the FTO heading.
 * Play-asserted, not preview-pane eyeballed (the :focus-visible trap).
 */
export const IpRunFlow: Story = {
  render: () => <IpRunHost />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cta = await canvas.findByRole("button", {
      name: /run full ip analysis/i,
    });
    await userEvent.click(cta);
    // The notice is deliberately not role=status (the persistent live region
    // owns announcements) — locate it by its slot.
    const noticeText = await canvas.findByText("Running full IP analysis");
    const notice = noticeText.closest('[data-slot="ip-generating"]');
    expect(notice).not.toBeNull();
    await waitFor(() => expect(notice).toHaveFocus());
    expect(
      canvas.queryByRole("button", { name: /run full ip analysis/i })
    ).toBeNull();
    const heading = await canvas.findByRole(
      "heading",
      { name: /freedom to operate/i },
      { timeout: 4000 }
    );
    await waitFor(() => expect(heading).toHaveFocus());
  },
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

/** Dark theme — the intent markers (GRAS/FDA/Clinical), the appendix's
 *  grade/status badges and meters, and the sticky bar must stay legible. Uses
 *  the post-run superset doc. Set via the theme global, never a hand-set
 *  data-theme. */
export const Dark: Story = {
  globals: { theme: "dark" },
  render: () => <DocHost doc={WITH_IP_DOC} />,
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
  // The superset doc, so the 390px no-sideways-scroll assertion polices the
  // dimension grid, patent chips and guidance panel too.
  render: () => <DocHost doc={WITH_IP_DOC} />,
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
