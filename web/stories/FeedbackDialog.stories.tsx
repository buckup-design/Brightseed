import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import {
  FeedbackDialog,
  type FeedbackSubmission,
} from "@/components/quill/feedback-dialog";
import { Button } from "@/components/ui/button";

/* ─────────────────────────────────────────────────────────────────────────
 * The feedback dialog, per Anna's spec sketch (Collab Playground 89:1549).
 * Raised from "Give feedback" in the sidebar footer menu; replaces the green
 * bubble pinned to the bottom-right of every screen in live Hummingbird.
 *
 * What to look for:
 *   - Four topics, in the annotated order.
 *   - No emoji sentiment row. The reference screenshot has one; the annotation
 *     "ignore emojis. text input only" removes it.
 *   - Send stays disabled until both a topic and a message exist.
 *   - The last submission echoes below the trigger, so you can see what the
 *     app would receive.
 * ───────────────────────────────────────────────────────────────────────── */

function FeedbackHost({ startOpen }: { startOpen: boolean }) {
  const [open, setOpen] = React.useState(startOpen);
  const [sent, setSent] = React.useState<FeedbackSubmission | null>(null);

  return (
    <div className="flex flex-col items-start gap-4">
      <Button onClick={() => setOpen(true)}>Give feedback</Button>
      {/* Story chrome, so it themes through the bridge rather than reaching for
       * a --ds-* directly, which component code may never do. */}
      {sent && (
        <pre className="bg-muted text-muted-foreground rounded p-3 text-xs">
          {JSON.stringify(sent, null, 2)}
        </pre>
      )}
      <FeedbackDialog open={open} onOpenChange={setOpen} onSubmit={setSent} />
    </div>
  );
}

const meta = {
  title: "Blocks/Feedback Dialog",
  component: FeedbackHost,
  parameters: { layout: "centered" },
} satisfies Meta<typeof FeedbackHost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { startOpen: true },
};

export const FromTrigger: Story = {
  args: { startOpen: false },
};
