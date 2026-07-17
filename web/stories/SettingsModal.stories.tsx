import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

import {
  SettingsModal,
  type Appearance,
  type SettingsAccount,
  type SettingsSectionId,
  type SettingsUser,
} from "@/components/quill/settings-modal";
import { Button } from "@/components/ui/button";

/* ─────────────────────────────────────────────────────────────────────────
 * The settings modal, per Anna's sketches (Collab Playground 89:1597 Profile,
 * 89:1693 Account), patterned on Claude's own settings (86:1539). A subcomponent
 * of Blocks/App Shell Quill — the account menu's "Settings" raises it.
 *
 * Replaces the full-page settings in live Hummingbird v1.3.2, where Profile and
 * Account were stacked cards you scrolled through.
 *
 * What to look for:
 *   - Rail: search, then the Settings group (Profile, Account), then two
 *     Placeholder groups — navigable, each with its own pane. They are the live
 *     example of the config's extension point (see settings-modal.tsx): the dev
 *     team adds a group the same way.
 *   - Search filters sections; typing a group name ("placeholder") keeps the
 *     whole group; no match shows an empty note.
 *   - Profile > Avatar opens the colour/icon picker over the modal. Pick a
 *     pair, Save, and the avatar updates; Cancel must discard.
 *   - Profile > Appearance is a live System / Light / Dark toggle — clicking it
 *     repaints the modal, because this story applies the theme the way the app
 *     will (data-theme on <html>; System follows the OS).
 *   - Placeholder two is long on purpose: the pane scrolls while the rail stays.
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

/** Resolve an appearance choice to a concrete theme. "system" reads the OS
 * preference — the same contract the real app carries. */
function resolveTheme(appearance: Appearance): "light" | "dark" {
  if (appearance !== "system") return appearance;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Apply the appearance to <html> so the (portaled) modal repaints. This is the
 * bit the app owns in production; the story plays that part so the toggle is
 * demonstrably live rather than a decorative selected-state. */
function useAppliedTheme(appearance: Appearance) {
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const apply = () =>
      document.documentElement.setAttribute("data-theme", resolveTheme(appearance));
    apply();
    if (appearance !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [appearance]);
}

/** Stateful host — the modal holds no store of its own, so the story plays the
 * part the app will: it owns the user + the appearance and takes the edits back. */
function SettingsHost({
  startOpen,
  openTo,
}: {
  startOpen: boolean;
  openTo?: SettingsSectionId;
}) {
  const [open, setOpen] = React.useState(startOpen);
  const [user, setUser] = React.useState<SettingsUser>(USER);
  const [appearance, setAppearance] = React.useState<Appearance>("system");
  useAppliedTheme(appearance);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open settings</Button>
      <SettingsModal
        open={open}
        onOpenChange={setOpen}
        openTo={openTo}
        user={user}
        account={ACCOUNT}
        onUserChange={setUser}
        appearance={appearance}
        onAppearanceChange={setAppearance}
      />
    </>
  );
}

/* The host is the story component, not SettingsModal itself: the modal is a
 * controlled component with required open/user/account props, so a story typed
 * against it would have to restate args that `render` already supplies. */
const meta = {
  title: "Blocks/Settings Modal",
  component: SettingsHost,
  parameters: { layout: "centered" },
} satisfies Meta<typeof SettingsHost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { startOpen: true },
  /* Guards the two fixes: the Appearance toggle actually toggles, and the
   * placeholder groups are navigable to their own pane. */
  play: async () => {
    const dialog = await screen.findByRole("dialog");
    const canvas = within(dialog);

    // Appearance: pick Light and confirm the control reflects it.
    const light = await canvas.findByRole("radio", { name: "Light" });
    await userEvent.click(light);
    await waitFor(() => expect(light).toHaveAttribute("data-state", "on"));

    // Placeholder two is the second "Overview" row; clicking it shows its pane.
    const overviews = await canvas.findAllByRole("button", { name: "Overview" });
    await userEvent.click(overviews[overviews.length - 1]);
    expect(
      await canvas.findByRole("heading", { name: "Placeholder two" })
    ).toBeInTheDocument();
  },
};

/** Closed on load, so the open transition and focus handling are reviewable. */
export const FromTrigger: Story = {
  args: { startOpen: false },
};

/** Lands straight on the long Placeholder pane so the content-pane scroll is
 * visible without hunting for it — the rail should not move as the pane scrolls. */
export const LongPaneScrolls: Story = {
  args: { startOpen: true, openTo: "placeholder-two" },
};
