import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { toast } from "sonner";

import { CommentDialog } from "@/components/quill/comment-dialog";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

/* ─────────────────────────────────────────────────────────────────────────
 * CommentDialog — leave a note on a report. Controlled by open/onOpenChange;
 * Save is disabled until the note has content. The app owns what a saved note
 * does (onSubmit).
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Blocks/Comment Dialog",
  component: CommentDialog,
  parameters: { layout: "centered" },
  // Required props; the render function drives them from local state.
  args: { open: false, onOpenChange: () => {} },
} satisfies Meta<typeof CommentDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Add a comment</Button>
        <CommentDialog
          open={open}
          onOpenChange={setOpen}
          title="Berberine + Biochanin A"
          onSubmit={() => toast("Comment added.")}
        />
        <Toaster />
      </>
    );
  },
};
