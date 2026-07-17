import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarItem,
  SidebarPanelOnly,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { BrightseedLogo } from "@/components/brand/BrightseedLogo";
import {
  Compass,
  Database,
  FlaskConical,
  Home,
  Leaf,
  MessageSquare,
  Settings,
  Sprout,
} from "lucide-react";

/**
 * The Quill sidebar. Composition-swap, after Otter.ai — every value below was
 * measured live on otter.ai (June 7 2026, logged-in web app) rather than
 * guessed, which is why they are oddly specific. Treat them as measurements.
 *
 * Collapsed (56px rail) and expanded (240px panel) are two distinct
 * compositions. The transition is a 150ms overflow-hidden width wipe, not a
 * morph: the entering layout mounts fully formed at its destination width, so
 * labels never clip or rewrap. Panel-only content is ABSENT from the rail, not
 * hidden in it — that is the whole thesis. The alternative, morphing one
 * composition and squeezing the labels to nothing, is what the old shadcn
 * sidebar did, and it is why the brand mark used to clip to a stray "B".
 *
 * The toggle is always mounted at opacity 0 and fades in over 300ms when the
 * pointer enters the nav or focus lands inside it. Otter reveals on hover only;
 * focus-within is ours, so keyboard users can find it. Cmd/Ctrl+B also toggles.
 *
 * Rail icons and the toggle show a tooltip on the right after 700ms — Radix's
 * default delay, which is what Otter uses. Radix's 300ms skip-delay makes
 * follow-up tooltips instant when sweeping the rail. Panel items get no
 * tooltip: their labels are already visible.
 *
 * Groups collapse to ONE representative rail icon. Clicking it expands the nav
 * and focuses that group — it does not navigate, and it does not open a popover
 * flyout. Both were considered and rejected: a flyout would put panel content
 * back on the rail.
 *
 * Open question: the toggle rests at opacity 0, following Otter. Resting it at
 * ~40% would make it discoverable without hovering, at the cost of a busier
 * nav. Never settled — compare both here before changing it.
 */
const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen", previewPadding: false },
  tags: ["autodocs"],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

function DemoNav() {
  return (
    <Sidebar>
      <SidebarHeader>
        <BrightseedLogo variant="tile" className="size-8 shrink-0" />
        <SidebarPanelOnly>
          <span className="ml-2 truncate text-sm font-medium text-[var(--c-sidebar-text-default)]">
            Brightseed
          </span>
        </SidebarPanelOnly>
      </SidebarHeader>
      <SidebarContent>
        <SidebarItem icon={Home} label="Home" isActive />
        <SidebarItem icon={MessageSquare} label="Chat" />
        <SidebarItem icon={Compass} label="Explore" />
        <SidebarGroup icon={Sprout} label="Strategies">
          <SidebarItem icon={Leaf} label="Bitterness blockers" />
          <SidebarItem icon={Leaf} label="Gut health" />
          <SidebarItem icon={Leaf} label="Metabolic" />
        </SidebarGroup>
        <SidebarGroup icon={Database} label="Datasets">
          <SidebarItem icon={FlaskConical} label="Compound library" />
          <SidebarItem icon={FlaskConical} label="Assay results" />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarPanelOnly>
          <div className="rounded-[var(--c-sidebar-shape-radius-md)] bg-[var(--c-sidebar-surface-alt)] p-3 text-xs text-[var(--c-sidebar-text-subtle)]">
            Panel-only slot: this card does not exist in the rail composition.
          </div>
        </SidebarPanelOnly>
        <SidebarItem icon={Settings} label="Settings" />
      </SidebarFooter>
    </Sidebar>
  );
}

function DemoContent() {
  return (
    <SidebarInset>
      <div className="flex h-14 items-center border-b border-[var(--c-sidebar-border-default)] px-6 text-sm font-medium text-[var(--c-sidebar-text-default)]">
        Content pushes when the nav expands
      </div>
      <div className="flex-1 p-6 text-sm text-[var(--c-sidebar-text-subtle)]">
        Hover the nav to reveal the toggle. Cmd/Ctrl+B also toggles. In the
        rail, each group is one icon; clicking it expands the nav and focuses
        that group.
      </div>
    </SidebarInset>
  );
}

/** Expanded panel with live toggle, groups, and a panel-only footer card. */
export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <DemoNav />
      <DemoContent />
    </SidebarProvider>
  ),
};

/** Starts in the 56px rail. Groups are single representative icons. */
export const Collapsed: Story = {
  render: () => (
    <SidebarProvider defaultOpen={false}>
      <DemoNav />
      <DemoContent />
    </SidebarProvider>
  ),
};

/**
 * Group expansion behavior: start collapsed, click the Strategies or
 * Datasets rail icon. The nav expands, scrolls the group into view, and
 * moves focus to its header (visible as a focus ring).
 */
export const GroupExpansion: Story = {
  render: () => (
    <SidebarProvider defaultOpen={false}>
      <DemoNav />
      <DemoContent />
    </SidebarProvider>
  ),
};

/** Dark theme via data-theme="dark" on an ancestor. No component dark code. */
export const Dark: Story = {
  render: () => (
    <div data-theme="dark" className="min-h-svh bg-[var(--c-sidebar-surface-default)]">
      <SidebarProvider>
        <DemoNav />
        <DemoContent />
      </SidebarProvider>
    </div>
  ),
};
