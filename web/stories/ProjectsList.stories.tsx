import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ProjectsList } from "@/components/quill/projects-list";

/* ─────────────────────────────────────────────────────────────────────────
 * Projects list view — named containers for the chats and reports that belong
 * together. Net-new to Quill (not yet in the live product), modelled on the
 * live Conversations/Reports list pattern. It is the content behind App Shell
 * Quill's "Projects" tab; App Shell imports this same component, so the two
 * never drift.
 *
 * Try it: type in the search box to filter the cards.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Blocks/Projects list view",
  component: ProjectsList,
  parameters: { layout: "fullscreen", previewPadding: false },
  decorators: [
    (Story) => (
      <div className="px-6 py-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProjectsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
