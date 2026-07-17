import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import {
  SettingsModal,
  type SettingsAccount,
  type SettingsUser,
} from "@/components/quill/settings-modal";
import { Button } from "@/components/ui/button";

/* ─────────────────────────────────────────────────────────────────────────
 * The settings modal, per Anna's sketches (Collab Playground 89:1597 Profile,
 * 89:1693 Account), patterned on Claude's own settings (86:1539).
 *
 * Replaces the full-page settings in live Hummingbird v1.3.2, where Profile and
 * Account were stacked cards you scrolled through.
 *
 * What to look for:
 *   - Rail: search, then Settings (Profile, Account), then the two Placeholder
 *     groups. Selected uses the same lime-50 pill as the app sidebar.
 *   - Search filters the real sections and hides the placeholders.
 *   - Profile > Avatar opens the colour/icon picker over the modal. Pick a
 *     pair, Save, and the avatar updates; Cancel must discard.
 *   - Full name accepts 20 characters and nothing else is validated.
 *
 * Open it — the trigger is the whole story.
 * ───────────────────────────────────────────────────────────────────────── */

const ACCOUNT: SettingsAccount = {
  organization: "Brightseed",
  healthAreas: "All areas",
  licenseExpires: "Sep 11, 2026",
  teams: ["Instance 1", "Instance 2", "Instance 3"],
};

const USER: SettingsUser = {
  name: "becky",
  email: "becky@buckupconsulting.com",
  emailVerified: true,
  memberSince: "Jul 13, 2026",
  color: "blue",
  icon: "leafy-green",
};

/** Stateful host — the modal holds no store of its own, so the story plays the
 * part the app will: it owns the user and takes the edits back. */
function SettingsHost({ startOpen }: { startOpen: boolean }) {
  const [open, setOpen] = React.useState(startOpen);
  const [user, setUser] = React.useState<SettingsUser>(USER);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open settings</Button>
      <SettingsModal
        open={open}
        onOpenChange={setOpen}
        user={user}
        account={ACCOUNT}
        onUserChange={setUser}
      />
    </>
  );
}

/* The host is the story component, not SettingsModal itself: the modal is a
 * controlled component with required open/user/account props, so a story typed
 * against it would have to restate args that `render` already supplies. */
const meta = {
  title: "WORK IN PROGRESS/Settings Modal",
  component: SettingsHost,
  parameters: { layout: "centered" },
} satisfies Meta<typeof SettingsHost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { startOpen: true },
};

/** Closed on load, so the open transition and focus handling are reviewable. */
export const FromTrigger: Story = {
  args: { startOpen: false },
};
