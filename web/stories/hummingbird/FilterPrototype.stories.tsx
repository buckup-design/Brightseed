import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FilterableResultsPanel } from "@/components/hummingbird/filters/filterable-results-panel";
import { SCREENING_PROFILES } from "@/components/hummingbird/filters/screening-data";
import { SAMPLE_WORKSPACE_RESULTS } from "@/components/hummingbird/data";

/* ─────────────────────────────────────────────────────────────────────────
 * Filter Prototype — faceted narrowing for the Workspace results canvas.
 *
 * Ported from Anna's `propolis-filters` demo (branch `anna/filter-demo`), rebuilt
 * on Quill primitives and Brightseed semantics. Her structure, labels and filter
 * rules are intact; the hardcoded shadcn-default palette and the hand-rolled
 * Slider / Switch / Badge / combobox are not.
 *
 * It hangs off the `+ Add` button that has been sitting inert in the Evidence
 * Filter Bar since the canvas shipped — press it to collapse and re-expand the
 * drawer.
 *
 * Two behaviours worth poking at, because neither is obvious from a screenshot:
 *
 *  1. A pristine facet renders every chip as SELECTED, because "nothing chosen"
 *     and "everything chosen" filter identically and should therefore look
 *     identical. The first click on a pristine group narrows straight to that one
 *     value rather than deselecting it. After that it's an ordinary multi-select,
 *     and you can legitimately deselect everything to match nothing.
 *  2. Every score slider's floor is ANY, and an unknown value passes only there.
 *     The three Brightseed-HBPB predicted compounds deliberately carry no
 *     screening data — a predicted hit has no formulation or FTO workup yet — so
 *     they vanish the moment any slider or switch leaves its floor. That is the
 *     model's "can't confirm it meets the threshold" rule, not a bug.
 *
 * Facet counts and evidence-pill counts are both computed over the full result
 * set and never move as you narrow, so the chips stay aimable.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "WORK IN PROGRESS/Filter Prototype",
  component: FilterableResultsPanel,
  parameters: { layout: "fullscreen", previewPadding: false },
  // The panel fills its parent, so the parent has to be height-definite.
  decorators: [
    (Story) => (
      <div className="h-svh w-full">
        <Story />
      </div>
    ),
  ],
  args: {
    results: SAMPLE_WORKSPACE_RESULTS,
    screening: SCREENING_PROFILES,
  },
} satisfies Meta<typeof FilterableResultsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The drawer open over the full result set — three facet clouds and the
 *  Feasibility / Novelty / Safety score panels. */
export const Default: Story = {};

/** The drawer collapsed, i.e. the results panel exactly as it ships today.
 *  `+ Add` expands it. */
export const Collapsed: Story = {
  args: { defaultDrawerOpen: false },
};

/** Narrow enough to exercise FilterCard's two-row cap: the Biological Targets
 *  cloud overflows and the tail moves into the "More" popover. Also the width
 *  the drawer sees inside the Workspace's split view, which is the case that
 *  actually matters — the facet grid drops to one column below 48rem. */
export const NarrowColumn: Story = {
  decorators: [
    (Story) => (
      <div className="h-svh w-[560px] border-r border-[var(--ds-color-border-subtle)]">
        <Story />
      </div>
    ),
  ],
};

/** No results at all — the drawer is suppressed along with the filter bar,
 *  since there is nothing to narrow. */
export const NoResults: Story = {
  args: { results: [], searchesCompleted: 0 },
};
