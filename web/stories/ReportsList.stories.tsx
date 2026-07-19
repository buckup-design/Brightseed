import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { toast } from "sonner";

import { ReportsList } from "@/components/quill/reports-list";
import { Toaster } from "@/components/ui/sonner";

/* ─────────────────────────────────────────────────────────────────────────
 * Reports list view — the library of concept briefs generated from
 * recommendations, mirroring the live product's /report list (brightseed.ai
 * v1.3.2). It is the content behind App Shell Quill's "Reports" tab; App Shell
 * imports this same component, so the two never drift.
 *
 * Try it: search filters by title; Filter narrows by status; Sort reorders. A
 * star favorites a report and floats it to the top. Clicking a card opens it;
 * each row's ⋮ menu carries Favorite, Share (invite by email + copy link),
 * Comment (leave a note), and Delete. View, Share and Comment fire a toast here
 * to show the round-trip.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Blocks/Reports list view",
  component: ReportsList,
  parameters: { layout: "fullscreen", previewPadding: false },
  args: {
    onView: (report) => toast(`Opening “${report.title}”…`),
    onShare: (report, emails) =>
      toast(
        `Shared “${report.title}” with ${emails.length} ${
          emails.length === 1 ? "person" : "people"
        }.`
      ),
    onComment: (report) => toast(`Comment added to “${report.title}”.`),
  },
  decorators: [
    // The canvas is the app shell's surface, not the screen's — mirror it here
    // so the standalone Block reads the same as it does inside App Shell Quill.
    (Story) => (
      <div className="min-h-svh bg-[var(--ds-color-surface-canvas)] p-6">
        <Story />
        <Toaster />
      </div>
    ),
  ],
} satisfies Meta<typeof ReportsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Zero reports — the list is replaced by an empty state that routes to New Report. */
export const Empty: Story = {
  args: { reports: [] },
};
