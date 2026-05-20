import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Beaker, Leaf, Microscope } from "lucide-react";

import { TeamSwitcher } from "@/components/pro-blocks/application/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";

/* ─────────────────────────────────────────────────────────────────────────
 * TeamSwitcher — sub-piece of AppShell4 sidebar header.
 *
 * Renders a workspace/team selector with logo + name + plan, opening a
 * dropdown of switchable teams plus an "Add team" affordance. Lives in the
 * SidebarHeader slot in AppShell4.
 *
 * Requires SidebarProvider context — useSidebar() reads layout state.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Pro Blocks/Application/Team Switcher",
  component: TeamSwitcher,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Sidebar collapsible="none" className="w-64 border-r">
          <SidebarHeader>
            <Story />
          </SidebarHeader>
          <SidebarContent />
        </Sidebar>
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof TeamSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

const teams = [
  { name: "Forager Research", logo: Microscope, plan: "Enterprise" },
  { name: "Greenhouse Lab", logo: Leaf, plan: "Pro" },
  { name: "Compound Studio", logo: Beaker, plan: "Free" },
];

export const Default: Story = {
  args: { teams },
};

export const SingleTeam: Story = {
  args: {
    teams: [{ name: "Forager Research", logo: Microscope, plan: "Enterprise" }],
  },
};

export const ManyTeams: Story = {
  args: {
    teams: [
      ...teams,
      { name: "Phyto Lab", logo: Leaf, plan: "Pro" },
      { name: "Sample Vault", logo: Beaker, plan: "Free" },
    ],
  },
};
