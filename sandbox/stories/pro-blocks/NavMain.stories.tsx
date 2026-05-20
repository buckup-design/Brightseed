import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  BarChart3,
  Database,
  FlaskConical,
  Settings2,
} from "lucide-react";

import { NavMain } from "@/components/pro-blocks/application/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";

/* ─────────────────────────────────────────────────────────────────────────
 * NavMain — sub-piece of AppShell4 sidebar.
 *
 * Renders a "Platform" section with collapsible nav groups. Each top-level
 * item can have nested sub-items, opened/closed via the chevron rotation.
 * The `isActive` flag pre-opens an item on first render.
 *
 * Requires SidebarProvider context for the SidebarMenu primitives.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Pro Blocks/Application/Nav Main",
  component: NavMain,
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
} satisfies Meta<typeof NavMain>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  {
    title: "Compounds",
    url: "#",
    icon: FlaskConical,
    isActive: true,
    items: [
      { title: "All compounds", url: "#" },
      { title: "Verified", url: "#" },
      { title: "Pending review", url: "#" },
      { title: "Archived", url: "#" },
    ],
  },
  {
    title: "Batches",
    url: "#",
    icon: Database,
    items: [
      { title: "Active batches", url: "#" },
      { title: "Completed", url: "#" },
      { title: "Failed", url: "#" },
    ],
  },
  {
    title: "Analysis",
    url: "#",
    icon: BarChart3,
    items: [
      { title: "Yield reports", url: "#" },
      { title: "Trend lines", url: "#" },
      { title: "Custom queries", url: "#" },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings2,
    items: [
      { title: "Workspace", url: "#" },
      { title: "Members", url: "#" },
      { title: "Integrations", url: "#" },
    ],
  },
];

export const Default: Story = {
  args: { items },
};

export const SingleGroup: Story = {
  args: {
    items: [items[0]],
  },
};

export const NoActiveItem: Story = {
  args: {
    items: items.map((item) => ({ ...item, isActive: false })),
  },
};

export const FlatItems: Story = {
  args: {
    items: items.map(({ items: _subItems, ...item }) => ({
      ...item,
      isActive: false,
    })),
  },
};
