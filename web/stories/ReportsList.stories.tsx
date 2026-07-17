import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ReportsList } from "@/components/quill/reports-list";

/* ─────────────────────────────────────────────────────────────────────────
 * Reports list view — the library of concept briefs generated from
 * recommendations, mirroring the live product's /report list (brightseed.ai
 * v1.3.2). It is the content behind App Shell Quill's "Reports" tab; App Shell
 * imports this same component, so the two never drift.
 *
 * Try it: type in the search box to filter by title. Filter/Sort are visual
 * placeholders — the real List Toolbar is its own Tier-3 pass.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Blocks/Reports list view",
  component: ReportsList,
  parameters: { layout: "fullscreen", previewPadding: false },
  decorators: [
    (Story) => (
      <div className="px-6 py-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReportsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
