import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { Building2, FlaskConical, Sprout } from "lucide-react";

import { TeamSwitcher, type Team } from "@/components/quill/team-switcher";

/* ─────────────────────────────────────────────────────────────────────────
 * Team Switcher — pick the active Hummingbird instance.
 *
 * Descends from the Pro Block that lived in App Shell 4's sidebar header and
 * died with the stock sidebar. Restored on Becky's call (July 16 2026) with its
 * home changed: instance switching now happens in the account menu's Teams row,
 * which expands into this list in place. See Blocks/App Shell Quill — open the
 * footer menu and hover Teams.
 *
 * This standalone form is the reviewable surface for the row design, and the
 * reusable one if a header switcher is ever wanted back. Nothing in the shell
 * composes it today.
 *
 * What to look for:
 *   - The active instance carries a check. The Pro Block showed ⌘1/⌘2 hints and
 *     marked the active team nowhere, so its menu could not answer the one
 *     question a switcher exists to answer.
 *   - Rows are shared with the menu submenu (TeamRows), so the two forms cannot
 *     drift apart.
 * ───────────────────────────────────────────────────────────────────────── */

const TEAMS: Team[] = [
  { name: "Instance 1", logo: Sprout, plan: "Enterprise" },
  { name: "Instance 2", logo: FlaskConical, plan: "Enterprise" },
  { name: "Instance 3", logo: Building2, plan: "Trial" },
];

/** Controlled — the app owns which instance is live, so the story does too. */
function SwitcherHost() {
  const [active, setActive] = React.useState<Team>(TEAMS[0]);
  return (
    <div className="w-60">
      <TeamSwitcher teams={TEAMS} value={active} onChange={setActive} />
    </div>
  );
}

const meta = {
  title: "Blocks/Team Switcher",
  component: SwitcherHost,
  parameters: { layout: "centered" },
} satisfies Meta<typeof SwitcherHost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
