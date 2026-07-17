import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { expect, screen, within } from "storybook/test";

import { AvatarPickerDialog } from "@/components/quill/avatar-picker-dialog";
import {
  Avatar,
  AvatarIdentity,
  type AvatarColor,
  type AvatarIcon,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

/**
 * The avatar picker from Settings → Profile, in isolation. Reworked July 2026
 * off the sketch at Collab Playground 96:1559: the two axes are shown on
 * separate ground — the colour selector is pure colour (flat circles, no glyph),
 * the icon selector is the glyph on a neutral surface (no colour) — after the
 * sketch flagged the earlier build for mixing them. The preview at the top
 * recombines the two into the real avatar, live.
 */
const meta = {
  title: "WORK IN PROGRESS/Avatar Picker",
  component: AvatarPickerDialog,
  parameters: { layout: "centered" },
  // The picker's props are all required, but every story drives it through a
  // stateful `render`, so these meta-level args exist only to satisfy the type;
  // the render ignores them.
  args: {
    open: true,
    onOpenChange: () => {},
    color: "cyan",
    icon: "leafy-green",
    onSave: () => {},
  },
} satisfies Meta<typeof AvatarPickerDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** As actually used: a trigger opens the modal, and the saved pair is reflected
 * back. Starts open so the picker is the first thing you see. */
export const Default: Story = {
  render: function AvatarPickerStory() {
    const [open, setOpen] = React.useState(true);
    const [identity, setIdentity] = React.useState<{
      color: AvatarColor;
      icon: AvatarIcon;
    }>({ color: "cyan", icon: "leafy-green" });

    return (
      <div className="flex flex-col items-center gap-4">
        <Avatar size="lg" className="rounded-lg">
          <AvatarIdentity
            color={identity.color}
            icon={identity.icon}
            className="rounded-lg"
          />
        </Avatar>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Customize avatar
        </Button>
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
          {identity.color} / {identity.icon}
        </span>
        <AvatarPickerDialog
          open={open}
          onOpenChange={setOpen}
          color={identity.color}
          icon={identity.icon}
          onSave={setIdentity}
        />
      </div>
    );
  },
  /* Regression guard for the bug the sketch called out: "the color selector
   * shouldn't have an icon on it, the icon selector shouldn't be on a color
   * surface." So a colour swatch must carry NO glyph, and an icon cell MUST. The
   * dialog is portaled to <body>, so query with `screen`, not the canvas. */
  play: async () => {
    const dialog = await screen.findByRole("dialog");
    const d = within(dialog);

    const orangeSwatch = d.getByRole("button", { name: "orange" });
    expect(orangeSwatch.querySelector("svg")).toBeNull();

    const wheatCell = d.getByRole("button", { name: "wheat" });
    expect(wheatCell.querySelector("svg")).not.toBeNull();
  },
};
