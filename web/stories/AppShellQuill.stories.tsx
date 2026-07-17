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
 * Built on sidebar-alt1 (Becky, July 16 2026), so collapsing SWAPS two
 * compositions rather than morphing one. The rail is a designed artifact, not a
 * squeezed panel: labels, the wordmark and the account name are absent from it
 * rather than clipped inside it.
 *
 * What to look for:
 *   - Hover the nav to reveal the toggle. Expanded it sits right of the logo;
 *     collapsed it takes the logo's cell and the mark crossfades out. Cmd/Ctrl+B
 *     also toggles.
 *   - Watch the LABELS as it collapses, not the end state — nothing squeezes.
 *     Compare against Blocks/App Shell 4, which still morphs.
 *   - Footer menu: display name + kebab in the panel, avatar alone in the rail.
 *   - Settings opens the modal on Profile. Change the avatar or the name and it
 *     flows straight back to the footer trigger — one `user`, two surfaces.
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

/** The shell takes `user` and `activeItem` and hands changes back; the app owns
 * the store and the router. The story plays both parts so the settings
 * round-trip and the nav are actually exercisable rather than inert. */
function ShellHost() {
  const [user, setUser] = React.useState<SettingsUser>(INITIAL_USER);
  const [active, setActive] = React.useState("Compounds");

  return (
    <AppShellQuill
      user={user}
      account={ACCOUNT}
      version="v1.3.2"
      activeItem={active}
      onNavigate={setActive}
      onUserChange={setUser}
    >
      <p className="text-muted-foreground text-sm">
        {active} — main content area. The nav, the footer menu, Settings and
        Give feedback are all live; click a nav item and this updates.
      </p>
    </AppShellQuill>
  );
}

const meta = {
  title: "WORK IN PROGRESS/App Shell Quill",
  component: ShellHost,
  parameters: { layout: "fullscreen", previewPadding: false },
} satisfies Meta<typeof ShellHost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
