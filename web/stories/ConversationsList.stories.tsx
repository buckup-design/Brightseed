import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { toast } from "sonner";

import { ConversationsList } from "@/components/quill/conversations-list";
import { Toaster } from "@/components/ui/sonner";

/* ─────────────────────────────────────────────────────────────────────────
 * Conversations list view — the history of chat threads with Hummingbird,
 * mirroring the live product's Conversations list (brightseed.ai v1.3.2). It
 * is the content behind App Shell Quill's "Conversations" tab; App Shell
 * imports this same component, so the two never drift.
 *
 * Conversations sits alongside Projects (Becky, July 18 2026): this is the flat
 * thread list and the door into a Workspace; Projects groups chats + reports
 * into named containers.
 *
 * Try it: search filters by title or preview. Clicking a row opens the
 * conversation (fires a toast here); the ⋮ menu carries Rename and Delete. New
 * chat routes to the agent home.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Blocks/Conversations list view",
  component: ConversationsList,
  parameters: { layout: "fullscreen", previewPadding: false },
  args: {
    onNewChat: () => toast("Starting a new chat…"),
    onOpen: (conversation) => toast(`Opening “${conversation.title}”…`),
    onRename: (conversation) => toast(`Rename “${conversation.title}”`),
    onDelete: (conversation) => toast(`Deleted “${conversation.title}”.`),
  },
  decorators: [
    // The canvas is the app shell's surface, not the screen's — mirror it here
    // so the standalone view reads the same as it does inside App Shell Quill.
    (Story) => (
      <div className="min-h-svh bg-[var(--ds-color-surface-canvas)] p-6">
        <Story />
        <Toaster />
      </div>
    ),
  ],
} satisfies Meta<typeof ConversationsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Zero conversations — the list is replaced by an empty state that routes to New chat. */
export const Empty: Story = {
  args: { conversations: [] },
};
