import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FlaskConical, Sprout, TestTube, Microscope } from "lucide-react";

import { NavProjects } from "@/components/pro-blocks/application/nav-projects";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";

/* ─────────────────────────────────────────────────────────────────────────
 * NavProjects — sub-piece of AppShell4 sidebar.
 *
 * Renders a "Projects" section in the sidebar. Each row is a link with a
 * leading icon and a row-action menu (View / Share / Delete) revealed on
 * hover. A trailing "More" item provides the affordance for the full list.
 *
 * Hidden when the sidebar is in icon-only collapsed mode (the section
 * label has nowhere to land on a 48px rail).
 *
 * Requires SidebarProvider context — useSidebar() drives the row-action
 * menu's side/align placement.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Blocks/Nav Projects",
  component: NavProjects,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Sidebar collapsible="none" className="w-64 border-r">
          <SidebarContent>
            <Story />
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof NavProjects>;

export default meta;
type Story = StoryObj<typeof meta>;

const projects = [
  { name: "Quercetin Q1", url: "#", icon: FlaskConical },
  { name: "Resveratrol Pilot", url: "#", icon: TestTube },
  { name: "Sulforaphane Trial", url: "#", icon: Sprout },
  { name: "Curcumin Batch 04", url: "#", icon: Microscope },
];

export const Default: Story = {
  args: { projects },
};

export const SingleProject: Story = {
  args: {
    projects: [{ name: "Quercetin Q1", url: "#", icon: FlaskConical }],
  },
};

export const ManyProjects: Story = {
  args: {
    projects: [
      ...projects,
      { name: "Lutein Screen", url: "#", icon: TestTube },
      { name: "Lycopene Run", url: "#", icon: FlaskConical },
      { name: "Anthocyanin Map", url: "#", icon: Sprout },
    ],
  },
};
