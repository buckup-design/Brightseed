import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  SidebarAlt1,
  SidebarAlt1Content,
  SidebarAlt1Footer,
  SidebarAlt1Group,
  SidebarAlt1Header,
  SidebarAlt1Inset,
  SidebarAlt1Item,
  SidebarAlt1PanelOnly,
  SidebarAlt1Provider,
} from "@/components/ui/sidebar-alt1";
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
 * Composition-swap sidebar (Otter.ai pattern). Spec: /sidebar-alt1-spec.md.
 *
 * Collapsed (56px rail) and expanded (240px panel) are two distinct
 * compositions. The transition is a 150ms overflow-hidden width wipe, not a
 * morph: the entering layout mounts fully formed, so labels never clip or
 * rewrap. The toggle fades in on hover/focus (300ms). Cmd/Ctrl+B toggles.
 * Groups collapse to ONE representative rail icon; clicking it expands the
 * nav and focuses that group.
 */
const meta = {
  title: "WORK IN PROGRESS/Sidebar Alt1",
  component: SidebarAlt1,
  parameters: { layout: "fullscreen", previewPadding: false },
  tags: ["autodocs"],
} satisfies Meta<typeof SidebarAlt1>;

export default meta;
type Story = StoryObj<typeof meta>;

function DemoNav() {
  return (
    <SidebarAlt1>
      <SidebarAlt1Header>
        <BrightseedLogo variant="tile" className="size-8 shrink-0" />
        <SidebarAlt1PanelOnly>
          <span className="ml-2 truncate text-sm font-medium text-[var(--c-sidebar-alt1-text-default)]">
            Brightseed
          </span>
        </SidebarAlt1PanelOnly>
      </SidebarAlt1Header>
      <SidebarAlt1Content>
        <SidebarAlt1Item icon={Home} label="Home" isActive />
        <SidebarAlt1Item icon={MessageSquare} label="Chat" />
        <SidebarAlt1Item icon={Compass} label="Explore" />
        <SidebarAlt1Group icon={Sprout} label="Strategies">
          <SidebarAlt1Item icon={Leaf} label="Bitterness blockers" />
          <SidebarAlt1Item icon={Leaf} label="Gut health" />
          <SidebarAlt1Item icon={Leaf} label="Metabolic" />
        </SidebarAlt1Group>
        <SidebarAlt1Group icon={Database} label="Datasets">
          <SidebarAlt1Item icon={FlaskConical} label="Compound library" />
          <SidebarAlt1Item icon={FlaskConical} label="Assay results" />
        </SidebarAlt1Group>
      </SidebarAlt1Content>
      <SidebarAlt1Footer>
        <SidebarAlt1PanelOnly>
          <div className="rounded-[var(--c-sidebar-alt1-shape-radius-md)] bg-[var(--c-sidebar-alt1-surface-alt)] p-3 text-xs text-[var(--c-sidebar-alt1-text-subtle)]">
            Panel-only slot: this card does not exist in the rail composition.
          </div>
        </SidebarAlt1PanelOnly>
        <SidebarAlt1Item icon={Settings} label="Settings" />
      </SidebarAlt1Footer>
    </SidebarAlt1>
  );
}

function DemoContent() {
  return (
    <SidebarAlt1Inset>
      <div className="flex h-14 items-center border-b border-[var(--c-sidebar-alt1-border-default)] px-6 text-sm font-medium text-[var(--c-sidebar-alt1-text-default)]">
        Content pushes when the nav expands
      </div>
      <div className="flex-1 p-6 text-sm text-[var(--c-sidebar-alt1-text-subtle)]">
        Hover the nav to reveal the toggle. Cmd/Ctrl+B also toggles. In the
        rail, each group is one icon; clicking it expands the nav and focuses
        that group.
      </div>
    </SidebarAlt1Inset>
  );
}

/** Expanded panel with live toggle, groups, and a panel-only footer card. */
export const Default: Story = {
  render: () => (
    <SidebarAlt1Provider>
      <DemoNav />
      <DemoContent />
    </SidebarAlt1Provider>
  ),
};

/** Starts in the 56px rail. Groups are single representative icons. */
export const Collapsed: Story = {
  render: () => (
    <SidebarAlt1Provider defaultOpen={false}>
      <DemoNav />
      <DemoContent />
    </SidebarAlt1Provider>
  ),
};

/**
 * Group expansion behavior: start collapsed, click the Strategies or
 * Datasets rail icon. The nav expands, scrolls the group into view, and
 * moves focus to its header (visible as a focus ring).
 */
export const GroupExpansion: Story = {
  render: () => (
    <SidebarAlt1Provider defaultOpen={false}>
      <DemoNav />
      <DemoContent />
    </SidebarAlt1Provider>
  ),
};

/** Dark theme via data-theme="dark" on an ancestor. No component dark code. */
export const Dark: Story = {
  render: () => (
    <div data-theme="dark" className="min-h-svh bg-[var(--c-sidebar-alt1-surface-default)]">
      <SidebarAlt1Provider>
        <DemoNav />
        <DemoContent />
      </SidebarAlt1Provider>
    </div>
  ),
};
