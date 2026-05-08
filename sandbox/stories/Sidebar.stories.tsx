import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  Compass,
  Database,
  FlaskConical,
  Layers,
  MessageSquare,
  Settings,
} from "lucide-react";

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const NAV = [
  { title: "Strategies", icon: Compass },
  { title: "Compounds", icon: FlaskConical },
  { title: "Plants", icon: Layers },
  { title: "Datasets", icon: Database },
  { title: "Chat", icon: MessageSquare },
];

/**
 * Icon-rail collapsed sidebar — the variant Anna's mocks use.
 * sidebar-07 equivalent. Brightseed icon and color tweaks come later.
 */
export const IconRail: Story = {
  render: () => (
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="Brightseed">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md text-xs font-semibold">
                  BS
                </div>
                <span className="font-medium">Brightseed</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={item.title}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-6 text-sm text-muted-foreground">
          Main content area. Toggle the sidebar by clicking the rail or use the
          PanelLeft icon.
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};
