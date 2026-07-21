import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Building2, FlaskConical, Sprout } from "lucide-react";
import { NavUserQuill } from "@/components/quill/nav-user-quill";
import type { Team } from "@/components/quill/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

/* ─────────────────────────────────────────────────────────────────────────
 * The sidebar footer account menu, per the app-shell proposal (Collab Playground
 * 89:1547 → 89:1596, July 16 2026). The Pro Block nav-user it replaces is gone,
 * deleted with App Shell 4 and the stock sidebar.
 *
 * What to look for:
 *   - Trigger: display name + kebab. No email, no ChevronsUpDown.
 *   - Menu: email header, then Settings / (Get help, Give feedback) / Teams /
 *     Version + Log out. The separators are the sketch's grouping.
 *   - Teams EXPANDS into the instance list rather than navigating — hover it.
 *     That is the Team Switcher, reached from here (July 16 2026).
 *   - Email and Version are readouts: sand-700 at weight 200, no role, no
 *     hover, no focus, and they do not close the menu.
 *
 * Open the menu to review it — the trigger alone is only half the component.
 * ───────────────────────────────────────────────────────────────────────── */

const TEAMS: Team[] = [
  { name: "Instance 1", logo: Sprout, plan: "Enterprise" },
  { name: "Instance 2", logo: FlaskConical, plan: "Enterprise" },
  { name: "Instance 3", logo: Building2, plan: "Trial" },
];

const meta = {
  title: "Components/Nav User Quill",
  component: NavUserQuill,
  parameters: { layout: "fullscreen", previewPadding: false },
  args: { teams: TEAMS, activeTeam: TEAMS[0] },
  render: (args) => (
    <SidebarProvider>
      <Sidebar>
        {/* Empty, but present: it takes the free space so the footer sits at the
         * bottom, which is where the menu has to open upward from. */}
        <SidebarContent />
        <SidebarFooter>
          <NavUserQuill {...args} />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="text-muted-foreground p-6 text-sm">
          Open the menu from the footer, bottom left. Cmd/Ctrl+B collapses the
          nav — the name and kebab are absent from the rail, not hidden in it.
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
} satisfies Meta<typeof NavUserQuill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: {
      name: "becky",
      email: "becky@buckupconsulting.com",
      color: "blue",
      icon: "leafy-green",
    },
    version: "v1.3.2",
  },
};

/** No stored colour + icon pair. Renders AvatarFallback — which is the assigned
 * orange + wheat pair, by design, not a neutral unknown-person avatar. */
export const NoStoredIdentity: Story = {
  args: {
    user: { name: "becky", email: "becky@buckupconsulting.com" },
    version: "v1.3.2",
  },
};

/** The Full name field allows 20 characters, so the trigger has to survive one
 * that actually uses them. It truncates; the menu header carries the email. */
export const LongDisplayName: Story = {
  args: {
    user: {
      name: "Bartholomew Quillsby",
      email: "bartholomew.quillsby@brightseedbio.com",
      color: "orchid",
      icon: "flower-2",
    },
    version: "v1.3.2",
  },
};
