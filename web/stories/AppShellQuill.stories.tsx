import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { AppShellQuill } from "@/components/quill/app-shell-quill";
import type {
  SettingsAccount,
  SettingsUser,
} from "@/components/quill/settings-modal";

/* ─────────────────────────────────────────────────────────────────────────
 * The Hummingbird app shell, assembled from Anna's proposal (Collab Playground
 * 88:1547). Successor to Blocks/App Shell 4 — open both side by side; App Shell
 * 4 retires once this one is signed off.
 *
 * What to look for:
 *   - Nav: 24px icons, 40px rows, lime-50 selected pill on Compounds, 700ms
 *     tooltips when collapsed. Collapse it with the trigger in the header.
 *   - Footer menu: display name + kebab, then the proposal's IA.
 *   - Settings opens the modal on Profile. Change the avatar or the name and
 *     it flows straight back to the footer trigger — one `user`, two surfaces.
 *   - Give feedback opens the feedback dialog.
 *   - Teams opens Settings > Account. See the [CONCERN] in app-shell-quill.tsx:
 *     the sketch never says what Teams should open, so this is a placeholder
 *     routing, not a decision.
 *   - Get help is intentionally inert ("will open jira ticket. ignore flow").
 * ───────────────────────────────────────────────────────────────────────── */

const ACCOUNT: SettingsAccount = {
  organization: "Brightseed",
  healthAreas: "All areas",
  licenseExpires: "Sep 11, 2026",
  teams: ["Instance 1", "Instance 2", "Instance 3"],
};

const INITIAL_USER: SettingsUser = {
  name: "becky",
  email: "becky@buckupconsulting.com",
  emailVerified: true,
  memberSince: "Jul 13, 2026",
  color: "blue",
  icon: "leafy-green",
};

/** The shell takes `user` and hands edits back; the app owns the store. The
 * story plays that part so the settings round-trip is actually exercisable. */
function ShellHost() {
  const [user, setUser] = React.useState<SettingsUser>(INITIAL_USER);

  return (
    <AppShellQuill
      user={user}
      account={ACCOUNT}
      version="v1.3.2"
      onUserChange={setUser}
    >
      <p className="text-muted-foreground text-sm">
        Main content area. The nav, the footer menu, Settings and Give feedback
        are all live — open them.
      </p>
    </AppShellQuill>
  );
}

const meta = {
  title: "WORK IN PROGRESS/App Shell Quill",
  component: ShellHost,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ShellHost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
