import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

import { Building2, FlaskConical, Sprout } from "lucide-react";

import { AppShellQuill } from "@/components/quill/app-shell-quill";
import { ConversationsList } from "@/components/quill/conversations-list";
import { NewChat } from "@/components/quill/new-chat";
import { ProjectsList } from "@/components/quill/projects-list";
import { ReportsList } from "@/components/quill/reports-list";
import type {
  Appearance,
  SettingsAccount,
  SettingsUser,
} from "@/components/quill/settings-modal";
import type { Team } from "@/components/quill/team-switcher";

/* The instances, surfaced through the account menu's Teams row. Same names the
 * Account settings pane lists, so the two agree. */
const TEAMS: Team[] = [
  { name: "Instance 1", logo: Sprout, plan: "Enterprise" },
  { name: "Instance 2", logo: FlaskConical, plan: "Enterprise" },
  { name: "Instance 3", logo: Building2, plan: "Trial" },
];

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
  const [active, setActive] = React.useState("New chat");
  const [team, setTeam] = React.useState<Team>(TEAMS[0]);
  const [appearance, setAppearance] = React.useState<Appearance>("system");

  /* Apply the appearance the way the app will (data-theme on <html>), so the
   * settings modal's Appearance toggle repaints the shell live. "system"
   * follows the OS. */
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const resolve = () =>
      appearance === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : appearance;
    const apply = () =>
      document.documentElement.setAttribute("data-theme", resolve());
    apply();
    if (appearance !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [appearance]);

  return (
    <AppShellQuill
      user={user}
      account={ACCOUNT}
      version="v1.3.2"
      activeItem={active}
      onNavigate={setActive}
      teams={TEAMS}
      activeTeam={team}
      onTeamChange={setTeam}
      onUserChange={setUser}
      appearance={appearance}
      onAppearanceChange={setAppearance}
    >
      <TabContent active={active} />
    </AppShellQuill>
  );
}

/* ── Tab content ─────────────────────────────────────────────────────────────
 * Each tab renders its own Blocks component, imported above (New chat /
 * Conversations / Projects list view / Reports list view), so the shell and the
 * standalone Blocks entries are one and the same and never drift. */

function TabContent({ active }: { active: string }) {
  if (active === "Conversations") return <ConversationsList />;
  if (active === "Projects") return <ProjectsList />;
  if (active === "Reports") return <ReportsList />;
  return <NewChat />;
}

const meta = {
  title: "Blocks/App Shell Quill",
  component: ShellHost,
  parameters: { layout: "fullscreen", previewPadding: false },
} satisfies Meta<typeof ShellHost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/* A single custom phone viewport, locked on the Mobile story below. Storybook 10
 * ships viewport in core, so no addon is needed; locking it via story `globals`
 * narrows the preview iframe, which is what trips useIsMobile() (it reads
 * window.innerWidth, not a container). */
const MOBILE_VIEWPORT = {
  mobile: {
    name: "Mobile (390×844)",
    styles: { width: "390px", height: "844px" },
    type: "mobile" as const,
  },
};

/**
 * Below md the sidebar renders inside a Sheet — the composition neither
 * Components/Sidebar nor the desktop App Shell story ever exercised, which is
 * exactly how the phantom-tap bug shipped (DOCS/tickets/sidebar-mobile-phantom-tap.md).
 *
 * This story locks the preview to a phone width so useIsMobile() trips and that
 * Sheet mounts, then drives the real path: the inset header's opener (the only
 * way IN on mobile) opens the nav, and the toggle in the Sheet header is now the
 * visible way OUT. The play function asserts that toggle is SOLID, not the
 * opacity-0 phantom it used to be — reintroduce the bug and this story fails.
 */
export const Mobile: Story = {
  parameters: { viewport: { options: MOBILE_VIEWPORT } },
  globals: { viewport: { value: "mobile" } },
  play: async ({ canvasElement }) => {
    // Wait for the locked viewport to narrow the iframe so useIsMobile() flips
    // and the Sheet composition (not the desktop rail) is what mounts.
    await waitFor(() => expect(window.innerWidth).toBeLessThan(768));

    // The way IN: the inset header opener is md:hidden, so mobile-only.
    const canvas = within(canvasElement);
    await userEvent.click(
      await canvas.findByRole("button", { name: "Open navigation" })
    );

    // The way OUT: the toggle lives in the Sheet, which Radix portals to
    // document.body — hence screen, not canvas. It must render solid.
    const closeToggle = await screen.findByRole("button", {
      name: "Close navigation",
    });
    await waitFor(() =>
      expect(getComputedStyle(closeToggle).opacity).toBe("1")
    );
  },
};
