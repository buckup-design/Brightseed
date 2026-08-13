import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { BrightseedLogo } from "@/components/brand/BrightseedLogo";
import {
  Compass,
  Database,
  FlaskConical,
  Home,
  Leaf,
  MessageSquare,
  PanelLeftOpen,
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
 * SETTLED Aug 2026 — the toggle rests at opacity 0, and stays there. The
 * long-standing proposal was ~40% for discoverability; measured, that resolves
 * to 1.79:1 against the nav, which is not a conformant control indicator (only
 * a full-opacity 5.75:1 clears 3:1). So 0.25–0.6 all sit in a dead zone: busy
 * enough to add noise, too faint to be a real affordance — the choice is
 * really 0 or 1, not a dial.
 *
 * 0 wins because the reveal is group-hover on the WHOLE 240px panel, not the
 * 36px button, so any pointer heading for the nav reveals it; focus-within
 * covers keyboard; and mobile renders it solid already. Reopen only if the
 * hover target ever narrows to the button itself.
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
        <BrightseedLogo variant="tile-mark" className="size-8 shrink-0" />
        <SidebarPanelOnly>
          <span className="ml-2 truncate text-sm font-medium text-[var(--c-sidebar-text-muted)]">
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
      <div className="flex h-14 items-center border-b border-[var(--c-sidebar-border-default)] px-6 text-sm font-medium text-[var(--c-sidebar-text-muted)]">
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

/* Mobile-only opener. Below md the nav lives in a Sheet with no on-screen way in
 * of its own, so the surrounding app supplies one (the real shell has the same
 * in app-shell-quill.tsx). SidebarToggle can't serve here: its reveal keys off
 * group/sidebar on the nav root, so outside that ancestor it stays invisible. */
function MobileOpener() {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label="Open navigation"
      className="flex size-9 shrink-0 items-center justify-center rounded-[var(--c-sidebar-shape-radius-md)] text-[var(--c-sidebar-text-subtle)] outline-none hover:bg-[var(--c-sidebar-surface-alt)] focus-visible:ring-1 focus-visible:ring-[var(--c-sidebar-border-focus)] md:hidden [&>svg]:size-5"
    >
      <PanelLeftOpen />
    </button>
  );
}

/* One custom phone viewport, locked on the Mobile story. Storybook 10 ships
 * viewport in core (no addon); locking it via story `globals` narrows the
 * preview iframe, which is what trips useIsMobile() — it reads window.innerWidth,
 * so a narrow *container* would not do it. */
const MOBILE_VIEWPORT = {
  mobile: {
    name: "Mobile (390×844)",
    styles: { width: "390px", height: "844px" },
    type: "mobile" as const,
  },
};

/**
 * Below md the sidebar is a Sheet, and its only close control is the toggle in
 * its own header. This is the composition the desktop stories never showed —
 * the gap that let the phantom-tap bug ship.
 *
 * Locked to a phone width so useIsMobile() trips and the Sheet mounts. The play
 * function opens it and asserts the in-Sheet toggle is SOLID (opacity 1), not
 * the opacity-0 phantom it used to be. Excluded from autodocs: that page renders
 * stories inline at full width, where the mobile composition can't form.
 */
export const Mobile: Story = {
  tags: ["!autodocs"],
  parameters: { viewport: { options: MOBILE_VIEWPORT } },
  globals: { viewport: { value: "mobile" } },
  render: () => (
    <SidebarProvider>
      <DemoNav />
      <SidebarInset>
        <div className="flex h-14 shrink-0 items-center border-b border-[var(--c-sidebar-border-default)] px-4 md:hidden">
          <MobileOpener />
        </div>
        <div className="flex-1 p-6 text-sm text-[var(--c-sidebar-text-subtle)]">
          Tap the opener above. The nav slides in; its header toggle is the
          visible way back out — not an invisible tap target.
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(window.innerWidth).toBeLessThan(768));

    const canvas = within(canvasElement);
    await userEvent.click(
      await canvas.findByRole("button", { name: "Open navigation" })
    );

    // The Sheet portals to document.body — query with screen, not canvas.
    const closeToggle = await screen.findByRole("button", {
      name: "Close navigation",
    });
    await waitFor(() =>
      expect(getComputedStyle(closeToggle).opacity).toBe("1")
    );
  },
};
