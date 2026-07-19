import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { NewChat } from "@/components/quill/new-chat";

/* ─────────────────────────────────────────────────────────────────────────
 * New chat — the Hummingbird agent home, mirroring the live product's
 * /new-chat screen (brightseed.ai v1.3.2). It is the content behind App Shell
 * Quill's "New chat" tab; App Shell imports this same component, so the two
 * never drift. This entry shows it on its own.
 *
 * Try it: type in the composer and hit send (it clears), or click a suggested
 * prompt to drop it into the composer. "Create Formula Brief" is wired to a
 * callback the app owns.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Blocks/New chat",
  component: NewChat,
  parameters: { layout: "fullscreen", previewPadding: false },
  decorators: [
    // The canvas is the app shell's surface, not the screen's — mirror it here
    // so the standalone Block reads the same as it does inside App Shell Quill.
    (Story) => (
      <div className="min-h-svh bg-[var(--ds-color-surface-canvas)] p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NewChat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
