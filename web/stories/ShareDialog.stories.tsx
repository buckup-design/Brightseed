import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { toast } from "sonner";

import { ShareDialog } from "@/components/quill/share-dialog";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

/* ─────────────────────────────────────────────────────────────────────────
 * ShareDialog — share a report by email. Add people (type an address, Enter or
 * Add; Backspace on an empty field removes the last chip), or copy the link.
 * Controlled by open/onOpenChange; the app owns what Share does.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Blocks/Share Dialog",
  component: ShareDialog,
  parameters: { layout: "centered" },
  // Required props; the render function drives them from local state.
  args: { open: false, onOpenChange: () => {} },
} satisfies Meta<typeof ShareDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Share report</Button>
        <ShareDialog
          open={open}
          onOpenChange={setOpen}
          title="Berberine + Biochanin A"
          link="https://brightseed.ai/report/r1"
          onShare={(emails) =>
            toast(
              `Shared with ${emails.length} ${
                emails.length === 1 ? "person" : "people"
              }.`
            )
          }
        />
        <Toaster />
      </>
    );
  },
};
